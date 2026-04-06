import { useState } from 'react'
import {
  Plus, Search, CheckCircle, AlertTriangle, FileText, Upload, ChevronRight,
  Kanban, ShieldCheck, Store, DollarSign, TicketCheck, ClipboardList,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { leadPipeline, merchants, onboardingApps } from '../data/mockData'

type SubNav = 'pipeline' | 'applications' | 'underwriting' | 'merchants' | 'residuals' | 'tickets'

const subNavItems: { id: SubNav; label: string; icon: typeof Kanban }[] = [
  { id: 'pipeline', label: 'Pipeline', icon: Kanban },
  { id: 'applications', label: 'Applications', icon: ClipboardList },
  { id: 'underwriting', label: 'Underwriting', icon: ShieldCheck },
  { id: 'merchants', label: 'My Merchants', icon: Store },
  { id: 'residuals', label: 'Residuals', icon: DollarSign },
  { id: 'tickets', label: 'Tickets', icon: TicketCheck },
]

export default function AgenticCRM() {
  const [activeNav, setActiveNav] = useState<SubNav>('pipeline')
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

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
      {activeNav === 'applications' && <ApplicationsView onSelectApp={(m) => { setSelectedApp(m); setActiveNav('underwriting') }} />}
      {activeNav === 'underwriting' && <UnderwritingView selectedApp={selectedApp} onBack={() => setActiveNav('applications')} />}
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

/* ═══ Pipeline (8 stages) ═══ */
function PipelineView() {
  const stages = Object.entries(leadPipeline)
  const stageColors: Record<string, { dot: string; bg: string }> = {
    'Lead':         { dot: '#3B82F6', bg: 'rgba(59,130,246,0.06)' },
    'Proposal':     { dot: '#4F46E5', bg: 'rgba(79,70,229,0.06)' },
    'Application':  { dot: '#8B5CF6', bg: 'rgba(139,92,246,0.06)' },
    'Underwriting': { dot: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
    'Approval':     { dot: '#10B981', bg: 'rgba(16,185,129,0.06)' },
    'Boarding':     { dot: '#0891B2', bg: 'rgba(8,145,178,0.06)' },
    'Equipment':    { dot: '#EC4899', bg: 'rgba(236,72,153,0.06)' },
    'Go-Live':      { dot: '#059669', bg: 'rgba(5,150,105,0.06)' },
  }

  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 16 }}>
      {stages.map(([stage, leads]) => {
        const colors = stageColors[stage] || { dot: '#94A3B8', bg: 'rgba(148,163,184,0.06)' }
        return (
          <div key={stage} style={{ minWidth: 210, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: colors.bg, borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.dot }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{stage}</span>
              <span style={{ fontSize: 9, background: 'white', color: '#64748B', borderRadius: 4, padding: '2px 5px', fontWeight: 700, marginLeft: 'auto' }}>{leads.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leads.map(lead => (
                <div key={lead.name} className="harlow-card" style={{ padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 130 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.2 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{lead.location}</div>
                    </div>
                    <ScoreRing score={lead.aiScore} />
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 'auto', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>MCC {lead.mcc}</span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#E8F0FE', color: '#1578F7' }}>{lead.estVolume}</span>
                  </div>
                  <div style={{ fontSize: 11, color: lead.detail ? '#64748B' : '#E2E8F0', paddingTop: 8, borderTop: '1px solid #F1F5F9', fontWeight: 500, minHeight: 18 }}>
                    {lead.detail || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══ Applications (from MerchantOnboarding list) ═══ */
function ApplicationsView({ onSelectApp }: { onSelectApp: (merchant: string) => void }) {
  type AppRow = { merchant: string; bank: string; submitted: string; stage: string; riskScore: number | null; riskLabel: string; status: string; assigned: string }

  const riskVariant = (label: string) => label === 'Low Risk' ? 'emerald' as const : label === 'Medium' ? 'amber' as const : label === 'High Risk' ? 'rose' as const : 'gray' as const
  const statusVariant = (s: string) => s === 'In Progress' ? 'blue' as const : s === 'In Review' ? 'indigo' as const : s.includes('Needs') ? 'rose' as const : 'amber' as const

  const columns: Column<AppRow>[] = [
    { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
    { key: 'bank', header: 'Bank' },
    { key: 'submitted', header: 'Submitted' },
    { key: 'stage', header: 'Stage' },
    { key: 'riskScore', header: 'Risk Score', render: (r) =>
      r.riskScore ? <StatusBadge variant={riskVariant(r.riskLabel)}>{r.riskScore} -- {r.riskLabel}</StatusBadge> : <span style={{ color: '#94A3B8', fontSize: 12 }}>Pending</span>
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
    { key: 'assigned', header: 'Assigned' },
    { key: '', header: '', render: () => <ChevronRight size={14} style={{ color: '#94A3B8' }} /> },
  ]

  return (
    <div className="dashboard-grid">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          background: 'linear-gradient(to right, #609FFF, #1578F7)',
          color: 'white', borderRadius: 8, padding: '8px 16px', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          <Plus size={16} /> New Application
        </button>
      </div>
      <Card noPadding>
        <DataTable columns={columns} data={onboardingApps as unknown as AppRow[]} hoverable onRowClick={(row) => onSelectApp(row.merchant)} />
      </Card>
    </div>
  )
}

/* ═══ Underwriting (from MerchantOnboarding detail) ═══ */
function UnderwritingView({ selectedApp, onBack }: { selectedApp: string | null; onBack: () => void }) {
  if (!selectedApp) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8', fontSize: 14 }}>
        Select an application from the <strong>Applications</strong> tab to view underwriting details.
      </div>
    )
  }

  const steps = [
    { label: 'Application Received', done: true },
    { label: 'Document Collection', done: true },
    { label: 'KYB/KYC Verification', current: true },
    { label: 'AI Risk Assessment', done: false },
    { label: 'Pricing & Terms', done: false },
    { label: 'Boarding Complete', done: false },
  ]

  const docs = [
    { name: 'Articles_of_Incorporation.pdf', status: 'AI Processed', extracted: 'Entity name, State, EIN, Formation date' },
    { name: 'Drivers_License_Rossi.jpg', status: 'AI Processed', extracted: 'Name, DOB, Address, ID number' },
    { name: '3mo_Bank_Statements.pdf', status: 'AI Processed', extracted: 'Avg monthly balance $47,200 | Deposit velocity: 142/mo' },
    { name: 'Voided_Check.png', status: 'AI Processed', extracted: 'Routing #, Account #' },
    { name: 'Processing_Statements_Previous.pdf', status: 'AI Processed', extracted: 'Monthly volume $89K | Avg ticket $34 | CB rate 0.3%' },
  ]

  const kybResults = [
    { icon: CheckCircle, color: '#10B981', title: 'Business Entity Verified', sub: "Bella's Bistro LLC, Delaware Corp, EIN validated", tag: 'Agentic Lakehouse -- Auto-Extracted from uploaded Articles of Incorporation' },
    { icon: CheckCircle, color: '#10B981', title: 'Beneficial Ownership Confirmed', sub: 'Maria Rossi, 100% owner', tag: 'Graph DB -- Ownership chain resolved, no layered structures detected' },
    { icon: CheckCircle, color: '#10B981', title: 'Sanctions & PEP Screening -- Clear', sub: 'No matches found', tag: 'Real-time screening against OFAC, EU, UN consolidated lists' },
    { icon: AlertTriangle, color: '#F59E0B', title: 'Adverse Media Check -- 1 result flagged', sub: 'Awaiting review', tag: 'AI flagged: local health dept citation (2023) -- low relevance score 0.12' },
    { icon: CheckCircle, color: '#10B981', title: 'Identity Verification -- Maria Rossi', sub: 'Verified', tag: 'Document AI -- Passport OCR + liveness check passed' },
  ]

  return (
    <div className="dashboard-grid">
      <button onClick={onBack} style={{ fontSize: 13, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, alignSelf: 'flex-start' }}>&larr; Back to Applications</button>

      {/* Progress Bar */}
      <Card>
        <div style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: step.done ? '#10B981' : step.current ? '#1578F7' : '#E2E8F0',
                  color: step.done || step.current ? 'white' : '#94A3B8',
                }}>
                  {step.done ? <CheckCircle size={14} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: step.done ? '#059669' : step.current ? '#1578F7' : '#94A3B8' }}>
                  {step.label}
                </span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step.done ? '#A7F3D0' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Left Column */}
        <div className="dashboard-grid">
          <Card noPadding>
            <CardHeader title="KYB / KYC Results" />
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {kybResults.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 8, border: '1px solid #F1F5F9' }}>
                  <item.icon size={18} style={{ marginTop: 2, flexShrink: 0, color: item.color }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{item.sub}</div>
                    <div style={{ fontSize: 10, color: '#4F46E5', marginTop: 4, background: '#EEF2FF', padding: '2px 8px', borderRadius: 12, display: 'inline-block' }}>{item.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card noPadding>
            <CardHeader title="AI Risk Assessment Preview" />
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                <div style={{ position: 'relative', width: 112, height: 112 }}>
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray={`${72 * 2.64} ${100 * 2.64}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>72</span>
                    <span style={{ fontSize: 10, color: '#059669', fontWeight: 500 }}>LOW RISK</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> MCC 5812 -- Chargeback: 0.3% vs industry 0.8%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> Volume Consistency: stable &plusmn;6%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> Fraud Signal Scan: No anomalies</div>
                </div>
              </div>
              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F766E' }}>AUTO-APPROVE -- Suggest Tier 2 pricing at 2.69% + $0.10</div>
                <div style={{ fontSize: 12, color: '#1578F7', marginTop: 4, fontWeight: 500 }}>ML model trained on 50K+ merchant profiles | Human override available at Step 5</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Documents */}
        <div className="dashboard-grid">
          <Card noPadding>
            <CardHeader title="Uploaded Documents" />
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {docs.map((doc, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 8, border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={14} style={{ color: '#94A3B8' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                    <StatusBadge variant="indigo">{doc.status}</StatusBadge>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, marginLeft: 22 }}>{doc.extracted}</div>
                </div>
              ))}
              <button style={{
                width: '100%', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 13, color: '#64748B', border: '1px dashed #CBD5E1', borderRadius: 8, padding: '10px 0',
                background: 'none', cursor: 'pointer',
              }}>
                <Upload size={14} /> Add Document
              </button>
            </div>
          </Card>

          <div style={{ background: '#FAFBFC', borderRadius: 12, padding: 16, fontSize: 12, color: '#64748B', fontWeight: 500 }}>
            <div>Application ID: HRW-2026-0488292</div>
            <div style={{ marginTop: 4 }}>Submitted: Mar 28, 2026 | SLA: 4h remaining</div>
            <div style={{ marginTop: 4 }}>Assigned: Sarah Chen</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ My Merchants ═══ */
function MerchantsView() {
  type MerchantRow = { name: string; mid: string; processor: string; equipment: string; monthlyVol: string; pciStatus: string; status: string }

  const pciVariant = (s: string) => s === 'Compliant' ? 'emerald' as const : s === 'Non-Compliant' ? 'rose' as const : 'gray' as const
  const statusVariant = (s: string) => s === 'Active' ? 'emerald' as const : s === 'Boarding' ? 'blue' as const : 'gray' as const

  const columns: Column<MerchantRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'mid', header: 'MID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.mid}</span> },
    { key: 'processor', header: 'Processor' },
    { key: 'equipment', header: 'Equipment' },
    { key: 'monthlyVol', header: 'Monthly Vol', render: (r) => <span style={{ fontWeight: 700, color: '#1E293B' }}>{r.monthlyVol}</span> },
    { key: 'pciStatus', header: 'PCI Status', render: (r) => <StatusBadge variant={pciVariant(r.pciStatus)}>{r.pciStatus}</StatusBadge> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  return (
    <Card noPadding>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #F1F5F9' }}>
        <select style={{ fontSize: 12, background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', fontWeight: 600, color: '#475569', outline: 'none' }}>
          <option>All Statuses</option><option>Active</option><option>Boarding</option><option>Inactive</option>
        </select>
        <select style={{ fontSize: 12, background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', fontWeight: 600, color: '#475569', outline: 'none' }}>
          <option>All Processors</option><option>Harlow Payments</option><option>EPSG</option><option>Repay TSYS FEO</option>
        </select>
      </div>
      <DataTable columns={columns} data={merchants as unknown as MerchantRow[]} hoverable />
    </Card>
  )
}

/* ═══ Residuals ═══ */
function ResidualsView() {
  type ResidualRow = { merchant: string; processor: string; volume: string; gross: string; split: string; payout: string }

  const residualData: ResidualRow[] = [
    { merchant: "Mario's Pizzeria", processor: 'Harlow Payments', volume: '$47,230', gross: '$472.30', split: '60%', payout: '$283.38' },
    { merchant: 'Harlem Grocery', processor: 'Repay TSYS FEO', volume: '$38,410', gross: '$384.10', split: '60%', payout: '$230.46' },
    { merchant: 'Jade Garden', processor: 'Harlow Payments', volume: '$31,560', gross: '$315.60', split: '60%', payout: '$189.36' },
    { merchant: 'Brooklyn Dry Cleaners', processor: 'EPSG', volume: '$22,890', gross: '$228.90', split: '60%', payout: '$137.34' },
  ]

  const residualColumns: Column<ResidualRow>[] = [
    { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
    { key: 'processor', header: 'Processor' },
    { key: 'volume', header: 'Volume' },
    { key: 'gross', header: 'Gross Residual' },
    { key: 'split', header: 'Your Split' },
    { key: 'payout', header: 'Your Payout', render: (r) => <span style={{ fontWeight: 700, color: '#059669' }}>{r.payout}</span> },
  ]

  return (
    <div className="dashboard-grid">
      <div className="grid-3">
        {[
          { label: 'March 2026 (Projected)', value: '$3,847', sub: 'Current month', accent: '#1578F7' },
          { label: 'February 2026 (Paid)', value: '$3,635', sub: 'Last payout', accent: '#059669' },
          { label: '12-Month Total', value: '$41,218', sub: 'Rolling total', accent: '#4F46E5' },
        ].map(r => (
          <div key={r.label} className="kpi-card">
            <div className="kpi-label">{r.label}</div>
            <div className="kpi-value" style={{ color: r.accent }}>{r.value}</div>
            <div className="kpi-sub">{r.sub}</div>
          </div>
        ))}
      </div>
      <Card noPadding>
        <CardHeader title="Residual Breakdown -- February 2026" />
        <DataTable columns={residualColumns} data={residualData} hoverable />
      </Card>
    </div>
  )
}

/* ═══ Tickets ═══ */
function TicketsView() {
  type TicketRow = { id: string; desc: string; merchant: string; type: string; created: string; assigned: string; status: string }

  const tickets: TicketRow[] = [
    { id: 'TKT-2026-0312', desc: 'Replace PAX A920', merchant: 'Sunrise Deli', type: 'Equipment', created: 'Mar 12', assigned: 'Operations', status: 'In Progress' },
    { id: 'TKT-2026-0308', desc: 'Update bank account', merchant: 'Lucky Nail Salon', type: 'Bank Info', created: 'Mar 8', assigned: 'Kate Palmarini', status: 'Awaiting Docs' },
    { id: 'TKT-2026-0301', desc: 'Switch to Cash Discount', merchant: 'Metro Tobacco', type: 'Pricing', created: 'Mar 1', assigned: 'David Goldfarb', status: 'Pending Approval' },
  ]

  const statusVariant = (s: string) => s.includes('Progress') ? 'blue' as const : s.includes('Awaiting') ? 'amber' as const : 'gray' as const

  const ticketColumns: Column<TicketRow>[] = [
    { key: 'id', header: 'Ticket', render: (r) => (
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#CBD5E1', fontWeight: 700 }}>{r.id}</div>
        <div style={{ fontWeight: 600, color: '#0F172A' }}>{r.desc}</div>
      </div>
    )},
    { key: 'merchant', header: 'Merchant' },
    { key: 'type', header: 'Type' },
    { key: 'created', header: 'Created' },
    { key: 'assigned', header: 'Assigned' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  return (
    <Card noPadding>
      <DataTable columns={ticketColumns} data={tickets} hoverable />
    </Card>
  )
}
