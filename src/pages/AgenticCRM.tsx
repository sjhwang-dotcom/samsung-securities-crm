import { useState } from 'react'
import {
  Plus, Search, CheckCircle, AlertTriangle, FileText, Upload, ChevronRight,
  Kanban, Store, DollarSign, TicketCheck, ClipboardList,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { leadPipeline, merchants, onboardingApps } from '../data/mockData'

type SubNav = 'pipeline' | 'onboarding' | 'merchants' | 'residuals' | 'tickets'

const subNavItems: { id: SubNav; label: string; icon: typeof Kanban }[] = [
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'onboarding', label: 'Onboarding', icon: ClipboardList },
  { id: 'merchants', label: 'My Merchants', icon: Store },
  { id: 'residuals', label: 'Residuals', icon: DollarSign },
  { id: 'tickets', label: 'Tickets', icon: TicketCheck },
]

export default function AgenticCRM() {
  const [activeNav, setActiveNav] = useState<SubNav>('pipeline')

  return (
    <div className="dashboard-grid">
      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            placeholder="Search merchants..."
            style={{
              background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
              paddingLeft: 34, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
              fontSize: 13, outline: 'none', width: 240, color: '#334155',
            }}
          />
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          background: 'linear-gradient(to right, #609FFF, #1578F7)',
          color: 'white', borderRadius: 10, padding: '9px 16px', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          <Plus size={16} strokeWidth={2.5} /> New Lead
        </button>
      </div>

      {/* Sub-Navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', overflowX: 'auto', flexShrink: 0 }}>
        {subNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              padding: '10px 14px', fontSize: 12,
              fontWeight: activeNav === item.id ? 700 : 500,
              color: activeNav === item.id ? '#1578F7' : '#64748B',
              background: 'none', border: 'none',
              borderBottom: activeNav === item.id ? '2px solid #1578F7' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <item.icon size={16} strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </div>

      {activeNav === 'pipeline' && <PipelineView />}
      {activeNav === 'onboarding' && <OnboardingMasterDetail />}
      {activeNav === 'merchants' && <MerchantsView />}
      {activeNav === 'residuals' && <ResidualsView />}
      {activeNav === 'tickets' && <TicketsView />}
    </div>
  )
}

/* ═══ Score Ring ═══ */
function ScoreRing({ score, size = 40 }: { score: number; size?: number }) {
  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#0891B2' : '#F59E0B'
  const label = score >= 80 ? 'High' : score >= 60 ? 'Med' : 'Low'
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={3} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: 8, fontWeight: 700, color: '#94A3B8', lineHeight: 1, marginTop: 1 }}>{label}</span>
      </div>
    </div>
  )
}

/* ═══ Pipeline Dashboard ═══ */
const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

// Simulated monthly pipeline data
const pipelineMonthly = [
  { month: 'Oct', newLeads: 18, won: 4, lost: 3, value: 142 },
  { month: 'Nov', newLeads: 22, won: 6, lost: 4, value: 168 },
  { month: 'Dec', newLeads: 15, won: 5, lost: 2, value: 155 },
  { month: 'Jan', newLeads: 28, won: 8, lost: 5, value: 198 },
  { month: 'Feb', newLeads: 31, won: 7, lost: 4, value: 215 },
  { month: 'Mar', newLeads: 35, won: 9, lost: 3, value: 247 },
]

const leadSourceData = [
  { name: 'Voice Agent', value: 40, color: '#1578F7' },
  { name: 'Referral', value: 25, color: '#10B981' },
  { name: 'Website', value: 15, color: '#8B5CF6' },
  { name: 'Walk-in', value: 10, color: '#F59E0B' },
  { name: 'Cold Call', value: 10, color: '#94A3B8' },
]

const agentLeaderboard = [
  { name: 'David Goldfarb', deals: 34, value: '$142K', winRate: '68%' },
  { name: 'Sarah Chen', deals: 28, value: '$118K', winRate: '72%' },
  { name: 'Mike Rodriguez', deals: 21, value: '$89K', winRate: '61%' },
  { name: 'Kate Palmarini', deals: 18, value: '$76K', winRate: '65%' },
]

const recentDeals = [
  { name: "Bella's Bistro LLC", stage: 'Approval', value: '$32K/mo', score: 72, time: '2h ago', status: 'Won' },
  { name: 'GreenLeaf Market', stage: 'Application', value: '$35K/mo', score: 88, time: '5h ago', status: 'Active' },
  { name: 'Sunrise Pharmacy', stage: 'Application', value: '$28K/mo', score: 81, time: '1d ago', status: 'Active' },
  { name: "King's Crown Jewelry", stage: 'Underwriting', value: '$45K/mo', score: 67, time: '1d ago', status: 'At Risk' },
  { name: 'Park Slope Yoga', stage: 'Proposal', value: '$12K/mo', score: 71, time: '2d ago', status: 'Active' },
  { name: 'Metro Grill', stage: 'Equipment', value: '$24K/mo', score: 79, time: '3d ago', status: 'Won' },
]

function PipelineView() {
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const stages = Object.entries(leadPipeline)
  const totalLeads = stages.reduce((s, [, l]) => s + l.length, 0)
  const totalVolume = stages.reduce((s, [, leads]) =>
    s + leads.reduce((v, l) => v + parseFloat((l.estVolume || '$0').replace(/[$K/mo]/g, '')) * 1000, 0), 0)
  const avgScore = Math.round(stages.flatMap(([,l]) => l).reduce((s,l) => s + l.aiScore, 0) / totalLeads)
  const conversionPct = Math.round(stages.filter(([s]) => ['Approval','Boarding','Equipment','Go-Live'].includes(s)).reduce((s,[,l]) => s + l.length, 0) / totalLeads * 100)

  const stageColors: Record<string, string> = {
    'Lead': '#3B82F6', 'Proposal': '#4F46E5', 'Application': '#8B5CF6', 'Underwriting': '#F59E0B',
    'Approval': '#10B981', 'Boarding': '#0891B2', 'Equipment': '#EC4899', 'Go-Live': '#059669',
  }

  const activeLeads = activeStage ? (leadPipeline as Record<string, any[]>)[activeStage] ?? [] : []

  return (
    <div className="dashboard-grid">
      {/* Row 1: KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {[
          { label: 'Active Pipeline', value: totalLeads, sub: 'leads', color: '#1578F7' },
          { label: 'Pipeline Value', value: `$${(totalVolume / 1000).toFixed(0)}K`, sub: '/month est.', color: '#4F46E5' },
          { label: 'Win Rate', value: '67%', sub: 'last 90 days', color: '#10B981' },
          { label: 'Avg Deal Velocity', value: '18d', sub: 'lead to close', color: '#0891B2' },
          { label: 'Avg AI Score', value: avgScore, sub: 'lead quality', color: '#8B5CF6' },
          { label: 'Conversion', value: `${conversionPct}%`, sub: 'to approval+', color: '#059669' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value" style={{ fontSize: 20, color: kpi.color }}>{kpi.value}</div>
            <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 2: Funnel + Stage detail */}
      <Card noPadding>
        <div style={{ padding: '14px 16px 10px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Pipeline Stages</div>
          {/* Horizontal funnel */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 8, borderRadius: 8, overflow: 'hidden' }}>
            {stages.map(([stage, leads]) => {
              const color = stageColors[stage] ?? '#94A3B8'
              const pct = (leads.length / totalLeads) * 100
              const isActive = activeStage === stage
              return (
                <div key={stage} onClick={() => setActiveStage(isActive ? null : stage)}
                  style={{
                    flex: Math.max(pct, 5), height: 36, cursor: 'pointer', transition: 'all 0.2s ease',
                    background: isActive ? color : `${color}18`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                  }} title={`${stage}: ${leads.length} leads`}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: isActive ? 'white' : color }}>{leads.length}</span>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 2 }}>
            {stages.map(([stage, leads]) => (
              <div key={stage} onClick={() => setActiveStage(activeStage === stage ? null : stage)}
                style={{ flex: Math.max((leads.length / totalLeads) * 100, 5), textAlign: 'center', cursor: 'pointer', padding: '4px 0' }}>
                <div style={{ fontSize: 9, fontWeight: activeStage === stage ? 700 : 500, color: activeStage === stage ? stageColors[stage] : '#94A3B8' }}>{stage}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Drill-down */}
        {activeStage && activeLeads.length > 0 && (
          <div style={{ borderTop: '1px solid #F1F5F9' }}>
            <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: stageColors[activeStage] }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{activeStage}</span>
                <span style={{ fontSize: 11, color: '#94A3B8' }}>{activeLeads.length} leads</span>
              </div>
              <button onClick={() => setActiveStage(null)} style={{ fontSize: 11, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>Close ✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, padding: '0 16px 16px' }}>
              {activeLeads.map((lead: any) => (
                <div key={lead.name} className="harlow-card" style={{ padding: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{lead.location}</div>
                    </div>
                    <ScoreRing score={lead.aiScore} size={36} />
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>MCC {lead.mcc}</span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#E8F0FE', color: '#1578F7' }}>{lead.estVolume}</span>
                  </div>
                  {lead.detail && <div style={{ fontSize: 11, color: '#64748B', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>{lead.detail}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Row 3: Pipeline Trend + Lead Sources + Conversion Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
        {/* Pipeline Activity Trend */}
        <Card noPadding>
          <CardHeader title="Pipeline Activity (6mo)" />
          <div style={{ padding: '0 16px 16px', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineMonthly} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="newLeads" name="New Leads" fill="#1578F7" radius={[3,3,0,0]} />
                <Bar dataKey="won" name="Won" fill="#10B981" radius={[3,3,0,0]} />
                <Bar dataKey="lost" name="Lost" fill="#F43F5E" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Lead Sources */}
        <Card noPadding>
          <CardHeader title="Lead Sources" />
          <div style={{ padding: '0 16px 16px', height: 200, display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              {leadSourceData.map(src => (
                <div key={src.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: src.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#334155', fontWeight: 500, flex: 1 }}>{src.name}</span>
                  <div style={{ width: 80, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${src.value}%`, height: '100%', background: src.color, borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', width: 32, textAlign: 'right' }}>{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Conversion Funnel */}
        <Card noPadding>
          <CardHeader title="Conversion Funnel" />
          <div style={{ padding: '0 16px 16px', height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {[
              { stage: 'Leads', count: 200, pct: 100 },
              { stage: 'Qualified', count: 142, pct: 71 },
              { stage: 'Proposal', count: 98, pct: 49 },
              { stage: 'Application', count: 62, pct: 31 },
              { stage: 'Won', count: 39, pct: 19.5 },
            ].map((f, i) => (
              <div key={f.stage} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 10, color: '#94A3B8', width: 60, textAlign: 'right', fontWeight: 500 }}>{f.stage}</span>
                <div style={{ flex: 1, position: 'relative', height: 20 }}>
                  <div style={{
                    width: `${f.pct}%`, height: '100%', borderRadius: 4,
                    background: `linear-gradient(90deg, #1578F7${Math.round(255 - i * 40).toString(16).padStart(2,'0')}, #1578F7${Math.round(180 - i * 30).toString(16).padStart(2,'0')})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                    transition: 'width 0.3s ease',
                  }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'white' }}>{f.count}</span>
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B', width: 36, textAlign: 'right' }}>{f.pct}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 4: Pipeline Value Trend + Agent Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>
        {/* Pipeline Value Trend */}
        <Card noPadding>
          <CardHeader title="Pipeline Value Trend ($K/mo)" />
          <div style={{ padding: '0 16px 16px', height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pipelineMonthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v: any) => `$${v}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v}K`, 'Value']} />
                <defs>
                  <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1578F7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1578F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#1578F7" fill="url(#valGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Leaderboard */}
        <Card noPadding>
          <CardHeader title="Agent Leaderboard (Q1 2026)" />
          <div style={{ padding: '0 16px 16px' }}>
            {agentLeaderboard.map((agent, i) => (
              <div key={agent.name} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: i < agentLeaderboard.length - 1 ? '1px solid #F8FAFC' : 'none',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? '#1578F7' : i === 1 ? '#3B82F6' : '#E8F0FE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: i < 2 ? 'white' : '#1578F7',
                }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{agent.name}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{agent.deals} deals · {agent.value}</div>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                  background: parseFloat(agent.winRate) >= 70 ? '#D1FAE5' : '#E8F0FE',
                  color: parseFloat(agent.winRate) >= 70 ? '#059669' : '#1578F7',
                }}>{agent.winRate}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 5: Recent Deal Activity */}
      <Card noPadding>
        <CardHeader title="Recent Deal Activity" />
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {recentDeals.map(deal => {
              const statusColor = deal.status === 'Won' ? '#10B981' : deal.status === 'At Risk' ? '#F59E0B' : '#1578F7'
              return (
                <div key={deal.name} className="harlow-card" style={{ padding: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{deal.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{deal.time}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                      background: `${statusColor}15`, color: statusColor,
                    }}>{deal.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: `${stageColors[deal.stage] ?? '#94A3B8'}15`, color: stageColors[deal.stage] ?? '#94A3B8' }}>{deal.stage}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#1E293B' }}>{deal.value}</span>
                    <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 'auto' }}>Score: {deal.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ═══ Onboarding Master-Detail (ISO-style layout) ═══ */
function OnboardingMasterDetail() {
  const apps = onboardingApps
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = apps[selectedIdx]

  const statusColor = (s: string) => s === 'In Progress' ? '#3B82F6' : s === 'In Review' ? '#4F46E5' : s.includes('Needs') || s.includes('Awaiting') ? '#F59E0B' : '#94A3B8'
  const riskColor = (label: string) => label === 'Low Risk' ? '#10B981' : label === 'Medium' ? '#F59E0B' : label === 'High Risk' ? '#EF4444' : '#94A3B8'

  const steps = [
    { label: 'Application', done: true },
    { label: 'Documents', done: true },
    { label: 'KYB/KYC', current: true },
    { label: 'Risk Assessment', done: false },
    { label: 'Pricing', done: false },
    { label: 'Boarding', done: false },
  ]

  const kybResults = [
    { icon: CheckCircle, color: '#10B981', title: 'Business Entity Verified', sub: 'Delaware Corp, EIN validated' },
    { icon: CheckCircle, color: '#10B981', title: 'Beneficial Ownership Confirmed', sub: '100% owner verified' },
    { icon: CheckCircle, color: '#10B981', title: 'Sanctions & PEP Screening', sub: 'Clear — no matches' },
    { icon: AlertTriangle, color: '#F59E0B', title: 'Adverse Media Check', sub: '1 result flagged — low relevance' },
    { icon: CheckCircle, color: '#10B981', title: 'Identity Verification', sub: 'Passport OCR + liveness passed' },
  ]

  const docs = [
    { name: 'Articles of Incorporation', status: 'Verified', extracted: 'Entity, State, EIN' },
    { name: 'Driver License', status: 'Verified', extracted: 'Name, DOB, Address' },
    { name: 'Bank Statements (3mo)', status: 'Verified', extracted: 'Avg balance $47.2K' },
    { name: 'Voided Check', status: 'Verified', extracted: 'Routing #, Account #' },
    { name: 'Processing Statements', status: 'Verified', extracted: 'Vol $89K | CB 0.3%' },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-12px -20px -16px', overflow: 'hidden' }}>
      {/* ═══ Left: Application List ═══ */}
      <div style={{
        width: 300, minWidth: 300, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 160px)',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Applications</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{apps.length} active · Avg SLA 3.2h</div>
        </div>

        {/* Summary KPIs in sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, padding: '10px 12px', borderBottom: '1px solid #F1F5F9' }}>
          {[
            { label: 'In Progress', value: apps.filter(a => a.status === 'In Progress').length, color: '#3B82F6' },
            { label: 'In Review', value: apps.filter(a => a.status === 'In Review').length, color: '#4F46E5' },
            { label: 'Needs Action', value: apps.filter(a => a.status.includes('Needs') || a.status.includes('Awaiting')).length, color: '#F59E0B' },
            { label: 'Auto-Approve', value: '42%', color: '#10B981' },
          ].map(k => (
            <div key={k.label} style={{ background: '#FAFBFC', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* App list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {apps.map((app, i) => {
            const isActive = selectedIdx === i
            return (
              <div key={app.merchant} onClick={() => setSelectedIdx(i)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06), transparent)' : 'transparent',
                  borderBottom: '1px solid #F8FAFC',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#1578F7' : '#0F172A' }}>{app.merchant}</span>
                  <ChevronRight size={12} color="#CBD5E1" style={{ opacity: isActive ? 1 : 0 }} />
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>{app.stage}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 700, background: `${statusColor(app.status)}15`, color: statusColor(app.status) }}>
                    {app.status}
                  </span>
                  {app.riskScore && (
                    <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 4, fontWeight: 700, background: `${riskColor(app.riskLabel)}15`, color: riskColor(app.riskLabel) }}>
                      Risk: {app.riskScore}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ padding: '10px 16px', borderTop: '1px solid #F1F5F9' }}>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12,
            background: 'linear-gradient(to right, #609FFF, #1578F7)',
            color: 'white', borderRadius: 8, padding: '8px 0', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}><Plus size={14} /> New Application</button>
        </div>
      </div>

      {/* ═══ Right: Detail View ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 160px)' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{selected.merchant}</span>
                <StatusBadge variant={selected.status === 'In Progress' ? 'blue' : selected.status === 'In Review' ? 'indigo' : 'amber'}>{selected.status}</StatusBadge>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
                {selected.bank} · Submitted {selected.submitted} · Assigned to {selected.assigned}
              </div>
            </div>
            {selected.riskScore && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: riskColor(selected.riskLabel) }}>{selected.riskScore}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: riskColor(selected.riskLabel) }}>{selected.riskLabel}</div>
              </div>
            )}
          </div>

          {/* Progress Steps */}
          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {steps.map((step, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      background: step.done ? '#10B981' : step.current ? '#1578F7' : '#E2E8F0',
                      color: step.done || step.current ? 'white' : '#94A3B8', fontSize: 10, fontWeight: 700,
                    }}>
                      {step.done ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 500, color: step.done ? '#059669' : step.current ? '#1578F7' : '#94A3B8' }}>{step.label}</span>
                    {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step.done ? '#A7F3D0' : '#E2E8F0' }} />}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* KYB/KYC + Risk side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>
            {/* KYB/KYC */}
            <Card noPadding>
              <CardHeader title="KYB / KYC Verification" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {kybResults.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: '1px solid #F1F5F9' }}>
                    <item.icon size={16} style={{ flexShrink: 0, color: item.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{item.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Risk + Documents */}
            <div className="dashboard-grid">
              {/* AI Risk */}
              <Card noPadding>
                <CardHeader title="AI Risk Assessment" />
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                    <div style={{ position: 'relative', width: 80, height: 80 }}>
                      <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray={`${72 * 2.64} ${100 * 2.64}`} strokeLinecap="round" />
                      </svg>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>72</span>
                        <span style={{ fontSize: 9, color: '#059669', fontWeight: 500 }}>LOW RISK</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> CB Rate: 0.3%</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> Volume: stable</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> Fraud: clear</div>
                    </div>
                  </div>
                  <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 8, padding: 10, fontSize: 11 }}>
                    <span style={{ fontWeight: 700, color: '#0F766E' }}>AUTO-APPROVE</span>
                    <span style={{ color: '#64748B' }}> — Tier 2 at 2.69% + $0.10</span>
                  </div>
                </div>
              </Card>

              {/* Documents */}
              <Card noPadding>
                <CardHeader title={`Documents (${docs.length})`} />
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {docs.map((doc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, border: '1px solid #F1F5F9' }}>
                      <FileText size={12} style={{ color: '#94A3B8', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{doc.extracted}</div>
                      </div>
                      <StatusBadge variant="emerald">{doc.status}</StatusBadge>
                    </div>
                  ))}
                  <button style={{
                    width: '100%', marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    fontSize: 11, color: '#64748B', border: '1px dashed #CBD5E1', borderRadius: 6, padding: '7px 0',
                    background: 'none', cursor: 'pointer',
                  }}><Upload size={12} /> Add Document</button>
                </div>
              </Card>

              {/* Meta */}
              <div style={{ background: '#FAFBFC', borderRadius: 8, padding: 12, fontSize: 11, color: '#64748B', fontWeight: 500 }}>
                <div>ID: HRW-2026-0488292</div>
                <div style={{ marginTop: 3 }}>SLA: 4h remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ My Merchants ═══ */
function MerchantsView() {
  type MerchantRow = { name: string; mid: string; processor: string; equipment: string; monthlyVol: string; pciStatus: string; status: string }

  const active = merchants.filter(m => m.status === 'Active').length
  const boarding = merchants.filter(m => m.status === 'Boarding').length
  const inactive = merchants.filter(m => m.status === 'Inactive').length
  const compliant = merchants.filter(m => m.pciStatus === 'Compliant').length
  const totalVol = merchants.reduce((s, m) => s + parseFloat(m.monthlyVol.replace(/[$,K]/g, '') || '0') * (m.monthlyVol.includes('K') ? 1000 : 1), 0)

  const pciVariant = (s: string) => s === 'Compliant' ? 'emerald' as const : s === 'Non-Compliant' ? 'rose' as const : 'gray' as const
  const statusVariant = (s: string) => s === 'Active' ? 'emerald' as const : s === 'Boarding' ? 'blue' as const : 'gray' as const

  const columns: Column<MerchantRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'mid', header: 'MID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.mid}</span> },
    { key: 'processor', header: 'Processor' },
    { key: 'equipment', header: 'Equipment' },
    { key: 'monthlyVol', header: 'Monthly Vol', render: (r) => <span style={{ fontWeight: 700, color: '#1E293B' }}>{r.monthlyVol}</span> },
    { key: 'pciStatus', header: 'PCI', render: (r) => <StatusBadge variant={pciVariant(r.pciStatus)}>{r.pciStatus}</StatusBadge> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  // Processor breakdown
  const procBreakdown: Record<string, number> = {}
  merchants.forEach(m => { procBreakdown[m.processor] = (procBreakdown[m.processor] || 0) + 1 })

  return (
    <div className="dashboard-grid">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Merchants', value: merchants.length, color: '#1578F7' },
          { label: 'Active', value: active, color: '#10B981' },
          { label: 'Boarding', value: boarding, color: '#3B82F6' },
          { label: 'PCI Compliant', value: `${Math.round(compliant / Math.max(merchants.length, 1) * 100)}%`, color: compliant / merchants.length > 0.85 ? '#10B981' : '#F59E0B' },
          { label: 'Monthly Volume', value: `$${(totalVol / 1000).toFixed(0)}K`, color: '#4F46E5' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value" style={{ fontSize: 22, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Processor + Status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="By Processor" />
          <div style={{ padding: '0 16px 16px' }}>
            {Object.entries(procBreakdown).sort((a, b) => b[1] - a[1]).map(([proc, count]) => (
              <div key={proc} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#334155', fontWeight: 500, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{proc}</span>
                <div style={{ width: 100, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / merchants.length) * 100}%`, height: '100%', background: '#1578F7', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', width: 24, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card noPadding>
          <CardHeader title="Status Breakdown" />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Active', count: active, pct: Math.round(active / merchants.length * 100), color: '#10B981' },
              { label: 'Boarding', count: boarding, pct: Math.round(boarding / merchants.length * 100), color: '#3B82F6' },
              { label: 'Inactive', count: inactive, pct: Math.round(inactive / merchants.length * 100), color: '#94A3B8' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: '#334155' }}>{s.label}</span>
                  <span style={{ fontWeight: 700, color: s.color }}>{s.count} ({s.pct}%)</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card noPadding>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Merchant Portfolio</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <select style={{ fontSize: 12, background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 10px', fontWeight: 600, color: '#475569', outline: 'none' }}>
              <option>All Statuses</option><option>Active</option><option>Boarding</option><option>Inactive</option>
            </select>
            <select style={{ fontSize: 12, background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 10px', fontWeight: 600, color: '#475569', outline: 'none' }}>
              <option>All Processors</option><option>Harlow Payments</option><option>EPSG</option><option>Repay TSYS FEO</option>
            </select>
          </div>
        </div>
        <DataTable columns={columns} data={merchants as unknown as MerchantRow[]} hoverable />
      </Card>
    </div>
  )
}

/* ═══ Residuals ═══ */
const residualTrend = [
  { month: 'Oct', residual: 2890, volume: 25100 },
  { month: 'Nov', residual: 3050, volume: 26300 },
  { month: 'Dec', residual: 3180, volume: 27800 },
  { month: 'Jan', residual: 3320, volume: 29200 },
  { month: 'Feb', residual: 3635, volume: 30500 },
  { month: 'Mar', residual: 3847, volume: 31100 },
]

function ResidualsView() {
  type ResidualRow = { merchant: string; processor: string; volume: string; gross: string; split: string; payout: string }

  const residualData: ResidualRow[] = [
    { merchant: "Mario's Pizzeria", processor: 'Harlow Payments', volume: '$47,230', gross: '$472.30', split: '60%', payout: '$283.38' },
    { merchant: 'Harlem Grocery', processor: 'Repay TSYS FEO', volume: '$38,410', gross: '$384.10', split: '60%', payout: '$230.46' },
    { merchant: 'Jade Garden', processor: 'Harlow Payments', volume: '$31,560', gross: '$315.60', split: '60%', payout: '$189.36' },
    { merchant: 'Brooklyn Dry Cleaners', processor: 'EPSG', volume: '$22,890', gross: '$228.90', split: '60%', payout: '$137.34' },
    { merchant: 'Sunrise Deli', processor: 'Harlow Payments', volume: '$18,770', gross: '$187.70', split: '60%', payout: '$112.62' },
    { merchant: 'Lucky Nail Salon', processor: 'EPSG Wells Fargo', volume: '$12,440', gross: '$124.40', split: '60%', payout: '$74.64' },
  ]

  const residualColumns: Column<ResidualRow>[] = [
    { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
    { key: 'processor', header: 'Processor' },
    { key: 'volume', header: 'Volume' },
    { key: 'gross', header: 'Gross Residual' },
    { key: 'split', header: 'Your Split' },
    { key: 'payout', header: 'Your Payout', render: (r) => <span style={{ fontWeight: 700, color: '#059669' }}>{r.payout}</span> },
  ]

  const growth = ((3847 - 3635) / 3635 * 100).toFixed(1)

  return (
    <div className="dashboard-grid">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'March 2026 (Projected)', value: '$3,847', color: '#1578F7' },
          { label: 'February 2026 (Paid)', value: '$3,635', color: '#059669' },
          { label: 'MoM Growth', value: `+${growth}%`, color: '#10B981' },
          { label: '12-Month Total', value: '$41,218', color: '#4F46E5' },
          { label: 'Avg Per Merchant', value: '$0.83', color: '#0891B2' },
        ].map(r => (
          <div key={r.label} className="kpi-card">
            <div className="kpi-label">{r.label}</div>
            <div className="kpi-value" style={{ fontSize: 20, color: r.color }}>{r.value}</div>
          </div>
        ))}
      </div>

      {/* Residual Trend + ISO Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Residual Income Trend (6mo)" />
          <div style={{ padding: '0 16px 16px', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={residualTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v: any) => `$${(v/1000).toFixed(1)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Residual']} />
                <defs>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="residual" stroke="#10B981" fill="url(#resGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Residual by ISO" />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { iso: 'Harlow Direct', amount: '$1,840', pct: 48, split: '100%', color: '#1578F7' },
              { iso: 'Zenith Payments', amount: '$890', pct: 23, split: '70%', color: '#4F46E5' },
              { iso: 'Liberty Processing', amount: '$480', pct: 12, split: '60%', color: '#8B5CF6' },
            ].map(iso => (
              <div key={iso.iso}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{iso.iso}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#059669' }}>{iso.amount}</span>
                    <span style={{ color: '#94A3B8', fontSize: 10, fontWeight: 500 }}>Split: {iso.split}</span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${iso.pct}%`, height: '100%', background: iso.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card noPadding>
        <CardHeader title="Residual Breakdown — Top Merchants (February 2026)" />
        <DataTable columns={residualColumns} data={residualData} hoverable />
      </Card>
    </div>
  )
}

/* ═══ Tickets ═══ */
function TicketsView() {
  type TicketRow = { id: string; desc: string; merchant: string; type: string; priority: string; created: string; assigned: string; status: string }

  const tickets: TicketRow[] = [
    { id: 'TKT-2026-0314', desc: 'Chargeback response needed', merchant: "Bella's Bistro", type: 'Chargeback', priority: 'Urgent', created: 'Mar 14', assigned: 'Sarah Chen', status: 'Open' },
    { id: 'TKT-2026-0312', desc: 'Replace PAX A920', merchant: 'Sunrise Deli', type: 'Equipment', priority: 'Normal', created: 'Mar 12', assigned: 'Operations', status: 'In Progress' },
    { id: 'TKT-2026-0311', desc: 'Rate review request', merchant: 'Jade Garden', type: 'Pricing', priority: 'Normal', created: 'Mar 11', assigned: 'David Goldfarb', status: 'In Progress' },
    { id: 'TKT-2026-0308', desc: 'Update bank account', merchant: 'Lucky Nail Salon', type: 'Bank Info', priority: 'High', created: 'Mar 8', assigned: 'Kate Palmarini', status: 'Awaiting Docs' },
    { id: 'TKT-2026-0305', desc: 'PCI compliance reminder', merchant: 'Metro Tobacco', type: 'Compliance', priority: 'Normal', created: 'Mar 5', assigned: 'AI Auto', status: 'Resolved' },
    { id: 'TKT-2026-0301', desc: 'Switch to Cash Discount', merchant: 'Metro Tobacco', type: 'Pricing', priority: 'Low', created: 'Mar 1', assigned: 'David Goldfarb', status: 'Pending Approval' },
  ]

  const open = tickets.filter(t => t.status === 'Open' || t.status === 'In Progress').length
  const awaiting = tickets.filter(t => t.status.includes('Awaiting')).length
  const resolved = tickets.filter(t => t.status === 'Resolved').length
  const urgent = tickets.filter(t => t.priority === 'Urgent' || t.priority === 'High').length

  const statusVariant = (s: string) => s === 'Open' ? 'rose' as const : s.includes('Progress') ? 'blue' as const : s.includes('Awaiting') ? 'amber' as const : s === 'Resolved' ? 'emerald' as const : 'gray' as const
  const priorityColor = (p: string) => p === 'Urgent' ? '#EF4444' : p === 'High' ? '#F59E0B' : p === 'Normal' ? '#64748B' : '#94A3B8'

  const ticketColumns: Column<TicketRow>[] = [
    { key: 'id', header: 'Ticket', render: (r) => (
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#CBD5E1', fontWeight: 700 }}>{r.id}</div>
        <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.desc}</div>
      </div>
    )},
    { key: 'merchant', header: 'Merchant' },
    { key: 'type', header: 'Type' },
    { key: 'priority', header: 'Priority', render: (r) => (
      <span style={{ fontSize: 11, fontWeight: 700, color: priorityColor(r.priority) }}>{r.priority}</span>
    )},
    { key: 'created', header: 'Created' },
    { key: 'assigned', header: 'Assigned' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  // Category breakdown
  const categories: Record<string, number> = {}
  tickets.forEach(t => { categories[t.type] = (categories[t.type] || 0) + 1 })

  return (
    <div className="dashboard-grid">
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Tickets', value: tickets.length, color: '#1578F7' },
          { label: 'Open', value: open, color: '#3B82F6' },
          { label: 'Awaiting', value: awaiting, color: '#F59E0B' },
          { label: 'Urgent/High', value: urgent, color: urgent > 0 ? '#EF4444' : '#10B981' },
          { label: 'Resolved', value: resolved, color: '#10B981' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value" style={{ fontSize: 22, color: kpi.color }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Category + Resolution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="By Category" />
          <div style={{ padding: '0 16px 16px' }}>
            {Object.entries(categories).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#334155', fontWeight: 500, width: 100 }}>{cat}</span>
                <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / tickets.length) * 100}%`, height: '100%', background: '#1578F7', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', width: 20, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card noPadding>
          <CardHeader title="Resolution Metrics" />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Avg Resolution Time', value: '4.2 hours', ok: true },
              { label: 'First Response', value: '12 min', ok: true },
              { label: 'SLA Compliance', value: '94%', ok: true },
              { label: 'AI Auto-Resolved', value: '38%', ok: true },
              { label: 'Escalation Rate', value: '8%', ok: true },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{m.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: m.ok ? '#0F172A' : '#EF4444' }}>{m.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card noPadding>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>All Tickets</span>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, fontSize: 12,
            background: 'linear-gradient(to right, #609FFF, #1578F7)',
            color: 'white', borderRadius: 8, padding: '7px 14px', fontWeight: 600, border: 'none', cursor: 'pointer',
          }}><Plus size={14} /> New Ticket</button>
        </div>
        <DataTable columns={ticketColumns} data={tickets} hoverable />
      </Card>
    </div>
  )
}
