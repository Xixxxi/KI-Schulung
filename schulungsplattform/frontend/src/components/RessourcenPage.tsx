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
    desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Die Plattform bietet tausende vortrainierte Modelle, Datensätze und Demos – ideal zum Einstieg in die Praxis.',
  },
  {
    id: 'r2',
    title: 'BMW Group Developer Hub',
    url: 'https://developer.bmwgroup.net',
    displayUrl: 'developer.bmwgroup.net',
    tag: 'BMW-intern',
    tagType: 'bmw',
    image: 'https://picsum.photos/seed/bmw-dev-hub/600/380',
    desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis. Hier findest du interne APIs, SDKs und Entwicklerdokumentationen, die speziell für den Einsatz im BMW Group Ökosystem bereitgestellt werden.',
  },
  {
    id: 'r3',
    title: 'arXiv – AI & Machine Learning',
    url: 'https://arxiv.org/list/cs.AI/recent',
    displayUrl: 'arxiv.org/cs.AI',
    tag: 'Allgemein',
    tagType: 'general',
    image: 'https://picsum.photos/seed/arxiv-ai/600/380',
    desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur adipisci velit. arXiv ist das führende Open-Access-Archiv für Preprints aus KI und maschinellem Lernen – täglich aktuell und kostenlos zugänglich.',
  },
]

export default function RessourcenPage() {
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
        </div>
      </header>

      {/* ── Ressourcen-Liste ── */}
      <div className={styles.content}>
        <div className={styles.list}>
          {/* Vertikale Mittellinie */}
          <div className={styles.centerLine} />

          {RESOURCES.map((res, i) => {
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
                  <div className={styles.dot} />
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
                    className={styles.btn}
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
