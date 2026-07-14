# Schulungsplattform (Proof of Concept)

Eine eigenständige Web-Applikation im Repo, unabhängig von der Haupt-Webapp.
Sie dient als **Schulungsplattform** mit drei aufeinander aufbauenden Schritten:

1. **Lernen** – Inhalte werden strukturiert vermittelt (Text, Listen, Hinweise, Code).
2. **Testen** – Interaktives Quiz mit **serverseitiger, intelligenter Auswertung**
   (Einfach-/Mehrfachauswahl + Freitext per Schlüsselwortabgleich, adaptives Feedback
   mit Lektionsempfehlungen bei Nichtbestehen).
3. **Nachschlagen** – Ein Nachschlagewerk mit allen Kernbegriffen. Es ist von Beginn an
   zugänglich und wird nach bestandenem Test zusätzlich als „abgeschlossen" markiert.

Technischer Aufbau (wie die Haupt-Webapp): **React-Frontend + Flask-Backend**,
vorbereitet für spätere Account-Verwaltung.

---

## Schnellstart (Windows)

Ein Doppelklick auf **`dev_hosting.bat`** genügt. Das Skript:

- erstellt ein Python-`venv` im Backend und installiert die Abhängigkeiten,
- installiert die Frontend-Pakete und baut das Produktions-Frontend (`dist`),
- startet das Flask-Backend, das API **und** das gebaute Frontend ausliefert.

Danach im Browser öffnen: **http://localhost:8100**

---

## Entwicklung (Hot Reload)

Zwei Terminals:

```powershell
# 1) Backend (Port 8100)
cd schulungsplattform\backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python app.py

# 2) Frontend (Port 5273, mit Proxy auf /api → 8100)
cd schulungsplattform\frontend
npm install
npm run dev
```

Frontend-Entwicklung: **http://localhost:5273**

---

## Projektstruktur

```
schulungsplattform/
├─ dev_hosting.bat            # Ein-Klick-Starter (Build + Hosting)
├─ README.md
├─ backend/
│  ├─ app.py                  # Flask-App: API + Frontend-Auslieferung
│  ├─ content_store.py        # Lädt Kapitel-JSON, wertet Quiz serverseitig aus
│  ├─ requirements.txt
│  └─ content/
│     └─ ki-agent-grundlagen.json   # Beispiel-Kapitel (Test-Inhalt)
└─ frontend/
   ├─ package.json
   ├─ vite.config.js
   ├─ index.html
   └─ src/
      ├─ main.jsx
      ├─ App.jsx              # 3-Schritt-Navigation Lernen/Testen/Nachschlagen
      ├─ api.js               # API-Helfer + anonyme Session-ID
      └─ components/
         ├─ LearnPanel.jsx
         ├─ TestPanel.jsx
         └─ ReferencePanel.jsx
```

---

## Ein neues Kapitel hinzufügen

Kein Code nötig – einfach eine weitere JSON-Datei im Ordner
`backend/content/` ablegen. Schema (gekürzt):

```json
{
  "id": "eindeutige-id",
  "order": 2,
  "title": "Kapitelname",
  "summary": "Kurzbeschreibung",
  "estimatedMinutes": 15,
  "lessons": [
    {
      "id": "l1",
      "title": "1. Lektion",
      "blocks": [
        { "type": "text", "text": "..." },
        { "type": "list", "title": "...", "items": ["...", "..."] },
        { "type": "callout", "tone": "info|tip|warn", "title": "...", "text": "..." },
        { "type": "code", "language": "python", "caption": "...", "text": "..." }
      ]
    }
  ],
  "quiz": {
    "passThreshold": 0.7,
    "questions": [
      { "id": "q1", "type": "single", "lessonRef": "l1",
        "question": "...", "options": ["A", "B"], "correct": 1, "explanation": "..." },
      { "id": "q2", "type": "multi",  "lessonRef": "l1",
        "question": "...", "options": ["A", "B", "C"], "correct": [0, 2], "explanation": "..." },
      { "id": "q3", "type": "text",   "lessonRef": "l1",
        "question": "...", "keywords": ["begriff1", "begriff2"], "minKeywords": 1,
        "hint": "...", "explanation": "..." }
    ]
  },
  "reference": [
    { "term": "Begriff", "definition": "Erklärung" }
  ]
}
```

**Wichtig:** Die Quiz-Lösungen (`correct`, `keywords`, `explanation`) werden nie an den
Browser gesendet. Das Frontend erhält nur die Fragen; die Auswertung passiert im Backend
(`POST /api/chapters/<id>/quiz/evaluate`).

---

## API-Überblick

| Methode | Pfad | Zweck |
|--------|------|-------|
| GET  | `/api/health` | Health-Check |
| GET  | `/api/chapters` | Kapitelübersicht inkl. Fortschritt |
| GET  | `/api/chapters/<id>/learn` | Lerninhalt |
| GET  | `/api/chapters/<id>/quiz` | Quizfragen (ohne Lösungen) |
| POST | `/api/chapters/<id>/quiz/evaluate` | Antworten auswerten (serverseitig) |
| GET  | `/api/chapters/<id>/reference` | Nachschlagewerk |
| GET  | `/api/progress` | Fortschritt der aktuellen Session |

Die Session wird aktuell über einen anonymen `X-Session-Id`-Header identifiziert
(im `localStorage` gehalten). Für echte Accounts kann der `ProgressStore` in
`app.py` durch eine Datenbank-Implementierung ersetzt werden.
