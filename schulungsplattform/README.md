# KI-Schulungsplattform

Interne Lernplattform für KI-Themen. Aufgebaut als React-SPA (Vite + TypeScript) + schlankes Flask-Backend. **Alle Inhalte** (Lektionen, Quiz und Nachschlagewerk) werden direkt in **TSX-Kapiteldateien** gepflegt. Das Backend dient ausschließlich der Fortschritts-Speicherung und als Grundlage für spätere Account-Verwaltung.

> **Migrationshinweis:** Früher wurden die Inhalte über JSON-Dateien gepflegt. Diese liegen jetzt nur noch als Legacy-Referenz unter `docs/legacy-content/` und werden **nicht** mehr von der Anwendung geladen.

---

## Inhaltsverzeichnis

1. [Konzept & Begriffe](#1-konzept--begriffe)
2. [Plattform-Architektur](#2-plattform-architektur)
3. [Inhalts-Hierarchie](#3-inhalts-hierarchie)
4. [Aufbau einer Kapitel-TSX-Datei](#4-aufbau-einer-kapitel-tsx-datei)
5. [Bausteine für Lektionen (Blocks)](#5-bausteine-für-lektionen-blocks)
6. [Quiz-Fragen-Typen](#6-quiz-fragen-typen)
7. [Datei-Namenskonvention & Registry](#7-datei-namenskonvention--registry)
8. [Aktuelle Inhalte](#8-aktuelle-inhalte)
9. [Neue Inhalte hinzufügen](#9-neue-inhalte-hinzufügen)
10. [One-Screen-Constraint](#10-one-screen-constraint)
11. [Plattform starten](#11-plattform-starten)
12. [API-Referenz](#12-api-referenz)

---

## 1. Konzept & Begriffe

| Begriff | Bedeutung |
|---|---|
| **Thema** (Topic) | Oberste Gruppierungsebene (z. B. „KI-Agenten und Automatisierung"). Mehrere Kapitel gehören zu einem Thema. Wird in der Registry definiert. |
| **Kapitel** (Chapter / SubTopic) | Eine TSX-Datei = ein Kapitel. Enthält die Lern-Komponente und das Quiz. Wird in der UI als Unterpunkt des Themas angezeigt. |
| **Lektion** (Lesson) | Eine einzelne, bildschirmfüllende Lerneinheit innerhalb eines Kapitels. Als JSX in der Lern-Komponente umgesetzt. |
| **Block** | Wiederverwendbare Präsentations-Komponente einer Lektion (Text, Liste, Callout, Code, Diagramm, …) aus `chapters/shared/Blocks.tsx`. |
| **Quiz** | Wissenstest am Ende eines Kapitels. Wird **clientseitig** ausgewertet; die Ergebnisse werden ans Backend gemeldet. |
| **Referenz** | Glossar-ähnliche Nachschlage-Einträge. Liegen bewusst getrennt in `content/reference.ts`, sind aber ihrem Kapitel (chapterId) zugeordnet. |

---

## 2. Plattform-Architektur

```
schulungsplattform/
├── backend/
│   ├── app.py              # Flask-App: Fortschritt-API + Auslieferung des Frontend-Builds
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx                     # Routing: Landing → Topic → Chapter
│   │   ├── api.ts                      # Fetch-Wrapper (nur Health + Fortschritt)
│   │   ├── types.ts                    # UI-Typen (Topic, SubTopic, Quiz, …)
│   │   ├── content/
│   │   │   ├── types.ts                # Autoren-Typen (ChapterDef, QuizQuestion, …)
│   │   │   ├── reference.ts            # Nachschlagewerk (getrennt, nach chapterId)
│   │   │   ├── quiz.ts                 # Quiz-Aufbereitung & clientseitige Auswertung
│   │   │   └── registry.ts             # ← fügt Kapitel, Quiz & Referenz zusammen
│   │   ├── chapters/
│   │   │   ├── ki-agenten/
│   │   │   │   ├── 01-LlmGrundlagen.tsx        # ← HIER LIEGEN DIE INHALTE
│   │   │   │   ├── 02-ToolCalling.tsx
│   │   │   │   └── ...
│   │   │   └── shared/
│   │   │       ├── Blocks.tsx          # Wiederverwendbare Inhalts-Bausteine
│   │   │       └── ChapterFrame.tsx    # Lektions-Rahmen (Fortschritt, Dot-Nav)
│   │   └── components/
│   │       ├── LandingPage.tsx         # Themen-Übersicht (Kacheln)
│   │       ├── TopicPage.tsx           # Kapitel-Übersicht eines Themas
│   │       ├── SubTopicSidebar.tsx     # Linke Sidebar in der Kapitel-Ansicht
│   │       ├── TestPanel.tsx           # Quiz-Ansicht (clientseitig ausgewertet)
│   │       ├── ReferencePanel.tsx      # Glossar-Ansicht (Kapitel)
│   │       └── GlossaryPage.tsx        # Zentrales Glossar (alle Kapitel)
│   └── vite.config.ts
└── dev_hosting.bat         # Baut Frontend + startet Backend in einem Fenster

docs/
└── legacy-content/         # Archivierte JSON-Inhalte (nicht mehr aktiv genutzt)
```

**Datenfluss:**
```
Kapitel-TSX  →  content/registry.ts  →  React-Frontend
                                     ↘  Fortschritt  →  Flask API (/api/progress)
```

Die `registry.ts` importiert jedes Kapitel und stellt daraus die Themenstruktur, das Quiz (über `content/quiz.ts`) und das Nachschlagewerk (über `content/reference.ts`) bereit. Es ist **kein** Backend-Aufruf nötig, um Inhalte zu laden.

---

## 3. Inhalts-Hierarchie

```
Thema (Topic – in registry.ts)
└── Kapitel 1 (Chapter / TSX-Datei)
│   ├── Lektion 1 (JSX in der Learn-Komponente)
│   │   ├── <Text>
│   │   ├── <Callout>
│   │   └── <QuizCheck>
│   ├── Lektion 2
│   │   └── ...
│   ├── quiz     (4–8 Fragen, mit Lösungen im chapter-Export)
│   └── (Referenz → content/reference.ts, unter derselben chapterId)
└── Kapitel 2 (Chapter / TSX-Datei)
    └── ...
```

**Navigation in der UI:**
1. **Landing Page** → Themen-Kacheln
2. **Topic-Seite** → Kapitel-Kacheln (mit Fortschrittsanzeige)
3. **Kapitel-Ansicht** → 3 Tabs: `Lernen` / `Testen` / `Nachschlagen`
   - Im **Lernen**-Tab: Lektionen als Folien (Dot-Navigation), eine Lektion = ein Screen
   - Im **Testen**-Tab: Quiz, clientseitig ausgewertet, Ergebnis wird ans Backend gemeldet
   - Im **Nachschlagen**-Tab: Glossar

---

## 4. Aufbau einer Kapitel-TSX-Datei

Jede TSX-Datei in `frontend/src/chapters/<thema>/` beschreibt genau **ein Kapitel**. Sie besteht aus zwei Teilen:

1. Einer **Lern-Komponente** (`export default function …`), die die Lektionen als JSX rendert.
2. Einem **`chapter`-Export** (`export const chapter: ChapterDef`), der Metadaten und das Quiz (inkl. Lösungen) enthält. Das Nachschlagewerk liegt separat in `content/reference.ts`.

```tsx
import type { ChapterDef, ChapterLearnProps } from '../../content/types'
import ChapterFrame from '../shared/ChapterFrame'
import { Text, Callout, List, QuizCheck } from '../shared/Blocks'

// ── 1) Lern-Komponente ──────────────────────────────────────────────────────
export default function LlmGrundlagen({ onStartTest, onOpenReference }: ChapterLearnProps) {
  return (
    <ChapterFrame
      onStartTest={onStartTest}
      onOpenReference={onOpenReference}
      lessons={[
        {
          title: 'Was ist ein LLM?',
          content: (
            <>
              <Text text="Ein Large Language Model …" />
              <Callout tone="info" title="Merke" text="…" />
            </>
          ),
        },
        // weitere Lektionen …
      ]}
    />
  )
}

// ── 2) Kapitel-Definition (Meta + Quiz + Referenz) ──────────────────────────
export const chapter: ChapterDef = {
  id: 'llm-grundlagen',            // EINDEUTIG, URL-safe, = Registry-Schlüssel
  title: 'Wie LLMs funktionieren',
  subTopicTitle: 'Wie LLMs funktionieren',
  summary: 'Kurzbeschreibung für die Sidebar …',
  subTopicDescription: 'Kurzbeschreibung unter der Kachel …',
  estimatedMinutes: 15,
  lessonCount: 5,
  tag: 'Allgemein',                // Optional
  Learn: LlmGrundlagen,            // Verweis auf die Lern-Komponente oben
  quiz: {
    passThreshold: 0.7,            // 70 % zum Bestehen (Default)
    questions: [ /* siehe Quiz-Typen */ ],
  },
}
```

> **Wichtig:** Das Feld `id` ist der Registry-Schlüssel. Es muss über **alle** Kapitel hinweg eindeutig sein und darf nur Kleinbuchstaben, Ziffern und Bindestriche enthalten (URL-safe). Die passenden Nachschlage-Einträge werden in [`content/reference.ts`](frontend/src/content/reference.ts) unter derselben `id` gepflegt.

---

## 5. Bausteine für Lektionen (Blocks)

Die Lektions-Inhalte werden mit den wiederverwendbaren Komponenten aus [`chapters/shared/Blocks.tsx`](frontend/src/chapters/shared/Blocks.tsx) aufgebaut. Statt eines JSON-Block-Arrays wird JSX geschrieben, z. B.:

```tsx
<Text text="Fließtext …" />

<Callout tone="tip" title="Hinweis" text="Inhalt …" />

<List title="Optionaler Titel" items={['Punkt 1', 'Punkt 2']} />

<QuizCheck
  blockKey="l2-quiz"
  question="Verständnisfrage direkt in der Lektion"
  options={['A', 'B', 'C']}
  correct={1}
  hint="Tipp …"
/>
```

Die verfügbaren Bausteine (und ihre Props) sind in [`Blocks.tsx`](frontend/src/chapters/shared/Blocks.tsx) definiert. Neue Baustein-Typen werden dort ergänzt und stehen anschließend allen Kapiteln zur Verfügung.

---

## 6. Quiz-Fragen-Typen

Die Fragen stehen im `quiz.questions`-Array des `chapter`-Exports (Typ `QuizQuestion` aus [`content/types.ts`](frontend/src/content/types.ts)):

```ts
{
  id: 'q1',                 // Eindeutig im Kapitel
  type: 'single',           // 'single' | 'multi' | 'text'
  question: 'Frage …',
  options: ['A', 'B', 'C', 'D'],   // Nur bei single/multi
  correct: 1,               // single: Index; multi: Array [0, 2]
  keywords: ['token'],      // Nur bei type:'text' – Schlüsselwörter zur Auswertung
  minKeywords: 1,           // Nur bei type:'text' – wie viele müssen treffen
  hint: 'Tipp …',           // Optional
  explanation: 'Erklärung …',       // Wird nach Abgabe angezeigt
  reviewLesson: 'Was ist ein LLM?', // Lektionstitel, der bei Fehler empfohlen wird
}
```

> **Auswertung:** Das Quiz wird **clientseitig** in [`content/quiz.ts`](frontend/src/content/quiz.ts) (`gradeQuiz`) ausgewertet; [`content/registry.ts`](frontend/src/content/registry.ts) reicht die Aufrufe pro Kapitel-ID durch. `buildPublicQuiz` liefert die Fragen ohne Lösungen an die UI; die Lösungen (`correct`, `keywords`, `explanation`) bleiben im gebündelten JS, werden aber erst nach der Abgabe angezeigt. Das Ergebnis (`passed`, `scorePercent`) wird per `POST /api/progress` ans Backend gemeldet.

---

## 7. Datei-Namenskonvention & Registry

```
frontend/src/chapters/<thema>/NN-PascalCaseName.tsx
```

- `NN` = zweistellige Nummer (01, 02, …) – für eine saubere Sortierung im Dateisystem
- `PascalCaseName` = beschreibend, entspricht dem Namen der Lern-Komponente
- Die **tatsächliche Reihenfolge** in der UI bestimmt die `chapters`-Liste des Themas in [`content/registry.ts`](frontend/src/content/registry.ts)

**Registry:** In [`content/registry.ts`](frontend/src/content/registry.ts) wird jedes Kapitel importiert und einem Thema (`TopicDef`) zugeordnet:

```ts
import { chapter as llmGrundlagen } from '../chapters/ki-agenten/01-LlmGrundlagen'
// …

export const TOPICS: TopicDef[] = [
  {
    id: 'ki-agenten',
    title: 'KI-Agenten und Automatisierung',
    description: '…',
    icon: '🤖',
    accentColor: '#1c69d4',
    order: 1,
    chapters: [llmGrundlagen, toolCalling, /* … */],  // Reihenfolge = UI-Reihenfolge
  },
]
```

---

## 8. Aktuelle Inhalte

### Thema: KI-Agenten und Automatisierung (`id: "ki-agenten"`)

| Datei | Chapter-ID | Titel | Lektionen | Quiz | ca. Min |
|---|---|---|---|---|---|
| `01-LlmGrundlagen.tsx` | `llm-grundlagen` | Wie LLMs funktionieren | 5 | 4 | 15 |
| `02-ToolCalling.tsx` | `tool-calling` | Tool Calling | 5 | 5 | — |
| `03-WasIstAgent.tsx` | `was-ist-agent` | Was KI-Agenten sind | 4 | 4 | 10 |
| `04-AgentenBauen.tsx` | `agenten-bauen` | Eigene spezialisierte Agenten erstellen | 7 | 7 | 28 |
| `05-WorkflowsDeployment.tsx` | `workflows-deployment` | Mehrstufige Arbeitsabläufe automatisieren | 8 | 8 | 30 |

---

## 9. Neue Inhalte hinzufügen

### Neues Kapitel zu einem bestehenden Thema

1. Neue Datei anlegen: `frontend/src/chapters/<thema>/NN-PascalCaseName.tsx`
2. Lern-Komponente (`export default`) mit `ChapterFrame` und Lektionen umsetzen
3. `chapter`-Export (`export const chapter: ChapterDef`) mit Metadaten und Quiz ergänzen; `id` eindeutig wählen
4. Nachschlage-Einträge in [`content/reference.ts`](frontend/src/content/reference.ts) unter derselben `id` ergänzen (optional)
5. In [`content/registry.ts`](frontend/src/content/registry.ts) das Kapitel importieren und an gewünschter Stelle in die `chapters`-Liste des Themas einfügen
6. `npm run build` / Dev-Server prüft die Typen automatisch – fertig

### Neues Thema

1. Ordner `frontend/src/chapters/<neues-thema>/` anlegen und Kapitel wie oben erstellen
2. In [`content/registry.ts`](frontend/src/content/registry.ts) einen neuen `TopicDef`-Eintrag in `TOPICS` ergänzen (`id`, `title`, `description`, `icon`, `accentColor`, `order`, `chapters`)

---

## 10. One-Screen-Constraint

**Jede Lektion muss auf einem durchschnittlichen Laptop-Bildschirm ohne Scrollen lesbar sein.**

Faustregel pro Lektion:
- Max. **2 Content-Bausteine** (Text, List, Cards, Comparison, …)
- Max. **1 interaktiver Baustein** (QuizCheck, TaskInput, Simulation, Code)
- Kein Baustein mit mehr als ~5 Listeneinträgen oder ~6 Karten
- Diagramme: max. 5 Nodes

Wenn ein Thema mehr Inhalt braucht → **neue Lektion** anlegen, nicht den Baustein aufblähen.

---

## 11. Plattform starten

### Schnellstart (empfohlen)
```bat
dev_hosting.bat
```
Baut das Frontend und startet das Backend (Port 8100), das den Build automatisch aus `frontend/dist/` ausliefert.

### Manuell

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

**Backend:**
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python app.py
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

Das Backend liefert **keine** Inhalte mehr aus – diese leben im Frontend. Es verwaltet nur den Fortschritt:

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/health` | Health-Check |
| `GET` | `/api/progress` | Fortschritt der aktuellen Session |
| `POST` | `/api/progress` | Fortschritt melden (Body: `{"chapterId": "…", "passed": true, "scorePercent": 85}`) |

**Session-ID:** Optionaler Header `X-Session-Id: <uuid>` oder Query-Parameter `?session=<uuid>`. Ohne Angabe: `"anonymous"` (gemeinsamer Fortschritt).

> Der Fortschritt liegt aktuell nur im Arbeitsspeicher (pro Prozess). Der `ProgressStore` in [`app.py`](backend/app.py) ist so gekapselt, dass er später 1:1 durch eine datenbankgestützte, account-basierte Implementierung ersetzt werden kann.

---

## Technischer Stack

| Schicht | Technologie |
|---|---|
| Frontend | React 18, Vite, TypeScript, CSS Modules |
| Backend | Python 3.11+, Flask, flask-cors, waitress |
| Icons | lucide-react |
| Inhalte | TSX-Kapitel (kein CMS, in den Build eingebunden) |
| Fortschritt | In-Memory (pro Prozess, kein Persist) |
