import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MessageCircle, X, Send, ArrowUpRight, Sparkles, Bot, User, CheckCircle2 } from 'lucide-react'
import { askAssistant } from '../../api/aiAssistantApi'
import { useJourneyStore } from '../../store/journeyStore'

const ROUTE_AGENT_MAP = {
  '/': 'dashboard',
  '/standard-finder': 'standard-finder',
  '/certification-guide': 'certification-guide',
  '/hallmarking': 'hallmarking',
  '/find-lab': 'find-lab',
  '/consumer-affairs': 'consumer-affairs',
  '/process-guide': 'process-guide-agent',
}

const AGENT_LABELS = {
  'dashboard': 'BIS General Portal',
  'standard-finder': 'Standards Matching',
  'certification-guide': 'Certification Schemes',
  'hallmarking': 'Gold & Silver Hallmarking',
  'find-lab': 'Testing Laboratories',
  'consumer-affairs': 'Consumer Grievance',
  'process-guide-agent': 'Application Journey',
}

const QUICK_PROMPTS = [
  'Find standard for LED bulb',
  'How to verify a HUID code?',
  'Documents for MSME certification',
]

export default function FloatingAssistantWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'agent',
      text: 'Namaste! I am the BIS Intelligent Assistant. Ask me anything about Indian Standards, ISI certification, hallmarking, or consumer rights.',
    },
  ])
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const currentStep = useJourneyStore((s) => s.currentStep)

  const currentAgent = ROUTE_AGENT_MAP[location.pathname] || 'dashboard'
  const agentReadableName = AGENT_LABELS[currentAgent] || currentAgent

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function handleSend(e) {
    e?.preventDefault()
    const query = input.trim()
    if (!query) return
    setMessages((m) => [...m, { role: 'user', text: query }])
    setInput('')
    setLoading(true)
    try {
      const res = await askAssistant({
        query,
        context: { currentAgent, currentStep: currentAgent === 'process-guide-agent' ? currentStep : undefined },
      })
      setMessages((m) => [...m, { role: 'agent', text: res.answer, action: res.suggestedAction }])
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: 'agent',
          text: 'Unable to reach the assistant service right now. Please try again or visit Manak Online directly.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleQuickPrompt(promptText) {
    setInput(promptText)
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[32rem] w-[24rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-4 py-3.5 text-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold tracking-tight">BIS Smart Assist</p>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                </div>
                <p className="text-[11px] text-primary-100 flex items-center gap-1">
                  <span>Context: {agentReadableName}</span>
                  {currentAgent === 'process-guide-agent' && (
                    <span className="rounded bg-white/20 px-1 text-[10px]">Step {currentStep}</span>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-lg p-1 text-white/80 hover:bg-white/15 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-3.5 bg-slate-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'agent' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate(m.action.route)
                        setOpen(false)
                      }}
                      className="mt-2.5 flex items-center gap-1 rounded-md bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 border border-primary-100 hover:bg-primary-100 transition-colors"
                    >
                      <span>{m.action.label}</span>
                      <ArrowUpRight size={12} />
                    </button>
                  )}
                </div>
                {m.role === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs mt-0.5">
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                <div className="flex space-x-1">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-[11px]">Assistant is synthesizing regulatory response…</span>
              </div>
            )}
          </div>

          {/* Quick suggestions if few messages */}
          {messages.length <= 2 && (
            <div className="border-t border-slate-100 bg-white px-3 py-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Suggested questions</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleQuickPrompt(prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-primary-50 hover:border-primary-200 hover:text-primary transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Bar */}
          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-200/80 bg-white p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about standards, ISI, HUID, labs..."
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send query"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open BIS AI Assistant"
        className="fixed bottom-6 right-6 z-50 group flex h-14 items-center gap-2.5 rounded-full bg-accent px-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-accent-700 active:scale-95"
      >
        <div className="relative">
          {open ? <X size={22} /> : <Sparkles size={22} className="text-amber-300 animate-pulse" />}
        </div>
        <span className="text-xs font-semibold tracking-wide pr-1">
          {open ? 'Close' : 'Ask BIS AI'}
        </span>
      </button>
    </>
  )
}
