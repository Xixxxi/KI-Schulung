import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  GraduationCap, BookOpen, ClipboardCheck,
  Lock, Loader2, AlertTriangle, ArrowLeft, ChevronRight, Settings, ChevronDown,
  BookMarked, HelpCircle,
} from 'lucide-react'
import styles from './App.module.css'
import { api } from './api'
import type { Topic, SubTopic, StepId, ProgressMap } from './types'
import { buildTopics, getChapterLearn } from './content/registry'
import LandingPage from './components/LandingPage'
import AboutPage from './components/AboutPage'
import GlossaryPage from './components/GlossaryPage'
import RessourcenPage from './components/RessourcenPage'
import TopicPage from './components/TopicPage'
import SubTopicSidebar from './components/SubTopicSidebar'
import TestPanel from './components/TestPanel'
import SettingsPage, { type Theme } from './components/SettingsPage'

type View = 'landing' | 'about' | 'glossary' | 'settings' | 'resources' | 'topic' | 'chapter'

interface StepDef {
  id: StepId
  num: number
  label: string
  hint: string
  icon: React.ComponentType<{ size?: number }>
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
  const [moreOpen, setMoreOpen]               = useState(false)
  const moreRef                               = useRef<HTMLDivElement>(null)

  // ── Dropdown außerhalb schließen ─────────────────────────────────────────
  useEffect(() => {
    if (!moreOpen) return
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [moreOpen])

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('ki-es-theme') as Theme) || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ki-es-theme', theme)
  }, [theme])

  // ── Daten laden ───────────────────────────────────────────────────────────
  const loadTopics = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      let progress: ProgressMap = {}
      try {
        const res = await api.getProgress()
        progress = res?.progress || {}
      } catch {
        // Backend ist optional – die Inhalte funktionieren auch ohne Fortschritts-Server.
      }
      const list = buildTopics(progress)
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

  const goToSettings = () => {
    setView('settings')
    setActiveTopicId('')
    setActiveChapterId('')
  }

  const goToResources = () => {
    setView('resources')
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
    if (view === 'settings') {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            <ArrowLeft size={13} /> Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>Einstellungen</span>
        </div>
      )
    }
    if (view === 'resources') {
      return (
        <div className={styles.breadcrumb}>
          <button className={styles.breadcrumbBtn} onClick={goToLanding}>
            <ArrowLeft size={13} /> Themenübersicht
          </button>
          <ChevronRight size={13} className={styles.breadcrumbSep} />
          <span className={styles.breadcrumbCurrent}>Ressourcen</span>
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
          <span className={styles.brandTitle}>KI @ ES</span>
          <span className={styles.brandSub}>Lernen · Testen · Nachschlagen</span>
        </div>
        <div className={styles.headerSpacer} />
        {(view === 'landing' || view === 'about' || view === 'glossary' || view === 'settings' || view === 'resources') ? (
          <nav className={styles.headerNav}>
            {/* Themen */}
            <button
              className={view === 'landing' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={goToLanding}
            >
              Themen
            </button>

            {/* Ressourcen */}
            <button
              className={view === 'resources' ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink}
              onClick={goToResources}
            >
              Ressourcen
            </button>

            {/* Mehr ▾ */}
            <div className={styles.moreWrapper} ref={moreRef}>
              <button
                className={
                  (view === 'glossary' || view === 'about' || view === 'settings')
                    ? `${styles.navLink} ${styles.navLinkActive} ${styles.moreBtn}`
                    : `${styles.navLink} ${styles.moreBtn}`
                }
                onClick={() => setMoreOpen(o => !o)}
                aria-haspopup="true"
                aria-expanded={moreOpen}
              >
                Mehr <ChevronDown size={12} className={moreOpen ? styles.chevronOpen : styles.chevronClosed} />
              </button>

              {moreOpen && (
                <div className={styles.dropdown} role="menu">
                  <button
                    className={`${styles.dropdownItem} ${view === 'glossary' ? styles.dropdownItemActive : ''}`}
                    role="menuitem"
                    onClick={() => { goToGlossary(); setMoreOpen(false) }}
                  >
                    <BookMarked size={15} />
                    Nachschlagen
                  </button>
                  <button
                    className={`${styles.dropdownItem} ${view === 'about' ? styles.dropdownItemActive : ''}`}
                    role="menuitem"
                    onClick={() => { goToAbout(); setMoreOpen(false) }}
                  >
                    <HelpCircle size={15} />
                    Über die Plattform
                  </button>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${view === 'settings' ? styles.dropdownItemActive : ''}`}
                    role="menuitem"
                    onClick={() => { goToSettings(); setMoreOpen(false) }}
                  >
                    <Settings size={15} />
                    Einstellungen
                  </button>
                </div>
              )}
            </div>
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

      {/* ── Settings Page ───────────────────────────────────────────────────── */}
      {view === 'settings' && (
        <main className={styles.mainFull}>
          <SettingsPage theme={theme} onThemeChange={setTheme} />
        </main>
      )}
      {/* ── Ressourcen Page ─────────────────────────────────────────────────────── */}
      {view === 'resources' && (
        <main className={styles.mainFull}>
          <RessourcenPage />
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
                const ChapterLearn = getChapterLearn(activeChapterId)
                return (
                  <>
                    {step === 'learn' && ChapterLearn && (
                      <ChapterLearn
                        onStartTest={() => setStep('test')}
                        onOpenReference={goToGlossary}
                      />
                    )}
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
        KI @ ES · Digital Learning · React + Flask
      </footer>
    </div>
  )
}
