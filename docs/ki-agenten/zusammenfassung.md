# Kapitel- und Lektionsübersicht – KI-Schulung

> Alle Texte so wie sie aktuell im Code stehen. Pro Lektion: Titel, vermittelter Inhalt (Fließtext/Callouts/Cards/Steps) und Abfrage.

---

## Kapitel 1 — LLM-Grundlagen
**ID:** `llm-grundlagen` | **Geschätzte Zeit:** 10 min | **6 Lektionen**

### Lektion 1 – Worum geht es in diesem Kapitel?
**Infobox:**
> Bevor wir Agenten bauen, müssen wir verstehen, womit wir bauen. Dieses Kapitel legt das Fundament: Was ist ein LLM, wie „denkt" es und warum ist alles für ein LLM einfach nur Text?

**Ausblick (4 Punkte):**
1. **Wie LLMs arbeiten** — Text rein, Text raus – das Grundprinzip.
2. **Alles ist Text** — Warum PDFs, Code und APIs alle gleich aussehen.
3. **Tokens und Kontext** — Die Maßeinheit des LLM und sein „Arbeitsgedächtnis".
4. **Vorhersagen statt Verstehen** — Was ein LLM wirklich macht, wenn es antwortet.

*Keine Abfrage.*

---

### Lektion 2 – Wie LLMs arbeiten
**Text:**
> Im Kern sind Large Language Models (LLMs) hochentwickelte Text-Vorhersage-Systeme. Sie empfangen eine Eingabe und erzeugen eine Ausgabe – basierend auf Mustern, die sie beim Training gelernt haben.

**Diagramm:** Text/Bild → LLM (z. B. langchain-bmw) → Text/Bild

**Schritte:**
1. **Eingabe** — Du gibst Text (einen Prompt) oder Bilder an das LLM.
2. **Verarbeitung** — Das LLM analysiert die Eingabe mit seinem trainierten neuronalen Netz (z. B. über langchain-bmw).
3. **Ausgabe** — Das Modell erzeugt eine Antwort – entweder Text oder Bilder.

**Quiz:** Was macht ein LLM im Kern?
- Es speichert Daten in einer Datenbank.
- **✅ Es empfängt Text und erzeugt Text.**
- Es führt Programme direkt aus.
- *Hinweis: Schau auf das Diagramm: Was geht rein, was kommt raus?*

---

### Lektion 3 – Alles ist Text (oder unterstützte Modalitäten)
**Callout (Tip):**
> LLMs verstehen nur Text – oder bei multimodalen Modellen die spezifischen Formate, die sie unterstützen (z. B. Bilder). Das bedeutet: Alle Daten, die ein LLM verarbeiten soll, müssen zuerst in Text umgewandelt werden.

**4 Karten:**
- 📄 PDFs, Word-Dokumente → extrahierter Text
- 🗄️ Datenbanken → als Text serialisiert (JSON, CSV, …)
- 🔌 API-Antworten → in Textformat konvertiert
- 💻 Code → ist bereits Text ✓

**Quiz:** Wie sieht ein LLM eine JSON-Datei aus einer API-Antwort?
- Als strukturierte Daten mit speziellem Parser.
- **✅ Als ganz normalen Text – wie einen Satz.**
- LLMs können kein JSON verarbeiten.
- *Hinweis: Für ein LLM ist alles einfach nur Text.*

---

### Lektion 4 – Tokens – die Bausteine
**Callout (Info):**
> Ein LLM liest Text nicht buchstabenweise, sondern in Stücken – sogenannten Tokens. Ein Token ist oft ein Wort oder Wortteil. Beispiel: „Automatisierung" wird zu „Auto" + „mat" + „isierung" (3 Tokens). Modellgrenzen und API-Kosten werden in Tokens gemessen.

**Vergleich:**
| Kurze Wörter | Lange Wörter |
|---|---|
| „Hallo" = 1 Token | „Automatisierung" = 3 Tokens |
| „und" = 1 Token | „Entwicklung" = 2 Tokens |
| „KI" = 1 Token | „Schulungsplattform" = 4 Tokens |

**Quiz:** Warum sind Tokens wichtig?
- **✅ Sie bestimmen die Kosten und das Limit einer LLM-Anfrage.**
- Sie sind nur ein technisches Detail ohne praktische Bedeutung.
- Tokens sind dasselbe wie Buchstaben.
- *Hinweis: LLMs haben ein begrenztes Fenster – gemessen in Tokens.*

---

### Lektion 5 – Das Kontext-Fenster
**Text:**
> Das Kontext-Fenster ist das „Arbeitsgedächtnis" des LLM. Alles, was das Modell bei einer Anfrage sieht, steht darin – nicht mehr, nicht weniger. Zwischen zwei Anfragen erinnert sich das LLM an nichts.

**Diagramm:** System-Prompt → Verlauf → Neue Frage → LLM antwortet

**Quiz:** Erinnert sich ein LLM automatisch an frühere Gespräche?
- Ja, es hat ein permanentes Gedächtnis.
- **✅ Nein – alles muss im Kontext-Fenster stehen, sonst ist es vergessen.**
- Nur die letzten 5 Nachrichten.
- *Hinweis: Ein LLM ist zustandslos – es sieht nur, was gerade im Fenster steht.*

---

### Lektion 6 – Vorhersagen statt Verstehen
**Callout (Warnung):**
> LLMs „verstehen" nicht im menschlichen Sinn – sie sagen das wahrscheinlichste nächste Token voraus, basierend auf dem Kontext. Die Qualität deiner Eingabe bestimmt direkt die Qualität der Ausgabe.

**Vergleich:**
| Was es aussieht wie | Was wirklich passiert |
|---|---|
| Das LLM versteht die Frage | Es berechnet die wahrscheinlichste Wortfolge |
| Es denkt nach und weiß die Antwort | Es interpoliert aus Trainingsmustern |
| Es hat echte Erfahrung | Es hat keine eigene Meinung oder Erfahrung |

**Quiz:** Was tut ein LLM tatsächlich, wenn es antwortet?
- Es schlägt im Internet nach und gibt die Antwort zurück.
- **✅ Es sagt das wahrscheinlichste nächste Token basierend auf dem Kontext voraus.**
- Es denkt wie ein Mensch und formuliert eine Meinung.
- *Hinweis: LLMs sind Vorhersage-Systeme, keine denkenden Entitäten.*

---
---

## Kapitel 2 — Wie kommunizieren LLMs mit der Außenwelt?
**ID:** `tool-calling` | **Geschätzte Zeit:** 12 min | **6 Lektionen**

### Lektion 1 – Worum geht es in diesem Kapitel?
**Infobox:**
> Du weißt jetzt, wie ein LLM intern arbeitet. Aber ein LLM, das nur Text erzeugt, kann keine Tickets anlegen, keine PRs lesen und keine Systeme steuern. In diesem Kapitel lernst du, wie Tool Calling das ändert.

**Ausblick (4 Punkte):**
1. **Das Problem** — Warum ein LLM allein nicht mit der Welt interagieren kann.
2. **Tool Calling** — Wie ein LLM eine Funktion „aufruft", ohne sie selbst auszuführen.
3. **Jira-Beispiel** — Ein Ticket anlegen und Aufgaben suchen.
4. **GitHub-Beispiel** — Pull Requests lesen und Code-Änderungen kommentieren.

*Keine Abfrage.*

---

### Lektion 2 – Das Problem: LLMs können nur Text
**Callout (Warnung):**
> Ein LLM kann nur Text erzeugen. Es kann nicht googeln, keine E-Mail senden, kein Jira-Ticket anlegen und keine Datenbank abfragen. Ohne Erweiterung ist es auf sein Trainings-Wissen beschränkt.

**Vergleich:**
| LLM ohne Tools | LLM mit Tools |
|---|---|
| Kann nur auf Trainingswissen antworten | Kann aktuelle Daten nachschlagen |
| Keine aktuellen Daten abrufbar | Kann Jira-Tickets anlegen und suchen |
| Keine Aktionen in externen Systemen | Kann GitHub-PRs lesen und kommentieren |
| Kein Zugriff auf interne Tools | Kann Workflows in echten Systemen auslösen |

**Quiz:** Was kann ein LLM OHNE Werkzeuge (Tools)?
- Aktuelle Tickets aus Jira abrufen.
- **✅ Nur Text erzeugen – basierend auf seinem Trainings-Wissen.**
- E-Mails versenden.
- *Hinweis: Ohne Tools ist ein LLM auf reinen Text beschränkt.*

---

### Lektion 3 – Was ist ein Tool Call?
**Text:**
> Ein Tool Call ist die Möglichkeit für ein LLM, eine klar definierte Funktion aufzurufen – zum Beispiel `suche_jira_tickets(projekt="ES-212")`. Das LLM erzeugt dabei nur den Aufruf. Das Framework führt die Funktion aus und gibt das Ergebnis zurück.

**Diagramm:** Nutzer fragt → LLM denkt nach → Tool Call (JSON) → Ausführung durch Framework → Ergebnis → Antwort

**Callout (Tip):**
> Das LLM führt das Tool nicht selbst aus! Es erzeugt nur einen strukturierten Aufruf (JSON mit Funktionsname + Argumente). Das Framework übernimmt die eigentliche Ausführung und gibt das Ergebnis zurück.

**Quiz:** Wer führt die Funktion aus, nachdem das LLM einen Tool Call erzeugt hat?
- Das LLM selbst.
- **✅ Das Agent-Framework.**
- Der Nutzer manuell.
- *Hinweis: Das LLM erzeugt nur den Aufruf – jemand anderes muss ihn ausführen.*

---

### Lektion 4 – Beispiel: Jira-Integration
**Text:**
> Jira ist eines der häufigsten Systeme in Entwicklungsteams. Mit Tool Calling kann ein LLM Tickets anlegen, suchen und aktualisieren – ohne dass der Nutzer die Jira-Oberfläche öffnen muss.

**Typische Jira-Tools:**
1. `erstelle_ticket(titel, beschreibung, typ)` — Legt ein neues Jira-Ticket an. *Beispiel: `erstelle_ticket('Login-Fehler', 'Passwort-Validierung fehlt', 'Bug')`*
2. `suche_tickets(projekt, status, zugewiesen_an)` — Gibt eine Liste passender Tickets zurück. *Beispiel: `suche_tickets(projekt='ES-212', status='Offen')`*
3. `aktualisiere_ticket(ticket_id, felder)` — Ändert Status, Priorität oder Beschreibung. *Beispiel: `aktualisiere_ticket('ES-42', {'status': 'In Bearbeitung'})`*

**Diagramm:** Fehlerbeschreibung → LLM analysiert (Typ: Bug, Projekt: ES-212) → `erstelle_ticket()` → Jira API → Ticket ES-212-99 erstellt + Link zurück

**Quiz:** Ein Nutzer sagt: „Leg ein Bug-Ticket für den Login-Fehler an." Was macht das LLM als Nächstes?
- Es antwortet mit einer Beschreibung, wie man ein Ticket anlegt.
- **✅ Es erzeugt einen Tool Call `erstelle_ticket(...)` mit den passenden Parametern.**
- Es öffnet die Jira-Oberfläche im Browser.
- *Hinweis: Das LLM erzeugt einen strukturierten Aufruf – das Framework führt ihn aus.*

---

### Lektion 5 – Beispiel: GitHub-Integration
**Text:**
> GitHub ist die zentrale Plattform für Code-Zusammenarbeit. Mit Tool Calling kann ein LLM Pull Requests analysieren, Kommentare verfassen und Code-Änderungen verarbeiten – direkt im Entwicklungsworkflow.

**Typische GitHub-Tools:**
1. `lese_pull_request(repo, pr_nummer)` — Gibt Titel, Beschreibung und geänderte Dateien zurück. *Beispiel: `lese_pull_request('my-org/backend', 42)`*
2. `erstelle_kommentar(repo, pr_nummer, kommentar)` — Verfasst einen Review-Kommentar am PR. *Beispiel: `erstelle_kommentar('my-org/backend', 42, 'Bitte Fehlerbehandlung ergänzen.')`*
3. `lese_datei(repo, pfad, branch)` — Liest den Inhalt einer Datei aus dem Repository. *Beispiel: `lese_datei('my-org/backend', 'src/auth.py', 'main')`*

**Diagramm:** Neuer PR #42 → `lese_pull_request()` → LLM analysiert → `erstelle_kommentar()` → PR kommentiert

**Quiz:** Ein LLM soll einen PR-Review-Kommentar schreiben. Welche Tools braucht es mindestens?
- Nur `erstelle_kommentar()` – es weiß den Inhalt schon.
- **✅ Zuerst `lese_pull_request()` um den PR zu kennen, dann `erstelle_kommentar()` um zu antworten.**
- Kein Tool – es kann direkt auf GitHub zugreifen.
- *Hinweis: Das LLM muss erst den Kontext lesen, bevor es sinnvoll kommentieren kann.*

---

### Lektion 6 – Mehrere Tools kombinieren
**Callout (Info):**
> Die Stärke von Tool Calling liegt nicht im Einzelaufruf, sondern in der Kombination: Ein LLM kann mehrere Tools nacheinander aufrufen – und auf Basis der Ergebnisse entscheiden, was als Nächstes zu tun ist.

**Diagramm:** Neuer PR (Bug-Fix) → `lese_pull_request()` → LLM entscheidet (Ticket vorhanden?) → `suche_tickets()` → `aktualisiere_ticket()` (PR-Link eintragen) → PR und Ticket verknüpft

**Quiz:** Was ist der Vorteil, wenn ein LLM mehrere Tools kombinieren kann?
- Es wird schneller, weil weniger Token verbraucht werden.
- **✅ Es kann komplexe Workflows automatisieren, die mehrere Systeme berühren.**
- Es braucht keinen System-Prompt mehr.
- *Hinweis: Einzelne Tool Calls sind gut – kombinierte sind mächtiger.*

---
---

## Kapitel 3 — Was ist ein Agent und wie arbeitet er?
**ID:** `ki-agenten` | **Geschätzte Zeit:** 12 min | **6 Lektionen**

### Lektion 1 – Worum geht es in diesem Kapitel?
**Infobox:**
> Du weißt jetzt, wie ein LLM arbeitet und wie es über Tools mit der Außenwelt kommuniziert. Jetzt geht es einen Schritt weiter: Was passiert, wenn ein LLM eigenständig entscheidet, WELCHES Tool es aufruft, in welcher Reihenfolge und wann es fertig ist?

**Ausblick (5 Punkte):**
1. **Was ist ein KI-Agent?** — Die entscheidende Eigenschaft: autonome Entscheidungen.
2. **Agent vs. Skript vs. Chatbot** — Der entscheidende Unterschied.
3. **Die vier Bausteine** — Woraus jeder Agent besteht.
4. **Der Agent Loop** — Wie ein Agent Schritt für Schritt arbeitet.
5. **Wann lohnt sich ein Agent?** — Nicht jede Aufgabe braucht einen.

*Keine Abfrage.*

---

### Lektion 2 – Was ist ein KI-Agent?
**Callout (Info):**
> Ein KI-Agent ist ein Programm, das ein LLM nutzt, um ein Ziel über mehrere Schritte selbstständig zu verfolgen. Es entscheidet bei jedem Schritt eigenständig, was als Nächstes zu tun ist – und ob es fertig ist.

**Diagramm:** Aufgabe (Nutzer gibt Ziel vor) → Agent denkt (Was muss ich als Nächstes tun?) → Agent handelt (Tool Call oder Antwort) → Ziel erreicht *(Loop: Noch nicht fertig – nächster Schritt)*

**Quiz:** Was macht einen KI-Agenten besonders gegenüber einem einfachen LLM mit Tool Calling?
- Er ist immer schneller.
- **✅ Er entscheidet eigenständig, welche Tools er aufruft und wann er fertig ist.**
- Er benötigt keine Tools.
- *Hinweis: Wer entscheidet den nächsten Schritt – und das Ziel?*

---

### Lektion 3 – Agent vs. Chatbot vs. Skript
**Text:**
> Nicht jede KI-Anwendung ist ein Agent. Die Unterschiede in Flexibilität und Autonomie sind entscheidend für die Wahl des richtigen Werkzeugs.

**Vergleich:**
| Skript / Chatbot | KI-Agent |
|---|---|
| Fester Ablauf – vorab programmiert | Entscheidet den nächsten Schritt selbst |
| Ein Input, ein Output | Mehrere Tool Calls nacheinander möglich |
| Scheitert bei unerwarteten Situationen | Reagiert flexibel auf Ergebnisse |
| Einfach zu debuggen und zu testen | Schwerer vorhersehbar – braucht Leitplanken |

**Quiz:** Was macht einen KI-Agenten anders als ein klassisches Skript?
- Er ist immer schneller.
- **✅ Er entscheidet zur Laufzeit selbst, was als Nächstes passiert.**
- Skripte können keine APIs aufrufen.
- *Hinweis: Wer entscheidet den nächsten Schritt?*

---

### Lektion 4 – Die vier Bausteine eines Agenten
**Text:**
> Jeder KI-Agent besteht aus denselben vier Grundelementen – egal ob er Jira-Tickets anlegt, Code reviewed oder Support-Anfragen bearbeitet.

**4 Karten:**
- 🧠 **Modell (LLM)** — Das Gehirn – plant, entscheidet und erzeugt Tool Calls.
- 📋 **Instruktionen** — Der System-Prompt – legt Rolle, Ziel und Grenzen fest.
- 🔧 **Werkzeuge (Tools)** — Die Hände – Verbindung zur Außenwelt (Jira, GitHub, APIs).
- 💾 **Speicher (Memory)** — Das Kurzzeitgedächtnis – Kontext, Verlauf und Tool-Ergebnisse.

**Diagramm:** Instruktionen → Speicher → LLM entscheidet → Tools (Jira, GitHub, APIs…) *(Loop: Ergebnis fließt zurück in den Speicher)*

**Quiz:** Ein Agent hat Modell, Instruktionen und Speicher – aber keine Tools. Was fehlt?
- Nichts – er funktioniert vollständig.
- **✅ Die Verbindung zur Außenwelt – er kann nur Text erzeugen, nicht handeln.**
- Der System-Prompt.
- *Hinweis: Tools sind die Hände des Agenten.*

---

### Lektion 5 – Der Agent Loop: Reason – Act – Observe
**Text:**
> Ein Agent arbeitet nicht einmalig – er durchläuft einen Zyklus, bis das Ziel erreicht ist. Dieser Kernzyklus heißt Reason-Act-Observe.

**Diagramm:** Aufgabe → Reason (Nächsten Schritt planen) → Act (Tool aufrufen) → Observe (Ergebnis analysieren) → Fertig *(Loop: Ziel noch nicht erreicht – erneut Reason)*

**Schritte:**
1. **Reason – Planen** — Das LLM überlegt: Was weiß ich bisher? Was ist der beste nächste Schritt?
2. **Act – Handeln** — Der Agent ruft ein Tool auf – z. B. `suche_jira_tickets()` oder `lese_pull_request()`.
3. **Observe – Beobachten** — Das Ergebnis des Tool Calls kommt zurück und wird in den Kontext aufgenommen.

**Quiz:** In welcher Reihenfolge arbeitet ein Agent?
- Act – Reason – Observe
- Observe – Act – Reason
- **✅ Reason – Act – Observe**
- *Hinweis: Erst denken, dann handeln, dann schauen.*

---

### Lektion 6 – Wann lohnt sich ein Agent?
**Text:**
> Ein KI-Agent ist mächtiger als ein einfaches Skript – aber auch komplexer, schwerer zu debuggen und teurer im Betrieb. Nicht jede Aufgabe rechtfertigt einen Agenten.

**Vergleich:**
| Gut für Agenten | Besser klassisch lösen |
|---|---|
| Unstrukturierte Texte verstehen und klassifizieren | Feste Regeln ohne Interpretation |
| Mehrere Schritte mit Entscheidungen dazwischen | Exakte Berechnungen (Buchhaltung, Maths) |
| Viele Sonderfälle und Ausnahmen | Hohe Frequenz mit minimalen Kosten |
| Systeme kombinieren (z. B. GitHub + Jira) | Sicherheitskritische Kernprozesse |

**Quiz:** Welche Aufgabe passt gut zu einem KI-Agenten?
- Einen Betrag von EUR in USD umrechnen.
- **✅ Support-Tickets lesen und dem richtigen Team zuweisen.**
- Jeden Tag um 8 Uhr einen Datenbankexport starten.
- *Hinweis: Braucht die Aufgabe Sprachverständnis und Urteilsvermögen?*

---
---

## Kapitel 4 — Eigene spezialisierte Agenten erstellen
**ID:** `agenten-bauen` | **Geschätzte Zeit:** 28 min | **8 Lektionen**

### Lektion 1 – Worum geht es in diesem Kapitel?
**Infobox:**
> Du weißt jetzt, was ein KI-Agent ist und wie der Agent Loop funktioniert. In diesem Kapitel lernst du, wie du einen eigenen spezialisierten Agenten baust – vom System-Prompt bis zum lauffähigen Code.

**Ausblick (4 Punkte):**
1. **Spezialisierung** — Warum fokussierte Agenten besser sind als Allzweck-Agenten.
2. **System-Prompt** — Wie du deinem Agenten Rolle und Regeln gibst.
3. **Setup und Code** — Einen Agent im Terminal zum Laufen bringen.
4. **Context Engineering** — Wie du steuerst, was der Agent sieht.

*Keine Abfrage.*

---

### Lektion 2 – Spezialisierung statt Allzweck
**Vergleich:**
| Allzweck-Assistent | Spezialisierter Agent |
|---|---|
| Deckt viele Themen oberflächlich ab | Genau eine klar umrissene Aufgabe |
| Verhalten schwer vorhersehbar | Vorhersehbares, konsistentes Ergebnis |
| Ausgabeformat variiert stark | Festes Ausgabeformat – testbar |

**Quiz:** Warum ist ein spezialisierter Agent für eine konkrete Aufgabe oft besser als ein Allzweck-Assistent?
- Er verwendet ein größeres Modell.
- **✅ Sein Verhalten ist vorhersehbar, testbar und leichter zu kontrollieren.**
- Er braucht keinen System-Prompt.
- *Erklärung: Ein enger Fokus macht den Agenten konsistent und einfach abzusichern – genau das, was Produktionsumgebungen brauchen.*

---

### Lektion 3 – Der System-Prompt als Stellenbeschreibung
**Die vier Pflichtteile jedes System-Prompts:**
1. **Persona – Wer ist der Agent?** — Eine klare Fachrolle erzeugt konsistenteres Verhalten. *Beispiel: „Du bist ein erfahrener Release-Manager."*
2. **Aufgabe – Was soll er tun?** — Konkretes Verb, kein vages „hilf mir". *Beispiel: „Du wandelst Code-Änderungen in Conventional-Commits-Nachrichten um."*
3. **Grenzen – Was soll er NIE tun?** — Explizite Verbote sind wirksamer als implizite Erwartungen. *Beispiel: „Erfinde keine Änderungen. Frag nach, wenn unklar."*
4. **Format – Wie sieht die Ausgabe aus?** — Länge, Sprache, Struktur – das Modell hält sich sehr zuverlässig daran. *Beispiel: „Nur die Commit-Nachricht, kein Kommentar. Erste Zeile max. 72 Zeichen."*

**Aufgabe (Freitext):** Schreib die ersten beiden Sätze eines System-Prompts für einen Agenten, der GitHub-Pull-Requests in drei Stichpunkten zusammenfasst. Beginne mit der Persona.
- *Platzhalter: „Du bist ein technischer Reviewer. Deine Aufgabe ist es, PR-Beschreibungen in genau drei prägnanten Stichpunkten zusammenzufassen …"*
- *Bedingungen: mind. 40 Zeichen, muss „du bist" enthalten*
- *Hinweis: Beginne mit „Du bist …" und beschreibe dann die konkrete Aufgabe.*

---

### Lektion 4 – Setup in VS Code
**Text:**
> Das Setup dauert drei Minuten. Richte es einmal ein – es gilt für alle Kapitel.

**Drei Setup-Befehle:**
1. `python -m venv .venv` — Isoliert Pakete vom System-Python.
2. `.venv\Scripts\activate` — (.venv) zeigt an, dass sie aktiv ist.
3. `pip install openai python-dotenv` — OpenAI SDK + dotenv für sicheres Key-Loading.

**Callout (Tip):**
> Erstelle im Projektordner eine Datei `.env` mit `OPENAI_API_KEY=sk-...` und füge `.env` zur `.gitignore` hinzu. Keys gehören nie in den Code.

**Terminal-Simulation (Übung):** Drei Schritte der Reihe nach eingeben und bestätigen.

---

### Lektion 5 – Commit-Agenten ausführen
**Text:**
> Der Agent bekommt eine Änderungsbeschreibung und gibt eine saubere Conventional-Commits-Nachricht zurück – nichts mehr, nichts weniger.

**Code (`commit_agent.py`):**
```python
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

SYSTEM_PROMPT = """
Du bist ein Release-Manager.
Aufgabe: Beschreibung -> Conventional-Commits-Nachricht.
Format: <typ>(<bereich>): <kurzbeschreibung>  (max. 72 Zeichen)
Erlaubte Typen: feat, fix, refactor, docs, test, chore
Nur die Nachricht - kein Kommentar, keine Erklärung.
"""

beschreibung = (
    "Login-Formular zeigt bei leerem Passwort "
    "keine Fehlermeldung. Validierung ergänzt, Test geschrieben."
)

r = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": beschreibung}
    ],
    temperature=0
)
print(r.choices[0].message.content)
```

**Quiz:** Warum wird `temperature=0` verwendet?
- Es beschleunigt den API-Call.
- **✅ Gleiche Eingabe liefert möglichst gleiche Ausgabe – ideal für feste Formate.**
- Das Modell liest sonst keinen System-Prompt.
- *Erklärung: temperature=0 macht das Modell so deterministisch wie möglich – für ein festes Format wie Conventional Commits genau richtig.*

**Terminal-Simulation:** `python commit_agent.py` ausführen → Ausgabe: `fix(login): Fehlermeldung bei leerem Passwort ergänzen`

---

### Lektion 6 – Ausgaben absichern
**Drei Leitplanken für produktionsreife Agenten:**
1. **Eingabe prüfen** — Leere oder unsinnige Eingaben fangen, bevor sie unnötige Kosten verursachen. *Beispiel: `if not beschreibung.strip(): raise ValueError('Leer')`*
2. **Ausgabe validieren** — Prüfen, ob das Format stimmt – nicht blind vertrauen. *Beispiel: `if not commit.split('(')[0] in TYPEN: ...neu anfordern`*
3. **System-Prompt versionieren** — In eigener Datei speichern und in Git committen – Änderungen müssen nachvollziehbar sein. *Beispiel: `prompt = Path('prompts/commit.txt').read_text()`*

**Quiz:** Der Agent liefert eine Commit-Nachricht im falschen Format. Was ist die richtige Reaktion?
- Die fehlerhafte Ausgabe direkt verwenden.
- **✅ Ausgabe validieren und bei Abweichung erneut anfordern oder den Nutzer benachrichtigen.**
- Den API-Key wechseln.
- *Erklärung: Auch ein gut instruierter Agent kann vom Format abweichen. Validierung vor der Weiterverwendung ist Pflicht.*

---

### Lektion 7 – Context Engineering
**Callout (Info):**
> Context Engineering bezeichnet alle Techniken, mit denen du steuerst, welche Informationen wann im Kontext-Fenster des LLM landen: System-Prompt-Design, Verlaufsmanagement, Tool-Output-Formatierung und RAG.

**4 Karten:**
- 📋 **System Prompt** — Rolle, Ziel, Grenzen und verfügbare Tools. Der wichtigste Hebel – klar und spezifisch formulieren.
- 🗂️ **Verlauf kürzen** — Bei langen Sessions den Kontext zusammenfassen – sonst steigen Kosten und Qualität sinkt.
- 🔍 **RAG (Retrieval)** — Relevante Dokumente werden zur Laufzeit nachgeladen – statt alles vorab in den System-Prompt zu schreiben.
- 📤 **Tool Output kürzen** — Nur relevante Felder zurückgeben. Kompakte Tool-Antworten verbessern das Reasoning.

**Quiz:** Ein Tool gibt 200 JSON-Felder zurück – nur 5 sind relevant. Was ist die beste Strategie?
- Alle 200 Felder in den Kontext schreiben – das LLM findet die relevanten selbst.
- **✅ Die Tool-Wrapper-Funktion filtert und gibt nur die 5 relevanten Felder zurück.**
- Den Kontext nach jedem Schritt komplett leeren.
- *Erklärung: Kompakter Kontext bedeutet besseres Reasoning und niedrigere Kosten. Die Tool-Funktion sollte filtern, bevor das Ergebnis in den Kontext kommt.*

---

### Lektion 8 – Wie viel Autonomie ist sinnvoll?
**Vier Stufen – von Vorschlag bis vollständig autonom:**
1. **Stufe 1 – Vorschlag** — Agent schlägt vor, Mensch entscheidet und handelt. *Beispiel: Agent formuliert Release Notes, du gibst frei.*
2. **Stufe 2 – Freigabe** — Agent bereitet alles vor, führt erst nach OK aus. *Beispiel: Agent erstellt Jira-Ticket, du klickst Speichern.*
3. **Stufe 3 – Leitplanken** — Agent handelt frei, aber nur innerhalb fester Grenzen. *Beispiel: Darf Test-Tickets anlegen, keine Produktionsänderungen.*
4. **Stufe 4 – Autonom** — Vollständig eigenständig – nur für risikoarme, klar begrenzte Aufgaben. *Beispiel: Eingehende PRs automatisch nach Dateipfad labeln.*

**Quiz:** Ein Agent soll selbstständig veraltete Branches im produktiven Repo löschen. Welche Stufe ist angemessen?
- Stufe 4 – autonom, das spart Zeit.
- **✅ Stufe 1 oder 2 – Vorschlag oder Freigabe, weil das kaum umkehrbar ist.**
- Stufe 3 genügt – er löscht ja nur Branches.
- *Erklärung: Je schwerer eine Aktion umkehrbar ist, desto mehr Kontrolle gehört dazu. Stufe 1 oder 2 ist der richtige Startpunkt.*

---
---

## Kapitel 5 — Mehrstufige Arbeitsabläufe automatisieren
**ID:** `workflows-deployment` | **Geschätzte Zeit:** 30 min | **9 Lektionen**

### Lektion 1 – Worum geht es in diesem Kapitel?
**Infobox:**
> Du kannst jetzt einzelne Agenten bauen. Aber was, wenn eine Aufgabe zu groß für einen einzelnen Agenten ist? In diesem Kapitel lernst du, wie du Aufgaben zerlegst, Agenten verkettest und Workflows robust betreibst.

**Ausblick (4 Punkte):**
1. **Aufgaben zerlegen** — Große Probleme in kleine Schritte aufteilen.
2. **Workflow-Muster** — Pipeline, Router, Orchestrator.
3. **Fehlerbehandlung** — Was tun, wenn ein Schritt fehlschlägt?
4. **Deployment** — Agenten zuverlässig betreiben.

*Keine Abfrage.*

---

### Lektion 2 – Große Aufgabe, kleine Schritte
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

### Lektion 3 – Die drei Workflow-Muster
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

### Lektion 4 – Kette bauen und ausführen
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

### Lektion 5 – Fester Workflow oder autonomer Agent?
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

### Lektion 6 – Single vs. Multi-Agent Architekturen
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

### Lektion 7 – Hierarchical Architecture & Agent Communication
**Diagramm:** Trigger (Gesamtaufgabe) → Orchestrator (zerlegt und delegiert) → Sub-Agent A (Teilaufgabe 1) + Sub-Agent B (Teilaufgabe 2) → Ergebnis (aggregiert)

**Hinweis:** Sub-Agents kommunizieren in der Regel über den Orchestrator – nicht direkt miteinander.

**Quiz:** Wer koordiniert die Sub-Agents in einer hierarchischen Architektur?
- Sub-Agents koordinieren sich selbst direkt.
- **✅ Der Orchestrator zerlegt, delegiert und aggregiert die Ergebnisse.**
- Der Nutzer koordiniert jeden Sub-Agent manuell.
- *Erklärung: Der Orchestrator ist der zentrale Koordinator: er zerlegt, delegiert, wartet auf Ergebnisse und aggregiert sie.*

---

### Lektion 8 – Deployment – Chatbot oder Pipeline?
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

### Lektion 9 – Automation Pipeline – Aufbau und Monitoring
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
