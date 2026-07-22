import type { ProgressMap, ChapterProgressInput } from './types'

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

// ── API ───────────────────────────────────────────────────────────────────
//
// Die Schulungsinhalte kommen ausschließlich aus den .tsx-Kapiteln
// (siehe src/content/registry.ts). Das Backend dient nur noch dem
// Fortschritt / den späteren Accounts.

export const api = {
  health: () => request<{ status: string; service: string }>('/api/health'),
  getProgress: () => request<{ progress: ProgressMap }>('/api/progress'),
  reportProgress: (chapterId: string, data: ChapterProgressInput) =>
    request<{ progress: ProgressMap }>('/api/progress', {
      method: 'POST',
      body: JSON.stringify({ chapterId, ...data }),
    }),
}
