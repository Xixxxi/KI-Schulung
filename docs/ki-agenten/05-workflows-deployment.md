# Kapitel 5 — Mehrstufige Arbeitsabläufe automatisieren

**ID:** `workflows-deployment` | **Geschätzte Zeit:** 30 min | **9 Lektionen**

---

## Lektion 1 – Worum geht es in diesem Kapitel?

**Infobox:**
> Du kannst jetzt einzelne Agenten bauen. Aber was, wenn eine Aufgabe zu groß für einen einzelnen Agenten ist? In diesem Kapitel lernst du, wie du Aufgaben zerlegst, Agenten verkettest und Workflows robust betreibst.

**Ausblick (4 Punkte):**
1. **Aufgaben zerlegen** — Große Probleme in kleine Schritte aufteilen.
2. **Workflow-Muster** — Pipeline, Router, Orchestrator.
3. **Fehlerbehandlung** — Was tun, wenn ein Schritt fehlschlägt?
4. **Deployment** — Agenten zuverlässig betreiben.

*Keine Abfrage.*

---

## Lektion 2 – Große Aufgabe, kleine Schritte

**Vergleich:**
| Ein großer Aufruf | Mehrere fokussierte Schritte |
|---|---|
| Ergebnis schwer nachvollziehbar | Jeder Schritt: ein klar definiertes Ziel |
| Fehler kaum einzugrenzen | Zwischenergebnis sichtbar und prüfbar |
| Einzelne Teile nicht testbar | Fehler lassen sich lokalisieren |

**Quiz:** Warum ist es besser, eine komplexe Aufgabe in mehrere kleine Schritte zu zerlegen?
- Weil ein einzelner Prompt technisch nicht möglich ist.
- **✅ Weil Modelle bei kleinen, fokussierten Aufgaben zuverlässiger sind und Fehler sich leichter einkreisen lassen.**
- Weil mehrere Schritte immer günstiger sind.
- *Erklärung: Fokus verbessert Qualität. Außerdem macht Zerlegung Zwischenergebnisse sichtbar und jeden Schritt einzeln testbar.*

---

## Lektion 3 – Die drei Workflow-Muster

**3 Karten:**
- ➡️ **Kette (sequenziell)** — Schritte laufen nacheinander. Ausgabe von Schritt 1 ist Eingabe von Schritt 2. Das häufigste Muster.
- 🔀 **Verzweigung (bedingt)** — Ein Zwischenergebnis entscheidet, welcher Pfad als Nächstes läuft – z. B. je nach Ticket-Kategorie.
- ⚡ **Parallel** — Unabhängige Schritte laufen gleichzeitig, Ergebnisse werden danach zusammengeführt. Spart Zeit.

**Quiz:** Jira-Tickets sollen gelesen, kategorisiert und je nach Kategorie unterschiedlich weitergeleitet werden. Welches Muster passt?
- Kette (sequenziell) – es sind mehrere Schritte.
- **✅ Verzweigung – das Ergebnis der Kategorisierung bestimmt den nächsten Schritt.**
- Parallel – alle Tickets gleichzeitig verarbeiten.
- *Erklärung: Ein Zwischenergebnis (Kategorie) entscheidet über den weiteren Weg – das ist das Verzweigungsmuster.*

---

## Lektion 4 – Kette bauen und ausführen

**Text:**
> Drei verkettete Schritte: Fehler aus einem Log extrahieren, zusammenfassen, Handlungsempfehlung ableiten.

**Code (`workflow_kette.py`):**
```python
from dotenv import load_dotenv
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

log = "ERROR: DB max_connections (100) reached\nWARN: RetryHandler failed 3x"

# Kette: Ausgabe fließt als Eingabe in den nächsten Schritt
s1 = schritt("Extrahiere nur ERROR/WARN-Zeilen als Liste.", log)
s2 = schritt("Fasse diese Fehler in 2 Sätzen zusammen.", s1)
s3 = schritt("Leite eine konkrete Handlungsempfehlung ab.", s2)
print(s3)
```

**Quiz:** Wie kommt das Ergebnis von Schritt 1 in Schritt 2?
- Die OpenAI API merkt sich den Verlauf automatisch.
- **✅ Die Ausgabe von Schritt 1 wird als Eingabe-Argument an die Funktion von Schritt 2 übergeben.**
- Über eine globale Variable, die das Modell setzt.
- *Erklärung: Die API ist zustandslos. Die Kette entsteht rein im Code: s1 wird als Eingabe an den zweiten Schritt übergeben.*

**Terminal-Simulation:** `python workflow_kette.py` → Ausgabe: Handlungsempfehlung für DB-Fehler

---

## Lektion 5 – Fester Workflow oder autonomer Agent?

**Vergleich:**
| Fester Workflow (empfohlen zum Start) | Autonomer Agent |
|---|---|
| Du bestimmst die Schrittfolge | Das Modell wählt Schritte selbst |
| Vorhersehbar, testbar, kostenkontrolliert | Flexibel, aber schwerer zu begrenzen |
| Ideal für bekannte, wiederkehrende Abläufe | Nur wenn der Weg wirklich unbekannt ist |

**Quiz:** Jira-Tickets sollen gelesen, in 5 Kategorien sortiert und dem passenden Team zugewiesen werden. Der Ablauf ist immer gleich. Was passt besser?
- Autonomer Agent – er ist flexibler.
- **✅ Fester Workflow – der Ablauf ist bekannt, also vorhersehbar und günstiger.**
- Beides ist gleichwertig.
- *Erklärung: Wenn die Schritte im Voraus feststehen, ist ein fester Workflow zuverlässiger, günstiger und leichter zu kontrollieren.*

---

## Lektion 6 – Single vs. Multi-Agent Architekturen

**Vergleich:**
| Single Agent | Multi-Agent |
|---|---|
| Ein LLM mit einem Toolset | Mehrere spezialisierte Agenten |
| Einfach zu bauen und zu debuggen | Parallelisierung spart Zeit |
| Gut wenn Aufgabe ins Kontext-Fenster passt | Skaliert über Kontext-Fenster-Grenzen hinaus |
| Start-Empfehlung für neue Anwendungsfälle | Komplexer – erst wenn Single Agent nicht reicht |

**Callout (Tip):**
> Starte immer mit einem Single Agent. Wechsle zu Multi-Agent, wenn (1) die Aufgabe zu groß für ein Kontext-Fenster wird, (2) Parallelisierung Zeit spart oder (3) Spezialisierung die Qualität deutlich verbessert.

**Quiz:** Du willst monatlich Berichte für 12 Projekte erstellen. Welche Architektur passt?
- Single Agent – er arbeitet alle 12 Projekte nacheinander ab.
- **✅ Multi-Agent – 12 Sub-Agents laufen parallel, ein Orchestrator fasst zusammen.**
- Kein Agent nötig – das ist ein klassischer Skript-Fall.
- *Erklärung: 12 parallele Sub-Agents sparen Zeit und halten den Kontext jedes Agenten überschaubar.*

---

## Lektion 7 – Hierarchical Architecture & Agent Communication

**Diagramm:** Trigger (Gesamtaufgabe) → Orchestrator (zerlegt und delegiert) → Sub-Agent A (Teilaufgabe 1) + Sub-Agent B (Teilaufgabe 2) → Ergebnis (aggregiert)

**Hinweis:** Sub-Agents kommunizieren in der Regel über den Orchestrator – nicht direkt miteinander.

**Quiz:** Wer koordiniert die Sub-Agents in einer hierarchischen Architektur?
- Sub-Agents koordinieren sich selbst direkt.
- **✅ Der Orchestrator zerlegt, delegiert und aggregiert die Ergebnisse.**
- Der Nutzer koordiniert jeden Sub-Agent manuell.
- *Erklärung: Der Orchestrator ist der zentrale Koordinator: er zerlegt, delegiert, wartet auf Ergebnisse und aggregiert sie.*

---

## Lektion 8 – Deployment – Chatbot oder Pipeline?

**Vergleich:**
| Interactive Chatbot Frontend | Automation Pipeline |
|---|---|
| Nutzer initiiert jede Aufgabe manuell | Trigger startet den Agenten automatisch |
| Interaktiv – Rückfragen möglich | Kein Mensch im Loop nötig |
| Läuft auf Anfrage | Läuft nach Zeitplan oder Ereignis |
| Beispiel: PR-Zusammenfassung auf Knopfdruck | Beispiel: Jede Nacht Bugs triagieren |

**Quiz:** Jede Nacht sollen neue Jira-Bugs automatisch kategorisiert werden. Welches Muster passt?
- Chatbot Frontend – ein Mitarbeiter startet manuell.
- **✅ Automation Pipeline – ein Cron-Job startet den Agenten automatisch.**
- Multi-Agent ohne Orchestrator.
- *Erklärung: Zeitgesteuert und ohne Nutzerinteraktion bedeutet Automation Pipeline mit Cron-Trigger.*

---

## Lektion 9 – Automation Pipeline – Aufbau und Monitoring

**Die vier Stationen einer Automation Pipeline:**
1. **Trigger** — Cron-Job, Webhook, Message Queue oder manueller API-Call starten den Agenten. *Beispiel: GitHub Webhook: neuer PR geöffnet, Agent startet.*
2. **Agent-Ausführung** — Der Agent läuft autonom durch seinen Loop – liest, analysiert, handelt. *Beispiel: Agent liest PR-Diff, analysiert Code, postet Review-Kommentare.*
3. **Output / Notification** — Ergebnis persistieren oder weiterleiten: Datenbank, E-Mail, Ticket, nächste Pipeline. *Beispiel: Zusammenfassung in Confluence + Slack-Nachricht ans Team.*
4. **Monitoring und Fehlerbehandlung** — Pipelines laufen unbeaufsichtigt – Logging, Alerting und Retry-Logik sind Pflicht. *Beispiel: Bei Fehler: Slack-Alert, Error-Log-Eintrag, automatischer Retry nach 5 Min.*

**Quiz:** Was ist bei unbeaufsichtigten Automation Pipelines besonders wichtig?
- Eine schönere UI.
- **✅ Robustes Monitoring, Logging, Alerting und Fehlerbehandlung.**
- Mehr Tools zur Verfügung stellen.
- *Erklärung: In einer Automation Pipeline gibt es niemanden, der sofort eingreift. Monitoring und Fehlerbehandlung sind deshalb kritisch.*

---

*Letzte Aktualisierung: Juli 2026*
