// ── Nachschlagewerk (Glossar) ──────────────────────────────────────────────
//
// Eigene Quelle für die Nachschlage-Einträge – bewusst getrennt von den
// Kapitel-Lektionen. Die Einträge bleiben ihren Kapiteln zugeordnet, indem
// sie unter der jeweiligen Kapitel-ID (chapterId) gruppiert sind.
//
// Neues Kapitel dokumentieren: einen Block mit der passenden chapterId
// ergänzen. Die Reihenfolge/Gruppierung in der UI ergibt sich aus der
// Themen-Definition in registry.ts.

import type { ReferenceEntry } from './types'

export const REFERENCE: Record<string, ReferenceEntry[]> = {
  // ── Kapitel: Wie LLMs funktionieren ──────────────────────────────────────
  'llm-grundlagen': [
    {
      term: 'LLM (Large Language Model)',
      definition:
        'Ein Sprachmodell, das Text (oder Bilder) empfängt und Text erzeugt. Intern wird alles als Tokens dargestellt.',
    },
    {
      term: 'Token',
      definition:
        'Die kleinste Verarbeitungseinheit eines LLM \u2013 oft ein Wort oder Wortteil. Modellgrenzen und Kosten werden in Tokens gemessen.',
    },
    {
      term: 'Kontext-Fenster',
      definition:
        'Alles, was das LLM bei einer Anfrage sieht: System-Prompt, Verlauf und Tool-Ergebnisse. Zwischen Anfragen ist alles vergessen.',
    },
    {
      term: 'System-Prompt',
      definition:
        'Die erste Nachricht im Kontext-Fenster \u2013 legt Rolle, Verhalten und Grenzen des LLM fest.',
    },
    {
      term: 'Multimodal',
      definition:
        'LLMs, die nicht nur Text, sondern auch Bilder (oder andere Medien) als Eingabe verarbeiten können.',
    },
    {
      term: 'Token-Vorhersage',
      definition:
        'Das Kernprinzip eines LLM: Es berechnet das wahrscheinlichste nächste Token auf Basis des aktuellen Kontexts \u2013 kein echtes Verstehen.',
    },
  ],

  // ── Kapitel: Tool Calling ────────────────────────────────────────────────
  'tool-calling': [
    {
      term: 'Tool / Werkzeug',
      definition:
        'Eine Funktion, die dem LLM zur Verfügung steht, um die Außenwelt zu erreichen \u2013 APIs, Datenbanken, Dateisystem.',
    },
    {
      term: 'Tool Call',
      definition:
        'Ein strukturierter Aufruf (JSON mit Funktionsname + Argumente), den das LLM erzeugt. Das Framework führt die Funktion dann aus und gibt das Ergebnis zurück.',
    },
    {
      term: 'Framework',
      definition:
        'Das Programm, das den Tool Call des LLM entgegennimmt, die Funktion ausführt und das Ergebnis an das LLM zurückgibt (z. B. LangChain, OpenAI Agents SDK).',
    },
    {
      term: 'Jira-Integration',
      definition:
        'Tool-Funktionen, die das LLM nutzen kann, um Tickets zu suchen, anzulegen oder zu aktualisieren \u2013 über die Jira-REST-API.',
    },
    {
      term: 'GitHub-Integration',
      definition:
        'Tool-Funktionen für Pull Requests lesen, Kommentare erstellen und Dateien aus Repositories laden \u2013 über die GitHub-REST-API.',
    },
    {
      term: 'Tool-Kombination',
      definition:
        'Das Aufrufen mehrerer Tools nacheinander \u2013 die Stärke von Tool Calling liegt in der Verknüpfung mehrerer Systeme in einem Workflow.',
    },
  ],

  // ── Kapitel: Was KI-Agenten sind ─────────────────────────────────────────
  'was-ist-agent': [
    {
      term: 'KI-Agent',
      definition:
        'Ein Programm, das ein LLM nutzt, um ein Ziel über mehrere Schritte selbstständig zu verfolgen \u2013 eigenständige Entscheidungen bei jedem Schritt.',
    },
    {
      term: 'Agent Loop',
      definition:
        'Reason (planen), Act (handeln), Observe (Ergebnis analysieren) \u2013 wiederholen, bis das Ziel erreicht ist.',
    },
    {
      term: 'Reason',
      definition:
        'Erster Schritt im Agent Loop: Das LLM plant den nächsten Schritt basierend auf dem aktuellen Kontext.',
    },
    {
      term: 'Act',
      definition:
        'Zweiter Schritt im Agent Loop: Der Agent führt einen Tool Call aus \u2013 z. B. Jira-Ticket suchen oder GitHub-PR lesen.',
    },
    {
      term: 'Observe',
      definition:
        'Dritter Schritt im Agent Loop: Das Ergebnis des Tool Calls wird in den Kontext aufgenommen und ausgewertet.',
    },
    {
      term: 'Modell (LLM)',
      definition: 'Das Gehirn des Agenten: plant, entscheidet und erzeugt Tool Calls.',
    },
    {
      term: 'Instruktionen',
      definition: 'Der System-Prompt \u2013 legt Rolle, Ziel und Grenzen des Agenten fest.',
    },
    {
      term: 'Werkzeuge (Tools)',
      definition: 'Funktionen für den Zugriff auf die Außenwelt (Jira, GitHub, APIs, Datenbanken).',
    },
    {
      term: 'Speicher (Memory)',
      definition:
        'Gesprächsverlauf und Tool-Ergebnisse im Kontext-Fenster \u2013 das Kurzzeitgedächtnis des Agenten.',
    },
  ],

  // ── Kapitel: Eigene spezialisierte Agenten erstellen ─────────────────────
  'agenten-bauen': [
    {
      term: 'Spezialisierter Agent',
      definition:
        'Ein Agent mit genau einer klar umrissenen Aufgabe. Sein Verhalten ist vorhersehbar, konsistent und leichter zu testen als das eines Allzweck-Assistenten.',
    },
    {
      term: 'System-Prompt',
      definition:
        'Die Stellenbeschreibung des Agenten: definiert Persona, Aufgabe, Grenzen und Ausgabeformat, bevor die erste Aufgabe hereinkommt.',
    },
    {
      term: 'Persona',
      definition:
        'Die im System-Prompt definierte Fachrolle des Agenten. Eine präzise Rolle erzeugt konsistenteres Verhalten.',
    },
    {
      term: 'temperature',
      definition:
        'API-Parameter (0 bis 2): 0 = deterministisch (gleiche Eingabe ergibt gleiche Ausgabe), >1 = kreativ. Für feste Ausgabeformate niedrig halten.',
    },
    {
      term: '.env-Datei',
      definition:
        'Lokale Datei für API-Keys. Wird per python-dotenv geladen und via .gitignore aus Git ausgeschlossen.',
    },
    {
      term: 'Ausgabevalidierung',
      definition:
        'Prüfung, ob die Agentenantwort dem erwarteten Format entspricht, bevor sie weiterverwendet wird.',
    },
    {
      term: 'Context Engineering',
      definition:
        'Alle Techniken zur optimalen Gestaltung des Kontext-Fensters: System-Prompt-Design, Verlaufsmanagement, Tool-Output-Filterung und RAG.',
    },
    {
      term: 'RAG (Retrieval Augmented Generation)',
      definition:
        'Technik, bei der relevante Dokumente zur Laufzeit in den Kontext eingefügt werden \u2013 statt alles vorab in den System-Prompt zu schreiben.',
    },
    {
      term: 'Autonomiegrad',
      definition:
        'Das Maß an Selbstständigkeit \u2013 von Stufe 1 (Vorschlag) bis Stufe 4 (vollständig autonom). Je schwerer eine Aktion umkehrbar ist, desto niedriger die empfohlene Stufe.',
    },
    {
      term: 'Conventional Commits',
      definition:
        'Standard für Commit-Nachrichten: <typ>(<bereich>): <kurzbeschreibung>. Typen: feat, fix, refactor, docs, test, chore.',
    },
  ],

  // ── Kapitel: Mehrstufige Arbeitsabläufe automatisieren ───────────────────
  'workflows-deployment': [
    {
      term: 'Mehrstufiger Workflow',
      definition:
        'Eine Kette mehrerer Agenten-Aufrufe, bei der jeder Schritt ein klar definiertes Ziel hat und sein Ergebnis an den nächsten weiterreicht.',
    },
    {
      term: 'Sequenzielle Kette',
      definition:
        'Schritte laufen nacheinander, die Ausgabe jedes Schritts ist die Eingabe des nächsten. Das häufigste Workflow-Muster.',
    },
    {
      term: 'Verzweigung',
      definition:
        'Ein Zwischenergebnis entscheidet, welcher Schritt als Nächstes ausgeführt wird \u2013 z. B. je nach erkannter Ticket-Kategorie.',
    },
    {
      term: 'Parallele Ausführung',
      definition:
        'Unabhängige Schritte laufen gleichzeitig und werden danach zusammengeführt. Reduziert Latenz bei voneinander unabhängigen Teilaufgaben.',
    },
    {
      term: 'Zustandslosigkeit der API',
      definition:
        'Jeder OpenAI-API-Aufruf ist unabhängig. Das Modell merkt sich nichts zwischen Aufrufen. Zwischenergebnisse müssen explizit weitergegeben werden.',
    },
    {
      term: 'Fester Workflow vs. autonomer Agent',
      definition:
        'Sind die Schritte bekannt: fester Workflow (vorhersehbar, günstig, kontrollierbar). Ist der Weg unbekannt: autonomer Agent (flexibel, aber schwerer zu begrenzen).',
    },
    {
      term: 'Single Agent',
      definition:
        'Ein einzelnes LLM mit einem Toolset. Einfach zu bauen, gut für Aufgaben die in ein Kontext-Fenster passen.',
    },
    {
      term: 'Multi-Agent System',
      definition:
        'Mehrere Agenten arbeiten zusammen \u2013 parallel oder hierarchisch. Sinnvoll wenn Aufgaben zu groß, zu parallelisierbar oder zu spezialisiert sind.',
    },
    {
      term: 'Orchestrator',
      definition:
        'Der übergeordnete Agent in einer hierarchischen Multi-Agent-Architektur \u2013 zerlegt, delegiert und aggregiert.',
    },
    {
      term: 'Interactive Chatbot Frontend',
      definition:
        'Deployment-Muster: Nutzer kommunizieren direkt mit dem Agenten über ein Chat-Interface. Für on-demand, interaktive Aufgaben.',
    },
    {
      term: 'Automation Pipeline',
      definition:
        'Deployment-Muster: ein Trigger (Cron, Webhook, Queue) startet den Agenten vollautomatisch \u2013 ohne Nutzerinteraktion.',
    },
    {
      term: 'Kostenskalierung',
      definition:
        'Jeder Schritt eines Workflows ist ein eigener API-Aufruf. Ein 5-stufiger Workflow kostet ca. fünfmal so viel wie ein einzelner Aufruf.',
    },
  ],
}

/** Nachschlage-Einträge eines Kapitels (leer, wenn keine vorhanden). */
export function getReferenceEntries(chapterId: string): ReferenceEntry[] {
  return REFERENCE[chapterId] ?? []
}
