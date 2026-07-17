import { useState } from 'react'
import {
  CheckCircle2, ChevronLeft, ChevronRight,
  ClipboardCheck, Library, MousePointerClick,
} from 'lucide-react'
import styles from './ChapterFrame.module.css'
import { ChapterCtx } from './chapterContext'

export interface ChapterLesson {
  title: string
  /** JSX content of the lesson – use Blocks components or any custom JSX */
  content: React.ReactNode
  /**
   * Keys of interactive blocks (QuizCheck / TaskInput / Simulation) that
   * must be completed before the learner can advance to the next lesson.
   * If omitted, the "Next" button is always enabled.
   */
  requiredKeys?: string[]
  /**
   * Use 'wide' to remove the max-width constraint (e.g. for lab layouts).
   * Default: 'normal' (max-width: 760px readable column)
   */
  layout?: 'normal' | 'wide'
}

interface Props {
  lessons: ChapterLesson[]
  onStartTest: () => void
  onOpenReference: () => void
}

/**
 * ChapterFrame – navigation shell for chapter learn panels.
 *
 * Provides progress bar, dot navigation, lesson title and a bottom nav bar.
 * It also provides the ChapterCtx so interactive blocks (QuizCheck etc.) can
 * track their completion state automatically.
 *
 * Chapters are free to NOT use this component and render their own layout.
 */
export default function ChapterFrame({ lessons, onStartTest, onOpenReference }: Props) {
  const [lessonIdx, setLessonIdx] = useState(0)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  const markDone = (key: string) =>
    setCompleted(prev => prev[key] ? prev : { ...prev, [key]: true })
  const done = (key: string) => !!completed[key]

  const lesson = lessons[lessonIdx]
  const isFirst = lessonIdx === 0
  const isLast = lessonIdx === lessons.length - 1
  const progress = lessons.length > 1 ? ((lessonIdx + 1) / lessons.length) * 100 : 100
  const requiredKeys = lesson?.requiredKeys ?? []
  const allChecksDone = requiredKeys.every(k => done(k))
  const cleanTitle = (t = '') => t.replace(/^\d+\.\s*/, '')

  return (
    <ChapterCtx.Provider value={{ done, markDone }}>
      <div className={styles.panel}>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>

        {/* Dot navigation */}
        <div className={styles.dotRow}>
          <span className={styles.dotLabel}>Lektion {lessonIdx + 1} von {lessons.length}</span>
          <div className={styles.dotNav}>
            {lessons.map((l, i) => (
              <button
                key={i}
                className={
                  i === lessonIdx ? `${styles.dot} ${styles.dotActive}`
                  : i < lessonIdx ? `${styles.dot} ${styles.dotDone}`
                  : styles.dot
                }
                onClick={() => setLessonIdx(i)}
                title={l.title}
                aria-label={l.title}
              >
                {i < lessonIdx && <CheckCircle2 size={9} />}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson content */}
        {lesson && (
          <section className={styles.lesson}>
            <h2 className={styles.lessonTitle}>
              <span className={styles.lessonNum}>{lessonIdx + 1}</span>
              {cleanTitle(lesson.title)}
            </h2>
            <div className={lesson.layout === 'wide' ? undefined : styles.lessonBody}>
              {lesson.content}
            </div>
          </section>
        )}

        {/* Nav bar */}
        <div className={styles.navBar}>
          <button
            type="button"
            className={styles.navBack}
            disabled={isFirst}
            onClick={() => setLessonIdx(p => p - 1)}
          >
            <ChevronLeft size={16} /> Zurück
          </button>

          <button type="button" className={styles.navRef} onClick={onOpenReference}>
            <Library size={14} /> Nachschlagewerk
          </button>

          {!allChecksDone && (
            <span className={styles.gateHint}>
              <MousePointerClick size={13} /> Löse die Aufgabe, um fortzufahren
            </span>
          )}

          {!isLast ? (
            <button
              type="button"
              className={styles.navNext}
              disabled={!allChecksDone}
              onClick={() => setLessonIdx(p => p + 1)}
            >
              Weiter <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className={styles.navTest}
              disabled={!allChecksDone}
              onClick={onStartTest}
            >
              <ClipboardCheck size={16} /> Wissen testen
            </button>
          )}
        </div>
      </div>
    </ChapterCtx.Provider>
  )
}
