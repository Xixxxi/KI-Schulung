// ── Shared Domain Types ────────────────────────────────────────────────────

export type StepId = 'learn' | 'test'

export interface SubTopic {
  id: string
  title: string
  description: string
  estimatedMinutes: number | null
  lessonCount: number
  questionCount: number
  referenceCount: number
  passed: boolean
  bestScorePercent: number
  tag?: string | null
}

export interface Topic {
  id: string
  title: string
  description: string
  icon: string
  accentColor: string
  order: number
  subTopics: SubTopic[]
  subTopicCount: number
  totalMinutes: number
  passedCount: number
  allPassed: boolean
}

// ── Quiz ───────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  type: 'single' | 'multi' | 'text'
  question: string
  options?: string[]
  hint?: string
}

export interface QuizData {
  chapterId: string
  title: string
  passThreshold: number
  questions: QuizQuestion[]
}

export interface QuestionResult {
  id: string
  correct: boolean
  explanation: string
  correctAnswer: string | string[] | { keywords: string[] } | null
}

export interface QuizResult {
  chapterId: string
  total: number
  correctCount: number
  score: number
  scorePercent: number
  passThreshold: number
  passThresholdPercent: number
  passed: boolean
  results: QuestionResult[]
  recommendedLessons: { id: string; title: string }[]
}

// ── Reference ──────────────────────────────────────────────────────────────

export interface ReferenceEntry {
  term: string
  definition: string
}

export interface ReferenceData {
  chapterId: string
  title: string
  entries: ReferenceEntry[]
}

export interface GlobalReferenceChapter {
  chapterId: string
  chapterTitle: string
  chapterOrder: number
  entries: ReferenceEntry[]
}

export interface GlobalReferenceTopic {
  topicId: string
  topicTitle: string
  topicIcon: string
  topicAccentColor: string
  topicOrder: number
  chapters: GlobalReferenceChapter[]
}

export interface GlobalReferenceData {
  topics: GlobalReferenceTopic[]
}

// ── Fortschritt (Backend – für spätere Accounts) ────────────────────────────

export type ProgressMap = Record<string, { passed?: boolean; scorePercent?: number }>

export interface ChapterProgressInput {
  passed: boolean
  scorePercent: number
}
