/**
 * Kapitel 3 – Was ist ein Agent und wie arbeitet er?
 * Agent vs. Skript, vier Bausteine, Reason-Act-Observe-Loop.
 */
import ChapterFrame from '../shared/ChapterFrame'
import {
  Callout, Steps, Text, Diagram, Cards,
  Comparison, QuizCheck,
} from '../shared/Blocks'
import type { ChapterDef } from '../../content/types'

interface Props {
  onStartTest: () => void
  onOpenReference: () => void
}

export default function WasIstAgent({ onStartTest, onOpenReference }: Props) {
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
                text="Du weißt jetzt, wie ein LLM arbeitet und wie es über Tools mit der Außenwelt kommuniziert. Jetzt geht es einen Schritt weiter: Was passiert, wenn ein LLM eigenständig entscheidet, WELCHES Tool es aufruft, in welcher Reihenfolge und wann es fertig ist?"
              />
              <Steps title="Was dich erwartet" items={[
                { label: 'Was ist ein KI-Agent?', description: 'Die entscheidende Eigenschaft: autonome Entscheidungen.' },
                { label: 'Agent vs. Skript vs. Chatbot', description: 'Der entscheidende Unterschied.' },
                { label: 'Die vier Bausteine', description: 'Woraus jeder Agent besteht.' },
                { label: 'Der Agent Loop', description: 'Wie ein Agent Schritt für Schritt arbeitet.' },
                { label: 'Wann lohnt sich ein Agent?', description: 'Nicht jede Aufgabe braucht einen.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 2: Definition ────────────────────────────────────────
        {
          title: 'Was ist ein KI-Agent?',
          requiredKeys: ['l2-quiz'],
          content: (
            <>
              <Callout
                tone="info"
                title="Die einfache Definition"
                text="Ein KI-Agent ist ein Programm, das ein LLM nutzt, um ein Ziel über mehrere Schritte selbstständig zu verfolgen. Es entscheidet bei jedem Schritt selbst, was als Nächstes zu tun ist."
              />
              <Diagram
                caption="Agent = LLM + eigenständige Entscheidungen + Tools"
                nodes={[
                  { id: 'task',   type: 'start', emoji: '🎯', label: 'Aufgabe',       sublabel: 'Nutzer gibt Ziel vor' },
                  { id: 'decide', type: 'step',  emoji: '🧠', label: 'Agent denkt',   sublabel: 'Was muss ich als Nächstes tun?' },
                  { id: 'act',    type: 'step',  emoji: '⚡', label: 'Agent handelt', sublabel: 'Tool Call oder Antwort' },
                  { id: 'done',   type: 'end',   emoji: '✅', label: 'Ziel erreicht', sublabel: 'Ergebnis zurück zum Nutzer' },
                ]}
              />
              <QuizCheck
                blockKey="l2-quiz"
                question="Was macht einen KI-Agenten besonders gegenüber einem einfachen LLM mit Tool Calling?"
                options={[
                  'Er ist immer schneller.',
                  'Er entscheidet eigenständig, welche Tools er aufruft und wann er fertig ist.',
                  'Er benötigt keine Tools.',
                ]}
                correct={1}
                hint="Wer entscheidet den nächsten Schritt – und das Ziel?"
              />
            </>
          ),
        },

        // ── Lektion 3: Agent vs. Skript ──────────────────────────────────
        {
          title: 'Agent vs. Chatbot vs. Skript',
          requiredKeys: ['l3-quiz'],
          content: (
            <>
              <Text text="Nicht jede KI-Anwendung ist ein Agent. Die Unterschiede in Flexibilität und Autonomie sind entscheidend für die Wahl des richtigen Werkzeugs." />
              <Comparison
                left={{
                  label: 'Skript / Chatbot',
                  color: '#6b7280',
                  items: [
                    'Fester Ablauf – vorab programmiert',
                    'Ein Input, ein Output',
                    'Scheitert bei unerwarteten Situationen',
                    'Einfach zu debuggen und zu testen',
                  ],
                }}
                right={{
                  label: 'KI-Agent',
                  color: '#1c69d4',
                  items: [
                    'Entscheidet den nächsten Schritt selbst',
                    'Mehrere Tool Calls nacheinander möglich',
                    'Reagiert flexibel auf Ergebnisse',
                    'Schwerer vorhersehbar – braucht Leitplanken',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l3-quiz"
                question="Was macht einen KI-Agenten anders als ein klassisches Skript?"
                options={[
                  'Er ist immer schneller.',
                  'Er entscheidet zur Laufzeit selbst, was als Nächstes passiert.',
                  'Skripte können keine APIs aufrufen.',
                ]}
                correct={1}
                hint="Wer entscheidet den nächsten Schritt?"
              />
            </>
          ),
        },

        // ── Lektion 4: Vier Bausteine ────────────────────────────────────
        {
          title: 'Die vier Bausteine eines Agenten',
          content: (
            <>
              <Text text="Jeder KI-Agent besteht aus denselben vier Grundelementen – egal ob er Jira-Tickets anlegt, Code reviewed oder Support-Anfragen bearbeitet." />
              <Cards items={[
                { icon: '🧠', label: 'Modell (LLM)',     color: '#1c69d4', description: 'Das Gehirn – plant, entscheidet und erzeugt Tool Calls.' },
                { icon: '📋', label: 'Instruktionen',    color: '#6d28d9', description: 'Der System-Prompt – legt Rolle, Ziel und Grenzen fest.' },
                { icon: '🔧', label: 'Werkzeuge (Tools)', color: '#0369a1', description: 'Die Hände – Verbindung zur Außenwelt (Jira, GitHub, APIs).' },
                { icon: '💾', label: 'Speicher (Memory)', color: '#166534', description: 'Das Kurzzeitgedächtnis – Kontext, Verlauf und Tool-Ergebnisse.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 5: Zusammenspiel der Bausteine ───────────────────────
        {
          title: 'Zusammenspiel der Bausteine',
          requiredKeys: ['l4-quiz'],
          content: (
            <>
              <Diagram
                caption="Zusammenspiel der vier Bausteine"
                nodes={[
                  { id: 'inst',  type: 'start', emoji: '📋', label: 'Instruktionen',   sublabel: 'Was soll der Agent tun?' },
                  { id: 'mem',   type: 'step',  emoji: '💾', label: 'Speicher',         sublabel: 'Was weiß er schon?' },
                  { id: 'llm',   type: 'step',  emoji: '🧠', label: 'LLM entscheidet', sublabel: 'Welches Tool als Nächstes?' },
                  { id: 'tools', type: 'end',   emoji: '🔧', label: 'Tools',            sublabel: 'Jira, GitHub, APIs...' },
                ]}
                loop={{ label: 'Ergebnis fließt zurück in den Speicher' }}
              />
              <QuizCheck
                blockKey="l4-quiz"
                question="Ein Agent hat Modell, Instruktionen und Speicher – aber keine Tools. Was fehlt?"
                options={[
                  'Nichts – er funktioniert vollständig.',
                  'Die Verbindung zur Außenwelt – er kann nur Text erzeugen, nicht handeln.',
                  'Der System-Prompt.',
                ]}
                correct={1}
                hint="Tools sind die Hände des Agenten."
              />
            </>
          ),
        },

        // ── Lektion 6: Agent Loop ────────────────────────────────────────
        {
          title: 'Der Agent Loop: Reason – Act – Observe',
          content: (
            <>
              <Text text="Ein Agent arbeitet nicht einmalig – er durchläuft einen Zyklus, bis das Ziel erreicht ist. Dieser Kernzyklus heißt Reason-Act-Observe." />
              <Diagram
                caption="Reason – Act – Observe: der Kernzyklus"
                nodes={[
                  { id: 'goal',    type: 'start', emoji: '🎯', label: 'Aufgabe',  sublabel: 'Ziel kommt rein' },
                  { id: 'reason',  type: 'step',  emoji: '🤔', label: 'Reason',   sublabel: 'Nächsten Schritt planen' },
                  { id: 'act',     type: 'step',  emoji: '⚡', label: 'Act',      sublabel: 'Tool aufrufen' },
                  { id: 'observe', type: 'step',  emoji: '👁', label: 'Observe',  sublabel: 'Ergebnis analysieren' },
                  { id: 'done',    type: 'end',   emoji: '✅', label: 'Fertig',   sublabel: 'Ziel erreicht' },
                ]}
                loop={{ label: 'Ziel noch nicht erreicht – erneut Reason' }}
              />
            </>
          ),
        },

        // ── Lektion 7: Was in jedem Schritt passiert ─────────────────────
        {
          title: 'Was in jedem Schritt passiert',
          requiredKeys: ['l5-quiz'],
          content: (
            <>
              <Steps title="Was passiert in jedem Schritt?" items={[
                { label: 'Reason – Planen', description: 'Das LLM überlegt: Was weiß ich bisher? Was ist der beste nächste Schritt?' },
                { label: 'Act – Handeln', description: "Der Agent ruft ein Tool auf – z. B. 'suche_jira_tickets()' oder 'lese_pull_request()'." },
                { label: 'Observe – Beobachten', description: 'Das Ergebnis des Tool Calls kommt zurück und wird in den Kontext aufgenommen.' },
              ]} />
              <QuizCheck
                blockKey="l5-quiz"
                question="In welcher Reihenfolge arbeitet ein Agent?"
                options={[
                  'Act – Reason – Observe',
                  'Observe – Act – Reason',
                  'Reason – Act – Observe',
                ]}
                correct={2}
                hint="Erst denken, dann handeln, dann schauen."
              />
            </>
          ),
        },

        // ── Lektion 8: Wann lohnt sich ein Agent? ───────────────────────
        {
          title: 'Wann lohnt sich ein Agent?',
          requiredKeys: ['l6-quiz'],
          content: (
            <>
              <Text text="Ein KI-Agent ist mächtiger als ein einfaches Skript – aber auch komplexer, schwerer zu debuggen und teurer im Betrieb. Nicht jede Aufgabe rechtfertigt einen Agenten." />
              <Comparison
                left={{
                  label: 'Gut für Agenten',
                  color: '#1c69d4',
                  items: [
                    'Unstrukturierte Texte verstehen und klassifizieren',
                    'Mehrere Schritte mit Entscheidungen dazwischen',
                    'Viele Sonderfälle und Ausnahmen',
                    'Systeme kombinieren (z. B. GitHub + Jira)',
                  ],
                }}
                right={{
                  label: 'Besser klassisch lösen',
                  color: '#6b7280',
                  items: [
                    'Feste Regeln ohne Interpretation',
                    'Exakte Berechnungen (Buchhaltung, Maths)',
                    'Hohe Frequenz mit minimalen Kosten',
                    'Sicherheitskritische Kernprozesse',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l6-quiz"
                question="Welche Aufgabe passt gut zu einem KI-Agenten?"
                options={[
                  'Einen Betrag von EUR in USD umrechnen.',
                  'Support-Tickets lesen und dem richtigen Team zuweisen.',
                  'Jeden Tag um 8 Uhr einen Datenbankexport starten.',
                ]}
                correct={1}
                hint="Braucht die Aufgabe Sprachverständnis und Urteilsvermögen?"
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
  id: 'ki-agenten',
  title: 'Was ist ein Agent und wie arbeitet er?',
  subTopicTitle: 'Was ist ein Agent und wie arbeitet er?',
  summary:
    'Agent vs. Skript, die vier Bausteine, der Reason-Act-Observe-Loop und wann sich ein Agent wirklich lohnt.',
  subTopicDescription:
    'Agent vs. Skript, die vier Bausteine, der Reason-Act-Observe-Loop und wann sich ein Agent lohnt.',
  estimatedMinutes: 12,
  lessonCount: 8,
  tag: 'Allgemein',
  Learn: WasIstAgent,
  quiz: {
    passThreshold: 0.7,
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'Was unterscheidet einen KI-Agenten von einem Skript?',
        options: [
          'Agenten sind immer schneller.',
          'Ein Agent entscheidet eigenständig den nächsten Schritt.',
          'Skripte können keine APIs aufrufen.',
        ],
        correct: 1,
        explanation: 'Der Kern: autonome Entscheidung bei jedem Schritt.',
        reviewLesson: 'Agent vs. Chatbot vs. Skript',
      },
      {
        id: 'q2',
        type: 'multi',
        question: 'Welche vier Elemente bilden einen KI-Agenten? (Mehrfachauswahl)',
        options: [
          'Modell (LLM)',
          'Instruktionen (System-Prompt)',
          'Grafikkarte',
          'Werkzeuge (Tools)',
          'Speicher (Memory)',
        ],
        correct: [0, 1, 3, 4],
        explanation: 'Modell, Instruktionen, Werkzeuge und Speicher \u2013 das sind die vier Bausteine.',
        reviewLesson: 'Die vier Bausteine eines Agenten',
      },
      {
        id: 'q3',
        type: 'single',
        question: 'In welcher Reihenfolge arbeitet der Agent Loop?',
        options: ['Act \u2013 Reason \u2013 Observe', 'Observe \u2013 Act \u2013 Reason', 'Reason \u2013 Act \u2013 Observe'],
        correct: 2,
        explanation: 'Reason, Act, Observe \u2013 wiederholen bis das Ziel erreicht ist.',
        reviewLesson: 'Der Agent Loop: Reason \u2013 Act \u2013 Observe',
      },
      {
        id: 'q4',
        type: 'single',
        question: 'Welche Aufgabe eignet sich am besten für einen KI-Agenten?',
        options: [
          'Commits nach Zeitstempel sortieren.',
          'Support-Tickets kategorisieren und priorisieren.',
          'Jeden Tag um 8 Uhr einen Datenbankexport starten.',
        ],
        correct: 1,
        explanation:
          'Kategorisierung erfordert Sprachverständnis und Urteilsvermögen \u2013 ideal für einen Agenten.',
        reviewLesson: 'Wann lohnt sich ein Agent?',
      },
    ],
  },
}
