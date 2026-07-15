"""Content-Loader für die Schulungsplattform.

Kapselt das Laden der Kapitel-JSON-Dateien aus dem ``content``-Ordner und
stellt Hilfsfunktionen bereit, um Inhalte für die verschiedenen API-Ansichten
aufzubereiten (Lerninhalt, Quiz ohne Lösungen, Nachschlagewerk).

Ein Kapitel ist eine einzelne JSON-Datei. Neue Kapitel werden durch Ablegen
einer weiteren JSON-Datei im ``content``-Ordner ergänzt – kein Code nötig.

JSON-Schema (vereinfacht)::

    {
      "topicId": "thema-id",           # Gruppierschlüssel
      "topicTitle": "Thema-Name",
      "subTopicTitle": "Unterthema",
      "id": "eindeutige-id",
      "title": "Anzeigetitel",
      "summary": "Kurzbeschreibung",
      "estimatedMinutes": 15,
      "renderer": "optional-custom",   # Escape-Hatch: eigene React-Komponente
                                       # (Standard: generischer Lernen/Testen/
                                       # Nachschlagen-Flow)
      "lessons": [
        {"id": "l1", "title": "...", "blocks": [
          {"type": "text",       "text": "..."},
          {"type": "list",       "title": "...", "items": ["..."]},
          {"type": "callout",    "tone": "info|tip|warn", "title": "...", "text": "..."},
          {"type": "code",       "language": "python", "caption": "...", "text": "..."},
          {"type": "comparison", "left": {...}, "right": {...}},
          {"type": "cards",      "title": "...", "items": [{"icon":"","label":"","description":""}]},
          {"type": "diagram",    "caption": "...", "nodes": [...], "loop": {...}},
          {"type": "steps",      "title": "...", "items": [{"label":"","description":"","example":""}]}
        ]}
      ],
      "quiz": {
        "passThreshold": 0.7,
        "questions": [
          {"id": "q1", "type": "single|multi|text", "lessonRef": "l1",
           "question": "...", "options": ["A", "B"], "correct": 1,
           "explanation": "..."}
        ]
      },
      "reference": [ {"term": "...", "definition": "..."} ]
    }

Architektur-Prinzip: Inhalte und Darstellung sind bewusst getrennt.
  - Standard-Themen: JSON-Datei ablegen, kein Code nötig.
  - Sonderfall (z.B. interaktive Simulation): "renderer"-Feld setzen und
    die zugehörige React-Komponente in CUSTOM_RENDERERS (App.jsx) registrieren.
    Die JSON-Datei liefert weiterhin die Metadaten (title, summary etc.) für
    die Sidebar und die Fortschrittsanzeige.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

CONTENT_DIR = Path(__file__).resolve().parent / "content"


class ContentError(RuntimeError):
    """Fehler beim Laden oder Auswerten von Kapitelinhalten."""


# ── Laden ─────────────────────────────────────────────────────────────────────

def _load_raw_chapters() -> list[dict[str, Any]]:
    """Liest alle Kapitel-JSON-Dateien und gibt sie als Liste zurück."""
    if not CONTENT_DIR.exists():
        return []
    chapters: list[dict[str, Any]] = []
    for path in sorted(CONTENT_DIR.glob("*.json")):
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:  # noqa: BLE001
            raise ContentError(f"Kapitel-Datei defekt: {path.name} ({exc})") from exc
        if isinstance(data, dict) and data.get("id"):
            data["_order"] = data.get("order", 999)
            chapters.append(data)
    chapters.sort(key=lambda c: (c.get("_order", 999), str(c.get("title", ""))))
    return chapters


def get_chapter(chapter_id: str) -> dict[str, Any] | None:
    """Ein einzelnes Kapitel anhand seiner ID."""
    for chapter in _load_raw_chapters():
        if str(chapter.get("id")) == str(chapter_id):
            return chapter
    return None


# ── Aufbereitung für die API ──────────────────────────────────────────────────

def list_chapters_summary() -> list[dict[str, Any]]:
    """Übersicht aller Kapitel (ohne die schweren Inhalte), inkl. Topic-Metadaten."""
    result = []
    for chapter in _load_raw_chapters():
        quiz = chapter.get("quiz") or {}
        questions = quiz.get("questions") or []
        result.append({
            "id": chapter.get("id"),
            "title": chapter.get("title"),
            "summary": chapter.get("summary", ""),
            "estimatedMinutes": chapter.get("estimatedMinutes"),
            "lessonCount": len(chapter.get("lessons") or []),
            "questionCount": len(questions),
            "referenceCount": len(chapter.get("reference") or []),
            # Topic-Gruppierung
            "topicId": chapter.get("topicId", "general"),
            "topicTitle": chapter.get("topicTitle", "Allgemein"),
            "topicDescription": chapter.get("topicDescription", ""),
            "topicIcon": chapter.get("topicIcon", "📚"),
            "topicAccentColor": chapter.get("topicAccentColor", "#6b7280"),
            "topicOrder": chapter.get("topicOrder", 999),
            "subTopicTitle": chapter.get("subTopicTitle") or chapter.get("title", ""),
            "subTopicDescription": chapter.get("subTopicDescription") or chapter.get("summary", ""),
            # Klassifizierung: optionales Tag (z. B. "Allgemein", "BMW-intern")
            "tag": chapter.get("tag"),
            # Escape-Hatch: optionaler Custom-Renderer (Standard: generischer Flow)
            "renderer": chapter.get("renderer"),
        })
    return result


def list_topics(progress: "dict | None" = None) -> list[dict[str, Any]]:
    """Gruppiert alle Kapitel nach Topic-ID und reichert mit Fortschritt an.

    Rückgabe-Struktur pro Topic::

        {
          "id": "ki-agenten",
          "title": "KI-Agenten erstellen",
          "description": "...",
          "icon": "🤖",
          "accentColor": "#1c69d4",
          "order": 1,
          "subTopicCount": 1,
          "totalMinutes": 15,
          "allPassed": False,
          "passedCount": 0,
          "subTopics": [
            {
              "id": "ki-agent-grundlagen",
              "title": "Grundlagen",
              "description": "...",
              "estimatedMinutes": 15,
              "lessonCount": 5,
              "questionCount": 5,
              "referenceCount": 8,
              "passed": False,
              "bestScorePercent": 0
            }
          ]
        }
    """
    chapters = list_chapters_summary()
    progress = progress or {}
    topics: dict[str, dict[str, Any]] = {}

    for ch in chapters:
        tid = ch["topicId"]
        if tid not in topics:
            topics[tid] = {
                "id": tid,
                "title": ch["topicTitle"],
                "description": ch["topicDescription"],
                "icon": ch["topicIcon"],
                "accentColor": ch["topicAccentColor"],
                "order": ch["topicOrder"],
                "subTopics": [],
            }
        p = progress.get(str(ch["id"]), {})
        topics[tid]["subTopics"].append({
            "id": ch["id"],
            "title": ch["subTopicTitle"],
            "description": ch["subTopicDescription"],
            "estimatedMinutes": ch["estimatedMinutes"],
            "lessonCount": ch["lessonCount"],
            "questionCount": ch["questionCount"],
            "referenceCount": ch["referenceCount"],
            "renderer": ch.get("renderer"),
            "tag": ch.get("tag"),
            "passed": bool(p.get("passed")),
            "bestScorePercent": int(p.get("scorePercent", 0)),
        })

    result = sorted(topics.values(), key=lambda t: (t["order"], t["title"]))
    for topic in result:
        subs = topic["subTopics"]
        topic["subTopicCount"] = len(subs)
        topic["totalMinutes"] = sum(s.get("estimatedMinutes") or 0 for s in subs)
        topic["passedCount"] = sum(1 for s in subs if s["passed"])
        topic["allPassed"] = len(subs) > 0 and all(s["passed"] for s in subs)
    return result


def get_chapter_learning(chapter_id: str) -> dict[str, Any] | None:
    """Lerninhalt eines Kapitels (Lektionen + Metadaten, ohne Quiz-Lösungen)."""
    chapter = get_chapter(chapter_id)
    if not chapter:
        return None
    return {
        "id": chapter.get("id"),
        "title": chapter.get("title"),
        "summary": chapter.get("summary", ""),
        "estimatedMinutes": chapter.get("estimatedMinutes"),
        "lessons": chapter.get("lessons") or [],
    }


def get_chapter_quiz(chapter_id: str) -> dict[str, Any] | None:
    """Quiz eines Kapitels – OHNE Lösungen (correct/keywords/explanation).

    Die Auswertung erfolgt ausschließlich serverseitig, damit die richtigen
    Antworten nicht im Browser sichtbar sind.
    """
    chapter = get_chapter(chapter_id)
    if not chapter:
        return None
    quiz = chapter.get("quiz") or {}
    public_questions = []
    for q in quiz.get("questions") or []:
        public_questions.append({
            "id": q.get("id"),
            "type": q.get("type", "single"),
            "question": q.get("question", ""),
            "options": q.get("options") or [],
            "hint": q.get("hint", ""),
        })
    return {
        "chapterId": chapter.get("id"),
        "title": chapter.get("title"),
        "passThreshold": quiz.get("passThreshold", 0.7),
        "questions": public_questions,
    }


def get_chapter_reference(chapter_id: str) -> dict[str, Any] | None:
    """Nachschlagewerk-Einträge eines Kapitels."""
    chapter = get_chapter(chapter_id)
    if not chapter:
        return None
    return {
        "chapterId": chapter.get("id"),
        "title": chapter.get("title"),
        "entries": chapter.get("reference") or [],
    }


# ── Quiz-Auswertung (serverseitig) ────────────────────────────────────────────

def _evaluate_single(question: dict[str, Any], answer: Any) -> bool:
    try:
        return int(answer) == int(question.get("correct"))
    except (TypeError, ValueError):
        return False


def _evaluate_multi(question: dict[str, Any], answer: Any) -> bool:
    correct = question.get("correct")
    if not isinstance(correct, list):
        return False
    if not isinstance(answer, list):
        return False
    try:
        return sorted(int(a) for a in answer) == sorted(int(c) for c in correct)
    except (TypeError, ValueError):
        return False


def _evaluate_text(question: dict[str, Any], answer: Any) -> bool:
    """Freitext-Auswertung per Schlüsselwort-Abgleich.

    ``minKeywords`` (Default: alle) legt fest, wie viele der Keywords im
    Antworttext (case-insensitive) vorkommen müssen.
    """
    keywords = question.get("keywords") or []
    if not keywords:
        return False
    text = str(answer or "").lower()
    hits = sum(1 for kw in keywords if str(kw).lower() in text)
    min_required = question.get("minKeywords", len(keywords))
    try:
        min_required = int(min_required)
    except (TypeError, ValueError):
        min_required = len(keywords)
    return hits >= max(1, min_required)


_EVALUATORS = {
    "single": _evaluate_single,
    "multi": _evaluate_multi,
    "text": _evaluate_text,
}


def evaluate_quiz(chapter_id: str, answers: dict[str, Any]) -> dict[str, Any] | None:
    """Wertet eingereichte Antworten aus und gibt detailliertes Feedback zurück.

    ``answers`` – Mapping ``{ frageId: antwort }``.

    Rückgabe enthält pro Frage die Korrektheit + Erklärung sowie ein Gesamt-
    ergebnis inkl. Empfehlung, welche Lektionen bei Nichtbestehen zu wiederholen
    sind ("intelligentes" adaptives Feedback).
    """
    chapter = get_chapter(chapter_id)
    if not chapter:
        return None

    quiz = chapter.get("quiz") or {}
    questions = quiz.get("questions") or []
    pass_threshold = float(quiz.get("passThreshold", 0.7))

    lessons_by_id = {l.get("id"): l for l in (chapter.get("lessons") or [])}

    results = []
    correct_count = 0
    weak_lessons: dict[str, dict[str, Any]] = {}

    for q in questions:
        qid = q.get("id")
        qtype = q.get("type", "single")
        evaluator = _EVALUATORS.get(qtype, _evaluate_single)
        given = answers.get(qid)
        is_correct = evaluator(q, given)
        if is_correct:
            correct_count += 1
        else:
            ref = q.get("lessonRef")
            if ref and ref in lessons_by_id and ref not in weak_lessons:
                weak_lessons[ref] = {
                    "id": ref,
                    "title": lessons_by_id[ref].get("title", ref),
                }
        results.append({
            "id": qid,
            "correct": is_correct,
            "explanation": q.get("explanation", ""),
            "correctAnswer": _public_correct_answer(q),
        })

    total = len(questions)
    score = (correct_count / total) if total else 0.0
    passed = score >= pass_threshold

    return {
        "chapterId": chapter_id,
        "total": total,
        "correctCount": correct_count,
        "score": round(score, 4),
        "scorePercent": round(score * 100),
        "passThreshold": pass_threshold,
        "passThresholdPercent": round(pass_threshold * 100),
        "passed": passed,
        "results": results,
        "recommendedLessons": list(weak_lessons.values()),
    }


def _public_correct_answer(question: dict[str, Any]) -> Any:
    """Menschenlesbare Darstellung der richtigen Antwort (für Feedback nach Abgabe)."""
    qtype = question.get("type", "single")
    options = question.get("options") or []
    if qtype == "single":
        idx = question.get("correct")
        if isinstance(idx, int) and 0 <= idx < len(options):
            return options[idx]
        return None
    if qtype == "multi":
        correct = question.get("correct") or []
        return [options[i] for i in correct if isinstance(i, int) and 0 <= i < len(options)]
    if qtype == "text":
        return {"keywords": question.get("keywords") or []}
    return None
