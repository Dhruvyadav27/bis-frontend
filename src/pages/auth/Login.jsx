import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { ShieldCheck, Lock, Loader2 } from 'lucide-react'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { login, googleLogin } from '../../api/authApi'
import { MOCK_MODE } from '../../api/axiosInstance'
import { useAuthStore } from '../../store/authStore'
import bisLogo from '../../assets/bis-smart-assist-logo.png'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const { t } = useTranslation()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const navigate = useNavigate()
  const setLoggedIn = useAuthStore((s) => s.login)
  const googleBtnRef = useRef(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(values) {
    setServerError('')
    setLoading(true)
    try {
      const data = await login(values)
      setLoggedIn(data)
      navigate('/')
    } catch {
      setServerError('Could not log in. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleCredential = useCallback(async (response) => {
    if (!response?.credential) {
      setServerError('Google did not return a valid sign-in credential. Please try again.')
      return
    }

    setServerError('')
    setGoogleLoading(true)
    try {
      const data = await googleLogin(response.credential)
      setLoggedIn(data)
      if (data.user?.isNewUser || data.user?.profileCompleted === false) {
        navigate('/complete-profile')
      } else {
        navigate('/')
      }
    } catch {
      setServerError('Google sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }, [navigate, setLoggedIn])

  const googleConfigured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (!googleConfigured) return undefined

    let cancelled = false
    let attempts = 0
    let timer

    const renderGoogleButton = () => {
      if (cancelled) return
      const google = window.google
      if (!google?.accounts?.id) {
        if (attempts < 100) {
          attempts += 1
          timer = window.setTimeout(renderGoogleButton, 100)
        } else {
          setServerError('Google Sign-In could not be loaded. Check your internet connection and try again.')
        }
        return
      }

      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = ''
        google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          shape: 'rectangular',
        })
      }
    }

    renderGoogleButton()
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [googleConfigured, handleGoogleCredential])

  async function handleMockGoogleSignIn() {
    setServerError('')
    setGoogleLoading(true)
    try {
      const data = await googleLogin('mock-google-credential')
      setLoggedIn(data)
      navigate('/')
    } catch {
      setServerError('Google demo sign-in failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md border-slate-200/90 shadow-xl p-8">
      <div className="mb-6 text-center">
        <Link to="/" className="inline-block group">
          <div className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 shadow-xs border border-slate-200/80 transition-transform duration-150 group-hover:scale-105">
            <img src={bisLogo} alt="Bureau of Indian Standards" className="h-10 w-auto object-contain" />
          </div>
        </Link>
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-primary-800 border border-primary-100">
            <ShieldCheck size={11} /> Official Single Sign-On
          </span>
          <h1 className="mt-2 text-xl font-bold text-slate-900 font-poppins">{t('auth.signInTitle')}</h1>
          <p className="mt-1 text-xs text-slate-500">{t('auth.signInSubtitle')}</p>
        </div>
      </div>

      {/* Google Sign-In */}
      <div className="mb-5 flex justify-center min-h-[44px]">
        {googleLoading ? (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-2.5">
            <Loader2 size={15} className="animate-spin" /> Signing in with Google…
          </div>
        ) : googleConfigured ? (
          <div ref={googleBtnRef} className="min-h-[44px]" aria-label="Continue with Google" />
        ) : MOCK_MODE ? (
          <button
            type="button"
            onClick={handleMockGoogleSignIn}
            className="flex h-11 w-full max-w-[320px] items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow"
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-sm font-bold">G</span>
            Continue with Google
          </button>
        ) : (
          <div className="w-full max-w-[320px] rounded-xl bg-slate-50 p-3 border border-slate-200 text-[11px] text-slate-500 text-center leading-relaxed">
            Google Sign-In is ready for production. Add <code className="font-semibold">VITE_GOOGLE_CLIENT_ID</code> to <code className="font-semibold">.env</code> to enable the live Google button.
          </div>
        )}
      </div>

      <div className="mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{t('common.or')}</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label={t('auth.email')} type="email" placeholder="officer@company.in" error={errors.email?.message} {...register('email')} />
        <Input label={t('auth.password')} type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />

        {serverError && (
          <div className="rounded-xl bg-red-50 p-3 border border-red-200 text-xs text-red-600 font-medium">
            {serverError}
          </div>
        )}

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Authenticating…
            </>
          ) : (
            <>
              <Lock size={15} /> {t('auth.signIn')}
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-500">
          {t('auth.newUser')}{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </Card>
  )
}
