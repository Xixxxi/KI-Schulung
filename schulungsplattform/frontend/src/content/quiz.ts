// ── Quiz-Logik ─────────────────────────────────────────────────────────────
//
// Reine, kapitelunabhängige Funktionen: Aufbereitung der Fragen für die
// Anzeige (ohne Lösungen) und clientseitige Auswertung. Bekommt jeweils ein
// ChapterDef übergeben – kein Zugriff auf die Registry, damit hier keine
// zirkulären Importe entstehen.

import type { QuizData, QuizResult, QuestionResult } from '../types'
import type { ChapterDef, QuizQuestion } from './types'

type Answer = number | number[] | string | undefined

// ── Öffentliche Fragen (ohne Lösungen) ────────────────────────────────────────

export function buildPublicQuiz(chapter: ChapterDef): QuizData {
  return {
    chapterId: chapter.id,
    title: chapter.title,
    passThreshold: chapter.quiz.passThreshold ?? 0.7,
    questions: chapter.quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options ?? [],
      hint: q.hint ?? '',
    })),
  }
}

// ── Einzelauswertung ──────────────────────────────────────────────────────────

function isSingleCorrect(q: QuizQuestion, answer: Answer): boolean {
  return typeof answer === 'number' && answer === q.correct
}

function isMultiCorrect(q: QuizQuestion, answer: Answer): boolean {
  if (!Array.isArray(q.correct) || !Array.isArray(answer)) return false
  const a = [...(answer as number[])].sort((x, y) => x - y)
  const c = [...q.correct].sort((x, y) => x - y)
  return a.length === c.length && a.every((v, i) => v === c[i])
}

function isTextCorrect(q: QuizQuestion, answer: Answer): boolean {
  const keywords = q.keywords ?? []
  if (keywords.length === 0) return false
  const text = String(answer ?? '').toLowerCase()
  const hits = keywords.filter((kw) => text.includes(String(kw).toLowerCase())).length
  const minRequired = Number.isFinite(q.minKeywords) ? Number(q.minKeywords) : keywords.length
  return hits >= Math.max(1, minRequired)
}

function evaluateOne(q: QuizQuestion, answer: Answer): boolean {
  if (q.type === 'multi') return isMultiCorrect(q, answer)
  if (q.type === 'text') return isTextCorrect(q, answer)
  return isSingleCorrect(q, answer)
}

function publicCorrectAnswer(q: QuizQuestion): QuestionResult['correctAnswer'] {
  const options = q.options ?? []
  if (q.type === 'single') {
    return typeof q.correct === 'number' && q.correct >= 0 && q.correct < options.length
      ? options[q.correct]
      : null
  }
  if (q.type === 'multi') {
    const correct = Array.isArray(q.correct) ? q.correct : []
    return correct
      .filter((i) => i >= 0 && i < options.length)
      .map((i) => options[i])
  }
  if (q.type === 'text') return { keywords: q.keywords ?? [] }
  return null
}

// ── Gesamtauswertung ──────────────────────────────────────────────────────────

export function gradeQuiz(
  chapter: ChapterDef,
  answers: Record<string, unknown>,
): QuizResult {
  const questions = chapter.quiz.questions
  const passThreshold = chapter.quiz.passThreshold ?? 0.7

  const results: QuestionResult[] = []
  const weakLessons = new Map<string, { id: string; title: string }>()
  let correctCount = 0

  for (const q of questions) {
    const given = answers[q.id] as Answer
    const correct = evaluateOne(q, given)
    if (correct) {
      correctCount += 1
    } else if (q.reviewLesson && !weakLessons.has(q.reviewLesson)) {
      weakLessons.set(q.reviewLesson, { id: q.reviewLesson, title: q.reviewLesson })
    }
    results.push({
      id: q.id,
      correct,
      explanation: q.explanation ?? '',
      correctAnswer: publicCorrectAnswer(q),
    })
  }

  const total = questions.length
  const score = total ? correctCount / total : 0
  return {
    chapterId: chapter.id,
    total,
    correctCount,
    score: Math.round(score * 10000) / 10000,
    scorePercent: Math.round(score * 100),
    passThreshold,
    passThresholdPercent: Math.round(passThreshold * 100),
    passed: score >= passThreshold,
    results,
    recommendedLessons: [...weakLessons.values()],
  }
}
