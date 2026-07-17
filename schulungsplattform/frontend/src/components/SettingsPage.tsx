import { Sun, Moon } from 'lucide-react'
import styles from './SettingsPage.module.css'

export type Theme = 'light' | 'dark'

interface Props {
  theme: Theme
  onThemeChange: (t: Theme) => void
}

export default function SettingsPage({ theme, onThemeChange }: Props) {
  return (
    <div className={styles.root}>
      <div className={styles.container}>

        {/* ── Page Header ── */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderAccent} />
          <div>
            <h2 className={styles.pageTitle}>Einstellungen</h2>
            <p className={styles.pageSub}>Passe die Plattform nach deinen Wünschen an.</p>
          </div>
        </div>

        {/* ── Erscheinungsbild ── */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Erscheinungsbild</h3>
          <p className={styles.sectionDesc}>
            Wähle zwischen hellem und dunklem Design.
          </p>

          <div className={styles.themeCards}>
            {/* Light Mode Card */}
            <button
              type="button"
              className={theme === 'light' ? `${styles.themeCard} ${styles.themeCardActive}` : styles.themeCard}
              onClick={() => onThemeChange('light')}
              aria-pressed={theme === 'light'}
            >
              <div className={styles.themePreview} data-preview="light">
                <div className={styles.previewBar} data-preview="light" />
                <div className={styles.previewContent} data-preview="light">
                  <div className={styles.previewLine} style={{ width: '60%' }} />
                  <div className={styles.previewLine} style={{ width: '80%', opacity: 0.5 }} />
                  <div className={styles.previewLine} style={{ width: '45%', opacity: 0.3 }} />
                </div>
              </div>
              <div className={styles.themeCardLabel}>
                <Sun size={16} className={styles.themeIcon} />
                <span>Light</span>
              </div>
              {theme === 'light' && <div className={styles.themeCardCheck} />}
            </button>

            {/* Dark Mode Card */}
            <button
              type="button"
              className={theme === 'dark' ? `${styles.themeCard} ${styles.themeCardActive}` : styles.themeCard}
              onClick={() => onThemeChange('dark')}
              aria-pressed={theme === 'dark'}
            >
              <div className={styles.themePreview} data-preview="dark">
                <div className={styles.previewBar} data-preview="dark" />
                <div className={styles.previewContent} data-preview="dark">
                  <div className={styles.previewLineDark} style={{ width: '60%' }} />
                  <div className={styles.previewLineDark} style={{ width: '80%', opacity: 0.5 }} />
                  <div className={styles.previewLineDark} style={{ width: '45%', opacity: 0.3 }} />
                </div>
              </div>
              <div className={styles.themeCardLabel}>
                <Moon size={16} className={styles.themeIcon} />
                <span>Dark</span>
              </div>
              {theme === 'dark' && <div className={styles.themeCardCheck} />}
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
