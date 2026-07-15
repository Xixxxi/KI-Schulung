import { BookOpen, ClipboardCheck, Library, ArrowRight, CheckCircle2, Clock, ChevronRight, Layers } from 'lucide-react'
import styles from './LandingPage.module.css'

const SCHRITTE = [
  { icon: BookOpen,       label: 'Lernen',       hint: 'Strukturierter Lerninhalt in Lektionen' },
  { icon: ClipboardCheck, label: 'Testen',        hint: 'Interaktives Quiz mit intelligentem Feedback' },
  { icon: Library,        label: 'Nachschlagen',  hint: 'Begriffe & Definitionen jederzeit abrufbar' },
]

export default function LandingPage({ topics = [], onSelectTopic }) {
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
          <h1 className={styles.heroTitle}>KI-Schulung</h1>
          <p className={styles.heroSub}>
            Lerne Schritt für Schritt, teste dein Wissen und schlage Begriffe nach —
            wähle ein Thema aus, um zu starten.
          </p>
        </div>
      </header>

      <div className={styles.content}>
        {/* ── Ablauf-Erklärung ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} style={{ background: '#1c69d4' }} />
            <div>
              <h2 className={styles.sectionTitle}>So funktioniert die Plattform</h2>
              <p className={styles.sectionSub}>Jedes Kapitel besteht aus drei aufeinander aufbauenden Schritten</p>
            </div>
          </div>

          <div className={styles.stepsRow}>
            {SCHRITTE.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.label} className={styles.stepCard}>
                  <div className={styles.stepNum}>{i + 1}</div>
                  <div className={styles.stepIconWrap}>
                    <Icon size={20} style={{ color: '#1c69d4' }} />
                  </div>
                  <div className={styles.stepCardLabel}>{s.label}</div>
                  <div className={styles.stepCardHint}>{s.hint}</div>
                  {i < SCHRITTE.length - 1 && (
                    <ChevronRight size={16} className={styles.stepArrow} />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Themen-Übersicht ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} style={{ background: '#1c69d4' }} />
            <div>
              <h2 className={styles.sectionTitle}>Verfügbare Themen</h2>
              <p className={styles.sectionSub}>
                {topics.length === 0
                  ? 'Noch keine Themen vorhanden.'
                  : `${topics.length} ${topics.length === 1 ? 'Thema' : 'Themen'} · ${totalSubTopics} ${totalSubTopics === 1 ? 'Kapitel' : 'Kapitel'} insgesamt`}
              </p>
            </div>
          </div>

          <div className={styles.tileGrid}>
            {topics.map((topic) => {
              const accent = topic.accentColor || '#1c69d4'
              const allDone = topic.allPassed
              const someProgress = topic.passedCount > 0 && !allDone

              return (
                <button
                  key={topic.id}
                  className={styles.tile}
                  onClick={() => onSelectTopic(topic.id)}
                  style={{ '--tile-accent': accent }}
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
                      {topic.subTopicCount} {topic.subTopicCount === 1 ? 'Kapitel' : 'Kapitel'}
                    </li>
                    {topic.totalMinutes > 0 && (
                      <li className={styles.tileMetaItem}>
                        <Clock size={12} className={styles.tileMetaIcon} />
                        ca. {topic.totalMinutes} min
                      </li>
                    )}
                  </ul>

                  {/* Fortschrittsbalken wenn teilweise erledigt */}
                  {topic.subTopicCount > 0 && (
                    <div className={styles.tileProgressBar}>
                      <div
                        className={styles.tileProgressFill}
                        style={{
                          width: `${(topic.passedCount / topic.subTopicCount) * 100}%`,
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
