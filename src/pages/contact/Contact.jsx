import { Mail, Phone, MapPin, ExternalLink, Clock, PhoneCall } from 'lucide-react'
import Card from '../../components/common/Card'

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-primary-100">
          <PhoneCall size={12} /> Official Directory &amp; Helpdesk
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 font-poppins">
          Contact Bureau of Indian Standards
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Reach our national headquarters, regional branches, or toll-free citizen grievance channels.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700 border border-primary-100 mb-4">
              <MapPin size={20} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Headquarters</p>
            <p className="mt-2 text-sm font-semibold text-slate-900 font-poppins">Manak Bhawan</p>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              9 Bahadur Shah Zafar Marg, New Delhi 110002, India
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="https://maps.google.com/?q=Manak+Bhawan+New+Delhi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-800 transition-colors"
            >
              <span>Get driving directions</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </Card>

        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-4">
              <Phone size={20} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">National Helpline</p>
            <p className="mt-2 text-base font-bold text-slate-900 font-poppins">1800-11-3011</p>
            <p className="mt-1 text-xs text-slate-600">
              Toll-free across all Indian telecom networks
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <Clock size={12} />
              <span>Mon–Sat: 09:00 to 17:30 IST</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="tel:1800113011"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>Dial toll-free now</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </Card>

        <Card className="border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4">
              <Mail size={20} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Correspondence</p>
            <p className="mt-2 text-sm font-semibold text-slate-900 font-poppins">info@bis.gov.in</p>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              For public inquiries, standard verification, and certification guidance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              href="mailto:info@bis.gov.in"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition-colors"
            >
              <span>Compose inquiry email</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}

