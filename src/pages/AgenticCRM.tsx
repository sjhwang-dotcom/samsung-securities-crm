import { useState, type CSSProperties } from 'react'
import {
  Plus, Search, CheckCircle, AlertTriangle, FileText, Upload, ChevronRight,
  Kanban, Store, DollarSign, TicketCheck, ClipboardList, Phone,
  Clock, ChevronDown, XCircle, Shield,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { leadPipeline, allMerchants, onboardingApps } from '../data/mockData'

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
  { name: "Bella's Bistro LLC", stage: 'Approval', value: '$32K/mo', score: 72, time: '2h ago', status: 'Won', source: 'Voice Agent' },
  { name: 'GreenLeaf Market', stage: 'Application', value: '$35K/mo', score: 88, time: '5h ago', status: 'Active', source: 'Voice Agent' },
  { name: 'Sunrise Pharmacy', stage: 'Application', value: '$28K/mo', score: 81, time: '1d ago', status: 'Active', source: 'Referral' },
  { name: "King's Crown Jewelry", stage: 'Underwriting', value: '$45K/mo', score: 67, time: '1d ago', status: 'At Risk', source: 'Voice Agent' },
  { name: 'Park Slope Yoga', stage: 'Proposal', value: '$12K/mo', score: 71, time: '2d ago', status: 'Active', source: 'Walk-in' },
  { name: 'Metro Grill', stage: 'Equipment', value: '$24K/mo', score: 79, time: '3d ago', status: 'Won', source: 'Website' },
]

const leadCallHistory: Record<string, { lastCall: string; outcome: string; sentiment: string; callCount: number; source: string }> = {
  'Queens Auto Repair': { lastCall: '2h ago', outcome: 'Callback Scheduled', sentiment: 'Positive', callCount: 3, source: 'Voice Agent' },
  'Fresh Bake Cafe': { lastCall: '1d ago', outcome: 'No Answer', sentiment: 'Neutral', callCount: 2, source: 'Voice Agent' },
  'Downtown Barber': { lastCall: '3d ago', outcome: 'Gatekeeper Block', sentiment: 'Neutral', callCount: 1, source: 'Cold Call' },
  'Park Slope Yoga': { lastCall: '5h ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 4, source: 'Voice Agent' },
  'Liberty Tax': { lastCall: 'Today', outcome: 'Callback Scheduled', sentiment: 'Positive', callCount: 2, source: 'Referral' },
  'Chez Antoine': { lastCall: 'Today', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 3, source: 'Voice Agent' },
  'GreenLeaf Market': { lastCall: '1d ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 5, source: 'Voice Agent' },
  'Brooklyn Dry Cleaners #2': { lastCall: '2d ago', outcome: 'Voicemail', sentiment: 'Neutral', callCount: 2, source: 'Voice Agent' },
  'Sunrise Pharmacy': { lastCall: 'Today', outcome: 'Callback Scheduled', sentiment: 'Positive', callCount: 3, source: 'Voice Agent' },
  'Harlem Grocery #2': { lastCall: '3d ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 4, source: 'Voice Agent' },
  "King's Crown Jewelry": { lastCall: '1d ago', outcome: 'Not Interested', sentiment: 'Skeptical', callCount: 6, source: 'Voice Agent' },
  "Bella's Bistro LLC": { lastCall: '2h ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 3, source: 'Voice Agent' },
  'Prestige Auto Wash': { lastCall: 'Today', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 2, source: 'Voice Agent' },
  'Metro Grill': { lastCall: '1d ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 4, source: 'Voice Agent' },
  'Jade Spa': { lastCall: '3d ago', outcome: 'Transfer Success', sentiment: 'Positive', callCount: 2, source: 'Voice Agent' },
}

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
                  {/* Call info row */}
                  {(() => {
                    const ch = leadCallHistory[lead.name]
                    if (!ch) return null
                    const outcomeColors: Record<string, { bg: string; color: string }> = {
                      'Transfer Success': { bg: '#D1FAE5', color: '#059669' },
                      'Callback Scheduled': { bg: '#DBEAFE', color: '#2563EB' },
                      'No Answer': { bg: '#F1F5F9', color: '#94A3B8' },
                      'Gatekeeper Block': { bg: '#FEF3C7', color: '#D97706' },
                      'Not Interested': { bg: '#FEE2E2', color: '#DC2626' },
                      'Voicemail': { bg: '#F1F5F9', color: '#94A3B8' },
                    }
                    const oc = outcomeColors[ch.outcome] || outcomeColors['Voicemail']
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                        <Phone size={10} color="#94A3B8" strokeWidth={2} />
                        <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500 }}>Last: {ch.lastCall}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: oc.bg, color: oc.color }}>{ch.outcome}</span>
                        <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500 }}>{ch.callCount} calls</span>
                        {ch.source === 'Voice Agent' && (
                          <span style={{ fontSize: 8, fontWeight: 800, padding: '1px 4px', borderRadius: 3, background: '#CCFBF1', color: '#0891B2' }}>AI</span>
                        )}
                      </div>
                    )
                  })()}
                  {lead.detail && <div style={{ fontSize: 11, color: '#64748B', paddingTop: 6, borderTop: '1px solid #F1F5F9' }}>{lead.detail}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Voice Agent Activity Card */}
      <Card noPadding>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #0891B2, #06B6D4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Phone size={16} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 3 }}>Voice Agent Activity (Today)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>
                <strong style={{ color: '#0891B2' }}>847</strong> calls made
              </span>
              <span style={{ fontSize: 9, color: '#CBD5E1' }}>|</span>
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>
                <strong style={{ color: '#10B981' }}>128</strong> transfers (15.1%)
              </span>
              <span style={{ fontSize: 9, color: '#CBD5E1' }}>|</span>
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>
                <strong style={{ color: '#1578F7' }}>71</strong> callbacks scheduled
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 3 }}>
              <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>Top converting:</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#059669' }}>Restaurants 41.2%</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#0891B2' }}>Auto 33.1%</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#1578F7' }}>Retail 29.5%</span>
              <span style={{ fontSize: 9, color: '#CBD5E1' }}>|</span>
              <span style={{ fontSize: 10, color: '#334155', fontWeight: 600 }}>12 leads moved to next stage via Voice Agent today</span>
            </div>
          </div>
        </div>
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
              const statusClr = deal.status === 'Won' ? '#10B981' : deal.status === 'At Risk' ? '#F59E0B' : '#1578F7'
              const srcStyle: Record<string, { bg: string; color: string }> = {
                'Voice Agent': { bg: '#CCFBF1', color: '#0891B2' },
                'Referral': { bg: '#DBEAFE', color: '#2563EB' },
                'Walk-in': { bg: '#F1F5F9', color: '#64748B' },
                'Website': { bg: '#EDE9FE', color: '#7C3AED' },
              }
              const ss = srcStyle[deal.source] || srcStyle['Walk-in']
              return (
                <div key={deal.name} className="harlow-card" style={{ padding: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{deal.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{deal.time}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                      background: `${statusClr}15`, color: statusClr,
                    }}>{deal.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: `${stageColors[deal.stage] ?? '#94A3B8'}15`, color: stageColors[deal.stage] ?? '#94A3B8' }}>{deal.stage}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: ss.bg, color: ss.color }}>
                      {deal.source === 'Voice Agent' && <Phone size={8} strokeWidth={2.5} />}
                      {deal.source}
                    </span>
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
  const [mpaOpen, setMpaOpen] = useState(false)

  const statusColor = (s: string) => s === 'In Progress' ? '#3B82F6' : s === 'In Review' ? '#4F46E5' : s.includes('Needs') || s.includes('Awaiting') ? '#F59E0B' : '#94A3B8'
  const riskColor = (label: string) => label === 'Low Risk' ? '#10B981' : label === 'Medium' ? '#F59E0B' : label === 'High Risk' ? '#EF4444' : '#94A3B8'

  /* ── Per-application data ── */
  const applicationDetails: Record<string, {
    steps: { label: string; done: boolean; current?: boolean }[];
    mpa: { legalName: string; dba: string; ein: string; mcc: string; address: string; owner: string; ownerTitle: string; phone: string; email: string; bankName: string; bankAccount: string; estVolume: string };
    kybResults: { title: string; sub: string; status: 'pass' | 'flag' | 'pending' }[];
    docs: { name: string; status: string; extracted: string }[];
    riskScore: number | null;
    riskLabel: string;
    pricingOffer: { rate: string; perTxn: string; monthly: string; tier: string } | null;
    timeline: { time: string; action: string; by: string }[];
  }> = {
    "Bella's Bistro LLC": {
      steps: [
        { label: 'Application', done: true },
        { label: 'Documents', done: true },
        { label: 'KYB/KYC', done: false, current: true },
        { label: 'Risk Assessment', done: false },
        { label: 'Pricing', done: false },
        { label: 'Boarding', done: false },
      ],
      mpa: { legalName: "Bella's Bistro LLC", dba: "Bella's Bistro", ein: '82-4937261', mcc: '5812', address: '142 Atlantic Ave, Brooklyn, NY 11201', owner: 'Isabella Moretti', ownerTitle: 'Owner / CEO', phone: '(718) 555-0142', email: 'bella@bellasbistro.com', bankName: 'Chase Business', bankAccount: '****7832', estVolume: '$85,000/mo' },
      kybResults: [
        { title: 'Business Entity Verified', sub: 'Delaware Corp, EIN validated', status: 'pass' },
        { title: 'Beneficial Ownership Confirmed', sub: '100% owner verified', status: 'pass' },
        { title: 'Sanctions & PEP Screening', sub: 'Clear — no matches', status: 'pass' },
        { title: 'Adverse Media Check', sub: '1 result flagged — low relevance', status: 'flag' },
        { title: 'Identity Verification', sub: 'Passport OCR + liveness passed', status: 'pass' },
      ],
      docs: [
        { name: 'Articles of Incorporation', status: 'Verified', extracted: 'Entity, State, EIN' },
        { name: 'Driver License', status: 'Verified', extracted: 'Name, DOB, Address' },
        { name: 'Bank Statements (3mo)', status: 'Verified', extracted: 'Avg balance $47.2K' },
        { name: 'Voided Check', status: 'Verified', extracted: 'Routing #, Account #' },
        { name: 'Processing Statements', status: 'Verified', extracted: 'Vol $89K | CB 0.3%' },
      ],
      riskScore: 72,
      riskLabel: 'Low Risk',
      pricingOffer: { rate: '2.69%', perTxn: '$0.10', monthly: '$9.95', tier: 'Tier 2' },
      timeline: [
        { time: 'Apr 2, 9:14 AM', action: 'Application submitted via online portal', by: 'System' },
        { time: 'Apr 2, 10:02 AM', action: 'Documents uploaded (5 files)', by: 'Isabella Moretti' },
        { time: 'Apr 2, 10:05 AM', action: 'KYB verification initiated', by: 'AI Engine' },
        { time: 'Apr 2, 10:12 AM', action: 'Business entity verified — Delaware Corp', by: 'AI Engine' },
        { time: 'Apr 2, 10:18 AM', action: 'Beneficial ownership confirmed', by: 'AI Engine' },
      ],
    },
    "Queens Auto Repair": {
      steps: [
        { label: 'Application', done: false, current: true },
        { label: 'Documents', done: false },
        { label: 'KYB/KYC', done: false },
        { label: 'Risk Assessment', done: false },
        { label: 'Pricing', done: false },
        { label: 'Boarding', done: false },
      ],
      mpa: { legalName: 'Queens Auto Repair Inc.', dba: 'Queens Auto Repair', ein: '91-3827461', mcc: '7538', address: '88-12 Queens Blvd, Elmhurst, NY 11373', owner: 'David Nguyen', ownerTitle: 'President', phone: '(718) 555-0288', email: 'david@queensauto.com', bankName: 'TD Bank Business', bankAccount: '****4510', estVolume: '$42,000/mo' },
      kybResults: [],
      docs: [
        { name: 'Merchant Processing Agreement', status: 'Sent', extracted: 'Awaiting e-signature' },
        { name: 'Driver License', status: 'Uploaded', extracted: 'Pending OCR extraction' },
      ],
      riskScore: null,
      riskLabel: 'Pending',
      pricingOffer: null,
      timeline: [
        { time: 'Apr 5, 2:30 PM', action: 'Application submitted by sales rep', by: 'Casey Rivera' },
        { time: 'Apr 5, 2:35 PM', action: 'MPA sent for e-signature', by: 'System' },
        { time: 'Apr 7, 9:00 AM', action: 'E-sign reminder sent (1st)', by: 'System' },
      ],
    },
    "Harlem Grocery #2": {
      steps: [
        { label: 'Application', done: true },
        { label: 'Documents', done: true },
        { label: 'KYB/KYC', done: true },
        { label: 'Risk Assessment', done: false, current: true },
        { label: 'Pricing', done: false },
        { label: 'Boarding', done: false },
      ],
      mpa: { legalName: 'Harlem Fresh Markets LLC', dba: 'Harlem Grocery #2', ein: '73-5928174', mcc: '5411', address: '2847 Frederick Douglass Blvd, New York, NY 10039', owner: 'Marcus Williams', ownerTitle: 'Managing Member', phone: '(212) 555-0391', email: 'marcus@harlemfresh.com', bankName: 'Bank of America', bankAccount: '****9201', estVolume: '$120,000/mo' },
      kybResults: [
        { title: 'Business Entity Verified', sub: 'NY LLC, EIN validated', status: 'pass' },
        { title: 'Beneficial Ownership Confirmed', sub: '75% primary owner verified', status: 'pass' },
        { title: 'Sanctions & PEP Screening', sub: 'Clear — no matches', status: 'pass' },
        { title: 'Adverse Media Check', sub: 'No adverse results', status: 'pass' },
        { title: 'Identity Verification', sub: 'License OCR + liveness passed', status: 'pass' },
      ],
      docs: [
        { name: 'Articles of Organization', status: 'Verified', extracted: 'Entity, State, EIN' },
        { name: 'Driver License', status: 'Verified', extracted: 'Name, DOB, Address' },
        { name: 'Bank Statements (3mo)', status: 'Verified', extracted: 'Avg balance $92.1K' },
        { name: 'Voided Check', status: 'Verified', extracted: 'Routing #, Account #' },
        { name: 'Processing Statements', status: 'Verified', extracted: 'Vol $115K | CB 0.8%' },
      ],
      riskScore: 58,
      riskLabel: 'Medium',
      pricingOffer: null,
      timeline: [
        { time: 'Mar 28, 11:00 AM', action: 'Application submitted via online portal', by: 'System' },
        { time: 'Mar 28, 2:15 PM', action: 'All documents uploaded and verified', by: 'AI Engine' },
        { time: 'Mar 29, 9:30 AM', action: 'KYB/KYC checks completed — all clear', by: 'AI Engine' },
        { time: 'Mar 29, 9:35 AM', action: 'Risk score 58 — flagged for manual review', by: 'AI Engine' },
        { time: 'Mar 29, 10:00 AM', action: 'Assigned to underwriter for review', by: 'System' },
      ],
    },
    "King's Crown Jewelry": {
      steps: [
        { label: 'Application', done: true },
        { label: 'Documents', done: true },
        { label: 'KYB/KYC', done: true },
        { label: 'Risk Assessment', done: false, current: true },
        { label: 'Pricing', done: false },
        { label: 'Boarding', done: false },
      ],
      mpa: { legalName: "King's Crown Jewelry LLC", dba: "King's Crown Jewelry", ein: '64-8291037', mcc: '5944', address: '47 W 47th St, New York, NY 10036', owner: 'Solomon Katz', ownerTitle: 'Owner', phone: '(212) 555-0547', email: 'solomon@kingscrown.nyc', bankName: 'Signature Bank', bankAccount: '****6178', estVolume: '$310,000/mo' },
      kybResults: [
        { title: 'Business Entity Verified', sub: 'NY LLC, EIN validated', status: 'pass' },
        { title: 'Beneficial Ownership Confirmed', sub: '100% owner verified', status: 'pass' },
        { title: 'Adverse Media Check', sub: '3 results — prior dispute coverage', status: 'flag' },
        { title: 'Sanctions & PEP Screening', sub: 'Clear — no matches', status: 'pass' },
        { title: 'High-Risk MCC Flag', sub: 'MCC 5944 — Jewelry, elevated CB risk', status: 'flag' },
      ],
      docs: [
        { name: 'Articles of Organization', status: 'Verified', extracted: 'Entity, State, EIN' },
        { name: 'Driver License', status: 'Verified', extracted: 'Name, DOB, Address' },
        { name: 'Bank Statements (3mo)', status: 'Pending', extracted: 'Awaiting upload' },
        { name: 'Processing Statements', status: 'Pending', extracted: 'Requested from merchant' },
        { name: 'Lease Agreement', status: 'Verified', extracted: '47th St Diamond District' },
      ],
      riskScore: 34,
      riskLabel: 'High Risk',
      pricingOffer: null,
      timeline: [
        { time: 'Mar 25, 3:00 PM', action: 'Application submitted by sales rep', by: 'Morgan Chen' },
        { time: 'Mar 26, 10:20 AM', action: 'Partial documents uploaded (3 of 5)', by: 'Solomon Katz' },
        { time: 'Mar 27, 11:00 AM', action: 'KYB flagged — adverse media + high-risk MCC', by: 'AI Engine' },
        { time: 'Mar 27, 11:15 AM', action: 'Escalated to senior underwriter', by: 'System' },
        { time: 'Mar 28, 9:00 AM', action: 'Additional documents requested', by: 'Morgan Chen' },
      ],
    },
  }

  const detail = applicationDetails[selected.merchant]

  // Fallback for merchants not in the detailed map
  const steps = detail?.steps ?? [
    { label: 'Application', done: true },
    { label: 'Documents', done: false },
    { label: 'KYB/KYC', done: false },
    { label: 'Risk Assessment', done: false },
    { label: 'Pricing', done: false },
    { label: 'Boarding', done: false },
  ]
  const kybResults = detail?.kybResults ?? []
  const docs = detail?.docs ?? []
  const mpa = detail?.mpa ?? null
  const timeline = detail?.timeline ?? []
  const pricingOffer = detail?.pricingOffer ?? null
  const detailRiskScore = detail?.riskScore ?? selected.riskScore
  const detailRiskLabel = detail?.riskLabel ?? selected.riskLabel

  const kybIcon = (status: 'pass' | 'flag' | 'pending') => status === 'pass' ? CheckCircle : status === 'flag' ? AlertTriangle : Clock
  const kybColor = (status: 'pass' | 'flag' | 'pending') => status === 'pass' ? '#10B981' : status === 'flag' ? '#F59E0B' : '#94A3B8'
  const riskArcColor = (label: string) => label === 'Low Risk' ? '#10B981' : label === 'Medium' ? '#F59E0B' : label === 'High Risk' ? '#EF4444' : '#CBD5E1'

  /* ── Action buttons per stage ── */
  const stageActions: Record<string, { label: string; variant: 'primary' | 'secondary' | 'danger' }[]> = {
    'E-Sign': [
      { label: 'Send Reminder', variant: 'primary' },
      { label: 'Cancel Application', variant: 'danger' },
    ],
    'KYB/KYC Verification': [
      { label: 'Request Additional Docs', variant: 'primary' },
      { label: 'Override Flag', variant: 'secondary' },
      { label: 'Escalate', variant: 'secondary' },
    ],
    'Underwriting Review': [
      { label: 'Approve', variant: 'primary' },
      { label: 'Deny', variant: 'danger' },
      { label: 'Request More Info', variant: 'secondary' },
      { label: 'Escalate', variant: 'secondary' },
    ],
    'High Risk Review': [
      { label: 'Approve with Conditions', variant: 'primary' },
      { label: 'Deny', variant: 'danger' },
      { label: 'Request Senior Review', variant: 'secondary' },
    ],
  }
  const actions = stageActions[selected.stage] ?? []

  const actionBtnStyle = (variant: 'primary' | 'secondary' | 'danger'): CSSProperties => ({
    fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap',
    ...(variant === 'primary' ? { background: '#1578F7', color: 'white', border: 'none' } :
      variant === 'danger' ? { background: 'none', color: '#EF4444', border: '1px solid #FCA5A5' } :
      { background: 'none', color: '#475569', border: '1px solid #CBD5E1' }),
  })

  const docBadgeVariant = (status: string) => status === 'Verified' ? 'emerald' as const : status === 'Uploaded' ? 'blue' as const : 'amber' as const

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-12px -20px -16px', overflow: 'hidden' }}>
      {/* Left: Application List */}
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
              <div key={`${app.merchant}-${i}`} onClick={() => { setSelectedIdx(i); setMpaOpen(false) }}
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
                  {app.riskScore != null && (
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

      {/* Right: Detail View */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 160px)' }}>
        <div className="dashboard-grid">
          {/* Header + Actions */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{selected.merchant}</span>
                <StatusBadge variant={selected.status === 'In Progress' ? 'blue' : selected.status === 'In Review' ? 'indigo' : 'amber'}>{selected.status}</StatusBadge>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
                {selected.bank} · Submitted {selected.submitted} · Assigned to {selected.assigned}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {actions.map(a => (
                <button key={a.label} style={actionBtnStyle(a.variant)}>{a.label}</button>
              ))}
              {detailRiskScore != null && (
                <div style={{ textAlign: 'center', marginLeft: 8 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: riskColor(detailRiskLabel), lineHeight: 1 }}>{detailRiskScore}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: riskColor(detailRiskLabel) }}>{detailRiskLabel}</div>
                </div>
              )}
            </div>
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

          {/* MPA (collapsible) */}
          {mpa && (
            <Card noPadding>
              <div
                onClick={() => setMpaOpen(!mpaOpen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', userSelect: 'none' }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Merchant Application</span>
                <ChevronDown size={14} color="#94A3B8" style={{ transform: mpaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </div>
              {mpaOpen && (
                <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                  {[
                    { label: 'Legal Name', value: mpa.legalName },
                    { label: 'Owner', value: `${mpa.owner}, ${mpa.ownerTitle}` },
                    { label: 'DBA', value: mpa.dba },
                    { label: 'Phone', value: mpa.phone },
                    { label: 'EIN', value: mpa.ein },
                    { label: 'Email', value: mpa.email },
                    { label: 'MCC', value: mpa.mcc },
                    { label: 'Bank', value: mpa.bankName },
                    { label: 'Address', value: mpa.address },
                    { label: 'Account', value: mpa.bankAccount },
                    { label: 'Est. Volume', value: mpa.estVolume },
                  ].map(f => (
                    <div key={f.label} style={{ display: 'flex', gap: 6, fontSize: 11, padding: '3px 0' }}>
                      <span style={{ color: '#94A3B8', fontWeight: 500, minWidth: 72 }}>{f.label}</span>
                      <span style={{ color: '#0F172A', fontWeight: 600 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* KYB/KYC + Risk side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 12 }}>
            {/* KYB/KYC */}
            <Card noPadding>
              <CardHeader title="KYB / KYC Verification" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {kybResults.length === 0 ? (
                  <div style={{ padding: '16px 0', textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                    <Clock size={20} style={{ margin: '0 auto 6px', display: 'block', color: '#CBD5E1' }} />
                    KYB/KYC checks not yet initiated
                  </div>
                ) : kybResults.map((item, i) => {
                  const Icon = kybIcon(item.status)
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, border: '1px solid #F1F5F9' }}>
                      <Icon size={16} style={{ flexShrink: 0, color: kybColor(item.status) }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>{item.sub}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Risk + Documents + Timeline */}
            <div className="dashboard-grid">
              {/* AI Risk */}
              {detailRiskScore != null ? (
                <Card noPadding>
                  <CardHeader title="AI Risk Assessment" />
                  <div style={{ padding: '0 16px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                      <div style={{ position: 'relative', width: 80, height: 80 }}>
                        <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke={riskArcColor(detailRiskLabel)} strokeWidth="8" strokeDasharray={`${detailRiskScore * 2.64} ${100 * 2.64}`} strokeLinecap="round" />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{detailRiskScore}</span>
                          <span style={{ fontSize: 9, color: riskArcColor(detailRiskLabel), fontWeight: 500 }}>{detailRiskLabel.toUpperCase()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11 }}>
                        {detailRiskLabel === 'Low Risk' && <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> CB Rate: 0.3%</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> Volume: stable</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> Fraud: clear</div>
                        </>}
                        {detailRiskLabel === 'Medium' && <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} style={{ color: '#F59E0B' }} /> CB Rate: 0.8%</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} style={{ color: '#10B981' }} /> Volume: growing</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} style={{ color: '#F59E0B' }} /> Manual review</div>
                        </>}
                        {detailRiskLabel === 'High Risk' && <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><XCircle size={12} style={{ color: '#EF4444' }} /> High-risk MCC</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={12} style={{ color: '#F59E0B' }} /> Adverse media</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={12} style={{ color: '#EF4444' }} /> Senior UW required</div>
                        </>}
                      </div>
                    </div>
                    {detailRiskLabel === 'Low Risk' && pricingOffer && (
                      <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 8, padding: 10, fontSize: 11 }}>
                        <span style={{ fontWeight: 700, color: '#0F766E' }}>AUTO-APPROVE</span>
                        <span style={{ color: '#64748B' }}> — {pricingOffer.tier} at {pricingOffer.rate} + {pricingOffer.perTxn}</span>
                      </div>
                    )}
                    {detailRiskLabel === 'Medium' && (
                      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: 10, fontSize: 11 }}>
                        <span style={{ fontWeight: 700, color: '#92400E' }}>MANUAL REVIEW</span>
                        <span style={{ color: '#64748B' }}> — Awaiting underwriter decision</span>
                      </div>
                    )}
                    {detailRiskLabel === 'High Risk' && (
                      <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: 10, fontSize: 11 }}>
                        <span style={{ fontWeight: 700, color: '#991B1B' }}>ESCALATED</span>
                        <span style={{ color: '#64748B' }}> — Pending senior underwriter review</span>
                      </div>
                    )}
                  </div>
                </Card>
              ) : (
                <Card noPadding>
                  <CardHeader title="AI Risk Assessment" />
                  <div style={{ padding: '16px', textAlign: 'center', color: '#94A3B8', fontSize: 12 }}>
                    <Clock size={20} style={{ margin: '0 auto 6px', display: 'block', color: '#CBD5E1' }} />
                    Risk assessment pending — awaiting KYB/KYC
                  </div>
                </Card>
              )}

              {/* Pricing Offer */}
              {pricingOffer && (
                <Card noPadding>
                  <CardHeader title="Suggested Pricing" />
                  <div style={{ padding: '0 16px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {[
                      { label: 'Discount Rate', value: pricingOffer.rate },
                      { label: 'Per Transaction', value: pricingOffer.perTxn },
                      { label: 'Monthly Fee', value: pricingOffer.monthly },
                      { label: 'Tier', value: pricingOffer.tier },
                    ].map(p => (
                      <div key={p.label} style={{ background: '#F8FAFC', borderRadius: 6, padding: '6px 10px' }}>
                        <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 500 }}>{p.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{p.value}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

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
                      <StatusBadge variant={docBadgeVariant(doc.status)}>{doc.status}</StatusBadge>
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

          {/* Review Timeline */}
          {timeline.length > 0 && (
            <Card noPadding>
              <CardHeader title="Review Timeline" />
              <div style={{ padding: '0 16px 14px' }}>
                {timeline.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: i < timeline.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                    <div style={{ width: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: i === 0 ? '#1578F7' : '#CBD5E1', flexShrink: 0 }} />
                      {i < timeline.length - 1 && <div style={{ width: 1, flex: 1, background: '#E2E8F0', marginTop: 2 }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{entry.action}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{entry.time} · {entry.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══ My Merchants — Master-Detail ═══ */
function MerchantsView() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [search, setSearch] = useState('')

  // Use DB merchants (first 100 for performance)
  const merchantList = allMerchants.slice(0, 100)
  const filtered = search
    ? merchantList.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.processor?.toLowerCase().includes(search.toLowerCase()) || m.category?.toLowerCase().includes(search.toLowerCase()))
    : merchantList

  const selected = filtered[selectedIdx] ?? filtered[0]
  if (!selected) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>No merchants found</div>

  const riskColor = (s: number) => s >= 80 ? '#10B981' : s >= 60 ? '#0891B2' : s >= 40 ? '#F59E0B' : '#F43F5E'
  const statusColor = (s: string) => s === 'Active' ? '#10B981' : s === 'Boarding' ? '#3B82F6' : '#94A3B8'
  const monthlyVol = (selected.annual_volume ?? 0) / 12

  // Simulated data for selected merchant
  const monthlyData = Array.from({ length: 6 }, (_, i) => ({
    month: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i],
    volume: Math.round(monthlyVol * (0.85 + i * 0.03 + Math.random() * 0.1)),
  }))

  const deposits = [
    { date: 'Mar 14', txns: Math.round(monthlyVol / (selected.avg_ticket ?? 30) / 22), amount: `$${(monthlyVol / 22).toFixed(2)}` },
    { date: 'Mar 13', txns: Math.round(monthlyVol / (selected.avg_ticket ?? 30) / 22 * 0.95), amount: `$${(monthlyVol / 22 * 0.95).toFixed(2)}` },
    { date: 'Mar 12', txns: Math.round(monthlyVol / (selected.avg_ticket ?? 30) / 22 * 0.88), amount: `$${(monthlyVol / 22 * 0.88).toFixed(2)}` },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-12px -20px -16px', overflow: 'hidden' }}>
      {/* ═══ Left: Merchant List ═══ */}
      <div style={{
        width: 300, minWidth: 300, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 160px)',
      }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>My Merchants</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{allMerchants.length.toLocaleString()} total</div>
          {/* Search */}
          <div style={{ position: 'relative', marginTop: 8 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input placeholder="Search..." value={search} onChange={e => { setSearch(e.target.value); setSelectedIdx(0) }}
              style={{ width: '100%', background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 12, outline: 'none', color: '#334155' }} />
          </div>
        </div>

        {/* Mini KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, padding: '8px 12px', borderBottom: '1px solid #F1F5F9' }}>
          {[
            { label: 'Active', value: allMerchants.filter(m => m.status === 'Active').length, color: '#10B981' },
            { label: 'Boarding', value: allMerchants.filter(m => m.status === 'Boarding').length, color: '#3B82F6' },
            { label: 'At Risk', value: allMerchants.filter(m => (m.risk_score ?? 70) < 40).length, color: '#F43F5E' },
          ].map(k => (
            <div key={k.label} style={{ background: '#FAFBFC', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: k.color }}>{k.value}</div>
              <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 500 }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Merchant list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filtered.map((m, i) => {
            const isActive = selectedIdx === i
            return (
              <div key={m.merchant_id} onClick={() => setSelectedIdx(i)}
                style={{
                  padding: '10px 16px', cursor: 'pointer',
                  borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06), transparent)' : 'transparent',
                  borderBottom: '1px solid #F8FAFC',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? '#1578F7' : '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{m.category} · {m.processor}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(m.status) }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(m.risk_score ?? 70) }}>{m.risk_score}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9', fontSize: 10, color: '#94A3B8', textAlign: 'center' }}>
          Showing {filtered.length} of {allMerchants.length.toLocaleString()}
        </div>
      </div>

      {/* ═══ Right: Merchant Detail ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 160px)' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{selected.name}</span>
                <StatusBadge variant={selected.status === 'Active' ? 'emerald' : selected.status === 'Boarding' ? 'blue' : 'gray'}>{selected.status}</StatusBadge>
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, display: 'flex', gap: 16, fontWeight: 500 }}>
                <span>MID: <span style={{ fontFamily: 'monospace', color: '#64748B' }}>{selected.mid}</span></span>
                <span>MCC: {selected.mcc} ({selected.mcc_desc})</span>
                <span>{selected.processor}</span>
                <span>{selected.iso_name}</span>
              </div>
            </div>
            {/* Risk Score */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 64, height: 64 }}>
                <svg width={64} height={64} style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx={32} cy={32} r={26} fill="none" stroke="#F1F5F9" strokeWidth={4} />
                  <circle cx={32} cy={32} r={26} fill="none" stroke={riskColor(selected.risk_score ?? 70)} strokeWidth={4}
                    strokeDasharray={`${((selected.risk_score ?? 70) / 100) * 163.4} 163.4`} strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: riskColor(selected.risk_score ?? 70) }}>{selected.risk_score}</span>
                  <span style={{ fontSize: 8, color: '#94A3B8', fontWeight: 500 }}>RISK</span>
                </div>
              </div>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {[
              { label: 'Monthly Volume', value: `$${(monthlyVol / 1000).toFixed(1)}K`, color: '#1578F7' },
              { label: 'Avg Ticket', value: `$${(selected.avg_ticket ?? 0).toFixed(2)}`, color: '#4F46E5' },
              { label: 'Annual Volume', value: `$${((selected.annual_volume ?? 0) / 1000).toFixed(0)}K`, color: '#0891B2' },
              { label: 'Effective Rate', value: '2.69%', color: '#059669' },
              { label: 'Residual/mo', value: `$${(monthlyVol * 0.01).toFixed(2)}`, color: '#10B981' },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card">
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-value" style={{ fontSize: 18, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Volume Trend + Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Volume Trend (6mo)" />
              <div style={{ padding: '0 16px 16px', height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v: any) => `$${(v/1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                    <Bar dataKey="volume" fill="#1578F7" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Merchant Info" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Category', value: selected.category },
                  { label: 'City', value: `${selected.city}, ${selected.state}` },
                  { label: 'Boarded', value: selected.boarding_date ? new Date(selected.boarding_date).toLocaleDateString() : '—' },
                  { label: 'Processor', value: selected.processor },
                  { label: 'ISO', value: selected.iso_name },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ color: '#0F172A', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Compliance + Equipment + Recent Deposits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Compliance" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'PCI Status', value: 'Compliant', ok: true },
                  { label: 'SAQ Type', value: 'SAQ B-IP', ok: true },
                  { label: 'Last ASV Scan', value: 'Feb 28', ok: true },
                  { label: 'P2PE', value: 'Validated', ok: true },
                  { label: 'Chargeback Rate', value: '0.3%', ok: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: item.ok ? '#059669' : '#EF4444' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Equipment" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Terminal', value: 'PAX A920' },
                  { label: 'Connection', value: 'WiFi + 4G' },
                  { label: 'Status', value: 'Online' },
                  { label: 'Firmware', value: 'v11.4.2' },
                  { label: 'Last Txn', value: 'Today' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Recent Deposits" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {deposits.map(d => (
                  <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#94A3B8', fontWeight: 500 }}>{d.date}</span>
                    <span style={{ color: '#64748B' }}>{d.txns} txns</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{d.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
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

      {/* Next Payout + Payout History */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Next Payout info card */}
        <Card noPadding>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <DollarSign size={18} style={{ color: '#1578F7' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Next Payout</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>Apr 5, 2026</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Estimated</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#059669' }}>$3,847</div>
            </div>
          </div>
        </Card>

        {/* Payout History */}
        <Card noPadding>
          <CardHeader title="Payout History" />
          <DataTable columns={payoutColumns} data={payoutData} hoverable />
        </Card>
      </div>
    </div>
  )
}

/* ═══ Payout History data (used by ResidualsView) ═══ */
type PayoutRow = {
  month: string
  merchantCount: string
  totalVolume: string
  grossResidual: string
  isoSplit: string
  netPayout: string
  status: string
  paidDate: string
}

const payoutData: PayoutRow[] = [
  { month: 'Mar 2026', merchantCount: '4,612', totalVolume: '$31.1M', grossResidual: '$5,420', isoSplit: '100%', netPayout: '$3,847', status: 'Pending', paidDate: '\u2014' },
  { month: 'Feb 2026', merchantCount: '4,580', totalVolume: '$30.1M', grossResidual: '$5,180', isoSplit: '100%', netPayout: '$3,635', status: 'Paid', paidDate: 'Mar 5' },
  { month: 'Jan 2026', merchantCount: '4,520', totalVolume: '$29.2M', grossResidual: '$5,010', isoSplit: '100%', netPayout: '$3,520', status: 'Paid', paidDate: 'Feb 5' },
  { month: 'Dec 2025', merchantCount: '4,480', totalVolume: '$27.8M', grossResidual: '$4,720', isoSplit: '100%', netPayout: '$3,180', status: 'Paid', paidDate: 'Jan 5' },
  { month: 'Nov 2025', merchantCount: '4,420', totalVolume: '$26.3M', grossResidual: '$4,450', isoSplit: '100%', netPayout: '$2,890', status: 'Paid', paidDate: 'Dec 5' },
  { month: 'Oct 2025', merchantCount: '4,380', totalVolume: '$25.1M', grossResidual: '$4,250', isoSplit: '100%', netPayout: '$2,810', status: 'Paid', paidDate: 'Nov 5' },
]

const payoutColumns: Column<PayoutRow>[] = [
  { key: 'month', header: 'Month', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.month}</span> },
  { key: 'merchantCount', header: 'Merchant Count' },
  { key: 'totalVolume', header: 'Total Volume', render: (r) => <span style={{ fontWeight: 600 }}>{r.totalVolume}</span> },
  { key: 'grossResidual', header: 'Gross Residual' },
  { key: 'isoSplit', header: 'ISO Split' },
  { key: 'netPayout', header: 'Net Payout', render: (r) => <span style={{ fontWeight: 700, color: '#059669' }}>{r.netPayout}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Paid' ? 'emerald' : 'blue'}>{r.status}</StatusBadge> },
  { key: 'paidDate', header: 'Paid Date' },
]

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
