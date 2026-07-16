import { useEffect, useRef, useState } from 'react'
import {
  Clock, BookOpen, Info, Lightbulb, AlertTriangle,
  ClipboardCheck, Library, Loader2, ChevronLeft, ChevronRight, CheckCircle2,
  MousePointerClick, Terminal as TerminalIcon, PenLine, Sparkles, XCircle, CornerDownLeft,
} from 'lucide-react'
import styles from './LearnPanel.module.css'
import { api } from '../api'
import type { LearnData, Block, Lesson } from '../types'

// Use a permissive alias for block data coming from JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlock = Record<string, any>

// ── Statische Block-Renderer ─────────────────────────────────────────────────

function BlockText({ block }: { block: AnyBlock }) {
  return <p className={styles.blockText}>{block.text}</p>
}

function BlockList({ block }: { block: AnyBlock }) {
  return (
    <div className={styles.blockListWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <ul className={styles.blockList}>
        {(block.items || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

function BlockCallout({ block }: { block: AnyBlock }) {
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

function BlockCode({ block }: { block: AnyBlock }) {
  return (
    <div className={styles.codeWrap}>
      {block.caption && <div className={styles.codeCaption}>{block.caption}</div>}
      <pre className={styles.code}><code>{block.text}</code></pre>
    </div>
  )
}

function BlockComparison({ block }: { block: AnyBlock }) {
  return (
    <div className={styles.comparison}>
      <div className={styles.compSide} style={{ '--comp-color': block.left?.color || '#6b7280' } as React.CSSProperties}>
        <div className={styles.compLabel}>{block.left?.label}</div>
        <ul className={styles.compList}>
          {(block.left?.items || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className={styles.compVs}>VS</div>
      <div className={styles.compSide} style={{ '--comp-color': block.right?.color || '#1c69d4' } as React.CSSProperties}>
        <div className={styles.compLabel}>{block.right?.label}</div>
        <ul className={styles.compList}>
          {(block.right?.items || []).map((item: string, i: number) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

function BlockCards({ block }: { block: AnyBlock }) {
  return (
    <div className={styles.cardsWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <div className={styles.cardGrid}>
        {(block.items || []).map((card: AnyBlock, i: number) => (
          <div key={i} className={styles.card} style={{ '--card-color': card.color || 'var(--primary)' } as React.CSSProperties}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <div className={styles.cardLabel}>{card.label}</div>
            <div className={styles.cardDesc}>{card.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BlockDiagram({ block }: { block: AnyBlock }) {
  const nodes: AnyBlock[] = block.nodes || []
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

function BlockSteps({ block }: { block: AnyBlock }) {
  const items: AnyBlock[] = block.items || []
  return (
    <div className={styles.stepsWrap}>
      {block.title && <div className={styles.blockListTitle}>{block.title}</div>}
      <div className={styles.stepsList}>
        {items.map((step, i) => (
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
            {i < items.length - 1 && (
              <div className={styles.stepConnector} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Interaktive Block-Renderer ───────────────────────────────────────────────

interface InteractiveProps {
  block: AnyBlock
  done: boolean
  onDone: () => void
}

function BlockQuizCheck({ block, done, onDone }: InteractiveProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const isCorrect = revealed && selected === block.correct

  function submit() {
    if (selected == null) return
    setRevealed(true)
    if (selected === block.correct) onDone()
  }

  return (
    <div className={`${styles.checkBox} ${done ? styles.checkBoxDone : ''}`}>
      <div className={styles.checkHead}>
        <MousePointerClick size={15} />
        <span>{block.title || 'Kurzer Check'}</span>
        {done && <span className={styles.checkDoneTag}><CheckCircle2 size={12} /> gelöst</span>}
      </div>
      <div className={styles.checkQuestion}>{block.question}</div>
      <div className={styles.checkOptions}>
        {(block.options || []).map((opt: string, i: number) => {
          const chosen = selected === i
          let cls = styles.checkOption
          if (revealed && i === block.correct) cls = `${styles.checkOption} ${styles.checkOptionCorrect}`
          else if (revealed && chosen && i !== block.correct) cls = `${styles.checkOption} ${styles.checkOptionWrong}`
          else if (chosen) cls = `${styles.checkOption} ${styles.checkOptionChosen}`
          return (
            <button
              key={i}
              type="button"
              className={cls}
              disabled={done}
              onClick={() => { if (!done) { setSelected(i); setRevealed(false) } }}
            >
              <span className={styles.checkRadio}>{chosen ? '●' : '○'}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {!done && (
        <button type="button" className={styles.checkSubmit} onClick={submit} disabled={selected == null}>
          Antwort prüfen
        </button>
      )}
      {revealed && (
        <div className={`${styles.checkFeedback} ${isCorrect ? styles.checkFeedbackOk : styles.checkFeedbackNo}`}>
          {isCorrect
            ? <><CheckCircle2 size={14} /> Richtig! {block.explanation}</>
            : <><XCircle size={14} /> Noch nicht ganz – versuch es erneut. {block.hint || ''}</>}
        </div>
      )}
    </div>
  )
}

function BlockTaskInput({ block, done, onDone }: InteractiveProps) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  function validate() {
    const text = value.trim().toLowerCase()
    const longEnough = text.length >= (block.minLength || 12)
    const keywords: string[] = (block.keywords || []).map((k: string) => k.toLowerCase())
    const minKw: number = block.minKeywords ?? (keywords.length ? 1 : 0)
    const hits = keywords.filter((k) => text.includes(k)).length
    return longEnough && hits >= minKw
  }

  function submit() {
    const valid = validate()
    setOk(valid)
    setChecked(true)
    if (valid) onDone()
  }

  return (
    <div className={`${styles.taskBox} ${done ? styles.checkBoxDone : ''}`}>
      <div className={styles.checkHead}>
        <PenLine size={15} />
        <span>{block.title || 'Selbst anwenden'}</span>
        {done && <span className={styles.checkDoneTag}><CheckCircle2 size={12} /> erledigt</span>}
      </div>
      <div className={styles.checkQuestion}>{block.prompt}</div>
      <textarea
        className={styles.taskInput}
        rows={block.rows || 3}
        placeholder={block.placeholder || 'Deine Antwort…'}
        value={value}
        onChange={(e) => { setValue(e.target.value); setChecked(false) }}
        disabled={done}
      />
      {!done && (
        <button type="button" className={styles.checkSubmit} onClick={submit} disabled={!value.trim()}>
          Absenden
        </button>
      )}
      {checked && (
        <div className={`${styles.checkFeedback} ${ok ? styles.checkFeedbackOk : styles.checkFeedbackNo}`}>
          {ok
            ? <><CheckCircle2 size={14} /> {block.success || 'Stark! Genau darum geht es.'}</>
            : <><Info size={14} /> {block.hint || 'Formuliere etwas ausführlicher und nutze die passenden Begriffe.'}</>}
        </div>
      )}
    </div>
  )
}

interface HistoryEntry { cmd: string; out: string; err: boolean }

function BlockSimulation({ block, done, onDone }: InteractiveProps) {
  const steps: AnyBlock[] = block.steps || []
  const [stepIdx, setStepIdx] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const finished = stepIdx >= steps.length
  const current = finished ? null : steps[stepIdx]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  const norm = (s: string) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ')

  function run() {
    if (!current || !input.trim()) return
    const matches = norm(input) === norm(current.expected) || norm(input).includes(norm(current.expected))
    if (matches) {
      setHistory((h) => [...h, { cmd: input, out: current.response, err: false }])
      const next = stepIdx + 1
      setStepIdx(next)
      if (next >= steps.length) onDone()
    } else {
      setHistory((h) => [...h, {
        cmd: input,
        out: current.error || `Erwartet wurde etwas wie:  ${current.expected}`,
        err: true,
      }])
    }
    setInput('')
  }

  const prompt = block.tool === 'editor' ? '›' : (block.prompt || 'PS C:\\projekt>')

  return (
    <div className={`${styles.sim} ${done ? styles.simDone : ''}`}>
      <div className={styles.simBar}>
        <span className={styles.simDot} style={{ background: '#ff5f56' }} />
        <span className={styles.simDot} style={{ background: '#ffbd2e' }} />
        <span className={styles.simDot} style={{ background: '#27c93f' }} />
        <span className={styles.simTitle}>
          <TerminalIcon size={12} /> {block.title || 'VS Code – Terminal'}
        </span>
        {done && <span className={styles.simBadge}><CheckCircle2 size={12} /> fertig</span>}
      </div>

      <div className={styles.simBody} ref={scrollRef}>
        {block.intro && <div className={styles.simIntro}>{block.intro}</div>}
        {history.map((h, i) => (
          <div key={i} className={styles.simLine}>
            <div className={styles.simCmd}><span className={styles.simPrompt}>{prompt}</span> {h.cmd}</div>
            <div className={h.err ? styles.simOutErr : styles.simOut}>{h.out}</div>
          </div>
        ))}
        {finished && (
          <div className={styles.simFinished}><Sparkles size={13} /> {block.done || 'Geschafft – alle Schritte ausgeführt.'}</div>
        )}
      </div>

      {!finished && current && (
        <div className={styles.simInputRow}>
          <div className={styles.simHint}>
            <CornerDownLeft size={12} /> {current.instruction}
            {current.expected && <code className={styles.simExpected}>{current.expected}</code>}
          </div>
          <div className={styles.simEntry}>
            <span className={styles.simPrompt}>{prompt}</span>
            <input
              className={styles.simField}
              value={input}
              placeholder="Befehl eingeben und Enter drücken…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') run() }}
              spellCheck={false}
              autoComplete="off"
            />
            <button type="button" className={styles.simRun} onClick={run}>Ausführen</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Block-Dispatch ────────────────────────────────────────────────────────────

const INTERACTIVE_TYPES = ['quizCheck', 'taskInput', 'simulation']

interface ContentBlockProps {
  block: Block
  blockKey: string
  completed: Record<string, boolean>
  markDone: (key: string) => void
}

function ContentBlock({ block, blockKey, completed, markDone }: ContentBlockProps) {
  if (!block || typeof block !== 'object') return null
  const b = block as AnyBlock
  const done = !!completed[blockKey]
  const onDone = () => markDone(blockKey)
  switch (b.type) {
    case 'text':       return <BlockText block={b} />
    case 'list':       return <BlockList block={b} />
    case 'callout':    return <BlockCallout block={b} />
    case 'code':       return <BlockCode block={b} />
    case 'comparison': return <BlockComparison block={b} />
    case 'cards':      return <BlockCards block={b} />
    case 'diagram':    return <BlockDiagram block={b} />
    case 'steps':      return <BlockSteps block={b} />
    case 'quizCheck':  return <BlockQuizCheck block={b} done={done} onDone={onDone} />
    case 'taskInput':  return <BlockTaskInput block={b} done={done} onDone={onDone} />
    case 'simulation': return <BlockSimulation block={b} done={done} onDone={onDone} />
    default:           return null
  }
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

interface Props {
  chapterId: string
  onStartTest: () => void
  onOpenReference: () => void
}

export default function LearnPanel({ chapterId, onStartTest, onOpenReference }: Props) {
  const [data, setData]           = useState<LearnData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [completed, setCompleted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setLessonIdx(0)
    setCompleted({})
    api.getLearn(chapterId)
      .then((d) => { if (active) setData(d) })
      .catch((err: Error) => { if (active) setError(err?.message || 'Lerninhalt konnte nicht geladen werden.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chapterId])

  const markDone = (key: string) => setCompleted((prev) => (prev[key] ? prev : { ...prev, [key]: true }))

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
  const lesson   = lessons[lessonIdx] ?? null
  const isFirst  = lessonIdx === 0
  const isLast   = lessonIdx === lessons.length - 1
  const progress = lessons.length > 1 ? ((lessonIdx + 1) / lessons.length) * 100 : 100
  const cleanTitle = (t = '') => t.replace(/^\d+\.\s*/, '')

  const blocks = lesson?.blocks || []
  const requiredKeys = blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => INTERACTIVE_TYPES.includes(b.type) && (b as AnyBlock).required !== false)
    .map(({ i }) => `${lessonIdx}:${i}`)
  const allChecksDone = requiredKeys.every((k) => completed[k])
  const isLab = lesson?.layout === 'lab'

  const renderBlock = (block: Block, i: number) => (
    <ContentBlock
      key={`${lessonIdx}:${i}`}
      block={block}
      blockKey={`${lessonIdx}:${i}`}
      completed={completed}
      markDone={markDone}
    />
  )

  return (
    <div className={styles.panel}>

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
          <div>
            <h2 className={styles.lessonTitle}>
              <span className={styles.lessonNum}>{lessonIdx + 1}</span>
              {cleanTitle(lesson.title)}
            </h2>

            {isLab ? (
              <div className={styles.labLayout}>
                <div className={styles.labLeft}>
                  {blocks.map((b, i) => (b.type === 'simulation' ? null : renderBlock(b, i)))}
                </div>
                <div className={styles.labRight}>
                  {blocks.map((b, i) => (b.type === 'simulation' ? renderBlock(b, i) : null))}
                </div>
              </div>
            ) : (
              <div className={styles.lessonBody}>
                {blocks.map((b, i) => renderBlock(b, i))}
              </div>
            )}
          </div>


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
            onClick={() => setLessonIdx((p) => p + 1)}
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.navTest}
            disabled={!allChecksDone}
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
