import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, FileText, MessageSquare, Loader2 } from 'lucide-react'
import Markdown from 'react-markdown'
import luminaIcon from '../assets/lumina-icon.svg'

function LuminaIcon({ size = 14 }: { size?: number }) {
  return <img src={luminaIcon} alt="Lumina" width={size} height={size} style={{ display: 'block' }} />
}

interface LuminaPanelProps {
  onClose?: () => void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const API_URL = '/api/chat'

export default function LuminaPanel({ onClose }: LuminaPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'documents'>('chat')
  const [panelWidth, setPanelWidth] = useState(() => Math.max(Math.round(window.innerWidth * 0.3), 420))
  const [isResizing, setIsResizing] = useState(false)

  const tabs = [
    { id: 'chat' as const, label: 'Chat', Icon: MessageSquare },
    { id: 'documents' as const, label: 'Documents', Icon: FileText },
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
            <LuminaIcon size={18} />
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
      {activeTab === 'documents' && <div className="lumina-content"><DocumentsTab /></div>}
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
    { role: 'assistant', content: "You have **1 open chargeback** for $487.50 (Visa ****4821, reason: Merchandise Not Received). Deadline is **March 26**. I'd recommend gathering your delivery confirmation or signed receipt. The industry win rate for this reason code is about 65%." },
  ],
  '/portal/transactions': [
    { role: 'assistant', content: "You're viewing your transaction history. Today you've processed **134 transactions** totaling **$2,148.20**. Average ticket is $35.19." },
    { role: 'user', content: "Any refunds today?" },
    { role: 'assistant', content: "You had **1 refund** today for $38.79 on a Discover card. Your refund rate is 1.8% which is well below the industry average of 3.2%. No voids today." },
  ],
  '/portal/statements': [
    { role: 'assistant', content: "Your latest statement for **March 2026** shows total volume of **$9,816** with fees of $264.05 (2.69% effective rate). Net deposit: $9,552." },
    { role: 'user', content: "How do my fees compare to last month?" },
    { role: 'assistant', content: "Your effective rate has been stable at **2.69%** for the past 3 months. February fees were $235.09 on $8,740 volume. Your rate is competitive — the average restaurant pays 2.85-3.10%. The biggest fee component is **Interchange at 68%** ($179.55)." },
  ],
  '/portal/pci': [
    { role: 'assistant', content: "Your PCI compliance status is **Compliant** through December 2026. SAQ-A completed, DSS Level 1. All checks passing." },
    { role: 'user', content: "When do I need to renew?" },
    { role: 'assistant', content: "Your SAQ-A is valid until **December 31, 2026** — about 8 months away. I'll send you a reminder 60 days before expiration. Your quarterly ASV scan is current (last passed Feb 28). P2PE is validated through your PAX A920 terminal." },
  ],
  '/portal/equipment': [
    { role: 'assistant', content: "Your **PAX A920** terminal is online and running firmware v4.2.1. Last transaction processed today. Battery at 87%." },
    { role: 'user', content: "Do I need a firmware update?" },
    { role: 'assistant', content: "Your firmware **v4.2.1** is the latest version — no update needed. Your terminal has been online for 342 consecutive days with 99.8% uptime. Connection: WiFi + 4G backup. If you're experiencing any issues, I can schedule a replacement through Harlow support." },
  ],
  '/portal/products': [
    { role: 'assistant', content: "You have **3 active products**: Business Checking (1.5% APY), Gift Cards, and Payroll. You're also **pre-approved** for Business Funding up to $25,000." },
    { role: 'user', content: "Which products should I add?" },
    { role: 'assistant', content: "Based on your business profile, I'd recommend:\n\n1. **Business Funding** — You're pre-approved for $25K at 1.15 factor. Great for seasonal inventory.\n2. **Accounting** — QuickBooks integration would auto-sync your $47K monthly volume and save ~4 hours/week on bookkeeping.\n3. **Health Insurance** — You have 3 employees. Group plans start at $385/mo and qualify for small business tax credits." },
  ],
  '/portal/support': [
    { role: 'assistant', content: "How can I help? You have **0 open support tickets**. Your last ticket (rate review) was resolved 12 days ago." },
    { role: 'user', content: "I need to update my bank account" },
    { role: 'assistant', content: "To update your settlement bank account, I'll need:\n\n1. **Voided check** or bank letter for the new account\n2. **Government-issued ID** (we have yours on file)\n\nThe change takes 2-3 business days to process. During transition, deposits continue to your current Chase ****8834 account. Want me to start the process?" },
  ],
  '/portal/sales': [
    { role: 'assistant', content: "Your POS data shows **4,364 items sold** in the last 30 days generating **$51K+ revenue**. Pepperoni Pizza is your #1 seller at 568 units ($9.6K)." },
    { role: 'user', content: "What should I focus on to increase revenue?" },
    { role: 'assistant', content: "Three opportunities from your data:\n\n1. **Cross-sell beverages** — only 15% of orders include a drink. If staff suggests a drink on every order, that's an extra **$3,500/month**.\n\n2. **Promote Supreme Pizza** — it has a higher margin ($5.10 cost vs $18.99 price = 73% margin) compared to Pepperoni (75% margin but lower ticket). Moving 10% of Pepperoni orders to Supreme adds ~$600/month.\n\n3. **4-5pm happy hour** — your slowest window. A pizza + drink combo deal could lift that hour by 40%." },
    { role: 'user', content: "What's my best day of the week?" },
    { role: 'assistant', content: "**Friday and Saturday** are your strongest days — about 40% more orders than weekdays. Saturday peaks at 7-8pm. Consider launching a **weekend family deal** (large pizza + salad + 2L soda) to increase average ticket on your busiest days." },
  ],
  '/partner': [
    { role: 'assistant', content: "Welcome back, Jake. Your portfolio is performing well — **34 active merchants** generating **$4,218/mo** in residuals. Pipeline has 15 leads across all stages." },
    { role: 'user', content: "How's my conversion rate?" },
    { role: 'assistant', content: "Your conversion rate is **28%** (lead to go-live), which is above the partner network average of 22%. Your strongest vertical is restaurants at 35% conversion. I'd suggest focusing on the 8 proposals currently pending — 3 of them have been idle for over a week." },
  ],
  '/partner/pipeline': [
    { role: 'assistant', content: "Your pipeline has **15 active leads**: 4 in Lead stage, 4 in Proposal, 3 in Application, 1 Boarding, and 3 Live. Total estimated volume: **$285K/mo**." },
    { role: 'user', content: "Which leads should I follow up on?" },
    { role: 'assistant', content: "Priority follow-ups:\n\n1. **Redwood Dental** ($45K/mo est.) — Proposal sent 3 weeks ago, no response. High-value healthcare practice.\n2. **Bay Area HVAC** ($35K/mo) — Application submitted but missing bank statements.\n3. **Bayshore Auto Parts** ($15K/mo) — Proposal stage, expressed interest in rate comparison.\n\nI can generate a follow-up email template for any of these." },
  ],
  '/partner/merchants': [
    { role: 'assistant', content: "You have **34 active merchants** with combined monthly volume of **$618K**. Your average payout per merchant is **$124/mo**." },
    { role: 'user', content: "Any merchants at risk of churning?" },
    { role: 'assistant', content: "2 merchants showing warning signs:\n\n1. **Valley Pet Care** — volume dropped 18% last month. May be seasonal but worth a check-in.\n2. **Tech Gadgets Plus** — hasn't processed in 5 days. Could be equipment issue.\n\nI'd recommend calling both this week. Retention saves are worth 10x the effort of new acquisition." },
  ],
  '/partner/residuals': [
    { role: 'assistant', content: "Your March residuals are **$4,218** — up 5.8% from February ($3,985). YTD earnings: **$38,420**. Next payout: April 15." },
    { role: 'user', content: "Which merchants generate the most?" },
    { role: 'assistant', content: "Your top 3 earners:\n\n1. **Harbor Seafood** — $320/mo ($32K volume, 60% split)\n2. **Nob Hill Bistro** — $280/mo ($28K volume, 60% split)\n3. **Coastal Cafe** — $284/mo ($28.4K volume, 60% split)\n\nThese 3 restaurants account for 21% of your total residuals. Restaurant vertical is your strongest — consider focusing new leads there." },
  ],
  '/partner/marketing': [
    { role: 'assistant', content: "Your shareable application link has received **142 clicks** this month with **18 form completions** (12.7% conversion). Top downloaded asset: Rate Comparison Sheet (34 downloads)." },
    { role: 'user', content: "How can I get more leads?" },
    { role: 'assistant', content: "Based on your profile, I'd recommend:\n\n1. **Share your link on LinkedIn** — partners who do this see 3x more form completions\n2. **Ask your top merchants for referrals** — Harbor Seafood and Nob Hill Bistro could introduce similar restaurants\n3. **Download the co-branded one-pager** — leave it with prospects after meetings\n4. **Complete the Sales Techniques training** — partners who finish it have 40% higher close rates" },
  ],
  '/partner/training': [
    { role: 'assistant', content: "You've completed **2 of 5 courses** (Getting Started + Products Overview). Next recommended: **Compliance Essentials** — required for your Partner Certification." },
    { role: 'user', content: "What's the certification benefit?" },
    { role: 'assistant', content: "**Certified Partners** get:\n\n- **10% higher residual split** (60% → 70%)\n- **Priority lead routing** from Harlow's Voice Agent\n- **Co-marketing budget** ($500/quarter)\n- **Dedicated account manager**\n\nYou're 3 courses away. Compliance Essentials takes ~45 minutes. Want to start now?" },
  ],
}

/* ═══ Chat Tab with Claude API ═══ */
function ChatTab() {
  const location = useLocation()
  // Match exact path first, then fall back to portal/partner defaults
  const path = location.pathname
  const currentPage = seedConversations[path] ? path : path.startsWith('/partner') ? '/partner' : path.startsWith('/portal') ? '/portal' : path
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
    '/portal': 'Merchant Portal — Home',
    '/portal/transactions': 'Transactions',
    '/portal/statements': 'Monthly Statements',
    '/portal/pci': 'PCI Compliance',
    '/portal/equipment': 'Equipment',
    '/portal/products': 'Products & Services',
    '/portal/support': 'Support',
    '/portal/sales': 'POS Sales Analytics',
    '/portal/funding': 'Business Funding',
    '/partner': 'Partner Dashboard',
    '/partner/pipeline': 'Partner Pipeline',
    '/partner/merchants': 'My Merchants',
    '/partner/residuals': 'Residuals & Payouts',
    '/partner/marketing': 'Marketing Tools',
    '/partner/training': 'Training & Certification',
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
                <LuminaIcon size={16} />
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
function DocumentsTab() {
  const sections = [
    {
      label: 'Reports',
      items: [
        { title: 'Portfolio Intelligence Report', date: 'Mar 28, 2026', type: 'PDF', pages: '12 pages' },
        { title: 'Monthly Residuals Summary', date: 'Mar 5, 2026', type: 'PDF', pages: '8 pages' },
        { title: 'Risk Assessment — Q1 2026', date: 'Mar 1, 2026', type: 'PDF', pages: '15 pages' },
        { title: 'Zenith Integration Status', date: 'Feb 28, 2026', type: 'PDF', pages: '6 pages' },
        { title: 'Voice Agent ROI Analysis', date: 'Feb 15, 2026', type: 'PDF', pages: '10 pages' },
      ],
    },
    {
      label: 'Statements',
      items: [
        { title: 'February 2026 Statement', date: 'Mar 5, 2026', type: 'PDF', pages: '4 pages' },
        { title: 'January 2026 Statement', date: 'Feb 5, 2026', type: 'PDF', pages: '4 pages' },
        { title: 'December 2025 Statement', date: 'Jan 5, 2026', type: 'PDF', pages: '4 pages' },
      ],
    },
    {
      label: 'Compliance',
      items: [
        { title: 'PCI DSS Certificate', date: 'Dec 15, 2025', type: 'PDF', pages: '2 pages' },
        { title: 'SAQ-A Completion', date: 'Dec 15, 2025', type: 'PDF', pages: '8 pages' },
        { title: 'TCPA Compliance Audit', date: 'Jan 10, 2026', type: 'PDF', pages: '5 pages' },
      ],
    },
    {
      label: 'Contracts',
      items: [
        { title: 'Harlow Direct ISO Agreement', date: 'Jan 1, 2019', type: 'PDF', pages: '24 pages' },
        { title: 'Zenith Acquisition Agreement', date: 'Oct 1, 2025', type: 'PDF', pages: '48 pages' },
        { title: 'Liberty Processing Agreement', date: 'Jan 15, 2026', type: 'PDF', pages: '36 pages' },
      ],
    },
  ]

  return (
    <div className="lumina-reports">
      {sections.map((section, si) => (
        <div key={si}>
          <div style={{ padding: '12px 16px 6px', fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {section.label}
          </div>
          {section.items.map((item, i) => (
            <div key={i} className="lumina-report-item" style={{ cursor: 'pointer' }}>
              <div className="lumina-report-icon">
                <FileText size={16} color="#3B82F6" strokeWidth={1.8} />
              </div>
              <div className="lumina-report-info">
                <div className="lumina-report-title">{item.title}</div>
                <div className="lumina-report-meta">{item.date} &middot; {item.pages}</div>
              </div>
              <span className="lumina-report-status">{item.type}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
