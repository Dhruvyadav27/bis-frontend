import { useState, useEffect } from 'react'
import { Gem, CheckCircle, XCircle, UploadCloud } from 'lucide-react'
import { getHuidRecords, bulkImportHuidRecordsJson } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import BulkJsonImportModal from '../../components/common/BulkJsonImportModal'

const HUID_SAMPLE_JSON = `[
  {
    "huid": "AZ4521XY",
    "purity": "18K750",
    "ahcCentre": "string",
    "hallmarkedOn": "2026-03-12",
    "verified": true
  }
]`

export default function ManageHuidRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    const data = await getHuidRecords()
    setRecords(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const columns = [
    {
      key: 'huid',
      header: 'HUID',
      render: (val) => <span className="font-mono font-semibold text-slate-900 text-xs">{val}</span>,
    },
    {
      key: 'purity',
      header: 'Purity',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>,
    },
    {
      key: 'ahcCentre',
      header: 'AHC Centre',
      render: (val) => <span className="text-xs text-slate-600">{val}</span>,
    },
    {
      key: 'hallmarkedOn',
      header: 'Hallmarked On',
      render: (val) => (
        <span className="text-xs text-slate-500">{val ? new Date(val).toLocaleDateString() : '—'}</span>
      ),
    },
    {
      key: 'verified',
      header: 'Verified',
      render: (val) =>
        val ? (
          <Badge tone="success" className="text-[11px]">
            <CheckCircle size={11} /> Verified
          </Badge>
        ) : (
          <Badge tone="neutral" className="text-[11px]">
            <XCircle size={11} /> Unverified
          </Badge>
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
          <h1 className="font-poppins text-xl font-bold text-slate-900 flex items-center gap-2">
            <Gem size={18} className="text-primary-700" /> Manage Hallmarking HUID Records
          </h1>
          <p className="text-xs text-slate-500">
            HUID numbers consumers can look up on the Hallmarking verification page.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setJsonModalOpen(true)}
          className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <UploadCloud size={14} /> Bulk Import JSON
        </Button>
      </div>

      <Table
        columns={columns}
        data={records}
        rowKey="id"
        emptyMessage={loading ? 'Loading HUID records...' : 'No HUID records configured yet.'}
      />

      {jsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import HUID Records"
          description="Paste a JSON array of HUID record objects. hallmarkedOn should be a yyyy-MM-dd date."
          sampleJson={HUID_SAMPLE_JSON}
          onImport={bulkImportHuidRecordsJson}
          onClose={() => setJsonModalOpen(false)}
          onDone={() => {
            showToast('HUID records imported successfully.')
            loadData()
          }}
        />
      )}
    </div>
  )
}
