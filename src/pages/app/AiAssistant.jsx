import { useState, useRef, useEffect } from 'react'
import {
  Bot,
  User,
  Send,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  RotateCcw,
  BookMarked,
  Filter,
  CheckCircle2,
} from 'lucide-react'
import { askAssistant } from '../../api/aiAssistantApi'
import ReferenceBadge from '../../components/common/ReferenceBadge'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const PROMPT_SUGGESTIONS = [
  'What is the difference between Scheme I (ISI) and Scheme II (CRS)?',
  'How can a consumer verify a 6-digit laser HUID on gold jewellery?',
  'What are the mandatory quality control requirements for toys under IS 9873?',
  'What are the concessions available for MSME units applying for BIS licenses?',
]

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text: 'Namaste! I am the BIS Smart Assist. You can query statutory Indian Standards, mandatory QCOs, laboratory test scopes, or grievance procedures.',
      citations: [{ doc: 'Bureau of Indian Standards Act 2016', clause: 'Section 16' }],
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [domainFilter, setDomainFilter] = useState('All Domains')
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (e) => {
    e?.preventDefault()
    const query = input.trim()
    if (!query) return

    const userMsg = { id: Date.now(), role: 'user', text: query }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await askAssistant({
        query,
        context: { currentAgent: 'dedicated-ai-assistant', domain: domainFilter },
      })

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: res.answer,
        action: res.suggestedAction,
        citations: [
          { doc: 'IS 1293 / Gazette QCO 2026', clause: 'Cl. 3.2 & 4.1' },
          { doc: 'BIS Conformity Assessment Regulations', clause: 'Reg. 7' },
        ],
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'The regulatory assistant could not process the query right now. Please cross-reference with Manak Online.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        text: 'Session reset. Ready for your questions on Indian Standards and certifications.',
      },
    ])
  }

  return (
    <div className="mx-auto max-w-5xl flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-white p-4 border border-slate-200 shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-xs">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-poppins text-base font-bold text-slate-900">
                BIS Dedicated Regulatory Assistant
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Agent
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Source-grounded natural language compliance reasoning engine (SIH 26107).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Domain Filter Dropdown */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700">
            <Filter size={13} className="text-slate-400" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="bg-transparent outline-none font-medium cursor-pointer"
            >
              <option>All Domains</option>
              <option>Electronics (CRS)</option>
              <option>ISI Product Certification</option>
              <option>Gold &amp; HUID Hallmarking</option>
              <option>Laboratory Testing</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            className="flex items-center gap-1"
            title="Reset conversation"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>
      </div>

      {/* Main Conversation Canvas */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 space-y-4 shadow-xs"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-primary text-white shadow-2xs'
              }`}
            >
              {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>

            <div
              className={`space-y-2 rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-slate-50/80 text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {/* Citations and Reference Badges */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Statutory References:
                  </span>
                  {msg.citations.map((cite, i) => (
                    <ReferenceBadge key={i} doc={cite.doc} clause={cite.clause} />
                  ))}
                </div>
              )}

              {/* Action Link Button */}
              {msg.action && (
                <div className="pt-1">
                  <a
                    href={msg.action.route}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-semibold text-primary border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
                  >
                    <span>{msg.action.label}</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white text-xs shadow-2xs">
              <Bot size={15} />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-primary">Cross-referencing Indian Standard databases...</p>
              <div className="flex space-x-1 pt-1">
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions Row (Only if 2 or fewer messages) */}
      {messages.length <= 3 && (
        <div className="flex flex-wrap gap-2 shrink-0">
          {PROMPT_SUGGESTIONS.map((sug, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInput(sug)
              }}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200 transition-colors text-left"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs shrink-0"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about Indian Standards, ISI Mark, CRS, HUID, or laboratory testing..."
          className="flex-1 px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-primary-700 text-white flex items-center gap-1.5 px-4"
        >
          <Send size={14} />
          <span>Ask</span>
        </Button>
      </form>
    </div>
  )
}
