import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  GraduationCap, BookOpen, ClipboardCheck,
  Lock, Loader2, AlertTriangle, ArrowLeft, ChevronRight, Info,
} from 'lucide-react'
import styles from './App.module.css'
import { api } from './api'
import type { Topic, SubTopic, StepId } from './types'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import GlossaryPage from './components/GlossaryPage'
import TopicPage from './components/TopicPage'
import SubTopicSidebar from './components/SubTopicSidebar'
import LearnPanel from './components/LearnPanel'
import TestPanel from './components/TestPanel'

// ── Kapitel-Lern-Panels (TSX-Dateien pro Kapitel) ─────────────────────────────
import LlmGrundlagen from './chapters/ki-agenten/01-LlmGrundlagen'
import ToolCalling from './chapters/ki-agenten/02-ToolCalling'
import WasIstAgent from './chapters/ki-agenten/03-WasIstAgent'
import AgentenBauen from './chapters/ki-agenten/04-AgentenBauen'
import WorkflowsDeployment from './chapters/ki-agenten/05-WorkflowsDeployment'

interface ChapterLearnProps {
  onStartTest: () => void
  onOpenReference: () => void
}

/**
 * Registry: chapterId → eigenständige Kapitel-Komponente.
 * Neue Kapitel hier eintragen – der generische LearnPanel bleibt als Fallback.
 */
const CHAPTER_LEARN: Record<string, React.ComponentType<ChapterLearnProps>> = {
  'llm-grundlagen':       LlmGrundlagen,
  'tool-calling':         ToolCalling,
  'ki-agenten':           WasIstAgent,
  'agenten-bauen':        AgentenBauen,
  'workflows-deployment': WorkflowsDeployment,
}

type View = 'landing' | 'about' | 'glossary' | 'topic' | 'chapter'

interface StepDef {
  id: StepId
  num: number
  label: string
  hint: string
  icon: React.ComponentType<{ size?: number }>
}

// ── Custom-Renderer-Registry ──────────────────────────────────────────────────
// Für Unterthemen, die einen völlig eigenen Lern-Flow benötigen (Escape-Hatch).
// Standard: kein Eintrag → generischer Lernen/Testen/Nachschlagen-Flow.
//
// Verwendung im JSON:  "renderer": "mein-custom-renderer"
// Registrierung hier:
//   import MeinCustomPanel from './components/custom/MeinCustomPanel'
//   CUSTOM_RENDERERS['mein-custom-renderer'] = MeinCustomPanel
const CUSTOM_RENDERERS: Record<string, React.ComponentType<CustomPanelProps>> = {}

interface CustomPanelProps {
  chapterId: string
  passed: boolean
  onPassed: () => void
  onBackToLearn: () => void
  onOpenReference: () => void
}

const STEPS: StepDef[] = [
  { id: 'learn',     num: 1, label: 'Lernen',  hint: 'Inhalte verstehen', icon: BookOpen },
  { id: 'test',      num: 2, label: 'Testen',  hint: 'Wissen prüfen',     icon: ClipboardCheck },
]

export default function App() {
  const [topics, setTopics]                   = useState<Topic[]>([])
  const [activeTopicId, setActiveTopicId]     = useState('')
  const [activeChapterId, setActiveChapterId] = useState('')
  const [view, setView]                       = useState<View>('landing')
  const [step, setStep]                       = useState<StepId>('learn')
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState('')
  const [passedChapters, setPassedChapters]   = useState<Record<string, boolean>>({})

  // ── Daten laden ───────────────────────────────────────────────────────────
  const loadTopics = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.listTopics()
      const list = Array.isArray(data?.topics) ? data.topics : []
      setTopics(list)
      const passed: Record<string, boolean> = {}
      list.forEach((t) => t.subTopics?.forEach((s) => { if (s.passed) passed[s.id] = true }))
      setPassedChapters(passed)
    } catch (err) {
      setError((err as Error)?.message || 'Schulungsinhalte konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadTopics() }, [loadTopics])

  // ── Abgeleitete Werte ─────────────────────────────────────────────────────
  const activeTopic = useMemo(
    () => topics.find((t) => t.id === activeTopicId) ?? null,
    [topics, activeTopicId],
  )

  const activeChapter = useMemo(
    () => activeTopic?.subTopics?.find((s: SubTopic) => s.id === activeChapterId) ?? null,
    [activeTopic, activeChapterId],
  )

  const isPassed = Boolean(passedChapters[activeChapterId] || activeChapter?.passed)

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToLanding = () => {
    setView('landing')
    setActiveTopicId('')
    setActiveChapterId('')
  }

  const goToAbout = () => {
    setView('about')
    setActiveTopicId('')
    setActiveChapterId('')
  }

  const goToGlossary = () => {
    setView('glossary')
    setActiveTopicId('')
    setActiveChapterId('')
  }

  const goToTopic = (topicId: string) => {
    setActiveTopicId(topicId)
    setView('topic')
    setActiveChapterId('')
  }

  const goToChapter = (chapterId: string) => {
    setActiveChapterId(chapterId)
    setStep('learn')
    setView('chapter')
  }

  const handleQuizPassed = useCallback((chapterId: string) => {
    setPassedChapters((prev) => ({ ...prev, [chapterId]: true }))
    loadTopics()
  }, [loadTopics])

  // ── Breadcrumb ────────────────────────────────────────────────────────────
  const renderBreadcrumb = () => {
    if (view === 'about') {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            <ArrowLeft size={13} /> Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>Über die Plattform</span>
        </div>
      )
    }
    if (view === 'glossary') {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            <ArrowLeft size={13} /> Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>Nachschlagewerk</span>
        </div>
      )
    }
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
        {(view === 'landing' || view === 'about' || view === 'glossary') ? (
          <nav className={styles.headerNav}>
            <button
              className={view === 'landing' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={goToLanding}
            >
              Themen
            </button>
            <button
              className={view === 'glossary' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={goToGlossary}
            >
              <Info size={13} />
              Nachschlagen
            </button>
            <button
              className={view === 'about' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={goToAbout}
            >
              <Info size={13} />
              About
            </button>
          </nav>
        ) : (
          renderBreadcrumb()
        )}
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

      {/* ── About Page ──────────────────────────────────────────────────────── */}
      {view === 'about' && (
        <main className={styles.mainFull}>
          <AboutPage onStart={goToLanding} />
        </main>
      )}

      {/* ── Glossary Page ────────────────────────────────────────────────────── */}
      {view === 'glossary' && (
        <main className={styles.mainFull}>
          <GlossaryPage />
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
            <div className={step === 'learn' ? `${styles.panelWrap} ${styles.panelWrapWide}` : styles.panelWrap}>
              {!activeChapter && !loading && (
                <div className={`${styles.statusBox} ${styles.statusInfo}`}>
                  <Lock size={18} /> Kapitel nicht gefunden.
                </div>
              )}

              {activeChapter && (() => {
                // Custom-Renderer-Escape-Hatch
                const CustomPanel = CUSTOM_RENDERERS[(activeChapter as SubTopic & { renderer?: string }).renderer ?? '']
                if (CustomPanel) {
                  return (
                    <CustomPanel
                      chapterId={activeChapterId}
                      passed={isPassed}
                      onPassed={() => handleQuizPassed(activeChapterId)}
                      onBackToLearn={() => setStep('learn')}
                      onOpenReference={() => goToGlossary()}
                    />
                  )
                }

                // Standard-Flow: Lernen / Testen
                return (
                  <>
                    {step === 'learn' && (() => {
                      const ChapterLearn = CHAPTER_LEARN[activeChapterId]
                      if (ChapterLearn) {
                        return (
                          <ChapterLearn
                            onStartTest={() => setStep('test')}
                            onOpenReference={goToGlossary}
                          />
                        )
                      }
                      return (
                        <LearnPanel
                          chapterId={activeChapterId}
                          onStartTest={() => setStep('test')}
                          onOpenReference={goToGlossary}
                        />
                      )
                    })()}
                    {step === 'test' && (
                      <TestPanel
                        chapterId={activeChapterId}
                        passed={isPassed}
                        onPassed={() => handleQuizPassed(activeChapterId)}
                        onBackToLearn={() => setStep('learn')}
                        onOpenReference={() => goToGlossary()}
                      />
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
