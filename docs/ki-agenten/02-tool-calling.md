# Kapitel 2 — Wie kommunizieren LLMs mit der Außenwelt?

**ID:** `tool-calling` | **Geschätzte Zeit:** 12 min | **6 Lektionen**

---

## Lektion 1 – Worum geht es in diesem Kapitel?

**Infobox:**
> Du weißt jetzt, wie ein LLM intern arbeitet. Aber ein LLM, das nur Text erzeugt, kann keine Tickets anlegen, keine PRs lesen und keine Systeme steuern. In diesem Kapitel lernst du, wie Tool Calling das ändert.

**Ausblick (4 Punkte):**
1. **Das Problem** — Warum ein LLM allein nicht mit der Welt interagieren kann.
2. **Tool Calling** — Wie ein LLM eine Funktion „aufruft", ohne sie selbst auszuführen.
3. **Jira-Beispiel** — Ein Ticket anlegen und Aufgaben suchen.
4. **GitHub-Beispiel** — Pull Requests lesen und Code-Änderungen kommentieren.

*Keine Abfrage.*

---

## Lektion 2 – Das Problem: LLMs können nur Text

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

## Lektion 3 – Was ist ein Tool Call?

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

## Lektion 4 – Beispiel: Jira-Integration

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

## Lektion 5 – Beispiel: GitHub-Integration

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

## Lektion 6 – Mehrere Tools kombinieren

**Callout (Info):**
> Die Stärke von Tool Calling liegt nicht im Einzelaufruf, sondern in der Kombination: Ein LLM kann mehrere Tools nacheinander aufrufen – und auf Basis der Ergebnisse entscheiden, was als Nächstes zu tun ist.

**Diagramm:** Neuer PR (Bug-Fix) → `lese_pull_request()` → LLM entscheidet (Ticket vorhanden?) → `suche_tickets()` → `aktualisiere_ticket()` (PR-Link eintragen) → PR und Ticket verknüpft

**Quiz:** Was ist der Vorteil, wenn ein LLM mehrere Tools kombinieren kann?
- Es wird schneller, weil weniger Token verbraucht werden.
- **✅ Es kann komplexe Workflows automatisieren, die mehrere Systeme berühren.**
- Es braucht keinen System-Prompt mehr.
- *Hinweis: Einzelne Tool Calls sind gut – kombinierte sind mächtiger.*

---

*Letzte Aktualisierung: Juli 2026*
