/**
 * Kapitel 2 – Wie kommunizieren LLMs mit der Außenwelt?
 * Tool Calling mit Jira- und GitHub-Beispielen.
 */
import ChapterFrame from '../shared/ChapterFrame'
import {
  Callout, Steps, Text, Diagram,
  Comparison, QuizCheck,
} from '../shared/Blocks'
import type { ChapterDef } from '../../content/types'

interface Props {
  onStartTest: () => void
  onOpenReference: () => void
}

export default function ToolCalling({ onStartTest, onOpenReference }: Props) {
  return (
    <ChapterFrame
      onStartTest={onStartTest}
      onOpenReference={onOpenReference}
      lessons={[

        // ── Lektion 1: Überblick ─────────────────────────────────────────
        {
          title: 'Worum geht es in diesem Kapitel?',
          content: (
            <>
              <Callout
                tone="info"
                title="Kapitel-Überblick"
                text="Du weißt jetzt, wie ein LLM intern arbeitet. Aber ein LLM, das nur Text erzeugt, kann keine Tickets anlegen, keine PRs lesen und keine Systeme steuern. In diesem Kapitel lernst du, wie Tool Calling das ändert."
              />
              <Steps title="Was dich erwartet" items={[
                { label: 'Das Problem', description: 'Warum ein LLM allein nicht mit der Welt interagieren kann.' },
                { label: 'Tool Calling', description: 'Wie ein LLM eine Funktion "aufruft", ohne sie selbst auszuführen.' },
                { label: 'Jira-Beispiel', description: 'Ein Ticket anlegen und Aufgaben suchen.' },
                { label: 'GitHub-Beispiel', description: 'Pull Requests lesen und Code-Änderungen kommentieren.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 2: Das Problem ───────────────────────────────────────
        {
          title: 'Das Problem: LLMs können nur Text',
          requiredKeys: ['l2-quiz'],
          content: (
            <>
              <Callout
                tone="warn"
                title="Die Grenze eines LLM"
                text="Ein LLM kann nur Text erzeugen. Es kann nicht googeln, keine E-Mail senden, kein Jira-Ticket anlegen und keine Datenbank abfragen. Ohne Erweiterung ist es auf sein Trainings-Wissen beschränkt."
              />
              <Comparison
                left={{
                  label: 'LLM ohne Tools',
                  color: '#6b7280',
                  items: [
                    'Kann nur auf Trainingswissen antworten',
                    'Keine aktuellen Daten abrufbar',
                    'Keine Aktionen in externen Systemen',
                    'Kein Zugriff auf interne Tools',
                  ],
                }}
                right={{
                  label: 'LLM mit Tools',
                  color: '#1c69d4',
                  items: [
                    'Kann aktuelle Daten nachschlagen',
                    'Kann Jira-Tickets anlegen und suchen',
                    'Kann GitHub-PRs lesen und kommentieren',
                    'Kann Workflows in echten Systemen auslösen',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l2-quiz"
                question="Was kann ein LLM OHNE Werkzeuge (Tools)?"
                options={[
                  'Aktuelle Tickets aus Jira abrufen.',
                  'Nur Text erzeugen – basierend auf seinem Trainings-Wissen.',
                  'E-Mails versenden.',
                ]}
                correct={1}
                hint="Ohne Tools ist ein LLM auf reinen Text beschränkt."
              />
            </>
          ),
        },

        // ── Lektion 3: Was ist ein Tool Call? ────────────────────────────
        {
          title: 'Was ist ein Tool Call?',
          requiredKeys: ['l3-quiz'],
          content: (
            <>
              <Text text={'Ein Tool Call ist die Möglichkeit für ein LLM, eine klar definierte Funktion aufzurufen – zum Beispiel suche_jira_tickets(projekt="ES-212"). Das LLM erzeugt dabei nur den Aufruf. Das Framework führt die Funktion aus und gibt das Ergebnis zurück.'} />
              <Diagram
                caption="Ablauf eines Tool Calls"
                nodes={[
                  { id: 'user',   type: 'start', emoji: '👤', label: 'Nutzer fragt',    sublabel: "z. B. 'Welche offenen Bugs gibt es?'" },
                  { id: 'think',  type: 'step',  emoji: '🧠', label: 'LLM denkt nach',  sublabel: 'Ich brauche ein Tool!' },
                  { id: 'call',   type: 'step',  emoji: '📤', label: 'Tool Call',        sublabel: 'suche_jira_tickets(...)' },
                  { id: 'exec',   type: 'step',  emoji: '⚙️', label: 'Ausführung',      sublabel: 'Framework ruft Jira-API' },
                  { id: 'result', type: 'step',  emoji: '📥', label: 'Ergebnis',         sublabel: 'Liste der Tickets' },
                  { id: 'ans',    type: 'end',   emoji: '💬', label: 'Antwort',          sublabel: 'LLM fasst zusammen' },
                ]}
              />
              <Callout
                tone="tip"
                title="Merke"
                text="Das LLM führt das Tool nicht selbst aus! Es erzeugt nur einen strukturierten Aufruf (JSON mit Funktionsname + Argumente). Das Framework übernimmt die eigentliche Ausführung und gibt das Ergebnis zurück."
              />
              <QuizCheck
                blockKey="l3-quiz"
                question="Wer führt die Funktion aus, nachdem das LLM einen Tool Call erzeugt hat?"
                options={[
                  'Das LLM selbst.',
                  'Das Agent-Framework.',
                  'Der Nutzer manuell.',
                ]}
                correct={1}
                hint="Das LLM erzeugt nur den Aufruf – jemand anderes muss ihn ausführen."
              />
            </>
          ),
        },

        // ── Lektion 4: Jira ──────────────────────────────────────────────
        {
          title: 'Beispiel: Jira-Integration',
          requiredKeys: ['l4-quiz'],
          content: (
            <>
              <Text text="Jira ist eines der häufigsten Systeme in Entwicklungsteams. Mit Tool Calling kann ein LLM Tickets anlegen, suchen und aktualisieren – ohne dass der Nutzer die Jira-Oberfläche öffnen muss." />
              <Steps title="Typische Jira-Tools für ein LLM" items={[
                { label: 'erstelle_ticket(titel, beschreibung, typ)', description: 'Legt ein neues Jira-Ticket an.', example: "erstelle_ticket('Login-Fehler', 'Passwort-Validierung fehlt', 'Bug')" },
                { label: 'suche_tickets(projekt, status, zugewiesen_an)', description: 'Gibt eine Liste passender Tickets zurück.', example: "suche_tickets(projekt='ES-212', status='Offen')" },
                { label: 'aktualisiere_ticket(ticket_id, felder)', description: 'Ändert Status, Priorität oder Beschreibung.', example: "aktualisiere_ticket('ES-42', {'status': 'In Bearbeitung'})" },
              ]} />
              <Diagram
                caption="Jira-Tool Call: Ticket aus einer Beschreibung anlegen"
                nodes={[
                  { id: 'in',     type: 'start', emoji: '✉️', label: 'Eingabe',            sublabel: 'Fehlerbeschreibung vom Nutzer' },
                  { id: 'decide', type: 'step',  emoji: '🧠', label: 'LLM analysiert',     sublabel: 'Typ: Bug, Projekt: ES-212' },
                  { id: 'call',   type: 'step',  emoji: '📤', label: 'erstelle_ticket()',  sublabel: 'Strukturierter API-Aufruf' },
                  { id: 'jira',   type: 'step',  emoji: '🎯', label: 'Jira API',           sublabel: 'Ticket ES-212-99 erstellt' },
                  { id: 'done',   type: 'end',   emoji: '✅', label: 'Bestätigung',         sublabel: 'Link zum Ticket zurück' },
                ]}
              />
              <QuizCheck
                blockKey="l4-quiz"
                question="Ein Nutzer sagt: 'Leg ein Bug-Ticket für den Login-Fehler an.' Was macht das LLM als Nächstes?"
                options={[
                  'Es antwortet mit einer Beschreibung, wie man ein Ticket anlegt.',
                  "Es erzeugt einen Tool Call 'erstelle_ticket(...)' mit den passenden Parametern.",
                  'Es öffnet die Jira-Oberfläche im Browser.',
                ]}
                correct={1}
                hint="Das LLM erzeugt einen strukturierten Aufruf – das Framework führt ihn aus."
              />
            </>
          ),
        },

        // ── Lektion 5: GitHub ────────────────────────────────────────────
        {
          title: 'Beispiel: GitHub-Integration',
          requiredKeys: ['l5-quiz'],
          content: (
            <>
              <Text text="GitHub ist die zentrale Plattform für Code-Zusammenarbeit. Mit Tool Calling kann ein LLM Pull Requests analysieren, Kommentare verfassen und Code-Änderungen verarbeiten – direkt im Entwicklungsworkflow." />
              <Steps title="Typische GitHub-Tools für ein LLM" items={[
                { label: 'lese_pull_request(repo, pr_nummer)', description: 'Gibt Titel, Beschreibung und geänderte Dateien zurück.', example: "lese_pull_request('my-org/backend', 42)" },
                { label: 'erstelle_kommentar(repo, pr_nummer, kommentar)', description: 'Verfasst einen Review-Kommentar am PR.', example: "erstelle_kommentar('my-org/backend', 42, 'Bitte Fehlerbehandlung ergänzen.')" },
                { label: 'lese_datei(repo, pfad, branch)', description: 'Liest den Inhalt einer Datei aus dem Repository.', example: "lese_datei('my-org/backend', 'src/auth.py', 'main')" },
              ]} />
              <Diagram
                caption="GitHub-Tool Call: PR automatisch zusammenfassen"
                nodes={[
                  { id: 'in',    type: 'start', emoji: '🔀', label: 'Neuer PR',              sublabel: 'PR #42 wurde geöffnet' },
                  { id: 'read',  type: 'step',  emoji: '📤', label: 'lese_pull_request()',   sublabel: 'Titel, Diff, Dateien' },
                  { id: 'think', type: 'step',  emoji: '🧠', label: 'LLM analysiert',        sublabel: 'Was wurde geändert?' },
                  { id: 'write', type: 'step',  emoji: '📤', label: 'erstelle_kommentar()',  sublabel: 'Zusammenfassung als Kommentar' },
                  { id: 'done',  type: 'end',   emoji: '✅', label: 'PR kommentiert',         sublabel: 'Team sieht die Zusammenfassung' },
                ]}
              />
              <QuizCheck
                blockKey="l5-quiz"
                question="Ein LLM soll einen PR-Review-Kommentar schreiben. Welche Tools braucht es mindestens?"
                options={[
                  "Nur 'erstelle_kommentar()' – es weiß den Inhalt schon.",
                  "Zuerst 'lese_pull_request()' um den PR zu kennen, dann 'erstelle_kommentar()' um zu antworten.",
                  'Kein Tool – es kann direkt auf GitHub zugreifen.',
                ]}
                correct={1}
                hint="Das LLM muss erst den Kontext lesen, bevor es sinnvoll kommentieren kann."
              />
            </>
          ),
        },

        // ── Lektion 6: Kombination ───────────────────────────────────────
        {
          title: 'Mehrere Tools kombinieren',
          requiredKeys: ['l6-quiz'],
          content: (
            <>
              <Callout
                tone="info"
                title="Der echte Nutzen entsteht durch Kombination"
                text="Die Stärke von Tool Calling liegt nicht im Einzelaufruf, sondern in der Kombination: Ein LLM kann mehrere Tools nacheinander aufrufen – und auf Basis der Ergebnisse entscheiden, was als Nächstes zu tun ist."
              />
              <Diagram
                caption="Kombinierter Ablauf: GitHub-PR → Jira-Ticket"
                nodes={[
                  { id: 'pr',    type: 'start', emoji: '🔀', label: 'Neuer PR',                sublabel: 'PR beschreibt einen Bug-Fix' },
                  { id: 'read',  type: 'step',  emoji: '📤', label: 'lese_pull_request()',     sublabel: 'PR-Inhalt laden' },
                  { id: 'think', type: 'step',  emoji: '🧠', label: 'LLM entscheidet',         sublabel: 'Gibt es ein zugehöriges Ticket?' },
                  { id: 'jira',  type: 'step',  emoji: '📤', label: 'suche_tickets()',         sublabel: 'Passendes Jira-Ticket finden' },
                  { id: 'link',  type: 'step',  emoji: '📤', label: 'aktualisiere_ticket()',   sublabel: 'PR-Link im Ticket ergänzen' },
                  { id: 'done',  type: 'end',   emoji: '✅', label: 'Verknüpft',               sublabel: 'PR und Ticket sind verbunden' },
                ]}
              />
              <QuizCheck
                blockKey="l6-quiz"
                question="Was ist der Vorteil, wenn ein LLM mehrere Tools kombinieren kann?"
                options={[
                  'Es wird schneller, weil weniger Token verbraucht werden.',
                  'Es kann komplexe Workflows automatisieren, die mehrere Systeme berühren.',
                  'Es braucht keinen System-Prompt mehr.',
                ]}
                correct={1}
                hint="Einzelne Tool Calls sind gut – kombinierte sind mächtiger."
              />
            </>
          ),
        },

      ]}
    />
  )
}

// ── Kapitel-Definition (Metadaten, Quiz, Nachschlagewerk) ────────────────────
export const chapter: ChapterDef = {
  id: 'tool-calling',
  title: 'Wie kommunizieren LLMs mit der Außenwelt?',
  subTopicTitle: 'Wie kommunizieren LLMs mit der Außenwelt?',
  summary:
    'Warum LLMs Werkzeuge brauchen, wie ein Tool Call Schritt für Schritt abläuft und konkrete Beispiele mit Jira und GitHub.',
  subTopicDescription:
    'Tool Calling: Wie ein LLM Jira-Tickets anlegt, GitHub-PRs liest und externe Systeme steuert.',
  estimatedMinutes: 12,
  lessonCount: 6,
  tag: 'Allgemein',
  Learn: ToolCalling,
  quiz: {
    passThreshold: 0.7,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'Was kann ein LLM ohne Tools NICHT tun?',
        options: ['Text erzeugen.', 'Fragen beantworten.', 'Ein Jira-Ticket anlegen.'],
        correct: 2,
        explanation:
          'Ohne Tools kann ein LLM nur Text erzeugen \u2013 kein Zugriff auf externe Systeme wie Jira.',
        reviewLesson: 'Das Problem: LLMs können nur Text',
      },
      {
        id: 'q2',
        type: 'single',
        question: 'Wer führt die Funktion aus, nachdem das LLM einen Tool Call erzeugt hat?',
        options: ['Das LLM selbst.', 'Das Agent-Framework.', 'Der Nutzer manuell.'],
        correct: 1,
        explanation:
          'Das LLM erzeugt nur den Aufruf. Das Framework führt die Funktion aus und gibt das Ergebnis zurück.',
        reviewLesson: 'Was ist ein Tool Call?',
      },
      {
        id: 'q3',
        type: 'single',
        question: "Ein Nutzer sagt: 'Zeig mir alle offenen Bugs im Projekt ES-212.' Welcher Tool Call passt?",
        options: [
          "erstelle_ticket('ES-212', 'Bug', ...)",
          "suche_tickets(projekt='ES-212', status='Offen', typ='Bug')",
          "aktualisiere_ticket('ES-212', ...)",
        ],
        correct: 1,
        explanation:
          "Der Nutzer möchte Tickets suchen \u2013 'suche_tickets()' mit den passenden Parametern ist der richtige Aufruf.",
        reviewLesson: 'Beispiel: Jira-Integration',
      },
      {
        id: 'q4',
        type: 'single',
        question: 'Ein LLM soll automatisch einen PR-Review-Kommentar schreiben. Welche Reihenfolge ist korrekt?',
        options: [
          'Zuerst kommentieren, dann den PR lesen.',
          'Zuerst den PR lesen, dann kommentieren.',
          'Nur kommentieren \u2013 das LLM kennt den PR bereits.',
        ],
        correct: 1,
        explanation:
          "Das LLM muss zuerst den PR-Inhalt laden ('lese_pull_request'), bevor es sinnvoll kommentieren kann.",
        reviewLesson: 'Beispiel: GitHub-Integration',
      },
      {
        id: 'q5',
        type: 'single',
        question: 'Was beschreibt den größten Vorteil von Tool Calling?',
        options: [
          'Das LLM braucht weniger Tokens.',
          'Es kann mehrere Systeme kombiniert ansprechen und komplexe Workflows automatisieren.',
          'Der System-Prompt wird kleiner.',
        ],
        correct: 1,
        explanation:
          'Die Kombination mehrerer Tools erlaubt es, komplexe Prozesse zu automatisieren, die mehrere Systeme (z. B. GitHub und Jira) berühren.',
        reviewLesson: 'Mehrere Tools kombinieren',
      },
    ],
  },
}
