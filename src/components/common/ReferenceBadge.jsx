import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookMarked, Loader2 } from 'lucide-react'
import Modal from './Modal'
import { getClauseText } from '../../api/clauseApi'

// Tappable citation badge — clicking it fetches and shows the full clause text in a modal.
// The backend returns the text already translated into the active language (Sarvam AI) along
// with the English original, so the person can always check the authoritative wording.
export default function ReferenceBadge({ doc, clause }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.resolvedLanguage || i18n.language || 'en'

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null) // { text, originalText, translated, lang }
  const [showOriginal, setShowOriginal] = useState(false)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await getClauseText(doc, clause)
      setData({
        text: res.text || '',
        originalText: res.originalText || '',
        translated: Boolean(res.translated),
        lang,
      })
    } catch {
      setError(t('clause.error'))
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    setOpen(true)
    setShowOriginal(false)
    // A cached copy is only reusable while the language is unchanged (the text is translated server-side).
    if (loading || (data && data.lang === lang)) return
    load()
  }

  const clauseLabel = t('clause.label')
  const shown = showOriginal && data?.originalText ? data.originalText : data?.text

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-md border border-primary-200/80 bg-primary-50/70 px-2.5 py-1 text-xs font-semibold text-primary-800 shadow-2xs hover:bg-primary-100 hover:border-primary-300 transition-colors cursor-pointer"
      >
        <BookMarked size={13} className="text-primary-600" />
        <span>{doc}</span>
        {clause && (
          <span className="rounded bg-primary-100/70 px-1.5 py-0.5 text-[11px] font-medium text-primary-900">
            {clauseLabel} {clause}
          </span>
        )}
      </button>

      {open && (
        <Modal title={`${doc}${clause ? ` — ${clauseLabel} ${clause}` : ''}`} onClose={() => setOpen(false)}>
          {loading && (
            <div className="flex items-center gap-2 text-slate-500 py-4">
              <Loader2 size={16} className="animate-spin" /> {t('clause.loading')}
            </div>
          )}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && data && (
            <>
              <p className="whitespace-pre-wrap">{shown || t('clause.noText')}</p>
              {data.translated && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                  <span>{t('clause.machineTranslated')}</span>
                  {data.originalText && (
                    <button
                      type="button"
                      onClick={() => setShowOriginal((v) => !v)}
                      className="font-semibold text-primary hover:underline"
                    >
                      {showOriginal ? t('clause.showTranslated') : t('clause.showOriginal')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  )
}
