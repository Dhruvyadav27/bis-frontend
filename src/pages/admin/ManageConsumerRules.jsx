import { useState, useEffect } from 'react'
import { Scale, CheckCircle, UploadCloud } from 'lucide-react'
import { getConsumerRules, bulkImportConsumerRulesJson } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import BulkJsonImportModal from '../../components/common/BulkJsonImportModal'

const CONSUMER_RULE_SAMPLE_JSON = `[
  {
    "actName": "Consumer Protection Act, 2019",
    "clauseRef": "Section 2(47)",
    "topic": "e.g. Fake ISI mark, Counterfeit product",
    "description": "string — plain-language explanation",
    "applicableAction": "e.g. File complaint on National Consumer Helpline",
    "status": "PUBLISHED"
  }
]`

export default function ManageConsumerRules() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    const data = await getConsumerRules()
    setRules(data)
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
      key: 'actName',
      header: 'Act & Clause',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs">{val}</span>
          <p className="text-[10px] text-slate-400 font-mono">{row.clauseRef}</p>
        </div>
      ),
    },
    {
      key: 'topic',
      header: 'Topic',
      render: (val) => <span className="text-xs text-slate-700">{val}</span>,
    },
    {
      key: 'description',
      header: 'Plain-Language Explanation',
      render: (val) => <p className="text-[11px] text-slate-500 max-w-md line-clamp-2">{val}</p>,
    },
    {
      key: 'applicableAction',
      header: 'Applicable Action',
      render: (val) => <span className="text-[11px] text-slate-600">{val}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (val) =>
        val === 'PUBLISHED' ? (
          <Badge tone="success" className="text-[11px]">
            <CheckCircle size={11} /> Published
          </Badge>
        ) : (
          <Badge tone="neutral" className="text-[11px]">
            {val || 'Draft'}
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
            <Scale size={18} className="text-primary-700" /> Manage Consumer Protection Rules
          </h1>
          <p className="text-xs text-slate-500">
            Clauses and plain-language guidance the Consumer Affairs agent draws on when answering.
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
        data={rules}
        rowKey="id"
        emptyMessage={loading ? 'Loading rules...' : 'No consumer rules configured yet.'}
      />

      {jsonModalOpen && (
        <BulkJsonImportModal
          title="Bulk Import Consumer Protection Rules"
          description="Paste a JSON array of rule objects. Status PUBLISHED embeds them immediately for the AI Assistant / Consumer Affairs agent."
          sampleJson={CONSUMER_RULE_SAMPLE_JSON}
          onImport={bulkImportConsumerRulesJson}
          onClose={() => setJsonModalOpen(false)}
          onDone={() => {
            showToast('Consumer rules imported successfully.')
            loadData()
          }}
        />
      )}
    </div>
  )
}
