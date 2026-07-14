import { useEffect, useMemo, useState } from 'react'
import {
  Loader2, CheckCircle2, XCircle, Info, Lightbulb, RotateCcw, Library, BookOpen, Send,
} from 'lucide-react'
import styles from './TestPanel.module.css'
import { api } from '../api'

export default function TestPanel({ chapterId, passed, onPassed, onBackToLearn, onOpenReference }) {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [answers, setAnswers] = useState({}) // { qId: value }
  const [result, setResult] = useState(null) // Auswertungsergebnis nach Abgabe
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setResult(null)
    setAnswers({})
    api
      .getQuiz(chapterId)
      .then((d) => {
        if (active) setQuiz(d)
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Quiz konnte nicht geladen werden.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [chapterId])

  const questions = useMemo(() => quiz?.questions || [], [quiz])

  // Ergebnis-Feedback pro Frage (nach Abgabe)
  const resultById = useMemo(() => {
    const map = {}
    ;(result?.results || []).forEach((r) => {
      map[r.id] = r
    })
    return map
  }, [result])

  const answeredCount = useMemo(() => {
    return questions.filter((q) => {
      const v = answers[q.id]
      if (q.type === 'multi') return Array.isArray(v) && v.length > 0
      if (q.type === 'text') return String(v || '').trim().length > 0
      return v != null && v !== ''
    }).length
  }, [questions, answers])

  const allAnswered = questions.length > 0 && answeredCount === questions.length

  function setSingle(qId, optionIndex) {
    if (result) return // Nach Abgabe gesperrt
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }))
  }

  function toggleMulti(qId, optionIndex) {
    if (result) return
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : []
      const next = current.includes(optionIndex)
        ? current.filter((i) => i !== optionIndex)
        : [...current, optionIndex]
      return { ...prev, [qId]: next }
    })
  }

  function setText(qId, value) {
    if (result) return
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  async function submit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await api.evaluateQuiz(chapterId, answers)
      setResult(res)
      if (res?.passed) onPassed?.()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err?.message || 'Auswertung fehlgeschlagen.')
    } finally {
      setSubmitting(false)
    }
  }

  function retry() {
    setResult(null)
    setAnswers({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className={styles.panel}>
        <Loader2 size={18} className="spin" /> Lade Quiz…
      </div>
    )
  }

  if (error && !quiz) {
    return <div className={styles.panel}>{error}</div>
  }

  return (
    <div className={styles.panel}>
      <h1 className={styles.title}>Wissenstest: {quiz?.title}</h1>
      <p className={styles.intro}>
        Beantworte alle {questions.length} Fragen. Zum Bestehen sind{' '}
        {quiz?.passThreshold != null ? Math.round(quiz.passThreshold * 100) : 70}% richtige
        Antworten nötig. Die Auswertung erfolgt sicher im Backend.
      </p>

      {/* Ergebnis-Banner */}
      {result && (
        <div
          className={`${styles.resultBanner} ${result.passed ? styles.resultPassed : styles.resultFailed}`}
        >
          <div className={styles.resultIcon}>
            {result.passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          </div>
          <div>
            <p className={styles.resultTitle}>
              {result.passed ? 'Bestanden! 🎉' : 'Noch nicht bestanden'}
            </p>
            <p className={styles.resultText}>
              {result.correctCount} von {result.total} richtig ({result.scorePercent}%). Benötigt:{' '}
              {result.passThresholdPercent}%.
            </p>
            {!result.passed && (result.recommendedLessons || []).length > 0 && (
              <div className={styles.recommend}>
                Empfehlung – diese Lektionen noch einmal ansehen:
                <ul>
                  {result.recommendedLessons.map((l) => (
                    <li key={l.id}>{l.title}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.passed && (
              <div className={styles.recommend}>
                Das Nachschlagewerk ist jetzt offiziell freigeschaltet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fortschritt */}
      {!result && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
            />
          </div>
          <span className={styles.progressText}>
            {answeredCount} / {questions.length} beantwortet
          </span>
        </div>
      )}

      {/* Fragen */}
      {questions.map((q, idx) => {
        const feedback = resultById[q.id]
        const questionCls = feedback
          ? feedback.correct
            ? `${styles.question} ${styles.questionCorrect}`
            : `${styles.question} ${styles.questionWrong}`
          : styles.question

        return (
          <div key={q.id} className={questionCls}>
            <div className={styles.questionHead}>
              <span className={styles.qNum}>{idx + 1}</span>
              <span className={styles.qText}>
                {q.question}
                <span className={styles.qType}>
                  {q.type === 'multi'
                    ? 'Mehrfachauswahl'
                    : q.type === 'text'
                      ? 'Freitext'
                      : 'Einfachauswahl'}
                </span>
              </span>
            </div>

            {/* Antwortoptionen */}
            {q.type === 'text' ? (
              <div>
                <textarea
                  className={styles.textInput}
                  rows={3}
                  placeholder="Deine Antwort…"
                  value={answers[q.id] || ''}
                  disabled={Boolean(result)}
                  onChange={(e) => setText(q.id, e.target.value)}
                />
                {q.hint && !result && (
                  <div className={styles.hint}>
                    <Lightbulb size={12} /> {q.hint}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.options}>
                {(q.options || []).map((opt, optIdx) => {
                  const selected =
                    q.type === 'multi'
                      ? Array.isArray(answers[q.id]) && answers[q.id].includes(optIdx)
                      : answers[q.id] === optIdx

                  // Nach Abgabe: richtige/falsche Optionen einfärben
                  let stateCls = ''
                  if (feedback) {
                    const correctAns = feedback.correctAnswer
                    const isCorrectOption =
                      q.type === 'multi'
                        ? Array.isArray(correctAns) && correctAns.includes(opt)
                        : correctAns === opt
                    if (isCorrectOption) stateCls = styles.optionCorrect
                    else if (selected) stateCls = styles.optionWrong
                  } else if (selected) {
                    stateCls = styles.optionSelected
                  }

                  return (
                    <label key={optIdx} className={`${styles.option} ${stateCls}`}>
                      <input
                        type={q.type === 'multi' ? 'checkbox' : 'radio'}
                        name={q.id}
                        checked={selected}
                        disabled={Boolean(result)}
                        onChange={() =>
                          q.type === 'multi' ? toggleMulti(q.id, optIdx) : setSingle(q.id, optIdx)
                        }
                      />
                      {opt}
                    </label>
                  )
                })}
              </div>
            )}

            {/* Feedback nach Abgabe */}
            {feedback && (
              <div
                className={`${styles.feedback} ${feedback.correct ? styles.feedbackCorrect : styles.feedbackWrong}`}
              >
                <div className={styles.feedbackLabel}>
                  {feedback.correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {feedback.correct ? 'Richtig' : 'Nicht ganz'}
                </div>
                {feedback.explanation && <div>{feedback.explanation}</div>}
                {!feedback.correct && q.type === 'text' && feedback.correctAnswer?.keywords && (
                  <div className={styles.correctAnswer}>
                    Erwartete Schlüsselbegriffe: {feedback.correctAnswer.keywords.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {error && <div className={styles.hint}>{error}</div>}

      {/* Aktionen */}
      <div className={styles.actions}>
        {!result ? (
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={submit}
            disabled={!allAnswered || submitting}
            title={!allAnswered ? 'Bitte zuerst alle Fragen beantworten' : ''}
          >
            {submitting ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
            Antworten auswerten
          </button>
        ) : (
          <button type="button" className={styles.primaryBtn} onClick={retry}>
            <RotateCcw size={16} />
            Erneut versuchen
          </button>
        )}

        <button type="button" className={styles.secondaryBtn} onClick={onBackToLearn}>
          <BookOpen size={16} />
          Zurück zum Lernen
        </button>

        {(passed || result?.passed) && (
          <button type="button" className={styles.secondaryBtn} onClick={onOpenReference}>
            <Library size={16} />
            Zum Nachschlagewerk
          </button>
        )}
      </div>
    </div>
  )
}
