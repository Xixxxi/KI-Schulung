import {
  BookOpen, ClipboardCheck, Library, ChevronRight,
  Layers, CheckCircle2, RotateCcw, MousePointerClick,
  Brain, Trophy, BookMarked, ArrowRight,
} from 'lucide-react'
import styles from './AboutPage.module.css'

const SCHRITTE = [
  {
    num: 1,
    icon: BookOpen,
    color: '#1c69d4',
    label: 'Lernen',
    title: 'Strukturierte Lektionen',
    desc: 'Jedes Kapitel besteht aus mehreren kurzen Lektionen. Eine Lektion passt auf genau einen Bildschirm – kein Scrollen nötig. Am Ende jeder Lektion gibt es einen kurzen Verständnis-Check.',
    details: [
      'Lektionen mit Flowcharts, Karten und Vergleichen',
      'Kurze Checks direkt in der Lektion',
      'Dot-Navigation zwischen Lektionen',
    ],
  },
  {
    num: 2,
    icon: ClipboardCheck,
    color: '#7c3aed',
    label: 'Testen',
    title: 'Intelligentes Quiz',
    desc: 'Nach den Lektionen wartet ein Kapitel-Quiz. Die Auswertung passiert auf dem Server – du siehst erst nach Abgabe, was richtig war. Bei Fehlern bekommst du Empfehlungen, welche Lektionen du wiederholen solltest.',
    details: [
      'Single-Choice, Multiple-Choice und Freitext',
      'Erklärungen zu jeder Antwort',
      'Adaptive Empfehlung bei Fehlern',
    ],
  },
  {
    num: 3,
    icon: Library,
    color: '#0369a1',
    label: 'Nachschlagen',
    title: 'Integriertes Glossar',
    desc: 'Jedes Kapitel hat ein eigenes Nachschlagewerk mit allen wichtigen Begriffen und Definitionen. Jederzeit erreichbar – auch ohne das Kapitel vorher abzuschließen.',
    details: [
      'Alle Fachbegriffe auf einen Blick',
      'Immer über den Reiter "Nachschlagen" erreichbar',
      'Keine Registrierung nötig',
    ],
  },
]

const TIPPS = [
  {
    icon: MousePointerClick,
    title: 'Thema wählen',
    desc: 'Auf der Startseite siehst du alle verfügbaren Themen als Kacheln. Klick auf ein Thema, um die zugehörigen Kapitel zu sehen.',
  },
  {
    icon: Layers,
    title: 'Kapitel der Reihe nach',
    desc: 'Innerhalb eines Themas sind die Kapitel nach Schwierigkeitsgrad sortiert. Steig am Anfang ein, um kein Vorwissen zu verpassen.',
  },
  {
    icon: Brain,
    title: 'Erst lernen, dann testen',
    desc: 'Geh alle Lektionen durch, bevor du das Quiz startest. Die In-Lektion-Checks helfen dir, Stoff sofort zu festigen.',
  },
  {
    icon: Trophy,
    title: 'Quiz bestehen = Kapitel abgeschlossen',
    desc: 'Sobald du 70 % oder mehr im Quiz erreichst, gilt das Kapitel als abgeschlossen. Dein Fortschritt wird für diese Sitzung gespeichert.',
  },
  {
    icon: RotateCcw,
    title: 'Wiederholen jederzeit möglich',
    desc: 'Du kannst Lektionen und Quiz beliebig oft wiederholen. Das beste Ergebnis bleibt gespeichert.',
  },
  {
    icon: BookMarked,
    title: 'Glossar als Nachschlagewerk nutzen',
    desc: 'Wenn dir ein Begriff unklar ist, wechsel jederzeit zum Reiter "Nachschlagen" – ohne den Lernfortschritt zu verlieren.',
  },
]

export default function AboutPage({ onStart }) {
  return (
    <div className={styles.root}>
      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <div className={styles.heroEyebrowLine} />
            <span>Über diese Plattform</span>
          </div>
          <h1 className={styles.heroTitle}>So funktioniert die KI-Schulung</h1>
          <p className={styles.heroSub}>
            Jedes Thema ist in Kapitel gegliedert. Jedes Kapitel folgt dem gleichen
            dreistufigen Ablauf: erst verstehen, dann prüfen, dann nachschlagen.
          </p>
          <button className={styles.heroBtn} onClick={onStart}>
            Jetzt starten <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* ── Die drei Schritte ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} />
            <div>
              <h2 className={styles.sectionTitle}>Die drei Schritte eines Kapitels</h2>
              <p className={styles.sectionSub}>Jedes Kapitel folgt immer diesem Ablauf</p>
            </div>
          </div>

          <div className={styles.flowRow}>
            {SCHRITTE.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={s.label} className={styles.flowWrap}>
                  <div className={styles.flowCard} style={{ '--card-color': s.color }}>
                    <div className={styles.flowNum} style={{ background: s.color }}>{s.num}</div>
                    <div className={styles.flowIconWrap} style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                      <Icon size={22} style={{ color: s.color }} />
                    </div>
                    <div className={styles.flowLabel} style={{ color: s.color }}>{s.label}</div>
                    <div className={styles.flowTitle}>{s.title}</div>
                    <p className={styles.flowDesc}>{s.desc}</p>
                    <ul className={styles.flowList}>
                      {s.details.map((d) => (
                        <li key={d} className={styles.flowListItem}>
                          <CheckCircle2 size={13} style={{ color: s.color, flexShrink: 0 }} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {i < SCHRITTE.length - 1 && (
                    <ChevronRight size={20} className={styles.flowArrow} />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Navigation erklärt ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} />
            <div>
              <h2 className={styles.sectionTitle}>Navigation auf einen Blick</h2>
              <p className={styles.sectionSub}>Wo du was findest</p>
            </div>
          </div>

          <div className={styles.navExplain}>
            <div className={styles.navExplainItem}>
              <div className={styles.navExplainLabel}>Startseite</div>
              <div className={styles.navExplainArrow}>→</div>
              <div className={styles.navExplainDesc}>Alle verfügbaren <strong>Themen</strong> als Kacheln</div>
            </div>
            <div className={styles.navExplainItem}>
              <div className={styles.navExplainLabel}>Thema-Seite</div>
              <div className={styles.navExplainArrow}>→</div>
              <div className={styles.navExplainDesc}>Alle <strong>Kapitel</strong> des Themas mit Fortschrittsanzeige</div>
            </div>
            <div className={styles.navExplainItem}>
              <div className={styles.navExplainLabel}>Kapitel-Ansicht</div>
              <div className={styles.navExplainArrow}>→</div>
              <div className={styles.navExplainDesc}>Tabs: <strong>Lernen</strong> · <strong>Testen</strong> · <strong>Nachschlagen</strong> – links die Kapitel-Sidebar</div>
            </div>
            <div className={styles.navExplainItem}>
              <div className={styles.navExplainLabel}>Breadcrumb (oben)</div>
              <div className={styles.navExplainArrow}>→</div>
              <div className={styles.navExplainDesc}>Zeigt deinen Pfad und ermöglicht schnelle Navigation zurück</div>
            </div>
          </div>
        </section>

        {/* ── Tipps ── */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionAccent} />
            <div>
              <h2 className={styles.sectionTitle}>Tipps für den Einstieg</h2>
              <p className={styles.sectionSub}>So holst du das Beste aus der Plattform heraus</p>
            </div>
          </div>

          <div className={styles.tipsGrid}>
            {TIPPS.map((t) => {
              const Icon = t.icon
              return (
                <div key={t.title} className={styles.tipCard}>
                  <div className={styles.tipIcon}>
                    <Icon size={18} style={{ color: '#1c69d4' }} />
                  </div>
                  <div>
                    <div className={styles.tipTitle}>{t.title}</div>
                    <p className={styles.tipDesc}>{t.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Bereit loszulegen?</h2>
          <p className={styles.ctaSub}>Wähle ein Thema auf der Startseite und starte mit der ersten Lektion.</p>
          <button className={styles.ctaBtn} onClick={onStart}>
            Zur Themenübersicht <ArrowRight size={16} />
          </button>
        </section>

      </div>
    </div>
  )
}
