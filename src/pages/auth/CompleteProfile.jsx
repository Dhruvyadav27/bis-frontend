import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { completeProfile } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { applyLanguage, AVAILABLE_LANGUAGES } from '../../i18n'
import bisLogo from '../../assets/bis-smart-assist-logo.png'

// Shown once, right after a person's FIRST Google sign-in (backend creates them
// with role=CONSUMER, profileCompleted=false — this fills in the rest per spec).
export default function CompleteProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setLoggedIn = useAuthStore((s) => s.login)
  const token = useAuthStore((s) => s.token)

  const [role, setRole] = useState('CONSUMER')
  const [phone, setPhone] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState('en')
  const [udyamRegistered, setUdyamRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await completeProfile({
        role,
        phone,
        preferredLanguage,
        udyamRegistered: role === 'MSME' ? udyamRegistered : undefined,
      })
      // Backend returns the updated user; keep the existing token, refresh user info.
      setLoggedIn({ token, user: { ...user, ...res.user, role, profileCompleted: true } })
      applyLanguage(preferredLanguage)
      navigate('/')
    } catch {
      setError('Could not save your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-slate-200/90 shadow-xl p-8">
      <div className="mb-6 text-center">
        <img src={bisLogo} alt="Bureau of Indian Standards" className="h-10 mx-auto w-auto object-contain" />
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-primary-800 border border-primary-100">
          <ShieldCheck size={11} /> One Last Step
        </span>
        <h1 className="mt-2 text-xl font-bold text-slate-900 font-poppins">{t('auth.completeProfileTitle', { defaultValue: 'Complete Your Profile' })}</h1>
        <p className="mt-1 text-xs text-slate-500">
          Welcome{user?.name ? `, ${user.name}` : ''}! Tell us a bit about yourself to personalize your experience.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            I am a...
          </span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
          >
            <option value="CONSUMER">Consumer</option>
            <option value="MSME">MSME / Manufacturer</option>
            <option value="LABORATORY">Laboratory</option>
          </select>
        </label>

        {role === 'MSME' && (
          <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={udyamRegistered}
              onChange={(e) => setUdyamRegistered(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="font-medium">I have an active Udyam registration</span>
          </label>
        )}

        <Input
          label="Phone Number (optional)"
          type="tel"
          placeholder="9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Preferred Language
          </span>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
          >
            {AVAILABLE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </label>

        {error && (
          <div className="rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          Save &amp; Continue
        </Button>
      </form>
    </Card>
  )
}
