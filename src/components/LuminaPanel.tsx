import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Send, Bot, FileText, MessageSquare, BarChart3, Loader2 } from 'lucide-react'

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

      {/* Content */}
      <div className="lumina-content">
        {activeTab === 'chat' && <ChatTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </aside>
  )
}

/* ═══ Chat Tab with Claude API ═══ */
function ChatTab() {
  const location = useLocation()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi, I'm Lumina — your AI portfolio analyst. I have context on the page you're viewing. Ask me anything about your merchants, volume, risk, or pipeline." },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get the base path for context (e.g., /portal/transactions → /portal)
  const currentPage = location.pathname.startsWith('/portal') ? '/portal' : location.pathname

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
    <>
      {/* Context indicator */}
      <div style={{
        padding: '8px 16px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9',
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
                {msg.content || (isLoading && i === messages.length - 1 ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#94A3B8' }}>
                    <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Thinking...
                  </span>
                ) : '')}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="lumina-input-area">
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
    </>
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
