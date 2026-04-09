import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, Bot, FileText, MessageSquare, BarChart3, Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'

interface LuminaPanelProps {
  onClose?: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const API_URL = '/api/chat'

export default function LuminaPanel({ onClose }: LuminaPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'reports'>('chat')
  const [panelWidth, setPanelWidth] = useState(() => Math.max(Math.round(window.innerWidth * 0.3), 420))
  const [isResizing, setIsResizing] = useState(false)

  const tabs = [
    { id: 'chat' as const, label: 'Chat', Icon: MessageSquare },
    { id: 'reports' as const, label: 'Reports', Icon: BarChart3 },
  ]

  const startResizing = useCallback(() => setIsResizing(true), [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isResizing) return
      const w = window.innerWidth - e.clientX
      if (w >= 380 && w <= window.innerWidth * 0.65) setPanelWidth(w)
    }
    const onUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    if (isResizing) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
    }
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [isResizing])

  return (
    <aside className="lumina-panel" style={{ width: panelWidth, minWidth: panelWidth }}>
      {/* Resize handle */}
      <div
        onMouseDown={startResizing}
        style={{
          position: 'absolute', left: -3, top: 0, bottom: 0, width: 6,
          cursor: 'col-resize', zIndex: 10,
          background: isResizing ? 'rgba(21,120,247,0.2)' : 'transparent',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!isResizing) (e.target as HTMLElement).style.background = 'rgba(21,120,247,0.12)' }}
        onMouseLeave={e => { if (!isResizing) (e.target as HTMLElement).style.background = 'transparent' }}
      />

      {/* Header */}
      <div className="lumina-header">
        <div className="lumina-title-row">
          <div className="lumina-logo">
            <Bot size={14} className="text-white" />
          </div>
          <div className="lumina-title-text">
            <span className="lumina-title">Lumina</span>
            <span className="lumina-badge">Superagent</span>
          </div>
          {onClose && (
            <button onClick={onClose} className="lumina-close-btn" title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div className="lumina-tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`lumina-tab ${activeTab === t.id ? 'active' : ''}`}
            >
              <t.Icon size={13} strokeWidth={2} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content — chat uses flex layout for pinned input */}
      {activeTab === 'chat' && <ChatTab />}
      {activeTab === 'reports' && <div className="lumina-content"><ReportsTab /></div>}
    </aside>
  )
}

/* ═══ Pre-seeded conversations per page ═══ */
const seedConversations: Record<string, ChatMessage[]> = {
  '/dashboard': [
    { role: 'assistant', content: "Good morning. I've completed my overnight analysis across all 3 ISOs. Portfolio volume hit $31.1M this month — up 3.5% MoM. Three items need your attention." },
    { role: 'user', content: "What are the three items?" },
    { role: 'assistant', content: "1. **Sunrise Deli** churn probability hit 87% — volume down 42% in 30 days. I've prepared a retention offer.\n\n2. **Liberty Processing** migration is at 92% — 59 merchants still need bank info updates. I've drafted follow-up emails.\n\n3. **Zenith** PCI compliance dropped to 88.5% — 3 healthcare merchants have expired SAQ-A forms. Auto-remediation initiated." },
    { role: 'user', content: "How's the waterfall looking?" },
    { role: 'assistant', content: "Portfolio value bridge: Starting at **$28.5M** → +$1.8M organic growth → +$1.2M from Zenith acquisition → +$0.8M product revenue → -$0.2M churn loss → **Current $32.1M**. Net gain of $3.6M this quarter. Churn loss is minimal at 0.6%." },
  ],
  '/crm': [
    { role: 'assistant', content: "Pipeline overview: **200 active leads** across 8 stages. Pipeline value is approximately $209K/mo in estimated volume. Win rate trending at 67%." },
    { role: 'user', content: "Which agents are performing best?" },
    { role: 'assistant', content: "**Sarah Chen** leads with a 72% win rate across 28 deals ($118K). David Goldfarb has the most deals (34) but a lower 68% rate. I'd recommend having Sarah share her objection-handling approach with the team — her restaurant vertical close rate is 81%." },
    { role: 'user', content: "Any deals at risk?" },
    { role: 'assistant', content: "**King's Crown Jewelry** is in Underwriting with a risk score of 67 — flagged for high-risk MCC (5944). The $45K/mo volume makes it valuable but chargeback exposure is elevated. I'd recommend requesting additional processing statements before approval." },
  ],
  '/voice': [
    { role: 'assistant', content: "Voice Agent status: **47 active calls** right now, 847 completed today. Transfer rate is 15.1% — up 0.3% from yesterday. Cost today: $42.35." },
    { role: 'user', content: "What's our best performing script?" },
    { role: 'assistant', content: "**Restaurant Savings Hook** leads at 41.2% win rate across 3,420 calls. Key factor: the empathy phrase added in v12 boosted transfers by 3.2%. Second best is Rate Comparison Direct at 38.7%. The seasonal rate lock script is underperforming at 24.1% — I'd recommend retiring it." },
    { role: 'user', content: "How much are we saving vs human callers?" },
    { role: 'assistant', content: "**$498K/month** in savings. Human team cost: $500K/mo ($16.67/transfer). AI Voice Agent: $1,270/mo ($0.33/transfer). That's a **99.7% cost reduction**. Annual savings: $5.98M. The AI also operates 9am-6pm with 50 concurrent lines — equivalent to a 200-person call center." },
  ],
  '/iso': [
    { role: 'assistant', content: "Portfolio companies overview: 3 ISOs managing 4,612 merchants with $32.1M combined monthly volume." },
    { role: 'user', content: "How's Liberty integration going?" },
    { role: 'assistant', content: "Liberty Processing integration is at **92%** — 59 merchants remaining. Key blocker: 12 merchants need bank info updates (legacy accounts from pre-acquisition). Migration target date is May 30, 2026. I've flagged the bank info issue to Lisa Nguyen on the Liberty team. Churn has improved from 5.8% to 3.4% since acquisition thanks to AI retention outreach." },
    { role: 'user', content: "What did we pay for Zenith?" },
    { role: 'assistant', content: "Zenith was acquired for **$12.5M** at a **4.2x revenue multiple**. Current monthly volume: $8.9M with 1,024 merchants. The 70/30 residual split generates ~$890K/mo. Integration is 96% complete — 28 merchants remaining. Post-acquisition churn dropped from 4.1% to 2.1%. ROI is tracking ahead of the 3-year payback projection." },
  ],
  '/analytics': [
    { role: 'assistant', content: "Portfolio health score: **87/100**. All dimensions are strong except Churn (78) — driven by Liberty's 3.4% rate pulling the average up." },
    { role: 'user', content: "Where should we focus product cross-sell?" },
    { role: 'assistant', content: "Product penetration is only **4.7%** average — huge upside. Top opportunity: **POS Upgrade** at 9.2% penetration generates $211K revenue. Biggest gap: **Insurance** at 2.1% with only 98 enrolled out of 4,612 eligible. I'd recommend a targeted campaign for Embedded Financing (currently 6.8%) — restaurants in the $30-50K volume range have the highest conversion rate at 14.2%." },
  ],
  '/risk': [
    { role: 'assistant', content: "Portfolio risk score: **72/100**, up 3 points from last month. Chargeback rate at 0.82% — well below Visa's 1.0% threshold. 7 high-risk merchants being monitored." },
    { role: 'user', content: "Which merchants are highest risk?" },
    { role: 'assistant', content: "Top concern: a jewelry store (MCC 5944) with risk score 34 — volume decline + chargeback spike. Also monitoring 2 car washes with scores in the low 50s. The OFAC scan flagged 3 matches last month — 2 auto-cleared as false positives, 1 pending manual review. PCI compliance is at 87% — the 47 non-compliant merchants are costing us $937/mo in non-compliance fees." },
  ],
  '/compliance': [
    { role: 'assistant', content: "All compliance systems are current. Next action item: **Employee Security Training** due May 1, 2026. OFAC screening runs monthly — last scan: April 1." },
    { role: 'user', content: "Any TCPA concerns?" },
    { role: 'assistant', content: "TCPA is fully compliant. DNC list syncs every 6 hours (last sync: April 6). Two-party consent enforced in all applicable states. Time-of-day restrictions auto-enforced across 47 states. Zero violations in the past 90 days. The Voice Agent's compliance module blocked 23 calls last week that would have violated state timing rules." },
  ],
  '/portal': [
    { role: 'assistant', content: "Welcome back, Mario. Your restaurant processed **$47,230** this month — up 8.2% from February. Approval rate is excellent at 98.7%." },
    { role: 'user', content: "I have an open chargeback, what should I do?" },
    { role: 'assistant', content: "You have **1 open chargeback** for $487.50 (Visa ****4821, reason: Merchandise Not Received). Deadline is **March 26**. I'd recommend gathering your delivery confirmation or signed receipt. If you have a signed credit card slip showing the customer was present, that's usually sufficient to win. The industry win rate for this reason code is about 65%. Want me to draft a response template?" },
    { role: 'user', content: "Am I eligible for funding?" },
    { role: 'assistant', content: "Yes! You're **pre-approved for up to $25,000** based on your processing volume. Terms: 1.15 factor rate, 15% daily hold, funds in 24-48 hours. Your current volume of $47K/mo and 98.7% approval rate make you a strong candidate. You could use this for equipment upgrades, inventory, or seasonal hiring. Want me to show you the full offer details?" },
  ],
}

/* ═══ Chat Tab with Claude API ═══ */
function ChatTab() {
  const location = useLocation()
  const currentPage = location.pathname.startsWith('/portal') ? '/portal' : location.pathname
  const seed = seedConversations[currentPage] || seedConversations['/dashboard'] || []

  const [messages, setMessages] = useState<ChatMessage[]>(seed)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const prevPageRef = useRef(currentPage)

  // Reset conversation when page changes
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      prevPageRef.current = currentPage
      const newSeed = seedConversations[currentPage] || seedConversations['/dashboard'] || []
      setMessages(newSeed)
    }
  }, [currentPage])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          currentPage,
        }),
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      // Stream the response
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          assistantText += chunk
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = { role: 'assistant', content: assistantText }
            return updated
          })
        }
      }
    } catch (err: any) {
      console.error('Lumina chat error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `I'm having trouble connecting right now. Error: ${err.message}. Please try again.` },
      ])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Page context indicator
  const pageLabels: Record<string, string> = {
    '/dashboard': 'Portfolio Command Center',
    '/crm': 'Agentic CRM',
    '/voice': 'Voice Agent',
    '/iso': 'ISO Management',
    '/analytics': 'Portfolio Intelligence',
    '/risk': 'Risk & Underwriting',
    '/compliance': 'Compliance',
    '/portal': 'Merchant Portal',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Context indicator */}
      <div style={{
        padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', flexShrink: 0,
        fontSize: 11, color: '#64748B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
        Viewing: {pageLabels[currentPage] || currentPage}
      </div>

      {/* Messages */}
      <div className="lumina-chat" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div key={i} className={`lumina-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
            {msg.role === 'assistant' && (
              <div className="lumina-msg-avatar">
                <Bot size={12} className="text-white" />
              </div>
            )}
            <div>
              <div className={`lumina-msg-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}>
                {msg.content ? (
                  <div className="lumina-markdown">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                ) : (isLoading && i === messages.length - 1 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
                  </span>
                ) : null)}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="lumina-input-area" style={{ flexShrink: 0 }}>
        <div className="lumina-input-wrapper">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Lumina anything..."
            className="lumina-input"
            disabled={isLoading}
          />
          <button
            className="lumina-send-btn"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            style={{ opacity: isLoading || !input.trim() ? 0.4 : 1 }}
          >
            {isLoading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══ Reports Tab ═══ */
function ReportsTab() {
  const reports = [
    { title: 'Portfolio Intelligence Report', date: 'Mar 28, 2026', pages: '12 pages' },
    { title: 'Monthly Residuals Summary', date: 'Mar 5, 2026', pages: '8 pages' },
    { title: 'Risk Assessment — Q1 2026', date: 'Mar 1, 2026', pages: '15 pages' },
    { title: 'Zenith Integration Status', date: 'Feb 28, 2026', pages: '6 pages' },
    { title: 'Voice Agent ROI Analysis', date: 'Feb 15, 2026', pages: '10 pages' },
  ]
  return (
    <div className="lumina-reports">
      <div className="lumina-reports-header">
        <div className="lumina-section-label">Generated Reports</div>
        <button className="lumina-new-report">+ New Report</button>
      </div>
      {reports.map((r, i) => (
        <div key={i} className="lumina-report-item">
          <div className="lumina-report-icon">
            <FileText size={16} color="#3B82F6" strokeWidth={1.8} />
          </div>
          <div className="lumina-report-info">
            <div className="lumina-report-title">{r.title}</div>
            <div className="lumina-report-meta">{r.date} &middot; {r.pages}</div>
          </div>
          <span className="lumina-report-status">Ready</span>
        </div>
      ))}
    </div>
  )
}
