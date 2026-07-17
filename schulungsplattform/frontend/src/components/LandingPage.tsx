import { ArrowRight, CheckCircle2, Clock, Layers } from 'lucide-react'
import styles from './LandingPage.module.css'
import type { Topic } from '../types'

interface Props {
  topics: Topic[]
  onSelectTopic: (id: string) => void
}

export default function LandingPage({ topics = [], onSelectTopic }: Props) {
  const totalSubTopics = topics.reduce((n, t) => n + (t.subTopicCount || 0), 0)

  return (
    <div className={styles.root}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <div className={styles.heroEyebrowLine} />
            <span className={styles.heroEyebrowText}>Digital Learning Platform</span>
          </div>
          <h1 className={styles.heroTitle}>KI @ ES</h1>
          <p className={styles.heroSub}>
            Lerne Schritt für Schritt, teste dein Wissen und schlage Begriffe nach —
            wähle ein Thema aus, um zu starten.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* ── Themen-Übersicht ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} style={{ background: '#1c69d4' }} />
            <div>
              <h2 className={styles.sectionTitle}>Verfügbare Themen</h2>
              <p className={styles.sectionSub}>
                {topics.length === 0
                  ? 'Noch keine Themen vorhanden.'
                  : `${topics.length} ${topics.length === 1 ? 'Thema' : 'Themen'} · ${totalSubTopics} Kapitel insgesamt`}
              </p>
            </div>
          </div>

          <div className={styles.tileGrid}>
            {topics.map((topic) => {
              const accent = topic.accentColor || '#1c69d4'
              const allDone = topic.allPassed
              const someProgress = (topic.passedCount ?? 0) > 0 && !allDone

              return (
                <button
                  key={topic.id}
                  className={styles.tile}
                  onClick={() => onSelectTopic(topic.id)}
                  style={{ '--tile-accent': accent } as React.CSSProperties}
                >
                  <div className={styles.tileTop}>
                    <div
                      className={styles.tileIconWrap}
                      style={{ background: `color-mix(in srgb, ${accent} 12%, transparent 88%)` }}
                    >
                      <span className={styles.tileEmoji}>{topic.icon || '📚'}</span>
                    </div>
                    <div className={styles.tileTopRight}>
                      {allDone && (
                        <span className={styles.badgeDone}>
                          <CheckCircle2 size={12} /> Abgeschlossen
                        </span>
                      )}
                      {someProgress && (
                        <span className={styles.badgeProgress}>
                          {topic.passedCount}/{topic.subTopicCount} fertig
                        </span>
                      )}
                      <ArrowRight size={14} className={styles.tileArrow} />
                    </div>
                  </div>

                  <div className={styles.tileLabel}>{topic.title}</div>
                  <div className={styles.tileTagline} style={{ color: accent }}>
                    {allDone ? 'Abgeschlossen · Wiederholen' : 'Thema öffnen'}
                  </div>

                  {topic.description && (
                    <p className={styles.tileDesc}>{topic.description}</p>
                  )}

                  <ul className={styles.tileMeta}>
                    <li className={styles.tileMetaItem}>
                      <Layers size={12} className={styles.tileMetaIcon} />
                      {topic.subTopicCount} Kapitel
                    </li>
                    {(topic.totalMinutes ?? 0) > 0 && (
                      <li className={styles.tileMetaItem}>
                        <Clock size={12} className={styles.tileMetaIcon} />
                        ca. {topic.totalMinutes} min
                      </li>
                    )}
                  </ul>

                  {/* Fortschrittsbalken */}
                  {(topic.subTopicCount ?? 0) > 0 && (
                    <div className={styles.tileProgressBar}>
                      <div
                        className={styles.tileProgressFill}
                        style={{
                          width: `${((topic.passedCount ?? 0) / (topic.subTopicCount ?? 1)) * 100}%`,
                          background: accent,
                        }}
                      />
                    </div>
                  )}

                  <div
                    className={styles.tileFooter}
                    style={{ borderColor: `color-mix(in srgb, ${accent} 25%, var(--border) 75%)` }}
                  >
                    <span style={{ color: accent }}>
                      {allDone ? 'Erneut öffnen' : 'Thema starten'}
                    </span>
                    <ArrowRight size={13} style={{ color: accent }} />
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
