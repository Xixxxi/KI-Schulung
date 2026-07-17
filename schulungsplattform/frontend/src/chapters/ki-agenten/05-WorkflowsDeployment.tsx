/**
 * Kapitel 5 – Mehrstufige Arbeitsabläufe automatisieren
 * Aufgaben zerlegen, Workflow-Muster, Architekturen, Deployment.
 */
import ChapterFrame from '../shared/ChapterFrame'
import {
  Callout, Steps, Text, Code,
  Comparison, Cards, Diagram, QuizCheck,
  Simulation, LabLayout,
} from '../shared/Blocks'

interface Props {
  onStartTest: () => void
  onOpenReference: () => void
}

export default function WorkflowsDeployment({ onStartTest, onOpenReference }: Props) {
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
                text="Du kannst jetzt einzelne Agenten bauen. Aber was, wenn eine Aufgabe zu groß für einen einzelnen Agenten ist? In diesem Kapitel lernst du, wie du Aufgaben zerlegst, Agenten verkettest und Workflows robust betreibst."
              />
              <Steps title="Was dich erwartet" items={[
                { label: 'Aufgaben zerlegen', description: 'Große Probleme in kleine Schritte aufteilen.' },
                { label: 'Workflow-Muster', description: 'Pipeline, Router, Orchestrator.' },
                { label: 'Fehlerbehandlung', description: 'Was tun wenn ein Schritt fehlschlägt?' },
                { label: 'Deployment', description: 'Agenten zuverlässig betreiben.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 2: Aufgaben zerlegen ────────────────────────────────
        {
          title: 'Große Aufgabe, kleine Schritte',
          requiredKeys: ['l1-quiz'],
          content: (
            <>
              <Comparison
                left={{
                  label: 'Ein großer Aufruf',
                  color: '#6b7280',
                  items: [
                    'Ergebnis schwer nachvollziehbar',
                    'Fehler kaum einzugrenzen',
                    'Einzelne Teile nicht testbar',
                  ],
                }}
                right={{
                  label: 'Mehrere fokussierte Schritte',
                  color: '#1c69d4',
                  items: [
                    'Jeder Schritt: ein klar definiertes Ziel',
                    'Zwischenergebnis sichtbar und prüfbar',
                    'Fehler lassen sich lokalisieren',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l1-quiz"
                title="Kurzer Check"
                question="Warum ist es besser, eine komplexe Aufgabe in mehrere kleine Schritte zu zerlegen?"
                options={[
                  'Weil ein einzelner Prompt technisch nicht möglich ist.',
                  'Weil Modelle bei kleinen, fokussierten Aufgaben zuverlässiger sind und Fehler sich leichter einkreisen lassen.',
                  'Weil mehrere Schritte immer günstiger sind.',
                ]}
                correct={1}
                explanation="Fokus verbessert Qualität. Außerdem macht Zerlegung Zwischenergebnisse sichtbar und jeden Schritt einzeln testbar."
                hint="Was ändert sich am Modell, wenn die Aufgabe kleiner wird?"
              />
            </>
          ),
        },

        // ── Lektion 3: Workflow-Muster ───────────────────────────────────
        {
          title: 'Die drei Workflow-Muster',
          requiredKeys: ['l2-quiz'],
          content: (
            <>
              <Cards items={[
                { icon: '➡️', label: 'Kette (sequenziell)', color: '#1c69d4', description: 'Schritte laufen nacheinander. Ausgabe von Schritt 1 ist Eingabe von Schritt 2. Das häufigste Muster.' },
                { icon: '🔀', label: 'Verzweigung (bedingt)', color: '#6d28d9', description: 'Ein Zwischenergebnis entscheidet, welcher Pfad als Nächstes läuft – z. B. je nach Ticket-Kategorie.' },
                { icon: '⚡', label: 'Parallel', color: '#0369a1', description: 'Unabhängige Schritte laufen gleichzeitig, Ergebnisse werden danach zusammengeführt. Spart Zeit.' },
              ]} />
              <QuizCheck
                blockKey="l2-quiz"
                title="Kurzer Check"
                question="Jira-Tickets sollen gelesen, kategorisiert und je nach Kategorie unterschiedlich weitergeleitet werden. Welches Muster passt?"
                options={[
                  'Kette (sequenziell) – es sind mehrere Schritte.',
                  'Verzweigung – das Ergebnis der Kategorisierung bestimmt den nächsten Schritt.',
                  'Parallel – alle Tickets gleichzeitig verarbeiten.',
                ]}
                correct={1}
                explanation="Ein Zwischenergebnis (Kategorie) entscheidet über den weiteren Weg – das ist das Verzweigungsmuster."
                hint="Was passiert, wenn das Kategorie-Ergebnis 'Bug' lautet vs. 'Feature Request'?"
              />
            </>
          ),
        },

        // ── Lektion 4: Kette bauen (Lab) ─────────────────────────────────
        {
          title: 'Kette bauen und ausführen',
          layout: 'wide',
          requiredKeys: ['l3-quiz', 'l3-sim'],
          content: (
            <LabLayout
              left={
                <>
                  <Text text="Drei verkettete Schritte: Fehler aus einem Log extrahieren, zusammenfassen, Handlungsempfehlung ableiten." />
                  <Code
                    caption="workflow_kette.py – drei Schritte, ein Durchlauf"
                    language="python"
                    text={`from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

def schritt(system, eingabe):
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": system},
                  {"role": "user",   "content": eingabe}],
        temperature=0
    )
    return r.choices[0].message.content

log = "ERROR: DB max_connections (100) reached\\nWARN: RetryHandler failed 3x"

# Kette: Ausgabe fliesst als Eingabe in den naechsten Schritt
s1 = schritt("Extrahiere nur ERROR/WARN-Zeilen als Liste.", log)
s2 = schritt("Fasse diese Fehler in 2 Saetzen zusammen.", s1)
s3 = schritt("Leite eine konkrete Handlungsempfehlung ab.", s2)
print(s3)`}
                  />
                  <QuizCheck
                    blockKey="l3-quiz"
                    title="Verstanden?"
                    question="Wie kommt das Ergebnis von Schritt 1 in Schritt 2?"
                    options={[
                      'Die OpenAI API merkt sich den Verlauf automatisch.',
                      'Die Ausgabe von Schritt 1 wird als Eingabe-Argument an die Funktion von Schritt 2 übergeben.',
                      'Über eine globale Variable, die das Modell setzt.',
                    ]}
                    correct={1}
                    explanation="Die API ist zustandslos. Die Kette entsteht rein im Code: s1 wird als Eingabe an den zweiten Schritt übergeben."
                    hint="Sieh dir die letzten drei Zeilen des Skripts an."
                  />
                </>
              }
              right={
                <Simulation
                  blockKey="l3-sim"
                  title="VS Code – Terminal"
                  prompt="(.venv) PS C:\\agent-werkstatt>"
                  intro="workflow_kette.py ist gespeichert. Starte den dreistufigen Workflow."
                  doneText="Drei Schritte, ein Ergebnis: Log, Zusammenfassung, Empfehlung. Das ist eine sequenzielle Kette."
                  steps={[
                    {
                      instruction: 'Workflow starten:',
                      expected: 'python workflow_kette.py',
                      response: 'Priorisiert: max_connections erhoehen (z. B. auf 200) und Connection-Pool-Monitoring einrichten, um kuenftige Auslastungen fruehzeitig zu erkennen.',
                      error: 'Starte mit: python workflow_kette.py',
                    },
                  ]}
                />
              }
            />
          ),
        },

        // ── Lektion 5: Fester Workflow vs. Agent ─────────────────────────
        {
          title: 'Fester Workflow oder autonomer Agent?',
          requiredKeys: ['l4-quiz'],
          content: (
            <>
              <Comparison
                left={{
                  label: 'Fester Workflow (empfohlen zum Start)',
                  color: '#166534',
                  items: [
                    'Du bestimmst die Schrittfolge',
                    'Vorhersehbar, testbar, kostenkontrolliert',
                    'Ideal für bekannte, wiederkehrende Abläufe',
                  ],
                }}
                right={{
                  label: 'Autonomer Agent',
                  color: '#6d28d9',
                  items: [
                    'Das Modell wählt Schritte selbst',
                    'Flexibel, aber schwerer zu begrenzen',
                    'Nur wenn der Weg wirklich unbekannt ist',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l4-quiz"
                title="Szenario"
                question="Jira-Tickets sollen gelesen, in 5 Kategorien sortiert und dem passenden Team zugewiesen werden. Der Ablauf ist immer gleich. Was passt besser?"
                options={[
                  'Autonomer Agent – er ist flexibler.',
                  'Fester Workflow – der Ablauf ist bekannt, also vorhersehbar und günstiger.',
                  'Beides ist gleichwertig.',
                ]}
                correct={1}
                explanation="Wenn die Schritte im Voraus feststehen, ist ein fester Workflow zuverlässiger, günstiger und leichter zu kontrollieren."
                hint="Ist der Weg zum Ziel hier vorhersehbar?"
              />
            </>
          ),
        },

        // ── Lektion 6: Single vs. Multi-Agent ───────────────────────────
        {
          title: 'Single vs. Multi-Agent Architekturen',
          requiredKeys: ['l5-quiz'],
          content: (
            <>
              <Comparison
                left={{
                  label: 'Single Agent',
                  color: '#1c69d4',
                  items: [
                    'Ein LLM mit einem Toolset',
                    'Einfach zu bauen und zu debuggen',
                    'Gut wenn Aufgabe ins Kontext-Fenster passt',
                    'Start-Empfehlung für neue Anwendungsfälle',
                  ],
                }}
                right={{
                  label: 'Multi-Agent',
                  color: '#6d28d9',
                  items: [
                    'Mehrere spezialisierte Agenten',
                    'Parallelisierung spart Zeit',
                    'Skaliert über Kontext-Fenster-Grenzen hinaus',
                    'Komplexer – erst wenn Single Agent nicht reicht',
                  ],
                }}
              />
              <Callout
                tone="tip"
                title="Faustformel"
                text="Starte immer mit einem Single Agent. Wechsle zu Multi-Agent, wenn (1) die Aufgabe zu groß für ein Kontext-Fenster wird, (2) Parallelisierung Zeit spart oder (3) Spezialisierung die Qualität deutlich verbessert."
              />
              <QuizCheck
                blockKey="l5-quiz"
                title="Kurzer Check"
                question="Du willst monatlich Berichte für 12 Projekte erstellen. Welche Architektur passt?"
                options={[
                  'Single Agent – er arbeitet alle 12 Projekte nacheinander ab.',
                  'Multi-Agent – 12 Sub-Agents laufen parallel, ein Orchestrator fasst zusammen.',
                  'Kein Agent nötig – das ist ein klassischer Skript-Fall.',
                ]}
                correct={1}
                explanation="12 parallele Sub-Agents sparen Zeit und halten den Kontext jedes Agenten überschaubar. Der Orchestrator koordiniert und aggregiert."
                hint="Parallelisierbarkeit spricht für Multi-Agent."
              />
            </>
          ),
        },

        // ── Lektion 7: Hierarchische Architektur ─────────────────────────
        {
          title: 'Hierarchical Architecture & Agent Communication',
          requiredKeys: ['l6-quiz'],
          content: (
            <>
              <Diagram
                caption="Hierarchical Multi-Agent Architecture"
                nodes={[
                  { id: 'user',   type: 'start', emoji: '👤', label: 'Trigger',      sublabel: 'Gesamtaufgabe' },
                  { id: 'orch',   type: 'step',  emoji: '🎯', label: 'Orchestrator', sublabel: 'Zerlegt und delegiert' },
                  { id: 'sub1',   type: 'step',  emoji: '🤖', label: 'Sub-Agent A',  sublabel: 'Teilaufgabe 1' },
                  { id: 'sub2',   type: 'step',  emoji: '🤖', label: 'Sub-Agent B',  sublabel: 'Teilaufgabe 2' },
                  { id: 'result', type: 'end',   emoji: '✅', label: 'Ergebnis',      sublabel: 'Aggregiert und ausgegeben' },
                ]}
                note="Sub-Agents kommunizieren in der Regel über den Orchestrator – nicht direkt miteinander."
              />
              <QuizCheck
                blockKey="l6-quiz"
                title="Kurzer Check"
                question="Wer koordiniert die Sub-Agents in einer hierarchischen Architektur?"
                options={[
                  'Sub-Agents koordinieren sich selbst direkt.',
                  'Der Orchestrator zerlegt, delegiert und aggregiert die Ergebnisse.',
                  'Der Nutzer koordiniert jeden Sub-Agent manuell.',
                ]}
                correct={1}
                explanation="Der Orchestrator ist der zentrale Koordinator: er zerlegt, delegiert, wartet auf Ergebnisse und aggregiert sie."
                hint="Es gibt eine zentrale koordinierende Instanz."
              />
            </>
          ),
        },

        // ── Lektion 8: Deployment ────────────────────────────────────────
        {
          title: 'Deployment – Chatbot oder Pipeline?',
          requiredKeys: ['l7-quiz'],
          content: (
            <>
              <Comparison
                left={{
                  label: 'Interactive Chatbot Frontend',
                  color: '#1c69d4',
                  items: [
                    'Nutzer initiiert jede Aufgabe manuell',
                    'Interaktiv – Rückfragen möglich',
                    'Läuft auf Anfrage',
                    'Beispiel: PR-Zusammenfassung auf Knopfdruck',
                  ],
                }}
                right={{
                  label: 'Automation Pipeline',
                  color: '#6d28d9',
                  items: [
                    'Trigger startet den Agenten automatisch',
                    'Kein Mensch im Loop nötig',
                    'Läuft nach Zeitplan oder Ereignis',
                    'Beispiel: Jede Nacht Bugs triagieren',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l7-quiz"
                title="Kurzer Check"
                question="Jede Nacht sollen neue Jira-Bugs automatisch kategorisiert werden. Welches Muster passt?"
                options={[
                  'Chatbot Frontend – ein Mitarbeiter startet manuell.',
                  'Automation Pipeline – ein Cron-Job startet den Agenten automatisch.',
                  'Multi-Agent ohne Orchestrator.',
                ]}
                correct={1}
                explanation="Zeitgesteuert und ohne Nutzerinteraktion bedeutet Automation Pipeline mit Cron-Trigger."
                hint="Gibt es einen Zeitplan und keine manuelle Interaktion?"
              />
            </>
          ),
        },

        // ── Lektion 9: Pipeline-Aufbau ───────────────────────────────────
        {
          title: 'Automation Pipeline – Aufbau und Monitoring',
          requiredKeys: ['l8-quiz'],
          content: (
            <>
              <Steps title="Die vier Stationen einer Automation Pipeline" items={[
                { label: 'Trigger', description: 'Cron-Job, Webhook, Message Queue oder manueller API-Call starten den Agenten.', example: 'GitHub Webhook: neuer PR geöffnet, Agent startet.' },
                { label: 'Agent-Ausführung', description: 'Der Agent läuft autonom durch seinen Loop – liest, analysiert, handelt.', example: 'Agent liest PR-Diff, analysiert Code, postet Review-Kommentare.' },
                { label: 'Output / Notification', description: 'Ergebnis persistieren oder weiterleiten: Datenbank, E-Mail, Ticket, nächste Pipeline.', example: 'Zusammenfassung in Confluence + Slack-Nachricht ans Team.' },
                { label: 'Monitoring und Fehlerbehandlung', description: 'Pipelines laufen unbeaufsichtigt – Logging, Alerting und Retry-Logik sind Pflicht.', example: 'Bei Fehler: Slack-Alert, Error-Log-Eintrag, automatischer Retry nach 5 Min.' },
              ]} />
              <QuizCheck
                blockKey="l8-quiz"
                title="Kurzer Check"
                question="Was ist bei unbeaufsichtigten Automation Pipelines besonders wichtig?"
                options={[
                  'Eine schönere UI.',
                  'Robustes Monitoring, Logging, Alerting und Fehlerbehandlung.',
                  'Mehr Tools zur Verfügung stellen.',
                ]}
                correct={1}
                explanation="In einer Automation Pipeline gibt es niemanden, der sofort eingreift. Monitoring und Fehlerbehandlung sind deshalb kritisch."
                hint="Was fehlt, wenn kein Mensch zuschaut?"
              />
            </>
          ),
        },

      ]}
    />
  )
}
