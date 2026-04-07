import { useState, useMemo } from 'react'
import { Building2, Calendar, MapPin, Phone, Mail, Globe, ChevronRight, ChevronLeft, Search } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { allMerchants, isoData as rawIsoData } from '../data/mockData'

/* ═══ Shape ISO data from DB ═══ */
const isoList = (rawIsoData as any[]).map((iso: any) => ({
  id: iso.iso_id,
  name: iso.name,
  status: iso.status === 'Primary' ? 'Primary' : `Acquired`,
  statusColor: (iso.status === 'Primary' ? 'teal' : 'emerald') as 'teal' | 'emerald',
  description: iso.notes ?? iso.description ?? '',
  founded: String(iso.founded_year ?? ''),
  hq: `${iso.hq_city ?? ''}, ${iso.hq_state ?? ''}`,
  contact: iso.contacts?.[0] ? `${iso.contacts[0].first_name} ${iso.contacts[0].last_name}` : '',
  email: iso.contacts?.[0]?.email ?? iso.contact_email ?? '',
  phone: iso.contacts?.[0]?.phone ?? iso.contact_phone ?? '',
  website: iso.website ?? '',
  merchants: iso.merchant_count ?? 0,
  volume: `$${((iso.total_monthly_volume ?? 0) / 1e6).toFixed(1)}M`,
  residuals: `$${((iso.total_monthly_residuals ?? 0) / 1e6).toFixed(1)}M`,
  churn: `${iso.churn_rate ?? 0}%`,
  penetration: `${iso.product_penetration_rate ?? 0}%`,
  avgTicket: `$${(iso.avg_ticket ?? 0).toFixed(2)}`,
  processors: (iso.processors ?? []).map((p: any) => p.name),
  topMCC: (iso.mcc_breakdown ?? []).slice(0, 5).map((m: any, i: number) => ({
    name: m.category, pct: m.pct,
    color: ['#1578F7', '#3B82F6', '#8B5CF6', '#F59E0B', '#94A3B8'][i] ?? '#94A3B8',
  })),
  volumeTrend: (iso.monthly_metrics ?? []).slice(-6).map((m: any) => ({
    m: new Date(m.month).toLocaleDateString('en-US', { month: 'short' }),
    v: Math.round((m.processing_volume ?? 0) / 1e6 * 10) / 10,
  })),
  products: (iso.products ?? []).map((p: any) => ({
    name: p.product_name, enrolled: p.enrolled_count, rate: `${p.enrollment_rate}%`,
  })),
  recentEvents: (iso.events ?? []).slice(0, 4).map((e: any) => ({
    text: e.title, time: e.description?.split('.')[0] ?? '',
  })),
  // Extra DB fields
  legalName: iso.legal_name,
  entityType: iso.entity_type,
  ein: iso.ein,
  isoSplitPct: iso.iso_split_pct,
  buyRate: iso.buy_rate,
  integrationStatus: iso.integration_status,
  integrationPct: iso.integration_pct,
  bankPartner: iso.bank_partner,
  binSponsor: iso.bin_sponsor,
  acquisitionPrice: iso.acquisition_price,
  acquisitionMultiple: iso.acquisition_multiple,
  contractStart: iso.contract_start_date,
  contractEnd: iso.contract_end_date,
  industryFocus: iso.industry_focus,
  pciComplianceRate: iso.pci_compliance_rate,
}))

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function ISOManagement() {
  const [selectedId, setSelectedId] = useState(isoList[0]?.id ?? 1)
  const selected = isoList.find(i => i.id === selectedId) ?? isoList[0]

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', margin: '-16px -20px', overflow: 'hidden' }}>
      {/* ═══ Left: ISO List Panel ═══ */}
      <div style={{
        width: 280, minWidth: 280, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 96px)',
      }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Portfolio Companies</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>
            {isoList.length} ISOs · ${(isoList.reduce((s, i) => s + parseFloat(i.volume.replace(/[$M]/g, '')), 0)).toFixed(1)}M combined volume
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isoList.map(iso => {
            const isActive = selectedId === iso.id
            return (
              <div key={iso.id} onClick={() => setSelectedId(iso.id)} className="sidebar-item"
                style={{
                  padding: '12px 16px',
                  borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06) 0%, rgba(21,120,247,0.01) 100%)' : 'transparent',
                  cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: isActive ? 'linear-gradient(135deg, #1578F7, #609FFF)' : '#F1F5F9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Building2 size={16} color={isActive ? 'white' : '#94A3B8'} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#1578F7' : '#0F172A' }}>{iso.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1, fontWeight: 500 }}>
                      {iso.merchants.toLocaleString()} merchants
                    </div>
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
                  <ChevronRight size={14} color="#CBD5E1" style={{ opacity: isActive ? 1 : 0 }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #F1F5F9', fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>
          Total: {allMerchants.length.toLocaleString()} merchants · 1.4% avg churn
        </div>
      </div>

      {/* ═══ Right: ISO Detail ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 96px)' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>{selected.name}</span>
              <StatusBadge variant={selected.statusColor}>{selected.status}</StatusBadge>
              {selected.integrationPct != null && selected.integrationPct < 100 && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, background: '#FEF3C7', color: '#D97706' }}>
                  Integration: {selected.integrationPct}%
                </span>
              )}
            </div>
            <p style={{ fontSize: 13, color: '#64748B', marginTop: 6, lineHeight: 1.6, maxWidth: 640, fontWeight: 500 }}>
              {selected.description}
            </p>
          </div>

          {/* Company Info */}
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748B', fontWeight: 500, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} color="#94A3B8" /> Founded {selected.founded}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} color="#94A3B8" /> {selected.hq}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={13} color="#94A3B8" /> {selected.contact}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={13} color="#94A3B8" /> {selected.email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Globe size={13} color="#94A3B8" /> {selected.website}</span>
          </div>

          {/* Contract & Financial Info */}
          {selected.legalName && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {[
                { label: 'Legal Entity', value: `${selected.legalName} (${selected.entityType})` },
                { label: 'EIN', value: selected.ein },
                { label: 'Split', value: `${selected.isoSplitPct}%` },
                { label: 'Buy Rate', value: `${((selected.buyRate ?? 0) * 100).toFixed(2)}%` },
                { label: 'Bank Partner', value: selected.bankPartner },
                { label: 'BIN Sponsor', value: selected.binSponsor },
                ...(selected.acquisitionPrice ? [{ label: 'Acq. Price', value: `$${(selected.acquisitionPrice / 1e6).toFixed(1)}M` }] : []),
                ...(selected.acquisitionMultiple ? [{ label: 'Multiple', value: `${selected.acquisitionMultiple}x` }] : []),
              ].filter(x => x.value).map(item => (
                <div key={item.label} style={{ fontSize: 11, color: '#64748B', background: '#FAFBFC', borderRadius: 6, padding: '4px 10px' }}>
                  <span style={{ color: '#94A3B8', fontWeight: 500 }}>{item.label}: </span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { label: 'Merchants', value: selected.merchants.toLocaleString(), icon: '🏪' },
              { label: 'Volume', value: selected.volume, icon: '💰' },
              { label: 'Residuals', value: selected.residuals, icon: '📈' },
              { label: 'Churn', value: selected.churn, icon: '📉' },
              { label: 'Penetration', value: selected.penetration, icon: '📦' },
              { label: 'Avg Ticket', value: selected.avgTicket, icon: '🎫' },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card">
                <div className="kpi-label">{kpi.label}</div>
                <div className="kpi-value" style={{ fontSize: 20 }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Volume Trend (6mo)" />
              <div style={{ padding: '0 16px 16px', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selected.volumeTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(v: any) => `$${v}M`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v}M`, 'Volume']} />
                    <Area type="monotone" dataKey="v" stroke="#1578F7" fill="url(#volGrad)" strokeWidth={2} />
                    <defs><linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1578F7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1578F7" stopOpacity={0} />
                    </linearGradient></defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="MCC Category Mix" />
              <div style={{ padding: '0 16px 16px', height: 180, display: 'flex', alignItems: 'center', gap: 16 }}>
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={selected.topMCC} dataKey="pct" nameKey="name" cx="50%" cy="50%"
                      innerRadius={35} outerRadius={60} paddingAngle={2}>
                      {selected.topMCC.map((entry: any, i: number) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selected.topMCC.map((m: any) => (
                    <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                      <span style={{ color: '#334155', fontWeight: 500 }}>{m.name}</span>
                      <span style={{ color: '#94A3B8', fontWeight: 700 }}>{m.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Products + Events */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Product Enrollment" />
              <div style={{ padding: '0 16px 16px' }}>
                {selected.products.length > 0 ? selected.products.map((p: any) => (
                  <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{p.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{p.enrolled} enrolled</span>
                      <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, fontWeight: 700, background: '#E8F0FE', color: '#1578F7' }}>{p.rate}</span>
                    </div>
                  </div>
                )) : <div style={{ fontSize: 12, color: '#94A3B8', padding: 12 }}>No product data</div>}
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Recent Events" />
              <div style={{ padding: '0 16px 16px' }}>
                <div className="activity-feed">
                  {selected.recentEvents.map((ev: any, i: number) => (
                    <div key={i} className="activity-item">
                      <span className="activity-dot" style={{ background: '#1578F7' }} />
                      <span className="activity-text">{ev.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Merchant List with pagination */}
          <Card noPadding>
            <CardHeader
              title={`${selected.name} — Merchant Portfolio`}
              subtitle={`${selected.merchants.toLocaleString()} merchants`}
            />
            <MerchantTable isoId={selected.id} />
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ═══ Merchant Table with search + pagination ═══ */
const PAGE_SIZE = 25

function MerchantTable({ isoId }: { isoId: number }) {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = allMerchants.filter(m => m.iso_id === isoId)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.mid?.toLowerCase().includes(q) ||
        m.processor?.toLowerCase().includes(q) ||
        m.category?.toLowerCase().includes(q) ||
        m.mcc_desc?.toLowerCase().includes(q)
      )
    }
    return list
  }, [isoId, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  // Reset page when ISO or search changes
  useMemo(() => setPage(0), [isoId, search])

  type MRow = typeof allMerchants[0]
  const statusVariant = (s: string) => s === 'Active' ? 'emerald' as const : s === 'Boarding' ? 'blue' as const : 'gray' as const

  const columns: Column<MRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => (
      <div>
        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.name}</div>
        <div style={{ fontSize: 10, color: '#94A3B8' }}>{r.mcc_desc}</div>
      </div>
    )},
    { key: 'mid', header: 'MID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#94A3B8' }}>{r.mid}</span> },
    { key: 'category', header: 'Category', render: (r) => (
      <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>
        {r.category}
      </span>
    )},
    { key: 'processor', header: 'Processor' },
    { key: 'avg_ticket', header: 'Avg Ticket', render: (r) => <span style={{ fontWeight: 600 }}>${(r.avg_ticket ?? 0).toFixed(2)}</span> },
    { key: 'annual_volume', header: 'Annual Vol', render: (r) => (
      <span style={{ fontWeight: 700, color: '#1E293B' }}>
        ${((r.annual_volume ?? 0) / 1000).toFixed(0)}K
      </span>
    )},
    { key: 'risk_score', header: 'Risk', render: (r) => {
      const score = r.risk_score ?? 50
      const color = score >= 80 ? '#10B981' : score >= 60 ? '#0891B2' : score >= 40 ? '#F59E0B' : '#F43F5E'
      return <span style={{ fontWeight: 700, color, fontSize: 12 }}>{score}</span>
    }},
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
  ]

  return (
    <div>
      {/* Search bar */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            placeholder="Search merchants..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8,
              paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
              fontSize: 12, outline: 'none', color: '#334155',
            }}
          />
        </div>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {filtered.length.toLocaleString()} merchants
        </span>
      </div>

      <DataTable columns={columns} data={pageData} hoverable compact />

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#64748B',
        }}>
          <span style={{ fontWeight: 500 }}>
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
                borderRadius: 6, border: '1px solid #E5E7EB', background: 'white',
                cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1,
                fontSize: 12, fontWeight: 500,
              }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 12, fontWeight: 600, color: '#334155' }}>
              {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
                borderRadius: 6, border: '1px solid #E5E7EB', background: 'white',
                cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1,
                fontSize: 12, fontWeight: 500,
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
