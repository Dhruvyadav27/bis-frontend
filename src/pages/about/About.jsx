import { Shield, Award, CheckCircle2, BookOpen, Layers, Users } from 'lucide-react'
import Card from '../../components/common/Card'
import aboutUsImage from '../../assets/about-us.png'

export default function About() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="border-b border-slate-200/80 pb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700 border border-primary-100">
          <Shield size={12} /> Institutional Profile
        </span>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 font-poppins">
          About Bureau of Indian Standards (BIS)
        </h1>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          The National Standards Body of India, functioning under the aegis of the Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-poppins text-lg font-bold text-slate-900">Statutory Mandate &amp; Quality Mission</h2>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Established under the Bureau of Indian Standards Act, 2016, BIS is entrusted with the harmonious development of activities of standardisation, marking, and quality certification of goods. The organization provides robust statutory backing for national industrial growth, consumer safety, and environmental protection.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-slate-600">
            Through the <strong>Smart India Hackathon 2026 (Problem Statement SIH26107)</strong>, the <strong>BIS Smart Assist</strong> introduces natural language query synthesis to democratize technical conformity documents, empowering businesses and citizens alike.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm">
            <div className="relative overflow-hidden rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2">
              <img
                src={aboutUsImage}
                alt="Bureau of Indian Standards Headquarters - Manak Bhawan"
                className="w-full h-auto object-contain rounded-lg select-none"
              />
            </div>
            <div className="mt-3 flex items-center justify-between px-2 py-0.5 text-xs text-slate-600">
              <span className="font-bold text-slate-800">Manak Bhawan</span>
              <span className="text-[11px] text-slate-500">New Delhi • BIS National HQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Pillars */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-slate-200/90 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary-700 border border-blue-100 mb-3">
            <BookOpen size={18} />
          </div>
          <p className="text-sm font-bold text-slate-900 font-poppins">Standardization</p>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Formulation of Indian Standards across mechanical, chemical, civil, electronics, food, and emerging frontier tech sectors.
          </p>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 mb-3">
            <Award size={18} />
          </div>
          <p className="text-sm font-bold text-slate-900 font-poppins">Product Certification</p>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Administering the ISI Mark, Compulsory Registration Scheme (CRS), and Foreign Manufacturers Certification Scheme (FMCS).
          </p>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-100 mb-3">
            <Users size={18} />
          </div>
          <p className="text-sm font-bold text-slate-900 font-poppins">Consumer Protection</p>
          <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
            Empowering consumers through gold HUID verification, market surveillance, laboratory testing, and grievance resolution.
          </p>
        </Card>
      </div>
    </div>
  )
}

