import { useState, useEffect, useCallback } from 'react'
import { Send, Bot, AlertTriangle, TrendingUp, Info, ChevronRight, FileText, MessageSquare, Lightbulb, BarChart3 } from 'lucide-react'
import { luminaInsights } from '../data/mockData'

const severityConfig: Record<string, { bg: string; iconBg: string; icon: React.ElementType; iconColor: string }> = {
  high: { bg: 'lumina-card-high', iconBg: 'high', icon: AlertTriangle, iconColor: 'text-rose-500' },
  medium: { bg: 'lumina-card-medium', iconBg: 'medium', icon: AlertTriangle, iconColor: 'text-amber-500' },
  positive: { bg: 'lumina-card-positive', iconBg: 'positive', icon: TrendingUp, iconColor: 'text-emerald-500' },
  info: { bg: 'lumina-card-info', iconBg: 'info', icon: Info, iconColor: 'text-blue-500' },
}

interface LuminaPanelProps {
  onClose?: () => void
}

export default function LuminaPanel({ onClose }: LuminaPanelProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'reports'>('chat')
  const [panelWidth, setPanelWidth] = useState(() => Math.max(Math.round(window.innerWidth * 0.3), 420))
  const [isResizing, setIsResizing] = useState(false)

  const tabs = [
    { id: 'chat' as const, label: 'Chat', Icon: MessageSquare },
    { id: 'insights' as const, label: 'Insights', Icon: Lightbulb },
    { id: 'reports' as const, label: 'Reports', Icon: BarChart3 },
  ]

  // ═══ Resize ═══
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
        {activeTab === 'insights' && <InsightsTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>

      {/* Input (chat only) */}
      {activeTab === 'chat' && <ChatInput />}
    </aside>
  )
}

function ChatInput() {
  const [input, setInput] = useState('')
  return (
    <div className="lumina-input-area">
      <div className="lumina-input-wrapper">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask Lumina anything..."
          className="lumina-input"
        />
        <button className="lumina-send-btn">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

function ChatTab() {
  return (
    <div className="lumina-chat">
      <div className="lumina-msg ai">
        <div className="lumina-msg-avatar"><Bot size={12} className="text-white" /></div>
        <div>
          <div className="lumina-msg-bubble ai">
            Good morning, Sarah. I've completed my overnight analysis across all 3 ISOs. Three items require your attention.
          </div>
        </div>
      </div>

      <div className="lumina-msg ai">
        <div className="lumina-msg-avatar" style={{ background: '#EF4444' }}>
          <AlertTriangle size={11} className="text-white" />
        </div>
        <div>
          <div className="lumina-msg-bubble ai">
            <strong>URGENT:</strong> Sunrise Deli churn probability hit 87%. Volume down 42% in 30 days, two chargebacks filed this week.
            <br /><br />
            I've prepared a retention offer: rate reduction to 2.49% + free PAX A920 upgrade. Estimated retention value: $97K annual residuals.
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="lumina-action-btn">Schedule Agent Call</button>
            <button className="lumina-action-btn">Review Offer Details</button>
          </div>
        </div>
      </div>

      <div className="lumina-msg ai">
        <div className="lumina-msg-avatar"><Bot size={12} className="text-white" /></div>
        <div>
          <div className="lumina-msg-bubble ai">
            Liberty Processing migration is at 92%. 12 merchants have incomplete bank info. I've drafted follow-up emails. Send them now, or review drafts?
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="lumina-action-btn">Send All 12</button>
            <button className="lumina-action-btn">Review Drafts</button>
          </div>
        </div>
      </div>

      <div className="lumina-msg user">
        <div className="lumina-msg-bubble user">What's driving the Sunrise Deli decline?</div>
      </div>

      <div className="lumina-msg ai">
        <div className="lumina-msg-avatar"><Bot size={12} className="text-white" /></div>
        <div>
          <div className="lumina-msg-bubble ai">
            Three factors: (1) PCI non-compliant for 94 days — they may be shopping processors, (2) a new competing deli opened 2 blocks away in January, (3) average ticket dropped from $18 to $11 suggesting menu changes. I'd recommend calling with a retention package.
          </div>
        </div>
      </div>
    </div>
  )
}

function InsightsTab() {
  return (
    <div className="lumina-insights">
      <div className="lumina-section-label">Auto-Generated Insights</div>
      {luminaInsights.map((insight, i) => {
        const cfg = severityConfig[insight.severity] || severityConfig.info
        const Icon = cfg.icon
        return (
          <div key={i} className={`lumina-insight-card ${cfg.bg}`}>
            <div className="lumina-insight-inner">
              <div className={`lumina-insight-icon ${cfg.iconBg}`}>
                <Icon size={14} className={cfg.iconColor} strokeWidth={2} />
              </div>
              <div className="lumina-insight-content">
                <div className="lumina-insight-title">{insight.title}</div>
                <div className="lumina-insight-text">{insight.text}</div>
                <div className="lumina-insight-time">{insight.time}</div>
              </div>
              <ChevronRight size={14} className="lumina-insight-chevron" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
