import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { AVAILABLE_LANGUAGES } from '../../i18n'

// A dropdown rather than one button per language, so it keeps working as more languages are added.
export default function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'en'

  return (
    <label className={`flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 ${className}`}>
      <Languages size={13} className="text-white/70" />
      <span className="sr-only">{t('common.language', { defaultValue: 'Language' })}</span>
      <select
        value={current}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
        className="cursor-pointer bg-transparent text-[11px] font-semibold text-white outline-none"
      >
        {AVAILABLE_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code} className="text-slate-900">
            {l.native}
          </option>
        ))}
      </select>
    </label>
  )
}
