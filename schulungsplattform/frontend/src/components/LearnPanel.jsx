import { useEffect, useState } from 'react'
import {
  Clock, BookOpen, Info, Lightbulb, AlertTriangle,
  ClipboardCheck, Library, Loader2, ChevronLeft, ChevronRight, CheckCircle2,
} from 'lucide-react'
import styles from './LearnPanel.module.css'
import { api } from '../api'

// ── Block-Renderer ────────────────────────────────────────────────────────────

function BlockText({ block }) {
  return <p className={styles.blockText}>{block.text}</p>
}

function BlockList({ block }) {
  return (
    <div className={styles.blockListWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <ul className={styles.blockList}>
        {(block.items || []).map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

function BlockCallout({ block }) {
  const tone = block.tone || 'info'
  const cls = tone === 'tip' ? styles.calloutTip : tone === 'warn' ? styles.calloutWarn : styles.calloutInfo
  const Icon = tone === 'tip' ? Lightbulb : tone === 'warn' ? AlertTriangle : Info
  return (
    <div className={`${styles.callout} ${cls}`}>
      {block.title && (
        <div className={styles.calloutTitle}><Icon size={15} />{block.title}</div>
      )}
      <div className={styles.calloutText}>{block.text}</div>
    </div>
  )
}

function BlockCode({ block }) {
  return (
    <div className={styles.codeWrap}>
      {block.caption && <div className={styles.codeCaption}>{block.caption}</div>}
      <pre className={styles.code}><code>{block.text}</code></pre>
    </div>
  )
}

/** Zwei-Spalten-Vergleich: links vs. rechts */
function BlockComparison({ block }) {
  return (
    <div className={styles.comparison}>
      <div className={styles.compSide} style={{ '--comp-color': block.left?.color || '#6b7280' }}>
        <div className={styles.compLabel}>{block.left?.label}</div>
        <ul className={styles.compList}>
          {(block.left?.items || []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className={styles.compVs}>VS</div>
      <div className={styles.compSide} style={{ '--comp-color': block.right?.color || '#1c69d4' }}>
        <div className={styles.compLabel}>{block.right?.label}</div>
        <ul className={styles.compList}>
          {(block.right?.items || []).map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

/** Karten-Raster: icon + label + description */
function BlockCards({ block }) {
  return (
    <div className={styles.cardsWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <div className={styles.cardGrid}>
        {(block.items || []).map((card, i) => (
          <div key={i} className={styles.card} style={{ '--card-color': card.color || 'var(--primary)' }}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardLabel}>{card.label}</div>
            <div className={styles.cardDesc}>{card.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Visueller Ablauf: Nodes mit Pfeilen + optionaler Schleife */
function BlockDiagram({ block }) {
  const nodes = block.nodes || []
  return (
    <div className={styles.diagramWrap}>
      {block.caption && <div className={styles.diagramCaption}>{block.caption}</div>}

      <div className={styles.diagramFlow}>
        {nodes.map((node, i) => (
          <div key={node.id} className={styles.diagramEntry}>
            <div className={`${styles.diagramNode} ${styles[`diagramNode_${node.type || 'step'}`]}`}>
              {node.emoji && <span className={styles.diagramEmoji}>{node.emoji}</span>}
              <span className={styles.diagramNodeLabel}>{node.label}</span>
              {node.sublabel && <span className={styles.diagramNodeSub}>{node.sublabel}</span>}
            </div>
            {i < nodes.length - 1 && (
              <div className={styles.diagramArrow}>
                <ChevronRight size={18} />
              </div>
            )}
          </div>
        ))}
      </div>

      {block.loop && (
        <div className={styles.diagramLoopBox}>
          <span className={styles.diagramLoopIcon}>↩</span>
          <span>{block.loop.label}</span>
        </div>
      )}

      {block.note && (
        <div className={styles.diagramNote}>{block.note}</div>
      )}
    </div>
  )
}

/** Nummerierte Schritt-Liste mit Beschreibungen */
function BlockSteps({ block }) {
  return (
    <div className={styles.stepsWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <div className={styles.stepsList}>
        {(block.items || []).map((step, i) => (
          <div key={i} className={styles.stepItem}>
            <div className={styles.stepBadge}>{i + 1}</div>
            <div className={styles.stepBody}>
              <div className={styles.stepLabel}>{step.label}</div>
              {step.description && <div className={styles.stepDesc}>{step.description}</div>}
              {step.example && (
                <div className={styles.stepExample}>
                  <span className={styles.stepExampleLabel}>Beispiel: </span>
                  {step.example}
                </div>
              )}
            </div>
            {i < (block.items?.length ?? 0) - 1 && (
              <div className={styles.stepConnector} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ContentBlock({ block }) {
  if (!block || typeof block !== 'object') return null
  switch (block.type) {
    case 'text':       return <BlockText block={block} />
    case 'list':       return <BlockList block={block} />
    case 'callout':    return <BlockCallout block={block} />
    case 'code':       return <BlockCode block={block} />
    case 'comparison': return <BlockComparison block={block} />
    case 'cards':      return <BlockCards block={block} />
    case 'diagram':    return <BlockDiagram block={block} />
    case 'steps':      return <BlockSteps block={block} />
    default:           return null
  }
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

export default function LearnPanel({ chapterId, onStartTest, onOpenReference }) {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setLessonIdx(0)
    api.getLearn(chapterId)
      .then((d) => { if (active) setData(d) })
      .catch((err) => { if (active) setError(err?.message || 'Lerninhalt konnte nicht geladen werden.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chapterId])

  if (loading) {
    return (
      <div className={`${styles.panel} ${styles.centered}`}>
        <Loader2 size={20} className={styles.spin} />
        <span>Lade Lerninhalt…</span>
      </div>
    )
  }
  if (error) return <div className={`${styles.panel} ${styles.errorBox}`}>{error}</div>
  if (!data)  return null

  const lessons  = data.lessons || []
  const lesson   = lessons[lessonIdx] || null
  const isFirst  = lessonIdx === 0
  const isLast   = lessonIdx === lessons.length - 1
  const progress = lessons.length > 1 ? ((lessonIdx + 1) / lessons.length) * 100 : 100

  // Führende Nummerierung aus Lektionstitel entfernen (wir zeigen sie selbst)
  const cleanTitle = (t = '') => t.replace(/^\d+\.\s*/, '')

  return (
    <div className={styles.panel}>

      {/* ── Kapitel-Header (nur auf erster Lektion) ─────────────────────── */}
      {lessonIdx === 0 && (
        <div className={styles.chapterHeader}>
          <h1 className={styles.chapterTitle}>{data.title}</h1>
          <div className={styles.chapterMeta}>
            {data.estimatedMinutes != null && (
              <span><Clock size={13} /> ca. {data.estimatedMinutes} Min.</span>
            )}
            <span><BookOpen size={13} /> {lessons.length} Lektionen</span>
          </div>
          {data.summary && <div className={styles.chapterSummary}>{data.summary}</div>}
        </div>
      )}

      {/* ── Fortschrittsleiste ──────────────────────────────────────────── */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* ── Lektion-Navigation (Dots) ────────────────────────────────────── */}
      <div className={styles.dotRow}>
        <span className={styles.dotLabel}>Lektion {lessonIdx + 1} von {lessons.length}</span>
        <div className={styles.dotNav}>
          {lessons.map((l, i) => (
            <button
              key={l.id}
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

      {/* ── Lektions-Inhalt ──────────────────────────────────────────────── */}
      {lesson && (
        <section className={styles.lesson}>
          <h2 className={styles.lessonTitle}>
            <span className={styles.lessonNum}>{lessonIdx + 1}</span>
            {cleanTitle(lesson.title)}
          </h2>
          {(lesson.blocks || []).map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </section>
      )}

      {/* ── Navigations-Leiste ──────────────────────────────────────────── */}
      <div className={styles.navBar}>
        <button
          type="button"
          className={styles.navBack}
          disabled={isFirst}
          onClick={() => setLessonIdx((p) => p - 1)}
        >
          <ChevronLeft size={16} />
          Zurück
        </button>

        <button
          type="button"
          className={styles.navRef}
          onClick={onOpenReference}
        >
          <Library size={14} />
          Nachschlagewerk
        </button>

        {!isLast ? (
          <button
            type="button"
            className={styles.navNext}
            onClick={() => setLessonIdx((p) => p + 1)}
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.navTest}
            onClick={onStartTest}
          >
            <ClipboardCheck size={16} />
            Wissen testen
          </button>
        )}
      </div>
    </div>
  )
}
