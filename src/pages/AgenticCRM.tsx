import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { leadPipeline, merchants } from '../data/mockData'

type Tab = 'pipeline' | 'merchants' | 'residuals' | 'tickets'

export default function AgenticCRM() {
  const [tab, setTab] = useState<Tab>('pipeline')
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'pipeline', label: 'Lead Pipeline', count: 12 },
    { id: 'merchants', label: 'My Merchants', count: 9 },
    { id: 'residuals', label: 'Residuals' },
    { id: 'tickets', label: 'Support Tickets', count: 3 },
  ]

  return (
    <div className="dashboard-grid">
      {/* Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            placeholder="Search merchants..."
            style={{
              background: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              paddingLeft: 34,
              paddingRight: 16,
              paddingTop: 9,
              paddingBottom: 9,
              fontSize: 13,
              outline: 'none',
              width: 240,
              color: '#334155',
            }}
          />
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            background: 'linear-gradient(to right, #609FFF, #1578F7)',
            color: 'white',
            borderRadius: 10,
            padding: '9px 16px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} strokeWidth={2.5} /> New Lead
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 10, padding: 3, width: 'fit-content' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              background: tab === t.id ? 'white' : 'transparent',
              color: tab === t.id ? '#0F172A' : '#94A3B8',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t.label}
            {t.count && (
              <span style={{
                fontSize: 10,
                padding: '2px 6px',
                borderRadius: 5,
                fontWeight: 700,
                background: tab === t.id ? '#E8F0FE' : '#F1F5F9',
                color: tab === t.id ? '#1578F7' : '#94A3B8',
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'pipeline' && <PipelineView />}
      {tab === 'merchants' && <MerchantsView />}
      {tab === 'residuals' && <ResidualsView />}
      {tab === 'tickets' && <TicketsView />}
    </div>
  )
}

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

function PipelineView() {
  const stages = Object.entries(leadPipeline)
  const stageColors: Record<string, { dot: string; bg: string }> = {
    'New': { dot: '#3B82F6', bg: 'rgba(59,130,246,0.06)' },
    'Contacted': { dot: '#609FFF', bg: 'rgba(21,120,247,0.06)' },
    'Proposal': { dot: '#4F46E5', bg: 'rgba(79,70,229,0.06)' },
    'E-Sign Sent': { dot: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
    'Underwriting': { dot: '#10B981', bg: 'rgba(16,185,129,0.06)' },
  }

  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
      {stages.map(([stage, leads]) => {
        const colors = stageColors[stage] || { dot: '#94A3B8', bg: 'rgba(148,163,184,0.06)' }
        return (
          <div key={stage} style={{ minWidth: 240, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, background: colors.bg, borderRadius: 8, padding: '7px 10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.dot }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>{stage}</span>
              <span style={{ fontSize: 9, background: 'white', color: '#64748B', borderRadius: 4, padding: '2px 5px', fontWeight: 700, marginLeft: 'auto' }}>{leads.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {leads.map(lead => (
                <div key={lead.name} className="harlow-card" style={{ padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', minHeight: 130 }}>
                  {/* Top: name + score ring */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 6 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A', lineHeight: 1.2 }}>{lead.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{lead.location}</div>
                    </div>
                    <ScoreRing score={lead.aiScore} />
                  </div>

                  {/* Middle: MCC + Volume */}
                  <div style={{ display: 'flex', gap: 4, marginTop: 'auto', marginBottom: 8 }}>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>
                      MCC {lead.mcc}
                    </span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#E8F0FE', color: '#1578F7' }}>
                      {lead.estVolume}
                    </span>
                  </div>

                  {/* Bottom: detail or placeholder */}
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
