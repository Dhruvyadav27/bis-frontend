import { useState, useEffect } from 'react'
import { Award, Plus, CheckCircle, Clock, ShieldCheck, X, Check, UploadCloud } from 'lucide-react'
import { getSchemes, createScheme, publishScheme, bulkImportSchemesJson } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import BulkJsonImportModal from '../../components/common/BulkJsonImportModal'

const SCHEME_SAMPLE_JSON = `[
  {
    "schemeName": "Scheme I / Simplified Procedure / FMCS",
    "description": "string",
    "eligibility": "string — e.g. Indian MSME with Udyam registration",
    "documentsRequired": ["Udyam registration", "Test report"],
    "processSteps": [
      { "step": 1, "title": "Apply on Manak Online", "description": "string" }
    ],
    "estimatedTimeline": "45-60 days",
    "status": "PUBLISHED"
  }
]`

export default function ManageSchemes() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    productsCovered: 0,
    mandatoryItems: 0,
  })

  const loadData = async () => {
    setLoading(true)
    const data = await getSchemes()
    setSchemes(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code) return
    await createScheme(formData)
    setAddModalOpen(false)
    setFormData({ code: '', name: '', description: '', productsCovered: 0, mandatoryItems: 0 })
    showToast('New certification scheme created as DRAFT.')
    loadData()
  }

  const handlePublish = async (id, name) => {
    await publishScheme(id)
    showToast(`Scheme "${name}" published successfully.`)
    loadData()
  }

  const columns = [
    {
      key: 'code',
      header: 'Scheme Identifier',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 font-mono text-xs">{val}</span>
          <p className="text-[10px] text-slate-400">Ver. {row.version}</p>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Scheme Classification',
      render: (val, row) => (
        <div>
          <p className="font-medium text-slate-800 text-xs">{val}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-md line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'productsCovered',
      header: 'Scope Coverage',
      render: (val, row) => (
        <span className="text-xs text-slate-700">
          <strong>{val}</strong> items ({row.mandatoryItems} mandatory)
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) =>
        val === 'published' ? (
          <Badge tone="success" className="text-[11px]">
            <CheckCircle size={11} /> Published
          </Badge>
        ) : (
          <Badge tone="neutral" className="text-[11px]">
            Draft
          </Badge>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== 'published' ? (
            <Button
              size="xs"
              onClick={() => handlePublish(row.id, row.name)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] flex items-center gap-1"
            >
              <Check size={12} /> Publish Scheme
            </Button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Active in Production</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-poppins text-xl font-bold text-slate-900">Manage Certification Schemes</h1>
          <p className="text-xs text-slate-500">
            Configure ISI Mark (Scheme I), CRS (Scheme II), and FMCS regulatory frameworks and compliance tracks.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setJsonModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <UploadCloud size={14} /> Bulk Import JSON
          </Button>
          <Button
            size="sm"
            onClick={() => setAddModalOpen(true)}
            className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} /> Add Certification Scheme
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={schemes}
        rowKey="id"
        emptyMessage={loading ? 'Loading schemes...' : 'No schemes configured.'}
      />

      {/* Add Scheme Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">Create Certification Scheme (Draft)</h3>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Scheme Identifier</label>
                <input
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. Scheme VI (Environmental Labels)"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Formal Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eco-Mark Certification Scheme"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Regulatory Summary</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Governing rules, test criteria, and applicant eligibility..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Products</label>
                  <input
                    type="number"
                    value={formData.productsCovered}
                    onChange={(e) => setFormData({ ...formData, productsCovered: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mandatory QCOs</label>
                  <input
                    type="number"
                    value={formData.mandatoryItems}
                    onChange={(e) => setFormData({ ...formData, mandatoryItems: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
                  Save Draft Scheme
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {jsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import Certification Schemes"
          description="Paste a JSON array of scheme objects. Status PUBLISHED embeds the scheme immediately for the AI Assistant."
          sampleJson={SCHEME_SAMPLE_JSON}
          onImport={bulkImportSchemesJson}
          onClose={() => setJsonModalOpen(false)}
          onDone={loadData}
        />
      )}
    </div>
  )
}
