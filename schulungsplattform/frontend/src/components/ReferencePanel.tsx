import { useEffect, useMemo, useState } from 'react'
import { Loader2, Search, CheckCircle2, Unlock } from 'lucide-react'
import styles from './ReferencePanel.module.css'
import { api } from '../api'
import type { ReferenceData } from '../types'

interface Props {
  chapterId: string
  passed: boolean
}

export default function ReferencePanel({ chapterId, passed }: Props) {
  const [data, setData] = useState<ReferenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setQuery('')
    api
      .getReference(chapterId)
      .then((d) => { if (active) setData(d) })
      .catch((err: Error) => { if (active) setError(err?.message || 'Nachschlagewerk konnte nicht geladen werden.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chapterId])

  const filtered = useMemo(() => {
    const entries = data?.entries || []
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      (e) =>
        String(e.term || '').toLowerCase().includes(q) ||
        String(e.definition || '').toLowerCase().includes(q),
    )
  }, [data, query])

  if (loading) {
    return (
      <div className={styles.panel}>
        <Loader2 size={18} className="spin" /> Lade Nachschlagewerk…
      </div>
    )
  }

  if (error) {
    return <div className={styles.panel}>{error}</div>
  }

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Nachschlagewerk: {data?.title}</h1>
      <p className={styles.intro}>
        Alle Kernbegriffe des Kapitels zum schnellen Nachschlagen.
      </p>

      <div className={`${styles.unlockBanner} ${passed ? styles.unlockOfficial : styles.unlockOpen}`}>
        {passed ? <CheckCircle2 size={16} /> : <Unlock size={16} />}
        {passed
          ? 'Freigeschaltet – du hast den Wissenstest dieses Kapitels bestanden.'
          : 'Frei zugänglich. Nach bestandenem Test wird es zusätzlich als "abgeschlossen" markiert.'}
      </div>

      <div style={{ position: 'relative' }}>
        <Search
          size={16}
          style={{ position: 'absolute', left: 12, top: 13, color: 'var(--text-muted)' }}
        />
        <input
          className={styles.search}
          style={{ paddingLeft: 36 }}
          placeholder="Begriff suchen…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>Keine passenden Begriffe gefunden.</div>
      ) : (
        <div className={styles.entries}>
          {filtered.map((entry, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.term}>{entry.term}</div>
              <div className={styles.definition}>{entry.definition}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
