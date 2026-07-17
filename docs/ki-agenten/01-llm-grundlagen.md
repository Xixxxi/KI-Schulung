# Kapitel 1 — LLM-Grundlagen

**ID:** `llm-grundlagen` | **Geschätzte Zeit:** 10 min | **6 Lektionen**

---

## Lektion 1 – Worum geht es in diesem Kapitel?

**Infobox:**
> Bevor wir Agenten bauen, müssen wir verstehen, womit wir bauen. Dieses Kapitel legt das Fundament: Was ist ein LLM, wie „denkt" es und warum ist alles für ein LLM einfach nur Text?

**Ausblick (4 Punkte):**
1. **Wie LLMs arbeiten** — Text rein, Text raus – das Grundprinzip.
2. **Alles ist Text** — Warum PDFs, Code und APIs alle gleich aussehen.
3. **Tokens und Kontext** — Die Maßeinheit des LLM und sein „Arbeitsgedächtnis".
4. **Vorhersagen statt Verstehen** — Was ein LLM wirklich macht, wenn es antwortet.

*Keine Abfrage.*

---

## Lektion 2 – Wie LLMs arbeiten

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

## Lektion 3 – Alles ist Text (oder unterstützte Modalitäten)

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

## Lektion 4 – Tokens – die Bausteine

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

## Lektion 5 – Das Kontext-Fenster

**Text:**
> Das Kontext-Fenster ist das „Arbeitsgedächtnis" des LLM. Alles, was das Modell bei einer Anfrage sieht, steht darin – nicht mehr, nicht weniger. Zwischen zwei Anfragen erinnert sich das LLM an nichts.

**Diagramm:** System-Prompt → Verlauf → Neue Frage → LLM antwortet

**Quiz:** Erinnert sich ein LLM automatisch an frühere Gespräche?
- Ja, es hat ein permanentes Gedächtnis.
- **✅ Nein – alles muss im Kontext-Fenster stehen, sonst ist es vergessen.**
- Nur die letzten 5 Nachrichten.
- *Hinweis: Ein LLM ist zustandslos – es sieht nur, was gerade im Fenster steht.*

---

## Lektion 6 – Vorhersagen statt Verstehen

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

*Letzte Aktualisierung: Juli 2026*
