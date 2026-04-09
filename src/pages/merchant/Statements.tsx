import { useState } from 'react'
import { FileText, Download, ChevronRight, DollarSign, CreditCard, Percent, TrendingUp } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import portalData from '../../data/db/merchant_portal.json'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

const statements = portalData.statements as any[]

export default function Statements() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = statements[selectedIdx]
  if (!selected) return <div style={{ padding: 40, textAlign: 'center', color: '#94A3B8' }}>No statements available</div>

  const brandColors: Record<string, string> = { 'Visa': '#1A1F71', 'Mastercard': '#EB001B', 'Amex': '#006FCF', 'Discover': '#FF6600' }

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-16px -20px', overflow: 'hidden' }}>
      {/* Left: Statement List */}
      <div style={{ width: 300, minWidth: 300, background: 'white', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Monthly Statements</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{statements.length} statements available</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {statements.map((s: any, i: number) => {
            const isActive = selectedIdx === i
            return (
              <div key={s.month} onClick={() => setSelectedIdx(i)} style={{
                padding: '12px 16px', cursor: 'pointer',
                borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06), transparent)' : 'transparent',
                borderBottom: '1px solid #F8FAFC',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={14} color={isActive ? '#1578F7' : '#94A3B8'} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#1578F7' : '#0F172A' }}>{s.month}</span>
                  </div>
                  <ChevronRight size={12} color="#CBD5E1" style={{ opacity: isActive ? 1 : 0 }} />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#94A3B8', fontWeight: 500, paddingLeft: 22 }}>
                  <span>Vol: <span style={{ color: '#334155', fontWeight: 600 }}>${s.volume.toLocaleString()}</span></span>
                  <span>Net: <span style={{ color: '#059669', fontWeight: 600 }}>${s.net.toLocaleString()}</span></span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Statement Detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 140px)' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{selected.month}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>
                Generated {selected.date} &middot; {selected.pages} pages &middot; Source: DuckDB
              </div>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}><Download size={14} /> Download PDF</button>
          </div>

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {[
              { label: 'Total Volume', value: `$${selected.volume.toLocaleString()}`, icon: DollarSign, color: '#1578F7' },
              { label: 'Total Fees', value: `$${selected.fees.toLocaleString()}`, icon: Percent, color: '#EF4444' },
              { label: 'Net Deposit', value: `$${selected.net.toLocaleString()}`, icon: TrendingUp, color: '#10B981' },
              { label: 'Transactions', value: selected.txnCount.toLocaleString(), icon: CreditCard, color: '#4F46E5' },
              { label: 'Avg Ticket', value: `$${selected.avgTicket.toFixed(2)}`, icon: DollarSign, color: '#0891B2' },
              { label: 'Effective Rate', value: `${selected.effectiveRate}%`, icon: Percent, color: '#F59E0B' },
            ].map(kpi => (
              <div key={kpi.label} className="kpi-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <kpi.icon size={12} color={kpi.color} />
                  <span className="kpi-label" style={{ margin: 0 }}>{kpi.label}</span>
                </div>
                <div className="kpi-value" style={{ fontSize: 18, color: kpi.color }}>{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Daily Volume" />
              <div style={{ padding: '0 16px 16px', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selected.dailyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                    <Bar dataKey="vol" fill="#1578F7" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Card Brand Breakdown" />
              <div style={{ padding: '0 16px 16px' }}>
                {(selected.cardBreakdown || []).map((cb: any) => (
                  <div key={cb.brand} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: brandColors[cb.brand] ?? '#94A3B8', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', width: 80 }}>{cb.brand}</span>
                    <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${cb.pct}%`, height: '100%', background: brandColors[cb.brand] ?? '#94A3B8', borderRadius: 3 }} />
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 60 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>${cb.volume.toLocaleString()}</div>
                      <div style={{ fontSize: 9, color: '#94A3B8' }}>{cb.txns} txns ({cb.pct}%)</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Fee Breakdown */}
          <Card noPadding>
            <CardHeader title="Fee Breakdown" subtitle={`Total fees: $${selected.fees.toLocaleString()} (${selected.effectiveRate}% effective rate)`} />
            <div style={{ padding: '0 16px 16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                {(selected.feeBreakdown || []).map((f: any) => (
                  <div key={f.category} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, border: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{f.category}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{f.pct}% of total</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>${f.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Adjustments + Performance + Settlement */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Adjustments" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Refunds', value: `$${selected.refunds.toFixed(2)}`, color: '#F59E0B' },
                  { label: 'Chargebacks', value: selected.chargebacks > 0 ? `$${selected.chargebacks.toFixed(2)}` : 'None', color: selected.chargebacks > 0 ? '#EF4444' : '#10B981' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card noPadding>
              <CardHeader title="Performance" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Approval Rate', value: `${selected.approvalRate}%` },
                  { label: 'Avg Ticket', value: `$${selected.avgTicket.toFixed(2)}` },
                  { label: 'Txns/Day', value: String(Math.round(selected.txnCount / 28)) },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B' }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: '#0F172A' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card noPadding>
              <CardHeader title="Settlement" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Bank', value: 'Chase ****8834' },
                  { label: 'Settlement', value: 'Same-day' },
                  { label: 'Data Source', value: 'DuckDB' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.value}</span>
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
