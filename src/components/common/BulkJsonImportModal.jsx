import { useState } from 'react'
import { X, UploadCloud, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from './Button'

/**
 * Generic "paste a JSON array, hit import" modal — used by every admin page that
 * has a POST /api/admin/.../bulk-import-json endpoint (Standards, Labs, Schemes,
 * Services, Consumer Rules, HUID Records). Each page just passes its own
 * `onImport` function (the matching adminApi.js call) and a sample to show.
 */
export default function BulkJsonImportModal({ title, description, sampleJson, onImport, onClose, onDone }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError('')
    setResult(null)

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      setError('Invalid JSON — could not parse. Check for missing commas/brackets.')
      return
    }

    if (!Array.isArray(parsed)) {
      setError('Expected a JSON array (e.g. [ { ... }, { ... } ]), even for a single record.')
      return
    }

    setSubmitting(true)
    try {
      const data = await onImport(parsed)
      setResult(data)
      onDone?.()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Import failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="font-poppins text-sm font-bold text-slate-900">{title}</h3>
            {description && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        <label className="block text-xs font-semibold text-slate-700 mb-1">
          Paste a JSON array below
        </label>
        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={sampleJson}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-mono text-slate-800 outline-none focus:border-primary-600"
        />

        {sampleJson && (
          <details className="mt-2">
            <summary className="cursor-pointer text-[11px] text-primary-700 font-medium">
              Show expected format
            </summary>
            <pre className="mt-1 rounded-lg bg-slate-50 border border-slate-200 p-3 text-[10px] text-slate-600 overflow-x-auto">
{sampleJson}
            </pre>
          </details>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-[11px] text-amber-900">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-[11px] text-emerald-900">
            <CheckCircle size={14} className="shrink-0 mt-0.5" />
            <span>Import completed — <strong>{result.importedCount ?? 0}</strong> record(s) imported.</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
            className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5"
          >
            <UploadCloud size={14} /> {submitting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </div>
    </div>
  )
}
