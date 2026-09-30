import { useState, useEffect } from 'react'
import { Users, UserPlus, ShieldCheck, Mail, Building, CheckCircle, X, ShieldAlert } from 'lucide-react'
import { getUsers, updateUserRole, inviteAdmin } from '../../api/adminApi'
import Table from '../../components/common/Table'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'

const ALLOWED_ROLES = ['ADMIN', 'MSME', 'LABORATORY', 'CONSUMER']

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const [inviteData, setInviteData] = useState({
    name: '',
    email: '',
    department: 'Standardization Directorate',
  })

  const loadData = async () => {
    setLoading(true)
    const data = await getUsers()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole)
    showToast(`User ID #${userId} permissions updated to ${newRole}.`)
    loadData()
  }

  const handleInviteSubmit = async (e) => {
    e.preventDefault()
    if (!inviteData.name || !inviteData.email) return
    await inviteAdmin(inviteData)
    setInviteModalOpen(false)
    setInviteData({ name: '', email: '', department: 'Standardization Directorate' })
    showToast(`Administrator invitation dispatched to ${inviteData.email}.`)
    loadData()
  }

  const columns = [
    {
      key: 'name',
      header: 'Officer / Entity Name',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 text-xs">{val}</span>
          <p className="text-[11px] text-slate-500">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'department',
      header: 'Department / Organization',
      render: (val) => (
        <span className="text-xs text-slate-700 font-medium">
          {val || 'General User'}
        </span>
      ),
    },
    {
      key: 'role',
      header: 'Access Role',
      render: (val, row) => (
        <select
          value={val}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold outline-none bg-white cursor-pointer ${
            val === 'ADMIN'
              ? 'border-emerald-300 text-emerald-800 bg-emerald-50/50'
              : 'border-slate-200 text-slate-700'
          }`}
        >
          {ALLOWED_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'status',
      header: 'Account Status',
      render: (val) => (
        <Badge tone={val === 'Active' ? 'success' : 'warning'} className="text-[11px]">
          {val}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Registration Date',
      render: (val) => <span className="text-slate-500 text-[11px]">{val}</span>,
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
          <h1 className="font-poppins text-xl font-bold text-slate-900">User &amp; Access Control Management</h1>
          <p className="text-xs text-slate-500">
            Control platform role-based access. Privacy rule: Personal complaints and certificate secrets remain strictly partitioned.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setInviteModalOpen(true)}
          className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
        >
          <UserPlus size={14} /> Invite Administrator
        </Button>
      </div>

      <Table
        columns={columns}
        data={users}
        rowKey="id"
        emptyMessage={loading ? 'Loading user registry…' : 'No registered users found.'}
      />

      {/* Invite Admin Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-poppins text-sm font-bold text-slate-900">
                Grant Administrative Privileges
              </h3>
              <button
                type="button"
                onClick={() => setInviteModalOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <input
                  required
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  placeholder="Officer Name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
                <input
                  required
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  placeholder="officer@bis.gov.in"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Cell</label>
                <select
                  value={inviteData.department}
                  onChange={(e) => setInviteData({ ...inviteData, department: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 outline-none focus:border-primary-600 bg-white"
                >
                  <option>Standardization Directorate</option>
                  <option>Certification Marks Department (CMD)</option>
                  <option>Central Testing Laboratories (CTL)</option>
                  <option>Hallmarking Cell</option>
                  <option>Consumer Redressal &amp; Vigilance</option>
                </select>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 border border-emerald-200 text-[11px] text-emerald-800">
                <p className="font-semibold flex items-center gap-1">
                  <ShieldCheck size={13} /> Dual-Key Authorization
                </p>
                <p className="mt-0.5">
                  Invited administrators receive an invitation link with Gov.in email verification.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button type="button" variant="secondary" onClick={() => setInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary-700 text-white">
                  Dispatch Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
