// ── Content-Authoring-Typen ────────────────────────────────────────────────
//
// Diese Typen beschreiben, wie Kapitel-Inhalte direkt in den .tsx-Dateien
// im jeweiligen Chapter-Ordner definiert werden. Die .tsx-Kapitel liefern
// Lektionen und Quiz. Das Nachschlagewerk ist bewusst ausgelagert und lebt
// in content/reference.ts (nach chapterId gruppiert).
//
// (Die früheren JSON-Dateien liegen nur noch als Legacy in docs/legacy-content/.)

import type { ComponentType } from 'react'

export interface ChapterLearnProps {
  onStartTest: () => void
  onOpenReference: () => void
}

// ── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  type: 'single' | 'multi' | 'text'
  question: string
  /** Antwortoptionen (bei single/multi). */
  options?: string[]
  /** Richtige Option(en) – Index bzw. Index-Liste (bei single/multi). */
  correct?: number | number[]
  /** Erwartete Schlüsselbegriffe (bei type 'text'). */
  keywords?: string[]
  /** Wie viele Keywords mindestens vorkommen müssen (Default: alle). */
  minKeywords?: number
  hint?: string
  explanation?: string
  /** Lektionstitel, den man bei falscher Antwort wiederholen sollte. */
  reviewLesson?: string
}

export interface ChapterQuiz {
  passThreshold?: number
  questions: QuizQuestion[]
}

// ── Nachschlagewerk ──────────────────────────────────────────────────────────
//
// Die eigentlichen Einträge stehen in content/reference.ts – bewusst getrennt
// von den Kapitel-Lektionen, aber weiterhin nach chapterId zugeordnet.

export interface ReferenceEntry {
  term: string
  definition: string
}

// ── Kapitel ───────────────────────────────────────────────────────────────────

export interface ChapterDef {
  id: string
  /** Voller Kapiteltitel. */
  title: string
  /** Titel für Sidebar/Kachel (Default: title). */
  subTopicTitle?: string
  summary: string
  /** Beschreibung für Kachel/Sidebar (Default: summary). */
  subTopicDescription?: string
  estimatedMinutes: number
  /** Anzahl Lektionen (nur für die Kachel-Metadaten). */
  lessonCount: number
  /** Optionales Klassifizierungs-Tag (z. B. "Allgemein"). */
  tag?: string | null
  /** Die Lern-Komponente dieses Kapitels. */
  Learn: ComponentType<ChapterLearnProps>
  quiz: ChapterQuiz
}

// ── Thema ─────────────────────────────────────────────────────────────────────

export interface TopicDef {
  id: string
  title: string
  description: string
  icon: string
  accentColor: string
  order: number
  chapters: ChapterDef[]
}
