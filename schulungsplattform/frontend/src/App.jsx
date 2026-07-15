import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GraduationCap, BookOpen, ClipboardCheck, Library,
  Lock, Loader2, AlertTriangle, ArrowLeft, ChevronRight,
} from 'lucide-react'
import styles from './App.module.css'
import { api } from './api'
import LandingPage from './components/LandingPage'
import TopicPage from './components/TopicPage'
import SubTopicSidebar from './components/SubTopicSidebar'
import LearnPanel from './components/LearnPanel'
import TestPanel from './components/TestPanel'
import ReferencePanel from './components/ReferencePanel'

// ── Custom-Renderer-Registry ──────────────────────────────────────────────────
// Für Unterthemen, die einen völlig eigenen Lern-Flow benötigen (Escape-Hatch).
// Standard: kein Eintrag → generischer Lernen/Testen/Nachschlagen-Flow.
//
// Verwendung im JSON:  "renderer": "mein-custom-renderer"
// Registrierung hier:
//   import MeinCustomPanel from './components/custom/MeinCustomPanel'
//   CUSTOM_RENDERERS['mein-custom-renderer'] = MeinCustomPanel
//
// Das Custom-Panel erhält dieselben Props wie die Standard-Panels:
//   { chapterId, passed, onPassed, onBackToLearn, onOpenReference }
const CUSTOM_RENDERERS = {}

const STEPS = [
  { id: 'learn',     num: 1, label: 'Lernen',      hint: 'Inhalte verstehen',       icon: BookOpen },
  { id: 'test',      num: 2, label: 'Testen',       hint: 'Wissen prüfen',           icon: ClipboardCheck },
  { id: 'reference', num: 3, label: 'Nachschlagen', hint: 'Begriffe & Definitionen', icon: Library },
]

// view: 'landing' | 'topic' | 'chapter'

export default function App() {
  const [topics, setTopics]                   = useState([])
  const [activeTopicId, setActiveTopicId]     = useState('')
  const [activeChapterId, setActiveChapterId] = useState('')
  const [view, setView]                       = useState('landing')
  const [step, setStep]                       = useState('learn')
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState('')
  const [passedChapters, setPassedChapters]   = useState({})

  // ── Daten laden ───────────────────────────────────────────────────────────
  const loadTopics = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.listTopics()
      const list = Array.isArray(data?.topics) ? data.topics : []
      setTopics(list)
      const passed = {}
      list.forEach((t) => t.subTopics?.forEach((s) => { if (s.passed) passed[s.id] = true }))
      setPassedChapters(passed)
    } catch (err) {
      setError(err?.message || 'Schulungsinhalte konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTopics() }, [loadTopics])

  // ── Abgeleitete Werte ─────────────────────────────────────────────────────
  const activeTopic = useMemo(
    () => topics.find((t) => t.id === activeTopicId) || null,
    [topics, activeTopicId],
  )

  const activeChapter = useMemo(
    () => activeTopic?.subTopics?.find((s) => s.id === activeChapterId) || null,
    [activeTopic, activeChapterId],
  )

  const isPassed = Boolean(passedChapters[activeChapterId] || activeChapter?.passed)

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToLanding = () => {
    setView('landing')
    setActiveTopicId('')
    setActiveChapterId('')
  }

  const goToTopic = (topicId) => {
    setActiveTopicId(topicId)
    setView('topic')
    setActiveChapterId('')
  }

  const goToChapter = (chapterId) => {
    setActiveChapterId(chapterId)
    setStep('learn')
    setView('chapter')
  }

  const handleQuizPassed = useCallback((chapterId) => {
    setPassedChapters((prev) => ({ ...prev, [chapterId]: true }))
    loadTopics()
  }, [loadTopics])

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  const renderBreadcrumb = () => {
    if (view === 'topic' && activeTopic) {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            <ArrowLeft size={13} /> Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>{activeTopic.title}</span>
        </div>
      )
    }
    if (view === 'chapter' && activeTopic && activeChapter) {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <button className={styles.breadcrumbBtn} onClick={() => goToTopic(activeTopic.id)}>
            {activeTopic.title}
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>{activeChapter.title}</span>
        </div>
      )
    }
    return null
  }

  const isFullWidth = view === 'landing' || view === 'topic'

  return (
    <div className={styles.app}>
      {/* ── Kopfzeile ─────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <button
          className={styles.logo}
          onClick={goToLanding}
          title="Zur Startseite"
          aria-label="Zur Startseite"
        >
          <GraduationCap size={22} />
        </button>
        <div className={styles.brand}>
          <span className={styles.brandTitle}>KI-Schulung</span>
          <span className={styles.brandSub}>Lernen · Testen · Nachschlagen</span>
        </div>
        <div className={styles.headerSpacer} />
        {renderBreadcrumb()}
      </header>

      {/* ── Statusmeldungen (Loading / Error) ──────────────────────────────── */}
      {loading && (
        <div className={`${styles.statusBox} ${styles.statusInfo} ${styles.statusPadded}`}>
          <Loader2 size={18} className={styles.spin} />
          Lade Schulungsinhalte…
        </div>
      )}
      {error && (
        <div className={`${styles.statusBox} ${styles.statusError} ${styles.statusPadded}`}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* ── Landing Page ────────────────────────────────────────────────────── */}
      {!loading && !error && view === 'landing' && (
        <main className={styles.mainFull}>
          <LandingPage topics={topics} onSelectTopic={goToTopic} />
        </main>
      )}

      {/* ── Topic-Seite ─────────────────────────────────────────────────────── */}
      {!loading && !error && view === 'topic' && (
        <main className={styles.mainFull}>
          {activeTopic
            ? <TopicPage topic={activeTopic} onSelectChapter={goToChapter} />
            : (
              <div className={`${styles.statusBox} ${styles.statusInfo} ${styles.statusPadded}`}>
                <Lock size={18} /> Thema nicht gefunden.
              </div>
            )
          }
        </main>
      )}

      {/* ── Kapitel-Ansicht: Sidebar links + Content rechts ─────────────────── */}
      {view === 'chapter' && (
        <div className={styles.chapterLayout}>
          {/* Linke Sidebar */}
          <SubTopicSidebar
            topic={activeTopic}
            activeChapterId={activeChapterId}
            passedChapters={passedChapters}
            onSelectChapter={goToChapter}
            onSelectStep={setStep}
          />

          {/* Rechter Content-Bereich */}
          <div className={styles.chapterContent}>
            {/* Schritt-Navigation */}
            {activeChapter && (
              <nav className={styles.stepNav}>
                {STEPS.map((s) => {
                  const Icon = s.icon
                  const isActive = step === s.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={isActive ? `${styles.stepBtn} ${styles.stepBtnActive}` : styles.stepBtn}
                      onClick={() => setStep(s.id)}
                    >
                      <span className={styles.stepNum}>{s.num}</span>
                      <span className={styles.stepLabel}>
                        <span>{s.label}</span>
                        <span className={styles.stepHint}>{s.hint}</span>
                      </span>
                      <span className={styles.lock}><Icon size={16} /></span>
                    </button>
                  )
                })}
              </nav>
            )}

            {/* Panel-Inhalt */}
            <div className={styles.panelWrap}>
              {!activeChapter && !loading && (
                <div className={`${styles.statusBox} ${styles.statusInfo}`}>
                  <Lock size={18} /> Kapitel nicht gefunden.
                </div>
              )}

              {activeChapter && (() => {
                // Custom-Renderer-Escape-Hatch: falls das Unterthema einen
                // eigenen Renderer registriert hat, wird dieser verwendet.
                const CustomPanel = CUSTOM_RENDERERS[activeChapter.renderer]
                if (CustomPanel) {
                  return (
                    <CustomPanel
                      chapterId={activeChapterId}
                      passed={isPassed}
                      onPassed={() => handleQuizPassed(activeChapterId)}
                      onBackToLearn={() => setStep('learn')}
                      onOpenReference={() => setStep('reference')}
                    />
                  )
                }

                // Standard-Flow: Lernen / Testen / Nachschlagen
                return (
                  <>
                    {step === 'learn' && (
                      <LearnPanel
                        chapterId={activeChapterId}
                        onStartTest={() => setStep('test')}
                        onOpenReference={() => setStep('reference')}
                      />
                    )}
                    {step === 'test' && (
                      <TestPanel
                        chapterId={activeChapterId}
                        passed={isPassed}
                        onPassed={() => handleQuizPassed(activeChapterId)}
                        onBackToLearn={() => setStep('learn')}
                        onOpenReference={() => setStep('reference')}
                      />
                    )}
                    {step === 'reference' && (
                      <ReferencePanel chapterId={activeChapterId} passed={isPassed} />
                    )}
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        KI-Schulungsplattform · Digital Learning · React + Flask
      </footer>
    </div>
  )
}
