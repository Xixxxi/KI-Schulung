import type { LearnData, QuizData, QuizResult, ReferenceData, GlobalReferenceData, Topic } from './types'

const SESSION_KEY = 'schulung.sessionId'

export function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': getSessionId(),
      ...(options.headers as Record<string, string> || {}),
    },
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json() as { error?: string }
      detail = body?.error || detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  return res.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string; service: string }>('/api/health'),
  listTopics: () => request<{ topics: Topic[] }>('/api/topics'),
  listChapters: () => request<{ chapters: unknown[] }>('/api/chapters'),
  getLearn: (id: string) => request<LearnData>(`/api/chapters/${id}/learn`),
  getQuiz: (id: string) => request<QuizData>(`/api/chapters/${id}/quiz`),
  evaluateQuiz: (id: string, answers: Record<string, unknown>) =>
    request<QuizResult>(`/api/chapters/${id}/quiz/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getReference: (id: string) => request<ReferenceData>(`/api/chapters/${id}/reference`),
  getAllReference: () => request<GlobalReferenceData>('/api/reference'),
}
