// ── Content-Registry ────────────────────────────────────────────────────────
//
// Zentrale Zusammenstellung der Schulung aus den .tsx-Kapiteln. Die Registry
// verbindet die einzelnen Inhaltsbausteine:
//   • chapters/…            → Lektionen (Learn) + Quiz + Metadaten
//   • content/reference.ts  → Nachschlagewerk (getrennt, nach chapterId)
//   • content/quiz.ts       → Quiz-Aufbereitung & clientseitige Auswertung
//
// Neues Kapitel: chapter-Objekt im Chapter-Ordner exportieren, hier ins
// passende Thema eintragen und (optional) Nachschlage-Einträge in
// content/reference.ts ergänzen – kein Backend, kein JSON nötig.

import type {
  Topic, QuizData, QuizResult,
  ReferenceData, GlobalReferenceData, ProgressMap,
} from '../types'
import type { ChapterDef, TopicDef } from './types'

import { chapter as llmGrundlagen } from '../chapters/ki-agenten/01-LlmGrundlagen'
import { chapter as toolCalling } from '../chapters/ki-agenten/02-ToolCalling'
import { chapter as wasIstAgent } from '../chapters/ki-agenten/03-WasIstAgent'
import { chapter as agentenBauen } from '../chapters/ki-agenten/04-AgentenBauen'
import { chapter as workflowsDeployment } from '../chapters/ki-agenten/05-WorkflowsDeployment'

import { getReferenceEntries } from './reference'
import { buildPublicQuiz, gradeQuiz } from './quiz'

// ── Themen-Definition ─────────────────────────────────────────────────────────

export const TOPICS: TopicDef[] = [
  {
    id: 'ki-agenten',
    title: 'KI-Agenten und Automatisierung',
    description:
      'Wie KI-Agenten funktionieren, wie du eigene spezialisierte Agenten baust und mehrstufige Arbeitsabläufe automatisierst.',
    icon: '🤖',
    accentColor: '#1c69d4',
    order: 1,
    chapters: [
      llmGrundlagen,
      toolCalling,
      wasIstAgent,
      agentenBauen,
      workflowsDeployment,
    ],
  },
]

// ── Fortschritt (kommt vom Backend – für spätere Accounts) ────────────────────

export type { ProgressMap } from '../types'

// ── Lookups ───────────────────────────────────────────────────────────────────

const CHAPTER_BY_ID: Record<string, ChapterDef> = {}
const TOPIC_BY_CHAPTER_ID: Record<string, TopicDef> = {}
for (const topic of TOPICS) {
  for (const chapter of topic.chapters) {
    CHAPTER_BY_ID[chapter.id] = chapter
    TOPIC_BY_CHAPTER_ID[chapter.id] = topic
  }
}

export function getChapter(id: string): ChapterDef | undefined {
  return CHAPTER_BY_ID[id]
}

export function getChapterLearn(id: string): ChapterDef['Learn'] | undefined {
  return CHAPTER_BY_ID[id]?.Learn
}

// ── Themen-Baum für die UI (mit Fortschritt angereichert) ─────────────────────

export function buildTopics(progress: ProgressMap = {}): Topic[] {
  return [...TOPICS]
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((topic) => {
      const subTopics = topic.chapters.map((ch) => {
        const p = progress[ch.id] || {}
        return {
          id: ch.id,
          title: ch.subTopicTitle || ch.title,
          description: ch.subTopicDescription || ch.summary,
          estimatedMinutes: ch.estimatedMinutes ?? null,
          lessonCount: ch.lessonCount,
          questionCount: ch.quiz.questions.length,
          referenceCount: getReferenceEntries(ch.id).length,
          tag: ch.tag ?? null,
          passed: Boolean(p.passed),
          bestScorePercent: Number(p.scorePercent ?? 0),
        }
      })
      const passedCount = subTopics.filter((s) => s.passed).length
      return {
        id: topic.id,
        title: topic.title,
        description: topic.description,
        icon: topic.icon,
        accentColor: topic.accentColor,
        order: topic.order,
        subTopics,
        subTopicCount: subTopics.length,
        totalMinutes: subTopics.reduce((n, s) => n + (s.estimatedMinutes || 0), 0),
        passedCount,
        allPassed: subTopics.length > 0 && passedCount === subTopics.length,
      }
    })
}

// ── Quiz (Delegation an content/quiz.ts) ──────────────────────────────────────

export function getPublicQuiz(id: string): QuizData | null {
  const chapter = CHAPTER_BY_ID[id]
  return chapter ? buildPublicQuiz(chapter) : null
}

export function evaluateQuiz(
  id: string,
  answers: Record<string, unknown>,
): QuizResult | null {
  const chapter = CHAPTER_BY_ID[id]
  return chapter ? gradeQuiz(chapter, answers) : null
}

// ── Nachschlagewerk (Daten aus content/reference.ts, nach Kapitel gruppiert) ──

export function getChapterReference(id: string): ReferenceData | null {
  const chapter = CHAPTER_BY_ID[id]
  if (!chapter) return null
  return {
    chapterId: chapter.id,
    title: chapter.title,
    entries: getReferenceEntries(chapter.id),
  }
}

export function getAllReferences(): GlobalReferenceData {
  const topics = [...TOPICS]
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
    .map((topic) => ({
      topicId: topic.id,
      topicTitle: topic.title,
      topicIcon: topic.icon,
      topicAccentColor: topic.accentColor,
      topicOrder: topic.order,
      chapters: topic.chapters
        .map((ch, idx) => ({
          chapterId: ch.id,
          chapterTitle: ch.subTopicTitle || ch.title,
          chapterOrder: idx + 1,
          entries: getReferenceEntries(ch.id),
        }))
        .filter((ch) => ch.entries.length > 0),
    }))
    .filter((t) => t.chapters.length > 0)
  return { topics }
}
