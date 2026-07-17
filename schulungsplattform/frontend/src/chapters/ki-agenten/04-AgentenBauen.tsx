/**
 * Kapitel 4 – Eigene spezialisierte Agenten erstellen
 * System-Prompt, Setup, Code, Context Engineering, Autonomie.
 */
import ChapterFrame from '../shared/ChapterFrame'
import {
  Callout, Steps, Text, Code,
  Comparison, Cards, QuizCheck, TaskInput,
  Simulation, LabLayout,
} from '../shared/Blocks'

interface Props {
  onStartTest: () => void
  onOpenReference: () => void
}

export default function AgentenBauen({ onStartTest, onOpenReference }: Props) {
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
                text="Du weißt jetzt, was ein KI-Agent ist und wie der Agent Loop funktioniert. In diesem Kapitel lernst du, wie du einen eigenen spezialisierten Agenten baust - vom System-Prompt bis zum lauffähigen Code."
              />
              <Steps title="Was dich erwartet" items={[
                { label: 'Spezialisierung', description: 'Warum fokussierte Agenten besser sind als Allzweck-Agenten.' },
                { label: 'System-Prompt', description: 'Wie du deinem Agenten Rolle und Regeln gibst.' },
                { label: 'Setup und Code', description: 'Einen Agent im Terminal zum Laufen bringen.' },
                { label: 'Context Engineering', description: 'Wie du steuerst, was der Agent sieht.' },
              ]} />
            </>
          ),
        },

        // ── Lektion 2: Spezialisierung ───────────────────────────────────
        {
          title: 'Spezialisierung statt Allzweck',
          requiredKeys: ['l1-quiz'],
          content: (
            <>
              <Comparison
                left={{
                  label: 'Allzweck-Assistent',
                  color: '#6b7280',
                  items: [
                    'Deckt viele Themen oberflächlich ab',
                    'Verhalten schwer vorhersehbar',
                    'Ausgabeformat variiert stark',
                  ],
                }}
                right={{
                  label: 'Spezialisierter Agent',
                  color: '#1c69d4',
                  items: [
                    'Genau eine klar umrissene Aufgabe',
                    'Vorhersehbares, konsistentes Ergebnis',
                    'Festes Ausgabeformat – testbar',
                  ],
                }}
              />
              <QuizCheck
                blockKey="l1-quiz"
                title="Kurzer Check"
                question="Warum ist ein spezialisierter Agent für eine konkrete Aufgabe oft besser als ein Allzweck-Assistent?"
                options={[
                  'Er verwendet ein größeres Modell.',
                  'Sein Verhalten ist vorhersehbar, testbar und leichter zu kontrollieren.',
                  'Er braucht keinen System-Prompt.',
                ]}
                correct={1}
                explanation="Ein enger Fokus macht den Agenten konsistent und einfach abzusichern – genau das, was Produktionsumgebungen brauchen."
                hint="Denk daran, was 'spezialisiert' bedeutet."
              />
            </>
          ),
        },

        // ── Lektion 3: System-Prompt ─────────────────────────────────────
        {
          title: 'Der System-Prompt als Stellenbeschreibung',
          requiredKeys: ['l2-task'],
          content: (
            <>
              <Steps title="Die vier Pflichtteile jedes System-Prompts" items={[
                { label: 'Persona – Wer ist der Agent?', description: 'Eine klare Fachrolle erzeugt konsistenteres Verhalten.', example: 'Du bist ein erfahrener Release-Manager.' },
                { label: 'Aufgabe – Was soll er tun?', description: "Konkretes Verb, kein vages 'hilf mir'.", example: 'Du wandelst Code-Änderungen in Conventional-Commits-Nachrichten um.' },
                { label: 'Grenzen – Was soll er NIE tun?', description: 'Explizite Verbote sind wirksamer als implizite Erwartungen.', example: 'Erfinde keine Änderungen. Frag nach, wenn unklar.' },
                { label: 'Format – Wie sieht die Ausgabe aus?', description: 'Länge, Sprache, Struktur – das Modell hält sich sehr zuverlässig daran.', example: 'Nur die Commit-Nachricht, kein Kommentar. Erste Zeile max. 72 Zeichen.' },
              ]} />
              <TaskInput
                blockKey="l2-task"
                title="Selbst schreiben"
                prompt="Schreib die ersten beiden Sätze eines System-Prompts für einen Agenten, der GitHub-Pull-Requests in drei Stichpunkten zusammenfasst. Beginne mit der Persona."
                placeholder="Du bist ein technischer Reviewer. Deine Aufgabe ist es, PR-Beschreibungen in genau drei prägnanten Stichpunkten zusammenzufassen …"
                minLength={40}
                keywords={['du bist']}
                minKeywords={1}
                success="Stark! 'Du bist …' gibt dem Agenten eine klare Persona – das Fundament jedes spezialisierten Agenten."
                hint="Beginne mit 'Du bist …' und beschreibe dann die konkrete Aufgabe."
              />
            </>
          ),
        },

        // ── Lektion 4: Setup (Lab) ───────────────────────────────────────
        {
          title: 'Setup in VS Code',
          layout: 'wide',
          requiredKeys: ['l3-sim'],
          content: (
            <LabLayout
              left={
                <>
                  <Text text="Das Setup dauert drei Minuten. Richte es einmal ein – es gilt für alle Kapitel." />
                  <Steps title="Drei Befehle im VS Code Terminal" items={[
                    { label: 'Virtuelle Umgebung anlegen', description: 'Isoliert Pakete vom System-Python.', example: 'python -m venv .venv' },
                    { label: 'Umgebung aktivieren', description: '(.venv) zeigt an, dass sie aktiv ist.', example: '.venv\\Scripts\\activate' },
                    { label: 'Pakete installieren', description: 'OpenAI SDK + dotenv für sicheres Key-Loading.', example: 'pip install openai python-dotenv' },
                  ]} />
                  <Callout
                    tone="tip"
                    title=".env-Datei nicht vergessen"
                    text="Erstelle im Projektordner eine Datei .env mit OPENAI_API_KEY=sk-... und füge .env zur .gitignore hinzu. Keys gehören nie in den Code."
                  />
                </>
              }
              right={
                <Simulation
                  blockKey="l3-sim"
                  title="VS Code – Terminal"
                  prompt="PS C:\\agent-werkstatt>"
                  intro="Führe die drei Setup-Befehle der Reihe nach aus."
                  doneText="Umgebung bereit – genau so sieht das Setup im echten VS Code Terminal aus."
                  steps={[
                    { instruction: 'Virtuelle Umgebung anlegen:', expected: 'python -m venv .venv', response: 'Die Umgebung .venv wurde erstellt.', error: 'Tippe den Befehl zum Erstellen der venv.' },
                    { instruction: 'Umgebung aktivieren:', expected: '.venv\\Scripts\\activate', response: '(.venv) PS C:\\agent-werkstatt>   <- aktiv', error: 'Aktiviere mit .venv\\Scripts\\activate' },
                    { instruction: 'Pakete installieren:', expected: 'pip install openai python-dotenv', response: 'Successfully installed openai python-dotenv', error: 'pip install <paket1> <paket2>' },
                  ]}
                />
              }
            />
          ),
        },

        // ── Lektion 5: Code ausführen (Lab) ─────────────────────────────
        {
          title: 'Commit-Agenten ausführen',
          layout: 'wide',
          requiredKeys: ['l4-quiz', 'l4-sim'],
          content: (
            <LabLayout
              left={
                <>
                  <Text text="Der Agent bekommt eine Änderungsbeschreibung und gibt eine saubere Conventional-Commits-Nachricht zurück – nichts mehr, nichts weniger." />
                  <Code
                    caption="commit_agent.py – der vollständige Agent"
                    language="python"
                    text={`from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

SYSTEM_PROMPT = """
Du bist ein Release-Manager.
Aufgabe: Beschreibung -> Conventional-Commits-Nachricht.
Format: <typ>(<bereich>): <kurzbeschreibung>  (max. 72 Zeichen)
Erlaubte Typen: feat, fix, refactor, docs, test, chore
Nur die Nachricht - kein Kommentar, keine Erklaerung.
"""

beschreibung = (
    "Login-Formular zeigt bei leerem Passwort "
    "keine Fehlermeldung. Validierung ergaenzt, Test geschrieben."
)

r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": beschreibung}
    ],
    temperature=0
)
print(r.choices[0].message.content)`}
                  />
                  <QuizCheck
                    blockKey="l4-quiz"
                    title="Verstanden?"
                    question="Warum wird temperature=0 verwendet?"
                    options={[
                      'Es beschleunigt den API-Call.',
                      'Gleiche Eingabe liefert möglichst gleiche Ausgabe – ideal für feste Formate.',
                      'Das Modell liest sonst keinen System-Prompt.',
                    ]}
                    correct={1}
                    explanation="temperature=0 macht das Modell so deterministisch wie möglich – für ein festes Format wie Conventional Commits genau richtig."
                    hint="Was bedeutet 'deterministisch'?"
                  />
                </>
              }
              right={
                <Simulation
                  blockKey="l4-sim"
                  title="VS Code – Terminal"
                  prompt="(.venv) PS C:\\agent-werkstatt>"
                  intro="commit_agent.py ist gespeichert. Führ ihn aus und sieh die Ausgabe."
                  doneText="Eine saubere Conventional-Commits-Nachricht – direkt aus dem System-Prompt."
                  steps={[
                    {
                      instruction: 'Agenten starten:',
                      expected: 'python commit_agent.py',
                      response: 'fix(login): Fehlermeldung bei leerem Passwort ergaenzen\n\n- Eingabevalidierung fuer leeres Passwortfeld ergaenzt\n- Passenden Unit-Test hinzugefuegt',
                      error: 'Starte mit: python commit_agent.py',
                    },
                  ]}
                />
              }
            />
          ),
        },

        // ── Lektion 6: Ausgaben absichern ────────────────────────────────
        {
          title: 'Ausgaben absichern',
          requiredKeys: ['l5-quiz'],
          content: (
            <>
              <Steps title="Drei Leitplanken für produktionsreife Agenten" items={[
                { label: 'Eingabe prüfen', description: 'Leere oder unsinnige Eingaben fangen, bevor sie unnötige Kosten verursachen.', example: "if not beschreibung.strip(): raise ValueError('Leer')" },
                { label: 'Ausgabe validieren', description: 'Prüfen, ob das Format stimmt – nicht blind vertrauen.', example: "if not commit.split('(')[0] in TYPEN: ...neu anfordern" },
                { label: 'System-Prompt versionieren', description: 'In eigener Datei speichern und in Git committen – Änderungen müssen nachvollziehbar sein.', example: "prompt = Path('prompts/commit.txt').read_text()" },
              ]} />
              <QuizCheck
                blockKey="l5-quiz"
                title="Kurzer Check"
                question="Der Agent liefert eine Commit-Nachricht im falschen Format. Was ist die richtige Reaktion?"
                options={[
                  'Die fehlerhafte Ausgabe direkt verwenden.',
                  'Ausgabe validieren und bei Abweichung erneut anfordern oder den Nutzer benachrichtigen.',
                  'Den API-Key wechseln.',
                ]}
                correct={1}
                explanation="Auch ein gut instruierter Agent kann vom Format abweichen. Validierung vor der Weiterverwendung ist Pflicht."
                hint="Was bedeutet 'Leitplanke'?"
              />
            </>
          ),
        },

        // ── Lektion 7: Context Engineering ──────────────────────────────
        {
          title: 'Context Engineering',
          requiredKeys: ['l6-quiz'],
          content: (
            <>
              <Callout
                tone="info"
                title="Was ist Context Engineering?"
                text="Context Engineering bezeichnet alle Techniken, mit denen du steuerst, welche Informationen wann im Kontext-Fenster des LLM landen: System-Prompt-Design, Verlaufsmanagement, Tool-Output-Formatierung und RAG."
              />
              <Cards items={[
                { icon: '📋', label: 'System Prompt',   color: '#1c69d4', description: 'Rolle, Ziel, Grenzen und verfügbare Tools. Der wichtigste Hebel – klar und spezifisch formulieren.' },
                { icon: '🗂️', label: 'Verlauf kürzen',  color: '#6d28d9', description: 'Bei langen Sessions den Kontext zusammenfassen – sonst steigen Kosten und Qualität sinkt.' },
                { icon: '🔍', label: 'RAG (Retrieval)',  color: '#0369a1', description: 'Relevante Dokumente werden zur Laufzeit nachgeladen – statt alles vorab in den System-Prompt zu schreiben.' },
                { icon: '📤', label: 'Tool Output kürzen', color: '#166534', description: 'Nur relevante Felder zurückgeben. Kompakte Tool-Antworten verbessern das Reasoning.' },
              ]} />
              <QuizCheck
                blockKey="l6-quiz"
                title="Kurzer Check"
                question="Ein Tool gibt 200 JSON-Felder zurück – nur 5 sind relevant. Was ist die beste Strategie?"
                options={[
                  'Alle 200 Felder in den Kontext schreiben – das LLM findet die relevanten selbst.',
                  'Die Tool-Wrapper-Funktion filtert und gibt nur die 5 relevanten Felder zurück.',
                  'Den Kontext nach jedem Schritt komplett leeren.',
                ]}
                correct={1}
                explanation="Kompakter Kontext bedeutet besseres Reasoning und niedrigere Kosten. Die Tool-Funktion sollte filtern, bevor das Ergebnis in den Kontext kommt."
                hint="Weniger ist mehr."
              />
            </>
          ),
        },

        // ── Lektion 8: Autonomie ─────────────────────────────────────────
        {
          title: 'Wie viel Autonomie ist sinnvoll?',
          requiredKeys: ['l7-quiz'],
          content: (
            <>
              <Steps title="Vier Stufen – von Vorschlag bis vollständig autonom" items={[
                { label: 'Stufe 1 – Vorschlag', description: 'Agent schlägt vor, Mensch entscheidet und handelt.', example: 'Agent formuliert Release Notes, du gibst frei.' },
                { label: 'Stufe 2 – Freigabe', description: 'Agent bereitet alles vor, führt erst nach OK aus.', example: 'Agent erstellt Jira-Ticket, du klickst Speichern.' },
                { label: 'Stufe 3 – Leitplanken', description: 'Agent handelt frei, aber nur innerhalb fester Grenzen.', example: 'Darf Test-Tickets anlegen, keine Produktionsänderungen.' },
                { label: 'Stufe 4 – Autonom', description: 'Vollständig eigenständig – nur für risikoarme, klar begrenzte Aufgaben.', example: 'Eingehende PRs automatisch nach Dateipfad labeln.' },
              ]} />
              <QuizCheck
                blockKey="l7-quiz"
                title="Szenario"
                question="Ein Agent soll selbstständig veraltete Branches im produktiven Repo löschen. Welche Stufe ist angemessen?"
                options={[
                  'Stufe 4 – autonom, das spart Zeit.',
                  'Stufe 1 oder 2 – Vorschlag oder Freigabe, weil das kaum umkehrbar ist.',
                  'Stufe 3 genügt – er löscht ja nur Branches.',
                ]}
                correct={1}
                explanation="Je schwerer eine Aktion umkehrbar ist, desto mehr Kontrolle gehört dazu. Stufe 1 oder 2 ist der richtige Startpunkt."
                hint="Wie leicht lässt sich ein gelöschter produktiver Branch wiederherstellen?"
              />
            </>
          ),
        },

      ]}
    />
  )
}
