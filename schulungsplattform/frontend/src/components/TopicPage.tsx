import { BookOpen, ClipboardCheck, Library, ArrowRight, CheckCircle2, Clock, Award } from 'lucide-react'
import styles from './TopicPage.module.css'
import type { Topic } from '../types'

interface Props {
  topic: Topic
  onSelectChapter: (id: string) => void
}

export default function TopicPage({ topic, onSelectChapter }: Props) {
  if (!topic) return null
  const accent = topic.accentColor || '#1c69d4'
  const subs   = topic.subTopics || []

  return (
    <div className={styles.root}>
      {/* ── Topic-Hero ── */}
      <header className={styles.hero} style={{ '--topic-accent': accent } as React.CSSProperties}>
        <div className={styles.heroInner}>
          <div className={styles.heroIcon}>{topic.icon || '📚'}</div>
          <div>
            <h1 className={styles.heroTitle}>{topic.title}</h1>
            {topic.description && (
              <p className={styles.heroSub}>{topic.description}</p>
            )}
            <div className={styles.heroMeta}>
              <span>{subs.length} {subs.length === 1 ? 'Kapitel' : 'Kapitel'}</span>
              {(topic.totalMinutes ?? 0) > 0 && <span>· ca. {topic.totalMinutes} min</span>}
              {topic.allPassed && (
                <span className={styles.heroBadge}>
                  <Award size={13} /> Thema abgeschlossen
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Kapitel ── */}
      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionAccent} style={{ background: accent }} />
          <div>
            <h2 className={styles.sectionTitle}>Kapitel</h2>
            <p className={styles.sectionSub}>
              Wähle ein Kapitel, um mit dem Lernen zu beginnen.
              Jedes Kapitel enthält Lektionen, ein Quiz und ein Nachschlagewerk.
            </p>
          </div>
        </div>

        <div className={styles.subTopicList}>
          {subs.map((sub, i) => (
            <button
              key={sub.id}
              className={styles.card}
              onClick={() => onSelectChapter(sub.id)}
              style={{ '--card-accent': accent } as React.CSSProperties}
            >
              {/* Linke Nummerierung */}
              <div className={styles.cardNum} style={{ background: sub.passed ? '#dcfce7' : `color-mix(in srgb, ${accent} 12%, white 88%)`, color: sub.passed ? '#166534' : accent }}>
                {sub.passed ? <CheckCircle2 size={16} /> : <span>{i + 1}</span>}
              </div>

              {/* Inhalt */}
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{sub.title}</span>
                  {sub.tag && (
                    <span className={`${styles.cardTag} ${sub.tag.toLowerCase() === 'allgemein' ? styles.cardTagGeneral : styles.cardTagBMW}`}>
                      {sub.tag}
                    </span>
                  )}
                  {sub.passed && (
                    <span className={styles.cardBadge}>
                      <CheckCircle2 size={11} /> Abgeschlossen
                    </span>
                  )}
                  {!sub.passed && (sub.bestScorePercent ?? 0) > 0 && (
                    <span className={styles.cardBadgePartial}>
                      Bestes Ergebnis: {sub.bestScorePercent}%
                    </span>
                  )}
                </div>

                {sub.description && (
                  <p className={styles.cardDesc}>{sub.description}</p>
                )}

                {/* Drei Schritte als Chips */}
                <div className={styles.cardSteps}>
                  <span className={styles.cardStep}>
                    <BookOpen size={11} />
                    {sub.lessonCount} Lektionen
                  </span>
                  <span className={styles.cardStepDot}>·</span>
                  <span className={styles.cardStep}>
                    <ClipboardCheck size={11} />
                    {sub.questionCount} Quizfragen
                  </span>
                  <span className={styles.cardStepDot}>·</span>
                  <span className={styles.cardStep}>
                    <Library size={11} />
                    {sub.referenceCount} Einträge
                  </span>
                  {sub.estimatedMinutes != null && (
                    <>
                      <span className={styles.cardStepDot}>·</span>
                      <span className={styles.cardStep}>
                        <Clock size={11} />
                        {sub.estimatedMinutes} min
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Pfeil */}
              <div className={styles.cardAction} style={{ color: accent }}>
                <span className={styles.cardActionLabel}>
                  {sub.passed ? 'Wiederholen' : 'Starten'}
                </span>
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
