# KI-Schulungsplattform

Interne Lernplattform für KI-Themen. Aufgebaut als React-SPA (Vite) + Flask-Backend. Inhalte werden ausschließlich über JSON-Dateien gepflegt – kein Code nötig, um neue Themen, Kapitel oder Lektionen hinzuzufügen.

---

## Inhaltsverzeichnis

1. [Konzept & Begriffe](#1-konzept--begriffe)
2. [Plattform-Architektur](#2-plattform-architektur)
3. [Inhalts-Hierarchie](#3-inhalts-hierarchie)
4. [JSON-Schema eines Kapitels](#4-json-schema-eines-kapitels)
5. [Block-Typen (Lektions-Inhalte)](#5-block-typen-lektions-inhalte)
6. [Quiz-Fragen-Typen](#6-quiz-fragen-typen)
7. [Datei-Namenskonvention & Ordner](#7-datei-namenskonvention--ordner)
8. [Aktuelle Inhalte](#8-aktuelle-inhalte)
9. [Neue Inhalte hinzufügen](#9-neue-inhalte-hinzufügen)
10. [One-Screen-Constraint](#10-one-screen-constraint)
11. [Plattform starten](#11-plattform-starten)
12. [API-Referenz](#12-api-referenz)

---

## 1. Konzept & Begriffe

| Begriff | Bedeutung |
|---|---|
| **Thema** (Topic) | Oberste Gruppierungsebene (z. B. „KI-Agenten und Automatisierung"). Mehrere Kapitel gehören zu einem Thema. |
| **Kapitel** (Chapter / SubTopic) | Eine JSON-Datei = ein Kapitel. Enthält Lektionen, Quiz und Referenz-Einträge. Wird in der UI als Unterpunkt des Themas angezeigt. |
| **Lektion** (Lesson) | Eine einzelne, bildschirmfüllende Lerneinheit innerhalb eines Kapitels. Besteht aus mehreren inhaltlichen Blöcken. |
| **Block** | Kleinste Inhaltseinheit einer Lektion (Text, Liste, Callout, Code, Diagramm, …). |
| **Quiz** | Wissenstest am Ende eines Kapitels (serverseitig ausgewertet, Lösungen nie im Frontend sichtbar). |
| **Referenz** | Glossar-ähnliche Nachschlage-Einträge pro Kapitel. |

---

## 2. Plattform-Architektur

```
schulungsplattform/
├── backend/
│   ├── app.py              # Flask-App, API-Routen, ProgressStore (In-Memory)
│   ├── content_store.py    # Lädt & verarbeitet alle Kapitel-JSON-Dateien
│   ├── requirements.txt
│   └── content/            # ← HIER LIEGEN DIE INHALTE (JSON-Dateien)
│       ├── 01-llm-grundlagen.json
│       ├── 02-ki-agenten.json
│       └── ...
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Routing: Landing → Topic → Chapter
│   │   ├── api.js                   # Fetch-Wrapper für alle Backend-Aufrufe
│   │   └── components/
│   │       ├── LandingPage.jsx      # Themen-Übersicht (Kacheln)
│   │       ├── TopicPage.jsx        # Kapitel-Übersicht eines Themas
│   │       ├── SubTopicSidebar.jsx  # Linke Sidebar in der Kapitel-Ansicht
│   │       ├── LearnPanel.jsx       # Lektions-Renderer (alle Block-Typen)
│   │       ├── TestPanel.jsx        # Quiz-Ansicht
│   │       └── ReferencePanel.jsx  # Glossar-Ansicht
│   └── vite.config.js
└── dev_hosting.bat         # Startet Backend + Frontend in einem Fenster
```

**Datenfluss:**
```
JSON-Datei  →  content_store.py  →  Flask API  →  React-Frontend
```

Der `content_store.py` scannt beim Start **automatisch** alle `*.json`-Dateien im `content/`-Ordner. Es ist kein Code-Eingriff nötig, um neue Inhalte zu laden.

---

## 3. Inhalts-Hierarchie

```
Thema (Topic)
└── Kapitel 1 (Chapter / JSON-Datei)
│   ├── Lektion 1
│   │   ├── Block (text)
│   │   ├── Block (callout)
│   │   └── Block (quizCheck)
│   ├── Lektion 2
│   │   └── ...
│   ├── Quiz (4–8 Fragen)
│   └── Referenz (Glossar-Einträge)
└── Kapitel 2 (Chapter / JSON-Datei)
    └── ...
```

**Navigation in der UI:**
1. **Landing Page** → Themen-Kacheln
2. **Topic-Seite** → Kapitel-Kacheln (mit Fortschrittsanzeige)
3. **Kapitel-Ansicht** → 3 Tabs: `Lernen` / `Testen` / `Nachschlagen`
   - Im **Lernen**-Tab: Lektionen als Folien (Dot-Navigation), eine Lektion = ein Screen
   - Im **Testen**-Tab: Quiz, serverseitig ausgewertet
   - Im **Nachschlagen**-Tab: Glossar

---

## 4. JSON-Schema eines Kapitels

Jede JSON-Datei in `backend/content/` beschreibt genau **ein Kapitel**.

```jsonc
{
  // ── Thema-Metadaten (gleich für alle Kapitel desselben Themas) ──────────
  "topicId":          "ki-agenten",                        // Gruppierschlüssel
  "topicTitle":       "KI-Agenten und Automatisierung",    // Anzeigename des Themas
  "topicDescription": "Kurzbeschreibung des Themas …",
  "topicIcon":        "🤖",                                // Emoji
  "topicAccentColor": "#1c69d4",                           // Hex-Farbe (BMW-Blau)
  "topicOrder":       1,                                   // Reihenfolge der Themen

  // ── Kapitel-Metadaten ────────────────────────────────────────────────────
  "id":               "llm-grundlagen",    // EINDEUTIG, URL-safe, = API-Schlüssel
  "order":            1,                   // Reihenfolge innerhalb des Themas
  "title":            "Wie LLMs funktionieren",  // Anzeige in Breadcrumb & Tabs
  "subTopicTitle":    "Wie LLMs funktionieren",  // Anzeige in der Topic-Kachel (oft = title)
  "subTopicDescription": "Kurzbeschreibung …",   // Unter der Kachel
  "summary":          "Kurzbeschreibung für die Sidebar …",
  "estimatedMinutes": 15,
  "tag":              "Allgemein",         // Optional: "Allgemein" | "BMW-intern" | …

  // ── Lektionen ────────────────────────────────────────────────────────────
  "lessons": [
    {
      "id":     "l1",              // Eindeutig im Kapitel, wird als lessonRef im Quiz genutzt
      "title":  "Lektionstitel",
      "blocks": [ /* siehe Block-Typen */ ]
    }
  ],

  // ── Quiz ─────────────────────────────────────────────────────────────────
  "quiz": {
    "passThreshold": 0.7,          // 70 % zum Bestehen
    "questions": [ /* siehe Quiz-Typen */ ]
  },

  // ── Referenz / Glossar ───────────────────────────────────────────────────
  "reference": [
    { "term": "Begriff", "definition": "Erklärung …" }
  ]
}
```

> **Wichtig:** Das Feld `"id"` ist der API-Schlüssel. Es muss über **alle** JSON-Dateien hinweg eindeutig sein und darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten (URL-safe).

---

## 5. Block-Typen (Lektions-Inhalte)

Jede Lektion hat ein `"blocks"`-Array. Die Reihenfolge bestimmt die visuelle Ausgabe.

### `text`
Fließtext. Markdown-Subsets werden **nicht** interpretiert – Plaintext.
```json
{ "type": "text", "text": "Erklärungstext …" }
```

### `callout`
Hervorgehobener Hinweis-Kasten. Tone steuert die Farbe.
```json
{
  "type":  "callout",
  "tone":  "info",       // "info" | "tip" | "warn"
  "title": "Hinweis",
  "text":  "Inhalt …"
}
```

### `list`
Aufzählungsliste mit optionalem Titel.
```json
{
  "type":  "list",
  "title": "Optionaler Titel",
  "items": ["Punkt 1", "Punkt 2", "Punkt 3"]
}
```

### `cards`
Kachel-Raster (3 Spalten) für Begriffe/Konzepte mit Icon.
```json
{
  "type":  "cards",
  "title": "Optionaler Titel",
  "items": [
    { "icon": "🧠", "label": "Begriff", "description": "Kurzbeschreibung" }
  ]
}
```

### `comparison`
Zwei-Spalten-Vergleich (links vs. rechts).
```json
{
  "type": "comparison",
  "left":  { "label": "Variante A", "items": ["Merkmal 1", "Merkmal 2"] },
  "right": { "label": "Variante B", "items": ["Merkmal 1", "Merkmal 2"] }
}
```

### `steps`
Nummerierte Schritt-für-Schritt-Abfolge.
```json
{
  "type":  "steps",
  "title": "Optionaler Titel",
  "items": [
    { "label": "Schritt 1", "description": "Was passiert …", "example": "Optional: Beispiel" }
  ]
}
```

### `code`
Code-Block mit Syntax-Highlighting.
```json
{
  "type":     "code",
  "language": "python",    // "python" | "json" | "bash" | "javascript" | …
  "caption":  "Optionale Überschrift",
  "text":     "print('Hello World')"
}
```

### `diagram`
Ablauf-Diagramm (Nodes + optionaler Loop-Pfeil).
```json
{
  "type":    "diagram",
  "caption": "Optionaler Titel",
  "nodes": [
    { "id": "n1", "label": "Start",      "shape": "rounded" },
    { "id": "n2", "label": "Verarbeite", "shape": "rect"    },
    { "id": "n3", "label": "Ende",       "shape": "rounded" }
  ],
  "loop": {
    "from":  "n3",
    "to":    "n1",
    "label": "Wiederholen"
  }
}
```
`shape`: `"rounded"` | `"rect"` | `"diamond"`

### `quizCheck`
Mini-Verständnisfrage direkt in der Lektion (kein Teil des Haupt-Quiz).
```json
{
  "type":     "quizCheck",
  "question": "Frage …",
  "options":  ["Antwort A", "Antwort B", "Antwort C"],
  "correct":  1,            // 0-basierter Index
  "hint":     "Tipp …"
}
```

### `taskInput`
Freie Texteingabe mit Muster-Antwort (nicht serverseitig bewertet).
```json
{
  "type":          "taskInput",
  "prompt":        "Aufgabenstellung …",
  "exampleAnswer": "Musterlösung …"
}
```

### `simulation`
Interaktives Beispiel (vordefinierte Eingaben + Ausgaben simulieren).
```json
{
  "type":    "simulation",
  "caption": "Optionaler Titel",
  "steps": [
    { "input": "Nutzer-Input", "output": "Simulated Output" }
  ]
}
```

---

## 6. Quiz-Fragen-Typen

```jsonc
{
  "id":         "q1",          // Eindeutig im Kapitel
  "type":       "single",      // "single" | "multi" | "text"
  "lessonRef":  "l1",          // Welche Lektion wird bei Fehler empfohlen
  "question":   "Frage …",
  "options":    ["A", "B", "C", "D"],   // Nur bei single/multi
  "correct":    1,             // single: 0-basierter Index; multi: Array [0,2]
  "keywords":   ["token"],     // Nur bei type:"text" – Schlüsselwörter zur Auswertung
  "minKeywords": 1,            // Nur bei type:"text" – wie viele müssen treffen
  "hint":       "Tipp …",      // Optional, im Frontend sichtbar
  "explanation": "Erklärung …" // Wird nach Abgabe angezeigt
}
```

> **Sicherheit:** `correct`, `keywords` und `explanation` werden vom Backend **nie** an den Browser gesendet. Auswertung erfolgt ausschließlich serverseitig.

---

## 7. Datei-Namenskonvention & Ordner

```
backend/content/NN-kurzname.json
```

- `NN` = zweistellige Nummer (01, 02, …) – steuert die Sortier-**Reihenfolge** innerhalb eines Themas
- `kurzname` = URL-safe, beschreibend, Kleinbuchstaben + Bindestriche
- Das `"order"`-Feld im JSON **muss** mit dem Nummernpräfix übereinstimmen
- Das `"id"`-Feld sollte dem `kurzname`-Teil des Dateinamens entsprechen

**Beispiel:**
```
01-llm-grundlagen.json   →  "id": "llm-grundlagen",   "order": 1
02-ki-agenten.json       →  "id": "ki-agenten",        "order": 2
```

**Neues Thema:** Einfach `topicId` auf einen neuen Wert setzen. Das Backend gruppiert automatisch.

---

## 8. Aktuelle Inhalte

### Thema: KI-Agenten und Automatisierung (`topicId: "ki-agenten"`)

| Datei | Chapter-ID | Titel | Lektionen | Quiz | ca. Min |
|---|---|---|---|---|---|
| `01-llm-grundlagen.json` | `llm-grundlagen` | Wie LLMs und Tool Calls funktionieren | 5 | 4 | 15 |
| `02-ki-agenten.json` | `ki-agenten` | Was KI-Agenten sind | 4 | 4 | 10 |
| `03-agenten-bauen.json` | `agenten-bauen` | Eigene spezialisierte Agenten erstellen | 7 | 7 | 28 |
| `04-workflows-deployment.json` | `workflows-deployment` | Mehrstufige Arbeitsabläufe automatisieren | 8 | 8 | 30 |

---

## 9. Neue Inhalte hinzufügen

### Neues Kapitel zu einem bestehenden Thema

1. Neue Datei anlegen: `backend/content/NN-kurzname.json`
2. `topicId` auf das bestehende Thema setzen (z. B. `"ki-agenten"`)
3. `id` eindeutig wählen (= `kurzname`), `order` = `NN`
4. `topicTitle`, `topicDescription`, `topicIcon`, `topicAccentColor`, `topicOrder` identisch zu den anderen Kapiteln des Themas setzen
5. Lektionen, Quiz und Referenz befüllen
6. JSON validieren (s. u.)
7. Backend neu starten – fertig

### Neues Thema

1. Neue Datei anlegen, z. B. `backend/content/01-mein-thema-einfuehrung.json`
2. Neue `topicId` vergeben (z. B. `"prompt-engineering"`)
3. `topicOrder` so wählen, dass das Thema an der gewünschten Stelle erscheint
4. Weitere Kapitel desselben Themas mit gleicher `topicId` anlegen

### JSON validieren

```powershell
# PowerShell
Get-Content backend\content\NN-kurzname.json -Raw | ConvertFrom-Json
```

```python
# Python
import json; json.loads(open("backend/content/NN-kurzname.json", encoding="utf-8").read())
```

---

## 10. One-Screen-Constraint

**Jede Lektion muss auf einem durchschnittlichen Laptop-Bildschirm ohne Scrollen lesbar sein.**

Faustregel pro Lektion:
- Max. **2 Content-Blöcke** (text, list, cards, comparison, …)
- Max. **1 interaktiver Block** (quizCheck, taskInput, simulation, code)
- Kein Block mit mehr als ~5 Listeneinträgen oder ~6 Karten
- Diagramme: max. 5 Nodes

Wenn ein Thema mehr Inhalt braucht → **neue Lektion** anlegen, nicht den Block aufblähen.

---

## 11. Plattform starten

### Schnellstart (empfohlen)
```bat
dev_hosting.bat
```
Öffnet Backend (Port 8100) + Frontend-Dev-Server (Port 5173) automatisch.

### Manuell

**Backend:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python app.py
```

**Frontend (Dev):**
```powershell
cd frontend
npm run dev
```

**Frontend (Build für Hosting):**
```powershell
cd frontend
npm run build
# Build landet in frontend/dist/
# Flask serviert dann / automatisch aus dist/
```

**Umgebungsvariablen (Backend):**
| Variable | Default | Beschreibung |
|---|---|---|
| `TRAINING_HOST` | `127.0.0.1` | Bind-Adresse |
| `TRAINING_PORT` | `8100` | Port |
| `TRAINING_USE_WAITRESS` | `1` | `0` = Flask-Dev-Server |

---

## 12. API-Referenz

Basis-URL: `http://127.0.0.1:8100`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/health` | Health-Check |
| `GET` | `/api/topics` | Alle Themen mit Kapitelstruktur und Fortschritt |
| `GET` | `/api/chapters` | Alle Kapitel (Übersicht, ohne Lektions-Inhalte) |
| `GET` | `/api/chapters/{id}/learn` | Lektions-Inhalte eines Kapitels |
| `GET` | `/api/chapters/{id}/quiz` | Quiz-Fragen (ohne Lösungen) |
| `POST` | `/api/chapters/{id}/quiz/evaluate` | Quiz auswerten (Body: `{"answers": {"q1": 0}}`) |
| `GET` | `/api/chapters/{id}/reference` | Glossar-Einträge eines Kapitels |
| `GET` | `/api/progress` | Fortschritt der aktuellen Session |

**Session-ID:** Optionaler Header `X-Session-Id: <uuid>` oder Query-Parameter `?session=<uuid>`. Ohne Angabe: `"anonymous"` (gemeinsamer Fortschritt).

---

## Technischer Stack

| Schicht | Technologie |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Python 3.11+, Flask, flask-cors, waitress |
| Icons | lucide-react |
| Inhalte | JSON (kein CMS, kein Build-Schritt) |
| Fortschritt | In-Memory (pro Prozess, kein Persist) |
