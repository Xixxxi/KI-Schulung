# Kapitel 4 — Eigene spezialisierte Agenten erstellen

**ID:** `agenten-bauen` | **Geschätzte Zeit:** 28 min | **8 Lektionen**

---

## Lektion 1 – Worum geht es in diesem Kapitel?

**Infobox:**
> Du weißt jetzt, was ein KI-Agent ist und wie der Agent Loop funktioniert. In diesem Kapitel lernst du, wie du einen eigenen spezialisierten Agenten baust – vom System-Prompt bis zum lauffähigen Code.

**Ausblick (4 Punkte):**
1. **Spezialisierung** — Warum fokussierte Agenten besser sind als Allzweck-Agenten.
2. **System-Prompt** — Wie du deinem Agenten Rolle und Regeln gibst.
3. **Setup und Code** — Einen Agent im Terminal zum Laufen bringen.
4. **Context Engineering** — Wie du steuerst, was der Agent sieht.

*Keine Abfrage.*

---

## Lektion 2 – Spezialisierung statt Allzweck

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

## Lektion 3 – Der System-Prompt als Stellenbeschreibung

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

## Lektion 4 – Setup in VS Code

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

## Lektion 5 – Commit-Agenten ausführen

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

## Lektion 6 – Ausgaben absichern

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

## Lektion 7 – Context Engineering

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

## Lektion 8 – Wie viel Autonomie ist sinnvoll?

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

*Letzte Aktualisierung: Juli 2026*
