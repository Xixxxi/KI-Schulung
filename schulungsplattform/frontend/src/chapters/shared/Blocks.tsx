import { useEffect, useRef, useState } from 'react'
import {
  Info, Lightbulb, AlertTriangle, CheckCircle2,
  MousePointerClick, Terminal as TerminalIcon, PenLine,
  Sparkles, XCircle, CornerDownLeft, ChevronRight,
} from 'lucide-react'
import styles from './Blocks.module.css'
import { useChapter } from './chapterContext'

// ── Primitive Types ──────────────────────────────────────────────────────────

export interface DiagramNode {
  id: string
  type?: 'start' | 'step' | 'end'
  emoji?: string
  label: string
  sublabel?: string
}

export interface StepItem {
  label: string
  description?: string
  example?: string
}

export interface CardItem {
  icon?: string
  label: string
  description?: string
  color?: string
}

export interface CompSide {
  label: string
  color?: string
  items: string[]
}

export interface SimStep {
  instruction: string
  expected: string
  response: string
  error?: string
}

// ── Text ──────────────────────────────────────────────────────────────────────

export function Text({ text }: { text: string }) {
  return <p className={styles.blockText}>{text}</p>
}

// ── List ──────────────────────────────────────────────────────────────────────

export function List({ title, items }: { title?: string; items: string[] }) {
  return (
    <div className={styles.blockListWrap}>
      {title && <div className={styles.blockListTitle}>{title}</div>}
      <ul className={styles.blockList}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </div>
  )
}

// ── Callout ───────────────────────────────────────────────────────────────────

export function Callout({ tone = 'info', title, text }: {
  tone?: 'info' | 'tip' | 'warn'
  title?: string
  text: string
}) {
  const cls = tone === 'tip' ? styles.calloutTip : tone === 'warn' ? styles.calloutWarn : styles.calloutInfo
  const Icon = tone === 'tip' ? Lightbulb : tone === 'warn' ? AlertTriangle : Info
  return (
    <div className={`${styles.callout} ${cls}`}>
      {title && <div className={styles.calloutTitle}><Icon size={15} />{title}</div>}
      <div className={styles.calloutText}>{text}</div>
    </div>
  )
}

// ── Code ──────────────────────────────────────────────────────────────────────

export function Code({ caption, text }: { caption?: string; language?: string; text: string }) {
  return (
    <div className={styles.codeWrap}>
      {caption && <div className={styles.codeCaption}>{caption}</div>}
      <pre className={styles.code}><code>{text}</code></pre>
    </div>
  )
}

// ── Comparison ────────────────────────────────────────────────────────────────

export function Comparison({ left, right }: { left: CompSide; right: CompSide }) {
  return (
    <div className={styles.comparison}>
      <div className={styles.compSide} style={{ '--comp-color': left.color || '#6b7280' } as React.CSSProperties}>
        <div className={styles.compLabel}>{left.label}</div>
        <ul className={styles.compList}>
          {left.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      <div className={styles.compVs}>VS</div>
      <div className={styles.compSide} style={{ '--comp-color': right.color || '#1c69d4' } as React.CSSProperties}>
        <div className={styles.compLabel}>{right.label}</div>
        <ul className={styles.compList}>
          {right.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
    </div>
  )
}

// ── Cards ─────────────────────────────────────────────────────────────────────

export function Cards({ title, items }: { title?: string; items: CardItem[] }) {
  return (
    <div className={styles.cardsWrap}>
      {title && <div className={styles.blockListTitle}>{title}</div>}
      <div className={styles.cardGrid}>
        {items.map((card, i) => (
          <div key={i} className={styles.card} style={{ '--card-color': card.color || 'var(--bmw-blue)' } as React.CSSProperties}>
            {card.icon && <div className={styles.cardIcon}>{card.icon}</div>}
            <div className={styles.cardLabel}>{card.label}</div>
            {card.description && <div className={styles.cardDesc}>{card.description}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Diagram ───────────────────────────────────────────────────────────────────

export function Diagram({ caption, nodes, loop, note }: {
  caption?: string
  nodes: DiagramNode[]
  loop?: { label: string }
  note?: string
}) {
  return (
    <div className={styles.diagramWrap}>
      {caption && <div className={styles.diagramCaption}>{caption}</div>}
      <div className={styles.diagramFlow}>
        {nodes.map((node, i) => (
          <div key={node.id} className={styles.diagramEntry}>
            <div className={`${styles.diagramNode} ${styles[`diagramNode_${node.type || 'step'}`]}`}>
              {node.emoji && <span className={styles.diagramEmoji}>{node.emoji}</span>}
              <span className={styles.diagramNodeLabel}>{node.label}</span>
              {node.sublabel && <span className={styles.diagramNodeSub}>{node.sublabel}</span>}
            </div>
            {i < nodes.length - 1 && (
              <div className={styles.diagramArrow}><ChevronRight size={18} /></div>
            )}
          </div>
        ))}
      </div>
      {loop && (
        <div className={styles.diagramLoopBox}>
          <span className={styles.diagramLoopIcon}>↩</span>
          <span>{loop.label}</span>
        </div>
      )}
      {note && <div className={styles.diagramNote}>{note}</div>}
    </div>
  )
}

// ── Steps ─────────────────────────────────────────────────────────────────────

export function Steps({ title, items }: { title?: string; items: StepItem[] }) {
  return (
    <div className={styles.stepsWrap}>
      {title && <div className={styles.blockListTitle}>{title}</div>}
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
          </div>
        ))}
      </div>
    </div>
  )
}

// ── QuizCheck (interaktiv) ────────────────────────────────────────────────────

export function QuizCheck({ blockKey, title, question, options, correct, hint, explanation }: {
  blockKey: string
  title?: string
  question: string
  options: string[]
  correct: number
  hint?: string
  explanation?: string
}) {
  const { done, markDone } = useChapter()
  const isDone = done(blockKey)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const isCorrect = revealed && selected === correct

  function submit() {
    if (selected == null) return
    setRevealed(true)
    if (selected === correct) markDone(blockKey)
  }

  return (
    <div className={`${styles.checkBox} ${isDone ? styles.checkBoxDone : ''}`}>
      <div className={styles.checkHead}>
        <MousePointerClick size={15} />
        <span>{title || 'Kurzer Check'}</span>
        {isDone && <span className={styles.checkDoneTag}><CheckCircle2 size={12} /> gelöst</span>}
      </div>
      <div className={styles.checkQuestion}>{question}</div>
      <div className={styles.checkOptions}>
        {options.map((opt, i) => {
          let cls = styles.checkOption
          const chosen = selected === i
          if (revealed && i === correct) cls = `${styles.checkOption} ${styles.checkOptionCorrect}`
          else if (revealed && chosen && i !== correct) cls = `${styles.checkOption} ${styles.checkOptionWrong}`
          else if (chosen) cls = `${styles.checkOption} ${styles.checkOptionChosen}`
          return (
            <button key={i} type="button" className={cls} disabled={isDone}
              onClick={() => { if (!isDone) { setSelected(i); setRevealed(false) } }}>
              <span className={styles.checkRadio}>{chosen ? '●' : '○'}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {!isDone && (
        <button type="button" className={styles.checkSubmit} onClick={submit} disabled={selected == null}>
          Antwort prüfen
        </button>
      )}
      {revealed && (
        <div className={`${styles.checkFeedback} ${isCorrect ? styles.checkFeedbackOk : styles.checkFeedbackNo}`}>
          {isCorrect
            ? <><CheckCircle2 size={14} /> Richtig! {explanation}</>
            : <><XCircle size={14} /> Noch nicht ganz – versuch es erneut. {hint || ''}</>}
        </div>
      )}
    </div>
  )
}

// ── TaskInput (interaktiv) ────────────────────────────────────────────────────

export function TaskInput({ blockKey, title, prompt, placeholder, minLength = 12, keywords = [], minKeywords, success, hint, rows = 3 }: {
  blockKey: string
  title?: string
  prompt: string
  placeholder?: string
  minLength?: number
  keywords?: string[]
  minKeywords?: number
  success?: string
  hint?: string
  rows?: number
}) {
  const { done, markDone } = useChapter()
  const isDone = done(blockKey)
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  function validate() {
    const text = value.trim().toLowerCase()
    const longEnough = text.length >= minLength
    const kwList = keywords.map(k => k.toLowerCase())
    const min = minKeywords ?? (kwList.length ? 1 : 0)
    const hits = kwList.filter(k => text.includes(k)).length
    return longEnough && hits >= min
  }

  function submit() {
    const valid = validate()
    setOk(valid)
    setChecked(true)
    if (valid) markDone(blockKey)
  }

  return (
    <div className={`${styles.taskBox} ${isDone ? styles.checkBoxDone : ''}`}>
      <div className={styles.checkHead}>
        <PenLine size={15} />
        <span>{title || 'Selbst anwenden'}</span>
        {isDone && <span className={styles.checkDoneTag}><CheckCircle2 size={12} /> erledigt</span>}
      </div>
      <div className={styles.checkQuestion}>{prompt}</div>
      <textarea className={styles.taskInput} rows={rows} placeholder={placeholder || 'Deine Antwort…'}
        value={value} onChange={e => { setValue(e.target.value); setChecked(false) }} disabled={isDone} />
      {!isDone && (
        <button type="button" className={styles.checkSubmit} onClick={submit} disabled={!value.trim()}>
          Absenden
        </button>
      )}
      {checked && (
        <div className={`${styles.checkFeedback} ${ok ? styles.checkFeedbackOk : styles.checkFeedbackNo}`}>
          {ok
            ? <><CheckCircle2 size={14} /> {success || 'Stark!'}</>
            : <><Info size={14} /> {hint || 'Formuliere etwas ausführlicher und nutze die passenden Begriffe.'}</>}
        </div>
      )}
    </div>
  )
}

// ── Simulation (interaktiv) ───────────────────────────────────────────────────

interface HistoryEntry { cmd: string; out: string; err: boolean }

export function Simulation({ blockKey, title, tool, prompt: shellPrompt, intro, doneText, steps }: {
  blockKey: string
  title?: string
  tool?: string
  prompt?: string
  intro?: string
  doneText?: string
  steps: SimStep[]
}) {
  const { done, markDone } = useChapter()
  const isDone = done(blockKey)
  const [stepIdx, setStepIdx] = useState(0)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const finished = stepIdx >= steps.length
  const current = finished ? null : steps[stepIdx]
  const displayPrompt = tool === 'editor' ? '›' : (shellPrompt || 'PS C:\\projekt>')

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  const norm = (s: string) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ')

  function run() {
    if (!current || !input.trim()) return
    const matches = norm(input) === norm(current.expected) || norm(input).includes(norm(current.expected))
    if (matches) {
      setHistory(h => [...h, { cmd: input, out: current.response, err: false }])
      const next = stepIdx + 1
      setStepIdx(next)
      if (next >= steps.length) markDone(blockKey)
    } else {
      setHistory(h => [...h, { cmd: input, out: current.error || `Erwartet: ${current.expected}`, err: true }])
    }
    setInput('')
  }

  return (
    <div className={`${styles.sim} ${isDone ? styles.simDone : ''}`}>
      <div className={styles.simBar}>
        <span className={styles.simDot} style={{ background: '#ff5f56' }} />
        <span className={styles.simDot} style={{ background: '#ffbd2e' }} />
        <span className={styles.simDot} style={{ background: '#27c93f' }} />
        <span className={styles.simTitle}><TerminalIcon size={12} /> {title || 'VS Code – Terminal'}</span>
        {isDone && <span className={styles.simBadge}><CheckCircle2 size={12} /> fertig</span>}
      </div>
      <div className={styles.simBody} ref={scrollRef}>
        {intro && <div className={styles.simIntro}>{intro}</div>}
        {history.map((h, i) => (
          <div key={i} className={styles.simLine}>
            <div className={styles.simCmd}><span className={styles.simPrompt}>{displayPrompt}</span> {h.cmd}</div>
            <div className={h.err ? styles.simOutErr : styles.simOut}>{h.out}</div>
          </div>
        ))}
        {finished && <div className={styles.simFinished}><Sparkles size={13} /> {doneText || 'Geschafft!'}</div>}
      </div>
      {!finished && current && (
        <div className={styles.simInputRow}>
          <div className={styles.simHint}>
            <CornerDownLeft size={12} /> {current.instruction}
            {current.expected && <code className={styles.simExpected}>{current.expected}</code>}
          </div>
          <div className={styles.simEntry}>
            <span className={styles.simPrompt}>{displayPrompt}</span>
            <input className={styles.simField} value={input} placeholder="Befehl eingeben und Enter drücken…"
              onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') run() }}
              spellCheck={false} autoComplete="off" />
            <button type="button" className={styles.simRun} onClick={run}>Ausführen</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── LabLayout ─────────────────────────────────────────────────────────────────

export function LabLayout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className={styles.labLayout}>
      <div className={styles.labLeft}>{left}</div>
      <div className={styles.labRight}>{right}</div>
    </div>
  )
}
