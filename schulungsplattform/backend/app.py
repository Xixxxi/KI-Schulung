"""Schulungsplattform – Flask-Backend.

Zweck der Plattform (Proof of Concept):
  1. Inhalte vermitteln (Lernen)
  2. Inhalte interaktiv & serverseitig-intelligent testen (Testen)
  3. Ein Nachschlagewerk bereitstellen (Nachschlagen)

Das Backend liefert eine JSON-API und – im Hosting-Modus – den fertig gebauten
React-Frontend-Build aus (analog zur Haupt-Webapp des Repos).

Der Fortschritt wird aktuell serverseitig pro Prozess im Speicher gehalten.
Die Struktur ist bewusst so gewählt, dass sie später leicht durch eine echte
Nutzerverwaltung / Datenbank ersetzt werden kann (siehe ``ProgressStore``).

Start (Entwicklung):   python app.py
Umgebungsvariablen:
  TRAINING_HOST           (Default 127.0.0.1)
  TRAINING_PORT           (Default 8100)
  TRAINING_USE_WAITRESS   (Default 1 – produktionsnaher WSGI-Server)
"""

from __future__ import annotations

import os
import threading
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

import content_store

# ── Pfade ─────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST_DIR = BASE_DIR.parent / "frontend" / "dist"


# ── Fortschritts-Speicher (später durch DB/Accounts ersetzbar) ────────────────

class ProgressStore:
    """Sehr einfacher, thread-sicherer In-Memory-Fortschrittsspeicher.

    Schlüssel ist aktuell eine anonyme Session-ID (vom Client übergeben).
    Für die spätere Account-Verwaltung kann dieser Store 1:1 durch eine
    Datenbank-gestützte Implementierung ersetzt werden.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        # { sessionId: { chapterId: {"passed": bool, "scorePercent": int} } }
        self._data: dict[str, dict[str, dict]] = {}

    def get(self, session_id: str) -> dict[str, dict]:
        with self._lock:
            return dict(self._data.get(session_id, {}))

    def set_chapter_result(self, session_id: str, chapter_id: str, result: dict) -> None:
        with self._lock:
            user = self._data.setdefault(session_id, {})
            prev = user.get(chapter_id, {})
            # Bestes Ergebnis behalten
            best_percent = max(int(prev.get("scorePercent", 0)), int(result.get("scorePercent", 0)))
            user[chapter_id] = {
                "passed": bool(prev.get("passed")) or bool(result.get("passed")),
                "scorePercent": best_percent,
            }


PROGRESS = ProgressStore()


def _session_id() -> str:
    """Liest die anonyme Session-ID aus Header oder Query (Fallback: 'anonymous')."""
    return (
        request.headers.get("X-Session-Id")
        or request.args.get("session")
        or "anonymous"
    ).strip() or "anonymous"


# ── App-Factory ───────────────────────────────────────────────────────────────

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)  # Entwicklung: Vite-Dev-Server (Port 5173) darf zugreifen

    # ── API: Health ──────────────────────────────────────────────────────────
    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok", "service": "schulungsplattform"})

    # ── API: Themen-Übersicht (Thema → Unterthemen) ─────────────────────────
    @app.get("/api/topics")
    def topics():
        try:
            progress = PROGRESS.get(_session_id())
            data = content_store.list_topics(progress)
        except content_store.ContentError as exc:
            return jsonify({"error": str(exc)}), 500
        return jsonify({"topics": data})

    # ── API: Kapitel-Übersicht ───────────────────────────────────────────────
    @app.get("/api/chapters")
    def chapters():
        try:
            summary = content_store.list_chapters_summary()
        except content_store.ContentError as exc:
            return jsonify({"error": str(exc)}), 500
        # Fortschritt anreichern
        progress = PROGRESS.get(_session_id())
        for item in summary:
            p = progress.get(item["id"], {})
            item["passed"] = bool(p.get("passed"))
            item["bestScorePercent"] = int(p.get("scorePercent", 0))
        return jsonify({"chapters": summary})

    # ── API: Lerninhalt ──────────────────────────────────────────────────────
    @app.get("/api/chapters/<chapter_id>/learn")
    def chapter_learn(chapter_id: str):
        data = content_store.get_chapter_learning(chapter_id)
        if not data:
            return jsonify({"error": "Kapitel nicht gefunden"}), 404
        return jsonify(data)

    # ── API: Quiz (ohne Lösungen) ────────────────────────────────────────────
    @app.get("/api/chapters/<chapter_id>/quiz")
    def chapter_quiz(chapter_id: str):
        data = content_store.get_chapter_quiz(chapter_id)
        if not data:
            return jsonify({"error": "Kapitel nicht gefunden"}), 404
        return jsonify(data)

    # ── API: Quiz-Auswertung (serverseitig) ──────────────────────────────────
    @app.post("/api/chapters/<chapter_id>/quiz/evaluate")
    def chapter_quiz_evaluate(chapter_id: str):
        payload = request.get_json(silent=True) or {}
        answers = payload.get("answers")
        if not isinstance(answers, dict):
            return jsonify({"error": "Feld 'answers' (Objekt) erforderlich"}), 400
        result = content_store.evaluate_quiz(chapter_id, answers)
        if result is None:
            return jsonify({"error": "Kapitel nicht gefunden"}), 404
        PROGRESS.set_chapter_result(_session_id(), chapter_id, result)
        return jsonify(result)

    # ── API: Nachschlagewerk (Kapitel) ──────────────────────────────────────
    @app.get("/api/chapters/<chapter_id>/reference")
    def chapter_reference(chapter_id: str):
        data = content_store.get_chapter_reference(chapter_id)
        if not data:
            return jsonify({"error": "Kapitel nicht gefunden"}), 404
        return jsonify(data)

    # ── API: Zentrales Nachschlagewerk (alle Kapitel) ────────────────────────
    @app.get("/api/reference")
    def all_reference():
        try:
            data = content_store.get_all_references()
        except content_store.ContentError as exc:
            return jsonify({"error": str(exc)}), 500
        return jsonify({"topics": data})

    # ── API: Fortschritt ─────────────────────────────────────────────────────
    @app.get("/api/progress")
    def progress():
        return jsonify({"progress": PROGRESS.get(_session_id())})

    # ── Frontend-Build ausliefern (Hosting-Modus) ────────────────────────────
    @app.get("/")
    def index():
        if _frontend_available():
            return send_from_directory(str(FRONTEND_DIST_DIR), "index.html")
        return jsonify({
            "status": "backend-only",
            "hint": "Frontend-Build fehlt. Im Dev-Modus läuft das Frontend auf Port 5173.",
            "expected": str(FRONTEND_DIST_DIR / "index.html"),
        })

    @app.get("/<path:asset_path>")
    def assets(asset_path: str):
        # API-Routen nicht abfangen
        if asset_path.startswith("api/"):
            return jsonify({"error": "Not found"}), 404
        if _frontend_available():
            candidate = FRONTEND_DIST_DIR / asset_path
            if candidate.exists() and candidate.is_file():
                return send_from_directory(str(FRONTEND_DIST_DIR), asset_path)
            # SPA-Fallback
            return send_from_directory(str(FRONTEND_DIST_DIR), "index.html")
        return jsonify({"error": "Frontend-Build nicht vorhanden"}), 404

    return app


def _frontend_available() -> bool:
    return FRONTEND_DIST_DIR.exists() and (FRONTEND_DIST_DIR / "index.html").exists()


def _use_waitress() -> bool:
    return os.environ.get("TRAINING_USE_WAITRESS", "1").strip().lower() not in {"0", "false", "no"}


def main() -> None:
    host = os.environ.get("TRAINING_HOST", "127.0.0.1")
    port = int(os.environ.get("TRAINING_PORT", "8100"))
    app = create_app()

    if _use_waitress():
        try:
            from waitress import serve
            print(f"[HOSTING] Schulungsplattform via Waitress auf http://{host}:{port}")
            serve(app, host=host, port=port, threads=8)
            return
        except Exception as exc:  # noqa: BLE001
            print(f"[HOSTING] Waitress nicht verfügbar ({exc}). Fallback: Flask-Dev-Server.")

    print(f"[DEV] Schulungsplattform (Flask) auf http://{host}:{port}")
    app.run(host=host, port=port, debug=True)


if __name__ == "__main__":
    main()
