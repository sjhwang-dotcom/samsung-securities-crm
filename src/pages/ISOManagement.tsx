import { useState } from 'react'
import { Building2, Users, DollarSign, TrendingDown, Package, ArrowUpRight, Calendar, MapPin, Phone, Mail, Globe, ChevronRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { merchants } from '../data/mockData'

/* ═══ Extended ISO Data ═══ */
const isoData = [
  {
    id: 'harlow',
    name: 'Harlow Direct',
    status: 'Primary',
    statusColor: 'teal' as const,
    description: 'Flagship ISO — direct merchant acquisition through AI-powered sales engine. Focused on restaurants, retail, and service industries across the tri-state area.',
    founded: '2019',
    hq: 'New York, NY',
    contact: 'David Goldfarb',
    email: 'david@harlowpayments.com',
    phone: '(212) 555-0147',
    website: 'harlowpayments.com',
    merchants: 2847,
    volume: '$18.4M',
    residuals: '$1.84M',
    churn: '1.2%',
    churnTrend: -0.3,
    penetration: '8.4%',
    avgTicket: '$34.20',
    processors: ['Harlow Payments', 'Repay TSYS FEO'],
    topMCC: [
      { name: 'Restaurants', pct: 38, color: '#1578F7' },
      { name: 'Retail', pct: 24, color: '#3B82F6' },
      { name: 'Services', pct: 18, color: '#8B5CF6' },
      { name: 'Auto', pct: 12, color: '#F59E0B' },
      { name: 'Other', pct: 8, color: '#94A3B8' },
    ],
    volumeTrend: [
      { m: 'Oct', v: 15.2 }, { m: 'Nov', v: 15.8 }, { m: 'Dec', v: 16.4 },
      { m: 'Jan', v: 17.1 }, { m: 'Feb', v: 17.8 }, { m: 'Mar', v: 18.4 },
    ],
    merchantFilter: ['harlow'],
    products: [
      { name: 'Embedded Financing', enrolled: 245, rate: '8.6%' },
      { name: 'POS Upgrade', enrolled: 312, rate: '11.0%' },
      { name: 'Gift Cards', enrolled: 189, rate: '6.6%' },
    ],
    recentEvents: [
      { text: '23 new merchants onboarded this month', time: '2d ago' },
      { text: 'PCI compliance rate improved to 94.2%', time: '1w ago' },
      { text: 'Voice Agent campaign targeting restaurant MCC launched', time: '2w ago' },
    ],
  },
  {
    id: 'zenith',
    name: 'Zenith Payments',
    status: 'Acquired Q4 2025',
    statusColor: 'emerald' as const,
    description: 'Mid-market ISO acquired in Q4 2025. Specializes in healthcare and professional services. Integration 96% complete — 28 merchants remaining.',
    founded: '2016',
    hq: 'Philadelphia, PA',
    contact: 'Rachel Torres',
    email: 'rachel@zenithpay.com',
    phone: '(215) 555-0312',
    website: 'zenithpayments.com',
    merchants: 1024,
    volume: '$8.9M',
    residuals: '$890K',
    churn: '2.1%',
    churnTrend: -0.8,
    penetration: '3.2%',
    avgTicket: '$52.10',
    processors: ['EPSG', 'EPSG Wells Fargo'],
    topMCC: [
      { name: 'Health', pct: 32, color: '#1578F7' },
      { name: 'Professional', pct: 28, color: '#3B82F6' },
      { name: 'Retail', pct: 20, color: '#8B5CF6' },
      { name: 'Restaurants', pct: 14, color: '#F59E0B' },
      { name: 'Other', pct: 6, color: '#94A3B8' },
    ],
    volumeTrend: [
      { m: 'Oct', v: 7.1 }, { m: 'Nov', v: 7.5 }, { m: 'Dec', v: 7.9 },
      { m: 'Jan', v: 8.2 }, { m: 'Feb', v: 8.6 }, { m: 'Mar', v: 8.9 },
    ],
    merchantFilter: ['zenith'],
    products: [
      { name: 'Banking (BaaS)', enrolled: 89, rate: '8.7%' },
      { name: 'Insurance', enrolled: 67, rate: '6.5%' },
      { name: 'Payroll', enrolled: 45, rate: '4.4%' },
    ],
    recentEvents: [
      { text: 'Migration 96% complete — 28 merchants remaining', time: '1d ago' },
      { text: 'Churn reduced from 4.1% to 2.1% post-acquisition', time: '2w ago' },
      { text: 'Product cross-sell revenue: +$1.2M annual', time: '1mo ago' },
    ],
  },
  {
    id: 'liberty',
    name: 'Liberty Processing',
    status: 'Acquired Q1 2026',
    statusColor: 'emerald' as const,
    description: 'Newest acquisition — small-market ISO focused on convenience stores, gas stations, and tobacco shops. High churn portfolio being stabilized with AI retention tools.',
    founded: '2018',
    hq: 'Newark, NJ',
    contact: 'Mike Rodriguez',
    email: 'mike@libertyprocessing.com',
    phone: '(973) 555-0298',
    website: 'libertyprocessing.com',
    merchants: 741,
    volume: '$4.8M',
    residuals: '$480K',
    churn: '3.4%',
    churnTrend: -1.2,
    penetration: '1.8%',
    avgTicket: '$18.90',
    processors: ['Card Point/First Data'],
    topMCC: [
      { name: 'Convenience', pct: 34, color: '#1578F7' },
      { name: 'Gas Station', pct: 22, color: '#3B82F6' },
      { name: 'Tobacco', pct: 18, color: '#8B5CF6' },
      { name: 'Grocery', pct: 16, color: '#F59E0B' },
      { name: 'Other', pct: 10, color: '#94A3B8' },
    ],
    volumeTrend: [
      { m: 'Oct', v: 3.8 }, { m: 'Nov', v: 4.0 }, { m: 'Dec', v: 4.2 },
      { m: 'Jan', v: 4.4 }, { m: 'Feb', v: 4.6 }, { m: 'Mar', v: 4.8 },
    ],
    merchantFilter: ['liberty'],
    products: [
      { name: 'Cash Advance', enrolled: 56, rate: '7.6%' },
      { name: 'Loyalty Program', enrolled: 23, rate: '3.1%' },
    ],
    recentEvents: [
      { text: 'Migration 92% complete — 59 merchants remaining', time: '2d ago' },
      { text: 'AI retention outreach reduced churn from 5.8% to 3.4%', time: '1w ago' },
      { text: '12 merchants flagged for bank info update', time: '1w ago' },
    ],
  },
]

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function ISOManagement() {
  const [selectedId, setSelectedId] = useState('harlow')
  const selected = isoData.find(i => i.id === selectedId)!

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', margin: '-16px -20px', overflow: 'hidden' }}>
      {/* ═══ Left: ISO List Panel ═══ */}
      <div style={{
        width: 280, minWidth: 280, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 96px)',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Portfolio Companies</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>3 ISOs · $32.1M combined volume</div>
        </div>

        {/* ISO Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isoData.map(iso => {
            const isActive = selectedId === iso.id
            return (
              <div
                key={iso.id}
                onClick={() => setSelectedId(iso.id)}
                className="sidebar-item"
                style={{
                  padding: '12px 16px',
                  borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06) 0%, rgba(21,120,247,0.01) 100%)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: isActive ? 'linear-gradient(135deg, #1578F7, #609FFF)' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Building2 size={16} color={isActive ? 'white' : '#94A3B8'} strokeWidth={1.8} />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 700,
                      color: isActive ? '#1578F7' : '#0F172A',
                    }}>
                      {iso.name}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, fontWeight: 500 }}>
                      {iso.merchants.toLocaleString()} merchants
                    </div>
                    {/* KPI badges */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 700, background: '#E8F0FE', color: '#1578F7' }}>
                        Vol: {iso.volume}
                      </span>
                      <span style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 700,
                        background: parseFloat(iso.churn) > 2.5 ? '#FEE2E2' : parseFloat(iso.churn) > 1.5 ? '#FEF3C7' : '#D1FAE5',
                        color: parseFloat(iso.churn) > 2.5 ? '#DC2626' : parseFloat(iso.churn) > 1.5 ? '#D97706' : '#059669',
                      }}>
                        Churn: {iso.churn}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0 }}>
                    <ChevronRight size={14} color="#CBD5E1" style={{ opacity: isActive ? 1 : 0 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer summary */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>
          Total: 4,612 merchants · $32.1M volume · 1.4% avg churn
        </div>
      </div>

      {/* ═══ Right: ISO Detail ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 96px)' }}>
        <div className="dashboard-grid">

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>{selected.name}</span>
                <StatusBadge variant={selected.statusColor}>{selected.status}</StatusBadge>
              </div>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.6, maxWidth: 640, fontWeight: 500 }}>
                {selected.description}
              </p>
            </div>
          </div>

          {/* Company Info Bar */}
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748B', fontWeight: 500, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} color="#94A3B8" /> Founded {selected.founded}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} color="#94A3B8" /> {selected.hq}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={13} color="#94A3B8" /> {selected.contact}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={13} color="#94A3B8" /> {selected.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={13} color="#94A3B8" /> {selected.website}</span>
          </div>

          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { label: 'Merchants', value: selected.merchants.toLocaleString(), icon: Users, color: '#1578F7' },
              { label: 'Monthly Volume', value: selected.volume, icon: DollarSign, color: '#3B82F6' },
              { label: 'Residuals', value: selected.residuals, icon: TrendingDown, color: '#8B5CF6' },
              { label: 'Churn Rate', value: selected.churn, icon: TrendingDown, color: parseFloat(selected.churn) > 2.5 ? '#EF4444' : '#F59E0B' },
              { label: 'Product Penetration', value: selected.penetration, icon: Package, color: '#4F46E5' },
              { label: 'Avg Ticket', value: selected.avgTicket, icon: ArrowUpRight, color: '#1578F7' },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card">
                <div className="kpi-icon" style={{ background: `${kpi.color}15`, width: 30, height: 30, borderRadius: 8, marginBottom: 6 }}>
                  <kpi.icon size={14} color={kpi.color} strokeWidth={2} />
                </div>
                <div className="kpi-value" style={{ fontSize: 20 }}>{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
                {kpi.label === 'Churn Rate' && (
                  <div className="kpi-trend" style={{ color: '#059669', fontSize: 10 }}>▼ {Math.abs(selected.churnTrend)}% vs prior</div>
                )}
              </div>
            ))}
          </div>

          {/* Charts: Volume Trend + MCC Mix */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Volume Trend (6mo)" />
              <div style={{ padding: '0 16px 16px' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={selected.volumeTrend}>
                    <defs>
                      <linearGradient id="isoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1578F7" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#1578F7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} width={45} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v}M`} />
                    <Area type="monotone" dataKey="v" stroke="#1578F7" fill="url(#isoGrad)" strokeWidth={2} dot={false} name="Volume" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="MCC Category Mix" />
              <div style={{ padding: '0 16px 16px' }}>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={selected.topMCC} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="pct" strokeWidth={0}>
                      {selected.topMCC.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {selected.topMCC.map((m, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.color }} />
                      {m.name} {m.pct}%
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Product Cross-Sell + Recent Events */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Product Cross-Sell" subtitle={`${selected.penetration} penetration rate`} />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selected.products.map(p => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{p.enrolled} enrolled</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: p.rate, background: '#1578F7' }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#1578F7' }}>{p.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Recent Events" />
              <div style={{ padding: '0 16px 16px' }}>
                <div className="activity-feed">
                  {selected.recentEvents.map((ev, i) => (
                    <div key={i} className="activity-item">
                      <span className="activity-dot" style={{ background: '#1578F7' }} />
                      <span className="activity-text">{ev.text}</span>
                      <span className="activity-time">{ev.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Merchant List */}
          <Card noPadding>
            <CardHeader
              title={`${selected.name} — Merchant Portfolio`}
              subtitle={`${selected.merchants.toLocaleString()} merchants`}
              action={
                <button className="card-view-all">View all &rarr;</button>
              }
            />
            <MerchantTable isoName={selected.name} />
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ═══ Merchant Table ═══ */
function MerchantTable({ isoName }: { isoName: string }) {
  // Filter merchants relevant to selected ISO (simplified — show all for demo)
  const isoMerchants = isoName === 'Harlow Direct'
    ? merchants.filter(m => ['Harlow Payments', 'Repay TSYS FEO'].includes(m.processor))
    : isoName === 'Zenith Payments'
    ? merchants.filter(m => m.processor.includes('EPSG'))
    : merchants.filter(m => m.processor.includes('Card Point'))

  // Fallback: show all if no matches
  const data = isoMerchants.length > 0 ? isoMerchants : merchants.slice(0, 5)

  type MRow = typeof merchants[0]
  const pciVariant = (s: string) => s === 'Compliant' ? 'emerald' as const : s === 'Non-Compliant' ? 'rose' as const : 'gray' as const
  const statusVariant = (s: string) => s === 'Active' ? 'emerald' as const : s === 'Boarding' ? 'blue' as const : 'gray' as const

  const columns: Column<MRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'mid', header: 'MID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.mid}</span> },
    { key: 'processor', header: 'Processor' },
    { key: 'equipment', header: 'Equipment' },
    { key: 'monthlyVol', header: 'Monthly Vol', render: (r) => <span style={{ fontWeight: 700, color: '#1E293B' }}>{r.monthlyVol}</span> },
    { key: 'pciStatus', header: 'PCI', render: (r) => <StatusBadge variant={pciVariant(r.pciStatus)}>{r.pciStatus}</StatusBadge> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  return <DataTable columns={columns} data={data} hoverable compact />
}
