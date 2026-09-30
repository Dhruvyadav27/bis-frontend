import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Upload,
  History,
  CheckCircle,
  Clock,
  FileText,
  X,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react'
import {
  getStandards,
  createStandard,
  submitForReview,
  publishStandard,
  importStandards,
  importPdf,
  getStandardHistory,
  bulkImportStandardsJson,
  bulkImportLabsJson,
} from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import BulkJsonImportModal from '../../components/common/BulkJsonImportModal'

const STANDARD_JSON_SAMPLE = `[
  {
    "isNumber": "IS 1234:2020",
    "title": "string",
    "scope": "string",
    "category": "string",
    "revision": "2020",
    "status": "PUBLISHED",
    "documentUrl": "string",
    "regulatoryType": "CRS | QCO | VOLUNTARY",
    "isCompulsory": true,
    "certificationSchemeRef": "CRS",
    "chunks": [
      { "text": "clause text", "clauseRef": "Clause 4.2" }
    ]
  }
]`

const LAB_JSON_SAMPLE = `[
  {
    "name": "string",
    "state": "string",
    "district": "string",
    "recognitionStatus": "BIS Recognized",
    "scope": "e.g. Mechanical & Chemical Testing",
    "standardsCovered": ["IS 1234:2020", "IS 5678:2019"],
    "workingHours": "9:00 AM - 6:00 PM",
    "address": "string"
  }
]`

export default function ManageStandards() {
  const [standards, setStandards] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals & Drawers
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [pdfImportModalOpen, setPdfImportModalOpen] = useState(false)
  const [standardJsonModalOpen, setStandardJsonModalOpen] = useState(false)
  const [labJsonModalOpen, setLabJsonModalOpen] = useState(false)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfType, setPdfType] = useState('standards')
  const [pdfCategory, setPdfCategory] = useState('General')
  const [pdfImporting, setPdfImporting] = useState(false)
  const [pdfResult, setPdfResult] = useState(null)
  const [historyDrawerItem, setHistoryDrawerItem] = useState(null)
  const [historyData, setHistoryData] = useState([])
  const [toastMessage, setToastMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    category: 'Electrotechnical',
    effectiveDate: '',
  })

  // Import mock CSV state
  const [importText, setImportText] = useState('')

  const fetchStandardsList = async () => {
    setLoading(true)
    const data = await getStandards({ search, status: statusFilter })
    setStandards(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchStandardsList()
  }, [search, statusFilter])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.code) return
    await createStandard(formData)
    setAddModalOpen(false)
    setFormData({ code: '', title: '', category: 'Electrotechnical', effectiveDate: '' })
    showToast('New standard created as DRAFT. Dual-admin review required to publish.')
    fetchStandardsList()
  }

  const handlePublish = async (id, code) => {
    await publishStandard(id)
    showToast(`Standard ${code} successfully PUBLISHED to official directory.`)
    fetchStandardsList()
  }

  const handleSubmitReview = async (id, code) => {
    await submitForReview(id)
    showToast(`Standard ${code} submitted to pending review queue.`)
    fetchStandardsList()
  }

  const handleOpenHistory = async (row) => {
    setHistoryDrawerItem(row)
    const hist = await getStandardHistory(row.id)
    setHistoryData(hist)
  }

  const handlePdfImportSubmit = async (e) => {
    e.preventDefault()
    if (!pdfFile) {
      showToast('Please select a PDF file first.')
      return
    }

    if (pdfFile.type !== 'application/pdf') {
      showToast('Only PDF files are supported.')
      return
    }

    try {
      setPdfImporting(true)
      setPdfResult(null)
      const result = await importPdf(pdfFile, { type: pdfType, category: pdfCategory })
      setPdfResult(result)
      showToast(`PDF processed: ${result.created} created, ${result.updated} updated, ${result.skipped} skipped.`)
      await fetchStandardsList()
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'PDF import failed.'
      showToast(message)
    } finally {
      setPdfImporting(false)
    }
  }

  const handleImportSubmit = async (e) => {
    e.preventDefault()
    // Parse sample CSV lines
    const lines = importText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const parsed = lines.map((line) => {
      const parts = line.split(',')
      return {
        code: parts[0]?.trim() || 'IS 00000:2026',
        title: parts[1]?.trim() || 'Imported Standard Record',
        category: parts[2]?.trim() || 'Imported Category',
      }
    })

    if (parsed.length === 0) {
      // Provide fallback mock items if input empty
      parsed.push({
        code: 'IS 15410:2026',
        title: 'Mineral Water Safety and Quality Verification Parameters',
        category: 'Food & Beverages',
      })
    }

    await importStandards(parsed)
    setImportModalOpen(false)
    setImportText('')
    showToast(`Successfully imported ${parsed.length} standards into DRAFT status.`)
    fetchStandardsList()
  }

  const columns = [
    {
      key: 'code',
      header: 'Standard Code',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 font-mono text-xs">{val}</span>
          <p className="text-[10px] text-slate-400">Ver. {row.version}</p>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title & Scope',
      render: (val) => <span className="font-medium text-slate-800 line-clamp-2 max-w-md">{val}</span>,
    },
    {
      key: 'category',
      header: 'Sectional Domain',
      render: (val) => (
        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 font-medium">
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Workflow State',
      render: (val) => {
        if (val === 'published') {
          return (
            <Badge tone="success" className="text-[11px]">
              <CheckCircle size={11} /> Published
            </Badge>
          )
        }
        if (val === 'pending_review') {
          return (
            <Badge tone="warning" className="text-[11px]">
              <Clock size={11} /> Pending 2nd Admin
            </Badge>
          )
        }
        return (
          <Badge tone="neutral" className="text-[11px]">
            Draft
          </Badge>
        )
      },
    },
    {
      key: 'lastModified',
      header: 'Last Modified',
      render: (val) => <span className="text-slate-500 text-[11px]">{val}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status === 'draft' && (
            <Button
              size="xs"
              variant="secondary"
              onClick={() => handleSubmitReview(row.id, row.code)}
              className="text-[11px]"
            >
              Submit Review
            </Button>
          )}

          {row.status === 'pending_review' && (
            <Button
              size="xs"
              onClick={() => handlePublish(row.id, row.code)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] flex items-center gap-1"
            >
              <Check size={12} /> Approve &amp; Publish
            </Button>
          )}

          <button
            type="button"
            onClick={() => handleOpenHistory(row)}
            title="View Version History"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <History size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-poppins text-xl font-bold text-slate-900">Manage Indian Standards</h1>
          <p className="text-xs text-slate-500">
            Publish, update, and audit standards. All additions start in DRAFT and require dual-admin validation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setPdfResult(null)
              setPdfFile(null)
              setPdfImportModalOpen(true)
            }}
            className="flex items-center gap-1.5"
          >
            <FileText size={14} /> Import PDF
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setImportModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Upload size={14} /> Import CSV
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setStandardJsonModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Upload size={14} /> Import Standards JSON
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setLabJsonModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Upload size={14} /> Import Labs JSON
          </Button>
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Add Standard
          </Button>
        </div>
      </div>

      {/* Search & Tabs Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by standard code, title, or category..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-primary-600"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'published', label: 'Published' },
            { id: 'pending_review', label: 'Pending Review' },
            { id: 'draft', label: 'Drafts' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-md px-3 py-1 font-medium transition-all ${
                statusFilter === tab.id
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Standards Data Table */}
      <Table
        columns={columns}
        data={standards}
        rowKey="id"
        emptyMessage={loading ? 'Loading standards catalogue…' : 'No standards match your filter criteria.'}
      />

      {/* 1. Add Standard Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Create New Standard (Draft)
              </h3>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Standard Code &amp; Year
                </label>
                <input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. IS 1293:2026"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Statutory Title
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Official description and specifications..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600 bg-white"
                  >
                    <option>Electrotechnical</option>
                    <option>Electronics &amp; IT</option>
                    <option>Precious Metals</option>
                    <option>Consumer Products</option>
                    <option>Food &amp; Agriculture</option>
                    <option>Civil Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Effective Date</label>
                  <input
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-800">
                <p className="font-semibold flex items-center gap-1">
                  <AlertCircle size={13} /> Draft Status Guard
                </p>
                <p className="mt-0.5">
                  Submissions are initialized in Draft mode. A second authorized administrator must verify and approve before public release.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
                  Save as Draft
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PDF Bulk Import Modal */}
      {pdfImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-poppins text-sm font-bold text-slate-900">Bulk Import from PDF</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Upload a BIS PDF and let the backend extract and update records.</p>
              </div>
              <button
                type="button"
                onClick={() => !pdfImporting && setPdfImportModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                disabled={pdfImporting}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handlePdfImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Data Type</label>
                <select
                  value={pdfType}
                  onChange={(e) => setPdfType(e.target.value)}
                  disabled={pdfImporting}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600 bg-white"
                >
                  <option value="standards">Standards</option>
                  <option value="labs">Labs</option>
                </select>
              </div>

              {pdfType === 'standards' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={pdfCategory}
                    onChange={(e) => setPdfCategory(e.target.value)}
                    disabled={pdfImporting}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600 bg-white"
                  >
                    <option>General</option>
                    <option>Electrotechnical</option>
                    <option>Electronics & IT</option>
                    <option>Precious Metals</option>
                    <option>Consumer Products</option>
                    <option>Food & Agriculture</option>
                    <option>Civil Engineering</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PDF File</label>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={pdfImporting}
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-2.5 file:py-1.5 file:text-[11px] file:font-semibold"
                />
                {pdfFile && (
                  <p className="mt-1.5 text-[10px] text-slate-500 truncate">Selected: {pdfFile.name}</p>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 p-3 border border-amber-200 text-[11px] text-amber-800">
                <p className="font-semibold flex items-center gap-1"><AlertCircle size={13} /> Safe bulk update</p>
                <p className="mt-0.5">Standards imported from PDF are staged as DRAFT. OCR/parser warnings are returned for admin review.</p>
              </div>

              {pdfResult && (
                <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1"><CheckCircle size={13} /> Import completed</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <span>Pages: <strong>{pdfResult.pages ?? 0}</strong></span>
                    <span>OCR pages: <strong>{pdfResult.ocrPages ?? 0}</strong></span>
                    <span>Detected: <strong>{pdfResult.detectedRows ?? 0}</strong></span>
                    <span>Created: <strong>{pdfResult.created ?? 0}</strong></span>
                    <span>Updated: <strong>{pdfResult.updated ?? 0}</strong></span>
                    <span>Skipped: <strong>{pdfResult.skipped ?? 0}</strong></span>
                  </div>
                  {pdfResult.warnings?.length > 0 && (
                    <div className="pt-2 mt-1 border-t border-emerald-200">
                      <p className="font-semibold">Warnings</p>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 max-h-20 overflow-y-auto">
                        {pdfResult.warnings.slice(0, 5).map((warning, idx) => <li key={idx}>{warning}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" disabled={pdfImporting} onClick={() => setPdfImportModalOpen(false)}>
                  {pdfResult ? 'Close' : 'Cancel'}
                </Button>
                {!pdfResult && (
                  <Button type="submit" disabled={pdfImporting || !pdfFile} className="bg-primary hover:bg-primary-700 text-white disabled:opacity-50">
                    {pdfImporting ? 'Processing PDF…' : 'Upload & Import'}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CSV Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Import Standards Batch (CSV / TSV)
              </h3>
              <button
                type="button"
                onClick={() => setImportModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste CSV Records (Code, Title, Category)
                </label>
                <textarea
                  rows={5}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="IS 15410:2026, Mineral Water Safety Requirements, Food &amp; Beverage&#10;IS 616:2026, Audio Video Apparatus Safety, Electronics"
                  className="w-full font-mono text-xs rounded-lg border border-slate-200 p-3 text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-600">
                All imported rows will be placed in the <strong>Drafts</strong> staging partition for review.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setImportModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Process Import Batch
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Version History Drawer */}
      {historyDrawerItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase">Audit Trail</span>
                <h3 className="font-poppins text-sm font-bold text-slate-900">
                  {historyDrawerItem.code}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryDrawerItem(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <p className="text-xs text-slate-500">
                Permanent cryptographic and editor modification ledger for regulatory compliance.
              </p>

              <div className="space-y-3">
                {historyData.map((ver, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 p-3.5 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-900">Version {ver.version}</span>
                      <span className="text-[10px] text-slate-400">{ver.date}</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">{ver.change}</p>
                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/60 pt-2 text-[11px] text-slate-500">
                      <span>Edited by: {ver.editor}</span>
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Restored version ${ver.version} into active draft.`)
                          setHistoryDrawerItem(null)
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        <RotateCcw size={11} /> Restore
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {standardJsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import Standards (JSON)"
          description="Paste a JSON array of standard objects with pre-split clause chunks. Status PUBLISHED embeds them immediately."
          sampleJson={STANDARD_JSON_SAMPLE}
          onImport={bulkImportStandardsJson}
          onClose={() => setStandardJsonModalOpen(false)}
          onDone={fetchStandardsList}
        />
      )}

      {labJsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import Labs (JSON)"
          description="Paste a JSON array of lab objects."
          sampleJson={LAB_JSON_SAMPLE}
          onImport={bulkImportLabsJson}
          onClose={() => setLabJsonModalOpen(false)}
          onDone={fetchStandardsList}
        />
      )}
    </div>
  )
}
