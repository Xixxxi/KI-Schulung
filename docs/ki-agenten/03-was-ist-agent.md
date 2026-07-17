# Kapitel 3 — Was ist ein Agent und wie arbeitet er?

**ID:** `ki-agenten` | **Geschätzte Zeit:** 12 min | **6 Lektionen**

---

## Lektion 1 – Worum geht es in diesem Kapitel?

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

## Lektion 2 – Was ist ein KI-Agent?

**Callout (Info):**
> Ein KI-Agent ist ein Programm, das ein LLM nutzt, um ein Ziel über mehrere Schritte selbstständig zu verfolgen. Es entscheidet bei jedem Schritt eigenständig, was als Nächstes zu tun ist – und ob es fertig ist.

**Diagramm:** Aufgabe (Nutzer gibt Ziel vor) → Agent denkt (Was muss ich als Nächstes tun?) → Agent handelt (Tool Call oder Antwort) → Ziel erreicht *(Loop: Noch nicht fertig – nächster Schritt)*

**Quiz:** Was macht einen KI-Agenten besonders gegenüber einem einfachen LLM mit Tool Calling?
- Er ist immer schneller.
- **✅ Er entscheidet eigenständig, welche Tools er aufruft und wann er fertig ist.**
- Er benötigt keine Tools.
- *Hinweis: Wer entscheidet den nächsten Schritt – und das Ziel?*

---

## Lektion 3 – Agent vs. Chatbot vs. Skript

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

## Lektion 4 – Die vier Bausteine eines Agenten

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

## Lektion 5 – Der Agent Loop: Reason – Act – Observe

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

## Lektion 6 – Wann lohnt sich ein Agent?

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

*Letzte Aktualisierung: Juli 2026*
