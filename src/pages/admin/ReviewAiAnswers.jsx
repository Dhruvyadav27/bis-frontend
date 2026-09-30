import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
  Check,
  XCircle,
  HelpCircle,
  X,
  Bot,
  User,
} from 'lucide-react'
import { getFlaggedAnswers, resolveFlaggedAnswer } from '../../api/adminApi'
import RelevanceBadge from '../../components/common/RelevanceBadge'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

export default function ReviewAiAnswers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [resolveModalItem, setResolveModalItem] = useState(null)
  const [actionType, setActionType] = useState('mark_correct')
  const [editAnswerText, setEditAnswerText] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    const data = await getFlaggedAnswers()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const toggleExpand = (id) => {
    setExpandedId((curr) => (curr === id ? null : id))
  }

  const openResolveModal = (item, type = 'mark_correct') => {
    setResolveModalItem(item)
    setActionType(type)
    setEditAnswerText(item.generatedAnswer)
    setAdminNotes('')
  }

  const handleResolveSubmit = async (e) => {
    e.preventDefault()
    if (!resolveModalItem) return

    await resolveFlaggedAnswer(resolveModalItem.id, {
      action: actionType,
      notes: adminNotes,
      editedAnswer: actionType === 'edit' ? editAnswerText : undefined,
    })

    showToast(`Flagged item ${resolveModalItem.id} resolved as: ${actionType.replace('_', ' ').toUpperCase()}`)
    setResolveModalItem(null)
    loadData()
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900 shadow-sm flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="font-poppins text-xl font-bold text-slate-900">Review AI Responses &amp; Hallucinations</h1>
        <p className="text-xs text-slate-500">
          Supervise responses flagged by citizens or evaluated with low confidence (&lt;75%). Ensure statutory compliance with BIS Gazette rules.
        </p>
      </div>

      {/* Flagged Answers List */}
      <div className="space-y-3">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            Loading flagged responses…
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-xs text-slate-400">
            No flagged responses requiring review.
          </div>
        ) : (
          items.map((item) => {
            const isExpanded = expandedId === item.id
            const isResolved = item.status === 'resolved'

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all ${
                  isResolved
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Collapsed Row Summary */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-600 shrink-0">
                      {item.id}
                    </span>
                    <div>
                      <p className="font-semibold text-xs text-slate-900 line-clamp-1">
                        "{item.query}"
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span>Agent: {item.agentContext}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    {/* Confidence Score color-coded badge */}
                    <RelevanceBadge score={item.confidenceScore} />

                    {isResolved ? (
                      <Badge tone="neutral" className="text-[11px]">
                        Resolved
                      </Badge>
                    ) : (
                      <Badge tone="warning" className="text-[11px]">
                        Pending Review
                      </Badge>
                    )}

                    <button
                      type="button"
                      className="rounded p-1 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details & Actions */}
                {isExpanded && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-4 text-xs animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Generated Answer */}
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-primary font-semibold mb-1.5">
                          <Bot size={14} />
                          <span>Generated Assistant Answer:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {item.generatedAnswer}
                        </p>
                      </div>

                      {/* User Feedback & Reported Issue */}
                      <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-amber-700 font-semibold mb-1.5">
                          <AlertTriangle size={14} />
                          <span>Citizen Feedback / Flag Reason:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                          {item.userFeedback}
                        </p>
                      </div>
                    </div>

                    {/* Resolution Section */}
                    {isResolved ? (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-emerald-900">
                        <p className="font-semibold flex items-center gap-1.5">
                          <CheckCircle size={14} className="text-emerald-600" />
                          Resolved as:{' '}
                          <span className="uppercase">{item.resolution?.action.replace('_', ' ')}</span>
                        </p>
                        {item.resolution?.notes && (
                          <p className="mt-1 text-[11px] text-slate-600">
                            Notes: {item.resolution.notes}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                        <span className="text-slate-500 font-medium">Select Resolution Action:</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="xs"
                            onClick={() => openResolveModal(item, 'mark_correct')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
                          >
                            <Check size={12} /> Mark Correct
                          </Button>
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => openResolveModal(item, 'needs_update')}
                            className="text-amber-700 hover:bg-amber-50 border-amber-200 flex items-center gap-1"
                          >
                            <HelpCircle size={12} /> Needs Corpus Update
                          </Button>
                          <Button
                            size="xs"
                            variant="secondary"
                            onClick={() => openResolveModal(item, 'edit')}
                            className="text-primary hover:bg-primary-50 border-primary-200 flex items-center gap-1"
                          >
                            <Edit3 size={12} /> Edit Answer
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Resolution Modal */}
      {resolveModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Resolve Flagged Response ({resolveModalItem.id})
              </h3>
              <button
                type="button"
                onClick={() => setResolveModalItem(null)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Action</label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600 bg-white"
                >
                  <option value="mark_correct">Mark Verified &amp; Correct</option>
                  <option value="needs_update">Flag Corpus for Retraining</option>
                  <option value="edit">Edit Statutory Answer Directly</option>
                </select>
              </div>

              {actionType === 'edit' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corrected Response Text
                  </label>
                  <textarea
                    rows={4}
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-primary-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrator Audit Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Citation to relevant Indian Standard clause or QCO..."
                  className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setResolveModalItem(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
                  Confirm Resolution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
