import { useEffect, useRef, useState } from 'react'
import {
  Clock, BookOpen, Info, Lightbulb, AlertTriangle,
  ClipboardCheck, Library, Loader2, ChevronLeft, ChevronRight, CheckCircle2,
  MousePointerClick, Terminal as TerminalIcon, PenLine, Sparkles, XCircle, CornerDownLeft,
} from 'lucide-react'
import styles from './LearnPanel.module.css'
import { api } from '../api'

// ── Statische Block-Renderer ─────────────────────────────────────────────────

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

// ── Interaktive Block-Renderer ───────────────────────────────────────────────

/** Wissens-Check: Single-Choice-Frage mit Sofort-Feedback (gated). */
function BlockQuizCheck({ block, done, onDone }) {
  const [selected, setSelected] = useState(null)
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
        {(block.options || []).map((opt, i) => {
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

/** Freitext-Aufgabe: Nutzer wendet Gelesenes an, wird auf Länge/Stichwörter geprüft. */
function BlockTaskInput({ block, done, onDone }) {
  const [value, setValue] = useState('')
  const [checked, setChecked] = useState(false)
  const [ok, setOk] = useState(false)

  function validate() {
    const text = value.trim().toLowerCase()
    const longEnough = text.length >= (block.minLength || 12)
    const keywords = (block.keywords || []).map((k) => k.toLowerCase())
    const minKw = block.minKeywords ?? (keywords.length ? 1 : 0)
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

/** Simuliertes VS-Code-Terminal / Editor à la freeCodeCamp – Nutzer tippt Befehle nach. */
function BlockSimulation({ block, done, onDone }) {
  const steps = block.steps || []
  const [stepIdx, setStepIdx] = useState(0)
  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  const finished = stepIdx >= steps.length
  const current = finished ? null : steps[stepIdx]

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [history])

  const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ')

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

      {!finished && (
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

function ContentBlock({ block, blockKey, completed, markDone }) {
  if (!block || typeof block !== 'object') return null
  const done = !!completed[blockKey]
  const onDone = () => markDone(blockKey)
  switch (block.type) {
    case 'text':       return <BlockText block={block} />
    case 'list':       return <BlockList block={block} />
    case 'callout':    return <BlockCallout block={block} />
    case 'code':       return <BlockCode block={block} />
    case 'comparison': return <BlockComparison block={block} />
    case 'cards':      return <BlockCards block={block} />
    case 'diagram':    return <BlockDiagram block={block} />
    case 'steps':      return <BlockSteps block={block} />
    case 'quizCheck':  return <BlockQuizCheck block={block} done={done} onDone={onDone} />
    case 'taskInput':  return <BlockTaskInput block={block} done={done} onDone={onDone} />
    case 'simulation': return <BlockSimulation block={block} done={done} onDone={onDone} />
    default:           return null
  }
}

// ── Onboarding-Overlay (erste Lektion jedes Kapitels) ────────────────────────

function IntroOverlay({ data, lessons, onDismiss }) {
  const btnRef = useRef(null)
  useEffect(() => { btnRef.current?.focus() }, [])
  return (
    <div className={styles.introOverlay} role="dialog" aria-modal="true" aria-label="Kapitel-Übersicht">
      <div className={styles.introCard}>

        {/* ── Kapitel-Info ── */}
        <div className={styles.introChapter}>
          <h2 className={styles.introChapterTitle}>{data.title}</h2>
          <div className={styles.introChapterMeta}>
            {data.estimatedMinutes != null && (
              <span><Clock size={13} /> ca. {data.estimatedMinutes} Min.</span>
            )}
            <span><BookOpen size={13} /> {lessons.length} Lektionen</span>
          </div>
          {data.summary && (
            <p className={styles.introChapterSummary}>{data.summary}</p>
          )}
        </div>

        {/* ── Ablauf-Hinweise ── */}
        <ul className={styles.introList}>
          <li><ChevronRight size={15} /> <span><b>Lektion für Lektion:</b> Mit „Weiter" durch die Lektionen. Die Punkte zeigen deinen Fortschritt.</span></li>
          <li><MousePointerClick size={15} /> <span><b>Mitmachen:</b> Kleine Checks schalten den nächsten Schritt frei.</span></li>
          <li><ClipboardCheck size={15} /> <span><b>Abschluss:</b> Am Ende prüfst du dein Wissen im Test.</span></li>
        </ul>

        <button ref={btnRef} type="button" className={styles.introBtn} onClick={onDismiss}>
          Los geht&apos;s <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}

// ── Haupt-Komponente ──────────────────────────────────────────────────────────

export default function LearnPanel({ chapterId, onStartTest, onOpenReference }) {
  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [lessonIdx, setLessonIdx] = useState(0)
  const [introOpen, setIntroOpen] = useState(true)
  const [completed, setCompleted] = useState({})  // `${lessonIdx}:${blockIdx}` -> true

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setLessonIdx(0)
    setIntroOpen(true)
    setCompleted({})
    api.getLearn(chapterId)
      .then((d) => { if (active) setData(d) })
      .catch((err) => { if (active) setError(err?.message || 'Lerninhalt konnte nicht geladen werden.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [chapterId])

  const markDone = (key) => setCompleted((prev) => (prev[key] ? prev : { ...prev, [key]: true }))

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
  const showIntro = introOpen && lessonIdx === 0

  const cleanTitle = (t = '') => t.replace(/^\d+\.\s*/, '')

  // Pflicht-Checks der aktuellen Lektion (interaktive Blöcke, sofern nicht optional)
  const blocks = lesson?.blocks || []
  const requiredKeys = blocks
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => INTERACTIVE_TYPES.includes(b.type) && b.required !== false)
    .map(({ i }) => `${lessonIdx}:${i}`)
  const allChecksDone = requiredKeys.every((k) => completed[k])
  const isLab = lesson?.layout === 'lab'

  // Blöcke rendern (mit stabilem Key je Lektion+Index)
  const renderBlock = (block, i) => (
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
          <div className={showIntro ? styles.lessonBlurred : undefined} aria-hidden={showIntro}>
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

          {showIntro && <IntroOverlay data={data} lessons={lessons} onDismiss={() => setIntroOpen(false)} />}
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

        {!allChecksDone && !showIntro && (
          <span className={styles.gateHint}>
            <MousePointerClick size={13} /> Löse die Aufgabe, um fortzufahren
          </span>
        )}

        {!isLast ? (
          <button
            type="button"
            className={styles.navNext}
            disabled={!allChecksDone || showIntro}
            onClick={() => setLessonIdx((p) => p + 1)}
          >
            Weiter
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.navTest}
            disabled={!allChecksDone || showIntro}
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
