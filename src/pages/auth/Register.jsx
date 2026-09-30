import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ShieldCheck, UserPlus, Loader2 } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { register as registerApi } from '../../api/authApi'
import { useAuthStore } from '../../store/authStore'
import { applyLanguage, AVAILABLE_LANGUAGES } from '../../i18n'
import bisLogo from '../../assets/bis-smart-assist-logo.png'

const USER_TYPES = ['CONSUMER', 'MSME', 'LABORATORY']

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Enter a 10-digit phone number'),
  userType: z.enum(USER_TYPES),
  preferredLanguage: z.string().min(1, 'Choose a preferred language'),
})

export default function Register() {
  const { t } = useTranslation()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setLoggedIn = useAuthStore((s) => s.login)

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userType: 'CONSUMER', preferredLanguage: 'en' },
  })

  async function onSubmit(values) {
    setServerError('')
    setLoading(true)
    try {
      const data = await registerApi(values)
      setLoggedIn(data)
      applyLanguage(values.preferredLanguage)
      navigate('/')
    } catch {
      setServerError('Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg border-slate-200/90 shadow-xl p-8">
      <div className="mb-6 text-center">
        <Link to="/" className="inline-block group">
          <div className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 shadow-xs border border-slate-200/80 transition-transform duration-150 group-hover:scale-105">
            <img src={bisLogo} alt="Bureau of Indian Standards" className="h-10 w-auto object-contain" />
          </div>
        </Link>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-emerald-800 border border-emerald-100">
            <ShieldCheck size={11} /> National Citizen &amp; Enterprise Registry
          </span>
          <h1 className="mt-2 text-xl font-bold text-slate-900 font-poppins">{t('auth.registerTitle')}</h1>
          <p className="mt-1 text-xs text-slate-500">{t('auth.registerSubtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="e.g. Ramesh Kumar" error={errors.name?.message} {...formRegister('name')} />
          <Input label="Email Address" type="email" placeholder="ramesh@enterprise.in" error={errors.email?.message} {...formRegister('email')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Phone Number" placeholder="98XXXXXXXX" error={errors.phone?.message} {...formRegister('phone')} />
          <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...formRegister('password')} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">User Profile Classification</span>
            <select
              {...formRegister('userType')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
            >
              {USER_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0) + t.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Preferred Language</span>
            <select
              {...formRegister('preferredLanguage')}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-150 focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
            >
              {AVAILABLE_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native}
                </option>
              ))}
            </select>
          </label>
        </div>

        {serverError && (
          <div className="rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Provisioning Account…
            </>
          ) : (
            <>
              <UserPlus size={15} /> {t('auth.registerCta')}
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-500">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </Card>
  )
}

