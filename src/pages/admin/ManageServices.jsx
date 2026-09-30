import { useState, useEffect } from 'react'
import { Server, Plus, CheckCircle, Activity, Globe, X, Check, UploadCloud } from 'lucide-react'
import { getServices, createService, publishService, bulkImportServicesJson } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import BulkJsonImportModal from '../../components/common/BulkJsonImportModal'

const SERVICE_SAMPLE_JSON = `[
  {
    "serviceName": "Hallmarking",
    "category": "Precious Metals",
    "description": "string",
    "procedure": [
      { "step": 1, "description": "Jeweller BIS registration leta hai" }
    ],
    "status": "PUBLISHED"
  }
]`

export default function ManageServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    endpoint: '',
    description: '',
  })

  const loadData = async () => {
    setLoading(true)
    const data = await getServices()
    setServices(data)
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
    if (!formData.name || !formData.endpoint) return
    await createService(formData)
    setAddModalOpen(false)
    setFormData({ name: '', slug: '', endpoint: '', description: '' })
    showToast('New digital service registered in DRAFT state.')
    loadData()
  }

  const handlePublish = async (id, name) => {
    await publishService(id)
    showToast(`Service "${name}" published to production routing.`)
    loadData()
  }

  const columns = [
    {
      key: 'name',
      header: 'Service Subsystem',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs">{val}</span>
          <p className="text-[11px] text-slate-500 line-clamp-1">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'endpoint',
      header: 'API Route',
      render: (val) => (
        <span className="font-mono text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
          {val}
        </span>
      ),
    },
    {
      key: 'uptime',
      header: 'Telemetry & Uptime',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
          <Activity size={12} className="text-emerald-500" />
          {val || '99.9%'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val, row) => (
        <div>
          {val === 'published' ? (
            <Badge tone="success" className="text-[11px]">
              <CheckCircle size={11} /> Active
            </Badge>
          ) : (
            <Badge tone="neutral" className="text-[11px]">
              Staging Draft
            </Badge>
          )}
          <span className="ml-2 text-[10px] text-slate-400">v{row.version}</span>
        </div>
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
              <Check size={12} /> Publish
            </Button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Live Service</span>
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
          <h1 className="font-poppins text-xl font-bold text-slate-900">Manage Digital Services</h1>
          <p className="text-xs text-slate-500">
            Monitor and configure the standard finder, certification pathway, and HUID verification subsystems.
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
            <Plus size={14} /> Register Subsystem
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={services}
        rowKey="id"
        emptyMessage={loading ? 'Loading services…' : 'No services configured.'}
      />

      {/* Add Service Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">Register Subsystem (Draft)</h3>
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">Service Display Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Export Quality Verification Engine"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">API Endpoint Path</label>
                <input
                  required
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  placeholder="/api/export-verify"
                  className="w-full font-mono text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description &amp; Purpose</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Operational function and client route..."
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
                  Create Draft Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {jsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import Services"
          description="Paste a JSON array of service objects. Status PUBLISHED embeds the description immediately for the AI Assistant."
          sampleJson={SERVICE_SAMPLE_JSON}
          onImport={bulkImportServicesJson}
          onClose={() => setJsonModalOpen(false)}
          onDone={loadData}
        />
      )}
    </div>
  )
}
