import { useEffect, useMemo, useState } from 'react'
import { Search, Loader2, AlertTriangle, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import styles from './GlossaryPage.module.css'
import { getAllReferences } from '../content/registry'
import type { GlobalReferenceData, GlobalReferenceTopic } from '../types'

export default function GlossaryPage() {
  const [data, setData] = useState<GlobalReferenceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setLoading(true)
    setError('')
    setData(getAllReferences())
    setLoading(false)
  }, [])

  const filtered = useMemo((): GlobalReferenceTopic[] => {
    if (!data) return []
    const q = query.trim().toLowerCase()
    if (!q) return data.topics

    return data.topics
      .map((topic) => ({
        ...topic,
        chapters: topic.chapters
          .map((ch) => ({
            ...ch,
            entries: ch.entries.filter(
              (e) =>
                e.term.toLowerCase().includes(q) ||
                e.definition.toLowerCase().includes(q),
            ),
          }))
          .filter((ch) => ch.entries.length > 0),
      }))
      .filter((topic) => topic.chapters.length > 0)
  }, [data, query])

  const totalTerms = useMemo(
    () => filtered.reduce((n, t) => n + t.chapters.reduce((m, c) => m + c.entries.length, 0), 0),
    [filtered],
  )

  const toggleTopic = (topicId: string) =>
    setCollapsed((prev) => ({ ...prev, [topicId]: !prev[topicId] }))

  return (
    <div className={styles.root}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <div className={styles.heroEyebrowLine} />
            <span className={styles.heroEyebrowText}>Zentrale Referenz</span>
          </div>
          <h1 className={styles.heroTitle}>Nachschlagewerk</h1>
          <p className={styles.heroSub}>
            Alle Begriffe und Definitionen aus allen Kapiteln — an einem Ort.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* ── Suche ── */}
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.search}
            placeholder="Begriff oder Definition suchen…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <span className={styles.searchCount}>
              {totalTerms} {totalTerms === 1 ? 'Treffer' : 'Treffer'}
            </span>
          )}
        </div>

        {/* ── Status ── */}
        {loading && (
          <div className={styles.status}>
            <Loader2 size={18} className={styles.spin} /> Lade Nachschlagewerk…
          </div>
        )}
        {error && (
          <div className={`${styles.status} ${styles.statusError}`}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {/* ── Keine Treffer ── */}
        {!loading && !error && filtered.length === 0 && (
          <div className={styles.empty}>
            <BookOpen size={32} className={styles.emptyIcon} />
            <p>Keine passenden Begriffe gefunden.</p>
          </div>
        )}

        {/* ── Einträge nach Topic ── */}
        {!loading && !error && filtered.map((topic) => {
          const isOpen = !collapsed[topic.topicId]
          return (
            <section key={topic.topicId} className={styles.topicSection}>
              <button
                className={styles.topicHeader}
                style={{ '--topic-accent': topic.topicAccentColor } as React.CSSProperties}
                onClick={() => toggleTopic(topic.topicId)}
                type="button"
              >
                <div className={styles.topicHeaderLeft}>
                  <span
                    className={styles.topicIconWrap}
                    style={{ background: `color-mix(in srgb, ${topic.topicAccentColor} 14%, transparent 86%)` }}
                  >
                    {topic.topicIcon}
                  </span>
                  <div>
                    <div className={styles.topicTitle}>{topic.topicTitle}</div>
                    <div className={styles.topicMeta}>
                      {topic.chapters.length} {topic.chapters.length === 1 ? 'Kapitel' : 'Kapitel'} ·{' '}
                      {topic.chapters.reduce((n, c) => n + c.entries.length, 0)} Begriffe
                    </div>
                  </div>
                </div>
                {isOpen ? <ChevronDown size={16} className={styles.chevron} /> : <ChevronRight size={16} className={styles.chevron} />}
              </button>

              {isOpen && (
                <div className={styles.topicBody}>
                  {topic.chapters.map((chapter) => (
                    <div key={chapter.chapterId} className={styles.chapterGroup}>
                      <div
                        className={styles.chapterLabel}
                        style={{ borderColor: topic.topicAccentColor, color: topic.topicAccentColor }}
                      >
                        {chapter.chapterTitle}
                      </div>
                      <div className={styles.entries}>
                        {chapter.entries.map((entry, i) => (
                          <div key={i} className={styles.entry}>
                            <div className={styles.term}>{entry.term}</div>
                            <div className={styles.definition}>{entry.definition}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
