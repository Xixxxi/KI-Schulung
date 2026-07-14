import { CheckCircle2 } from 'lucide-react'
import styles from './SubTopicSidebar.module.css'

export default function SubTopicSidebar({
  topic,           // { title, icon, accentColor, subTopics: [] }
  activeChapterId,
  passedChapters,  // { [id]: true }
  onSelectChapter,
  onSelectStep,    // beim Kapitelwechsel auf 'learn' zurücksetzen
}) {
  if (!topic) return null

  const subs      = topic.subTopics || []
  const accent    = topic.accentColor || '#1c69d4'
  const doneCount = subs.filter((s) => passedChapters[s.id] || s.passed).length
  const activeIdx = subs.findIndex((s) => s.id === activeChapterId)

  return (
    <aside className={styles.sidebar}>
      {/* ── Thema-Header ── */}
      <div className={styles.topicHeader}>
        <span className={styles.topicIcon}>{topic.icon || '📚'}</span>
        <div className={styles.topicMeta}>
          <span className={styles.topicLabel}>Thema</span>
          <span className={styles.topicTitle}>{topic.title}</span>
        </div>
      </div>

      {/* ── Fortschritts-Zusammenfassung ── */}
      <div className={styles.progressSummary}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: subs.length ? `${(doneCount / subs.length) * 100}%` : '0%',
              background: accent,
            }}
          />
        </div>
        <span className={styles.progressLabel}>
          {doneCount} von {subs.length} Unterthemen abgeschlossen
        </span>
      </div>

      {/* ── Unterthemen-Liste ── */}
      <nav className={styles.subList} aria-label="Unterthemen">
        {subs.map((sub, i) => {
          const isActive = sub.id === activeChapterId
          const isPassed = passedChapters[sub.id] || sub.passed
          const isBefore = i < activeIdx

          return (
            <div key={sub.id} className={styles.subEntry}>
              {/* Verbindungslinie */}
              {i < subs.length - 1 && (
                <div
                  className={styles.connector}
                  style={{ background: (isPassed || isBefore) ? accent : undefined }}
                />
              )}

              <button
                className={`${styles.subBtn} ${isActive ? styles.subBtnActive : ''}`}
                style={isActive ? { '--accent': accent } : {}}
                onClick={() => {
                  onSelectChapter(sub.id)
                  onSelectStep('learn')
                }}
                title={sub.title}
              >
                {/* Status-Kreis */}
                <span
                  className={`${styles.subStatus} ${
                    isPassed
                      ? styles.subStatusDone
                      : isActive
                      ? styles.subStatusActive
                      : styles.subStatusPending
                  }`}
                  style={
                    isPassed
                      ? { background: accent, borderColor: accent }
                      : isActive
                      ? { borderColor: accent }
                      : {}
                  }
                >
                  {isPassed
                    ? <CheckCircle2 size={12} />
                    : <span className={styles.subNum}>{i + 1}</span>
                  }
                </span>

                {/* Titel + Status-Label */}
                <div className={styles.subContent}>
                  <span className={styles.subTitle}>{sub.title}</span>
                  {isPassed && (
                    <span className={styles.subDoneLabel}>Abgeschlossen</span>
                  )}
                  {isActive && !isPassed && (
                    <span className={styles.subActiveLabel} style={{ color: accent }}>
                      In Bearbeitung
                    </span>
                  )}
                </div>
              </button>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
