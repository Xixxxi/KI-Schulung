// Zentrale API-Hilfsfunktionen für die Schulungsplattform.
// Hält eine anonyme Session-ID im localStorage (später durch echtes Login ersetzbar).

const SESSION_KEY = 'schulung.sessionId'

export function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

async function request(path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Session-Id': getSessionId(),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    let detail = `HTTP ${res.status}`
    try {
      const body = await res.json()
      detail = body?.error || detail
    } catch {
      /* ignore */
    }
    throw new Error(detail)
  }
  return res.json()
}

export const api = {
  health: () => request('/api/health'),
  // Themen-Übersicht (Thema → Unterthemen, mit Fortschritt)
  listTopics: () => request('/api/topics'),
  // Kapitel-Endpunkte (Unterthema-Ebene)
  listChapters: () => request('/api/chapters'),
  getLearn: (id) => request(`/api/chapters/${id}/learn`),
  getQuiz: (id) => request(`/api/chapters/${id}/quiz`),
  evaluateQuiz: (id, answers) =>
    request(`/api/chapters/${id}/quiz/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getReference: (id) => request(`/api/chapters/${id}/reference`),
}
