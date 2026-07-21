import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import styles from './RessourcenPage.module.css'

interface Resource {
  id: string
  title: string
  url: string
  displayUrl: string
  tag: string
  tagType: 'general' | 'bmw'
  image: string
  desc: string
}

const RESOURCES: Resource[] = [
  {
    id: 'r1',
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    displayUrl: 'huggingface.co',
    tag: 'Allgemein',
    tagType: 'general',
    image: 'https://picsum.photos/seed/hf-portal/600/380',
    desc: 'Hugging Face ist die zentrale Community-Plattform für Open-Source-KI. Du findest dort tausende vortrainierte Sprachmodelle, Bildmodelle und Datensätze zum direkten Download und Ausprobieren. Über den integrierten „Spaces"-Bereich lassen sich Live-Demos ohne eigene Infrastruktur starten. Für alle, die praktisch mit Modellen arbeiten wollen, ist Hugging Face der erste Anlaufpunkt.',
  },
  {
    id: 'r3',
    title: 'arXiv – AI & Machine Learning',
    url: 'https://arxiv.org/list/cs.AI/recent',
    displayUrl: 'arxiv.org/cs.AI',
    tag: 'Allgemein',
    tagType: 'general',
    image: 'https://picsum.photos/seed/arxiv-ai/600/380',
    desc: 'arXiv ist das weltweit führende Open-Access-Archiv für wissenschaftliche Preprints. In der Kategorie cs.AI und cs.LG werden täglich neue Forschungsarbeiten zu großen Sprachmodellen, Agenten-Architekturen, Reinforcement Learning und mehr veröffentlicht — kostenlos und noch vor dem offiziellen Peer-Review-Prozess. Ideal, um immer auf dem neuesten Stand der KI-Forschung zu bleiben.',
  },
  {
    id: 'r4',
    title: 'LangChain Docs',
    url: 'https://docs.langchain.com',
    displayUrl: 'docs.langchain.com',
    tag: 'Allgemein',
    tagType: 'general',
    image: 'https://picsum.photos/seed/langchain-docs/600/380',
    desc: 'Die offizielle LangChain-Dokumentation ist das Nachschlagewerk für das meistgenutzte Framework zum Bauen von KI-Agenten und LLM-Applikationen. Sie erklärt Konzepte wie Chains, Tools, Memory und RAG-Pipelines anhand konkreter Code-Beispiele in Python und TypeScript. Ob Einstieg oder fortgeschrittene Multi-Agent-Architektur — hier findet man die passende Anleitung.',
  },
  {
    id: 'r2',
    title: 'BMW Group Developer Hub',
    url: 'https://developer.bmwgroup.net',
    displayUrl: 'developer.bmwgroup.net',
    tag: 'BMW-intern',
    tagType: 'bmw',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=380&fit=crop',
    desc: 'Der BMW Group Developer Hub ist das zentrale Entwicklerportal für alle, die in der BMW Group Software entwickeln. Hier sind interne APIs, SDKs, Plattform-Dokumentationen und Onboarding-Guides gebündelt. Der Hub stellt sicher, dass Teams auf standardisierte, bereits compliance-geprüfte Bausteine zurückgreifen können — statt jedes Mal von Grund auf neu zu starten.',
  },
  {
    id: 'r5',
    title: 'AI Native @ BMW Group',
    url: 'https://ainative.bmwgroup.net/',
    displayUrl: 'ainative.bmwgroup.net',
    tag: 'BMW-intern',
    tagType: 'bmw',
    image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=380&fit=crop',
    desc: 'AI Native ist das interne KI-Portal der BMW Group und bündelt Strategie, Tooling und Community rund um den unternehmensweiten KI-Einsatz. Hier findet man Use-Case-Bibliotheken, Informationen zu genehmigten KI-Plattformen, Leitfäden für verantwortungsvollen KI-Einsatz sowie den Zugang zu internen KI-Produkten und -Services — der Ausgangspunkt für alle, die KI in ihrem Arbeitsbereich einsetzen oder vorantreiben wollen.',
  },
  {
    id: 'r6',
    title: 'AI Kit – Software Factory',
    url: 'https://cc-github.bmwgroup.net/pages/software-factory/ai-kit/#/',
    displayUrl: 'cc-github.bmwgroup.net · ai-kit',
    tag: 'BMW-intern',
    tagType: 'bmw',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=380&fit=crop',
    desc: 'Das AI Kit der BMW Software Factory stellt Entwicklern ein internes Toolkit für die schnelle, standardisierte Umsetzung KI-gestützter Applikationen bereit. Es enthält wiederverwendbare Komponenten, vorkonfigurierte Pipelines und dokumentierte Patterns — abgestimmt auf die technischen und regulatorischen Anforderungen der BMW Group. Ideal als Startpunkt für neue KI-Projekte innerhalb der Softwareentwicklung.',
  },
  {
    id: 'r7',
    title: 'BMW Group Skills',
    url: 'https://skills.bmwgroup.net/',
    displayUrl: 'skills.bmwgroup.net',
    tag: 'BMW-intern',
    tagType: 'bmw',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=380&fit=crop',
    desc: 'BMW Group Skills ist die interne Lern- und Kompetenzplattform für alle Mitarbeitenden. Hier können gezielt Weiterbildungsangebote zu Technologie, KI, Leadership und Fachthemen gesucht und absolviert werden. Die Plattform ermöglicht es außerdem, das eigene Kompetenzprofil zu pflegen und Lernpfade zu verfolgen — ein zentraler Baustein für die kontinuierliche Weiterentwicklung innerhalb der BMW Group.',
  },
]

export default function RessourcenPage() {
  const [activeView, setActiveView] = useState<'general' | 'bmw'>('general')

  const filtered = RESOURCES.filter(r => r.tagType === activeView)

  return (
    <div className={styles.root}>

      {/* ── Hero ── */}
      <header className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroEyebrow}>
            <div className={styles.heroEyebrowLine} />
            <span>Externe Ressourcen</span>
          </div>
          <h1 className={styles.heroTitle}>Ressourcen</h1>
          <p className={styles.heroSub}>
            Eine kuratierte Auswahl an Websites, Portalen und Tools rund um
            Künstliche Intelligenz — von allgemeinen Quellen bis zu internen
            BMW-Angeboten.
          </p>

          {/* ── Toggle Switch ── */}
          <div className={styles.toggle}>
            <button
              className={`${styles.toggleBtn} ${activeView === 'general' ? styles.toggleBtnActive : ''}`}
              onClick={() => setActiveView('general')}
            >
              🌐 Allgemein
            </button>
            <button
              className={`${styles.toggleBtn} ${activeView === 'bmw' ? styles.toggleBtnActiveBMW : ''}`}
              onClick={() => setActiveView('bmw')}
            >
              🔷 BMW-Intern
            </button>
          </div>
        </div>
      </header>

      {/* ── Ressourcen-Liste ── */}
      <div className={styles.content}>
        <div className={styles.list}>
          {/* Vertikale Mittellinie */}
          <div className={styles.centerLine} />

          {filtered.map((res, i) => {
            const reversed = i % 2 === 1
            return (
              <div
                key={res.id}
                className={`${styles.item} ${reversed ? styles.itemReverse : ''}`}
              >
                {/* ── Bild-Seite ── */}
                <div className={styles.imageCol}>
                  <div className={styles.browserFrame}>
                    <div className={styles.browserBar}>
                      <span className={styles.browserDot} />
                      <span className={styles.browserDot} />
                      <span className={styles.browserDot} />
                      <span className={styles.browserUrl}>{res.displayUrl}</span>
                    </div>
                    <img
                      src={res.image}
                      alt={`Screenshot: ${res.title}`}
                      className={styles.screenshot}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* ── Connector-Dot ── */}
                <div className={styles.connectorCol}>
                  <div className={`${styles.dot} ${res.tagType === 'bmw' ? styles.dotBMW : ''}`} />
                </div>

                {/* ── Text-Seite ── */}
                <div className={styles.textCol}>
                  <span
                    className={`${styles.tag} ${
                      res.tagType === 'bmw' ? styles.tagBMW : styles.tagGeneral
                    }`}
                  >
                    {res.tag}
                  </span>
                  <h2 className={styles.title}>{res.title}</h2>
                  <p className={styles.desc}>{res.desc}</p>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.btn} ${res.tagType === 'bmw' ? styles.btnBMW : ''}`}
                  >
                    <ExternalLink size={14} />
                    Website öffnen
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
