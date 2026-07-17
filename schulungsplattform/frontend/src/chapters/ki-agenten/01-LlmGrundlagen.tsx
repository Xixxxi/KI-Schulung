/**
 * Kapitel 1 – Was LLMs sind und wie sie arbeiten
 *
 * Jede Lektion ist ein ReactNode. Nutze die Blöcke aus shared/Blocks.tsx
 * oder schreibe beliebiges JSX direkt hier.
 */
import ChapterFrame from '../shared/ChapterFrame'
import {
  Callout, Steps, Text, Diagram, Cards,
  Comparison, QuizCheck,
} from '../shared/Blocks'

interface Props {
  onStartTest: () => void
  onOpenReference: () => void
}

export default function LlmGrundlagen({ onStartTest, onOpenReference }: Props) {
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
                title="Willkommen"
                text="Bevor wir Agenten bauen, müssen wir verstehen, womit wir bauen. Dieses Kapitel legt das Fundament: Was ist ein LLM, wie 'denkt' es und warum ist alles für ein LLM einfach nur Text?"
              />
              <Steps title="Was dich erwartet" items={[
                { label: 'Wie LLMs arbeiten', description: 'Text rein, Text raus – das Grundprinzip.' },
                { label: 'Alles ist Text', description: 'Warum PDFs, Code und APIs alle gleich aussehen.' },
                { label: 'Tokens und Kontext', description: 'Die Maßeinheit des LLM und sein "Arbeitsgedächtnis".' },
                { label: 'Vorhersagen statt Verstehen', description: 'Was ein LLM wirklich macht, wenn es antwortet.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 2: Grundprinzip ──────────────────────────────────────
        {
          title: 'Wie LLMs arbeiten',
          requiredKeys: ['l2-quiz'],
          content: (
            <>
              <Text text="Im Kern sind Large Language Models (LLMs) hochentwickelte Text-Vorhersage-Systeme. Sie empfangen eine Eingabe und erzeugen eine Ausgabe – basierend auf Mustern, die sie beim Training gelernt haben." />
              <Diagram
                caption="Das Grundprinzip eines LLM"
                nodes={[
                  { id: 'in',  type: 'start', emoji: '📝', label: 'Text / Bild',  sublabel: 'Eingabe: Frage, Code, Daten' },
                  { id: 'llm', type: 'step',  emoji: '🧠', label: 'LLM',          sublabel: 'z. B. langchain-bmw' },
                  { id: 'out', type: 'end',   emoji: '💬', label: 'Text / Bild',  sublabel: 'Ausgabe: Antwort, Code, JSON' },
                ]}
              />
              <Steps title="Was der Ablauf bedeutet" items={[
                { label: 'Eingabe', description: 'Du gibst Text (einen Prompt) oder Bilder an das LLM.' },
                { label: 'Verarbeitung', description: 'Das LLM analysiert die Eingabe mit seinem trainierten neuronalen Netz (z. B. über langchain-bmw).' },
                { label: 'Ausgabe', description: 'Das Modell erzeugt eine Antwort – entweder Text oder Bilder.' },
              ]} />
              <QuizCheck
                blockKey="l2-quiz"
                question="Was macht ein LLM im Kern?"
                options={[
                  'Es speichert Daten in einer Datenbank.',
                  'Es empfängt Text und erzeugt Text.',
                  'Es führt Programme direkt aus.',
                ]}
                correct={1}
                hint="Schau auf das Diagramm: Was geht rein, was kommt raus?"
              />
            </>
          ),
        },

        // ── Lektion 3: Alles ist Text ────────────────────────────────────
        {
          title: 'Alles ist Text (oder unterstützte Modalitäten)',
          requiredKeys: ['l3-quiz'],
          content: (
            <>
              <Callout
                tone="tip"
                title="Wichtig"
                text="LLMs verstehen nur Text – oder bei multimodalen Modellen die spezifischen Formate, die sie unterstützen (z. B. Bilder). Das bedeutet: Alle Daten, die ein LLM verarbeiten soll, müssen zuerst in Text umgewandelt werden."
              />
              <Cards items={[
                { icon: '📄', label: 'PDFs, Word-Dokumente', description: '→ extrahierter Text' },
                { icon: '🗄️', label: 'Datenbanken', description: '→ als Text serialisiert (JSON, CSV, …)' },
                { icon: '🔌', label: 'API-Antworten', description: '→ in Textformat konvertiert' },
                { icon: '💻', label: 'Code', description: '→ ist bereits Text ✓' },
              ]} />
              <QuizCheck
                blockKey="l3-quiz"
                question="Wie sieht ein LLM eine JSON-Datei aus einer API-Antwort?"
                options={[
                  'Als strukturierte Daten mit speziellem Parser.',
                  'Als ganz normalen Text – wie einen Satz.',
                  'LLMs können kein JSON verarbeiten.',
                ]}
                correct={1}
                hint="Für ein LLM ist alles einfach nur Text."
              />
            </>
          ),
        },

        // ── Lektion 4: Tokens ────────────────────────────────────────────
        {
          title: 'Tokens – die Bausteine',
          requiredKeys: ['l4-quiz'],
          content: (
            <>
              <Callout
                tone="info"
                title="Was ist ein Token?"
                text="Ein LLM liest Text nicht buchstabenweise, sondern in Stücken – sogenannten Tokens. Ein Token ist oft ein Wort oder Wortteil. Beispiel: 'Automatisierung' wird zu 'Auto' + 'mat' + 'isierung' (3 Tokens). Modellgrenzen und API-Kosten werden in Tokens gemessen."
              />
              <Comparison
                left={{ label: 'Kurze Wörter', items: ["'Hallo' = 1 Token", "'und' = 1 Token", "'KI' = 1 Token"] }}
                right={{ label: 'Lange Wörter', items: ["'Automatisierung' = 3 Tokens", "'Entwicklung' = 2 Tokens", "'Schulungsplattform' = 4 Tokens"] }}
              />
              <QuizCheck
                blockKey="l4-quiz"
                question="Warum sind Tokens wichtig?"
                options={[
                  'Sie bestimmen die Kosten und das Limit einer LLM-Anfrage.',
                  'Sie sind nur ein technisches Detail ohne praktische Bedeutung.',
                  'Tokens sind dasselbe wie Buchstaben.',
                ]}
                correct={0}
                hint="LLMs haben ein begrenztes Fenster – gemessen in Tokens."
              />
            </>
          ),
        },

        // ── Lektion 5: Kontext-Fenster ───────────────────────────────────
        {
          title: 'Das Kontext-Fenster',
          requiredKeys: ['l5-quiz'],
          content: (
            <>
              <Text text="Das Kontext-Fenster ist das 'Arbeitsgedächtnis' des LLM. Alles, was das Modell bei einer Anfrage sieht, steht darin – nicht mehr, nicht weniger. Zwischen zwei Anfragen erinnert sich das LLM an nichts." />
              <Diagram
                caption="Was das LLM bei jeder Anfrage sieht"
                nodes={[
                  { id: 'sys',  type: 'start', emoji: '📋', label: 'System-Prompt', sublabel: 'Deine Anweisungen' },
                  { id: 'hist', type: 'step',  emoji: '💬', label: 'Verlauf',        sublabel: 'Bisherige Nachrichten' },
                  { id: 'new',  type: 'step',  emoji: '✏️', label: 'Neue Frage',     sublabel: 'Aktuelle Eingabe' },
                  { id: 'out',  type: 'end',   emoji: '🧠', label: 'LLM antwortet',  sublabel: 'Basierend auf allem oben' },
                ]}
              />
              <QuizCheck
                blockKey="l5-quiz"
                question="Erinnert sich ein LLM automatisch an frühere Gespräche?"
                options={[
                  'Ja, es hat ein permanentes Gedächtnis.',
                  'Nein – alles muss im Kontext-Fenster stehen, sonst ist es vergessen.',
                  'Nur die letzten 5 Nachrichten.',
                ]}
                correct={1}
                hint="Ein LLM ist zustandslos – es sieht nur, was gerade im Fenster steht."
              />
            </>
          ),
        },

        // ── Lektion 6: Vorhersagen statt Verstehen ───────────────────────
        {
          title: 'Vorhersagen statt Verstehen',
          requiredKeys: ['l6-quiz'],
          content: (
            <>
              <Callout
                tone="warn"
                title="Eine wichtige Erkenntnis"
                text="LLMs 'verstehen' nicht im menschlichen Sinn – sie sagen das wahrscheinlichste nächste Token voraus, basierend auf dem Kontext. Die Qualität deiner Eingabe bestimmt direkt die Qualität der Ausgabe."
              />
              <Comparison
                left={{
                  label: 'Was es aussieht wie',
                  color: '#6b7280',
                  items: [
                    'Das LLM versteht die Frage',
                    'Es denkt nach und weiß die Antwort',
                    'Es hat echte Erfahrung',
                  ],
                }}
                right={{
                  label: 'Was wirklich passiert',
                  color: '#1c69d4',
                  items: [
                    'Es berechnet die wahrscheinlichste Wortfolge',
                    'Es interpoliert aus Trainingsmustern',
                    'Es hat keine eigene Meinung oder Erfahrung',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l6-quiz"
                question="Was tut ein LLM tatsächlich, wenn es antwortet?"
                options={[
                  'Es schlägt im Internet nach und gibt die Antwort zurück.',
                  'Es sagt das wahrscheinlichste nächste Token basierend auf dem Kontext voraus.',
                  'Es denkt wie ein Mensch und formuliert eine Meinung.',
                ]}
                correct={1}
                hint="LLMs sind Vorhersage-Systeme, keine denkenden Entitäten."
              />
            </>
          ),
        },

      ]}
    />
  )
}
