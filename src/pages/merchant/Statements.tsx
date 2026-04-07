import { useState } from 'react'
import { FileText, Download, ChevronRight, DollarSign, CreditCard, Percent, TrendingUp } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

const statements = [
  {
    month: 'February 2026', date: 'Mar 5, 2026', pages: 4,
    volume: 47230, fees: 3124.80, net: 44105.20,
    txnCount: 1342, avgTicket: 35.19, refunds: 312.40, chargebacks: 0,
    effectiveRate: 2.69, approvalRate: 98.7,
    dailyBreakdown: [
      { day: '1', vol: 1820 }, { day: '5', vol: 2140 }, { day: '10', vol: 1950 },
      { day: '15', vol: 2310 }, { day: '20', vol: 2080 }, { day: '25', vol: 1760 }, { day: '28', vol: 1420 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 2124.80, pct: 68.0 },
      { category: 'Assessment', amount: 472.30, pct: 15.1 },
      { category: 'Processor Markup', amount: 378.20, pct: 12.1 },
      { category: 'Monthly Fee', amount: 9.95, pct: 0.3 },
      { category: 'PCI Compliance', amount: 9.95, pct: 0.3 },
      { category: 'Statement Fee', amount: 7.50, pct: 0.2 },
      { category: 'Batch Fee', amount: 122.10, pct: 3.9 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 604, volume: 24559.60, pct: 52 },
      { brand: 'Mastercard', txns: 376, volume: 13224.40, pct: 28 },
      { brand: 'Amex', txns: 188, volume: 6612.20, pct: 14 },
      { brand: 'Discover', txns: 174, volume: 2833.80, pct: 6 },
    ],
  },
  {
    month: 'January 2026', date: 'Feb 5, 2026', pages: 4,
    volume: 43610, fees: 2891.40, net: 40718.60,
    txnCount: 1238, avgTicket: 35.22, refunds: 287.10, chargebacks: 487.50,
    effectiveRate: 2.71, approvalRate: 98.4,
    dailyBreakdown: [
      { day: '1', vol: 1620 }, { day: '5', vol: 1940 }, { day: '10', vol: 1750 },
      { day: '15', vol: 2110 }, { day: '20', vol: 1880 }, { day: '25', vol: 1660 }, { day: '31', vol: 1320 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 1966.14, pct: 68.0 },
      { category: 'Assessment', amount: 436.10, pct: 15.1 },
      { category: 'Processor Markup', amount: 349.67, pct: 12.1 },
      { category: 'Monthly Fee', amount: 9.95, pct: 0.3 },
      { category: 'PCI Compliance', amount: 9.95, pct: 0.3 },
      { category: 'Statement Fee', amount: 7.50, pct: 0.2 },
      { category: 'Batch Fee', amount: 112.09, pct: 3.9 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 557, volume: 22677.20, pct: 52 },
      { brand: 'Mastercard', txns: 347, volume: 12210.80, pct: 28 },
      { brand: 'Amex', txns: 173, volume: 6105.40, pct: 14 },
      { brand: 'Discover', txns: 161, volume: 2616.60, pct: 6 },
    ],
  },
  {
    month: 'December 2025', date: 'Jan 5, 2026', pages: 4,
    volume: 51890, fees: 3442.10, net: 48447.90,
    txnCount: 1478, avgTicket: 35.11, refunds: 418.20, chargebacks: 0,
    effectiveRate: 2.68, approvalRate: 98.9,
    dailyBreakdown: [
      { day: '1', vol: 2020 }, { day: '5', vol: 2340 }, { day: '10', vol: 2150 },
      { day: '15', vol: 2510 }, { day: '20', vol: 2280 }, { day: '25', vol: 2960 }, { day: '31', vol: 1620 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 2340.65, pct: 68.0 },
      { category: 'Assessment', amount: 518.90, pct: 15.1 },
      { category: 'Processor Markup', amount: 416.39, pct: 12.1 },
      { category: 'Monthly Fee', amount: 9.95, pct: 0.3 },
      { category: 'PCI Compliance', amount: 9.95, pct: 0.3 },
      { category: 'Statement Fee', amount: 7.50, pct: 0.2 },
      { category: 'Batch Fee', amount: 138.76, pct: 3.9 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 665, volume: 26982.80, pct: 52 },
      { brand: 'Mastercard', txns: 414, volume: 14529.20, pct: 28 },
      { brand: 'Amex', txns: 207, volume: 7264.60, pct: 14 },
      { brand: 'Discover', txns: 192, volume: 3113.40, pct: 6 },
    ],
  },
  {
    month: 'November 2025', date: 'Dec 5, 2025', pages: 3,
    volume: 39220, fees: 2598.70, net: 36621.30,
    txnCount: 1116, avgTicket: 35.14, refunds: 195.60, chargebacks: 0,
    effectiveRate: 2.72, approvalRate: 98.5,
    dailyBreakdown: [
      { day: '1', vol: 1520 }, { day: '5', vol: 1740 }, { day: '10', vol: 1550 },
      { day: '15', vol: 1810 }, { day: '20', vol: 1480 }, { day: '25', vol: 1660 }, { day: '30', vol: 1220 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 1767.12, pct: 68.0 },
      { category: 'Assessment', amount: 392.20, pct: 15.1 },
      { category: 'Processor Markup', amount: 314.36, pct: 12.1 },
      { category: 'Monthly Fee', amount: 9.95, pct: 0.3 },
      { category: 'PCI Compliance', amount: 9.95, pct: 0.3 },
      { category: 'Statement Fee', amount: 7.50, pct: 0.2 },
      { category: 'Batch Fee', amount: 97.62, pct: 3.9 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 502, volume: 20394.40, pct: 52 },
      { brand: 'Mastercard', txns: 312, volume: 10981.60, pct: 28 },
      { brand: 'Amex', txns: 156, volume: 5490.80, pct: 14 },
      { brand: 'Discover', txns: 146, volume: 2353.20, pct: 6 },
    ],
  },
  {
    month: 'October 2025', date: 'Nov 5, 2025', pages: 3,
    volume: 41340, fees: 2740.50, net: 38599.50,
    txnCount: 1176, avgTicket: 35.15, refunds: 224.80, chargebacks: 0,
    effectiveRate: 2.70, approvalRate: 98.6,
    dailyBreakdown: [
      { day: '1', vol: 1620 }, { day: '5', vol: 1840 }, { day: '10', vol: 1650 },
      { day: '15', vol: 1910 }, { day: '20', vol: 1580 }, { day: '25', vol: 1760 }, { day: '31', vol: 1320 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 1878.54, pct: 68.5 },
      { category: 'Assessment', amount: 413.40, pct: 15.1 },
      { category: 'Processor Markup', amount: 299.34, pct: 10.9 },
      { category: 'Other', amount: 149.22, pct: 5.5 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 529, volume: 21496.80, pct: 52 },
      { brand: 'Mastercard', txns: 329, volume: 11575.20, pct: 28 },
      { brand: 'Amex', txns: 165, volume: 5787.60, pct: 14 },
      { brand: 'Discover', txns: 153, volume: 2480.40, pct: 6 },
    ],
  },
  {
    month: 'September 2025', date: 'Oct 5, 2025', pages: 3,
    volume: 38770, fees: 2570.90, net: 36199.10,
    txnCount: 1104, avgTicket: 35.12, refunds: 198.40, chargebacks: 0,
    effectiveRate: 2.73, approvalRate: 98.3,
    dailyBreakdown: [
      { day: '1', vol: 1420 }, { day: '5', vol: 1640 }, { day: '10', vol: 1450 },
      { day: '15', vol: 1710 }, { day: '20', vol: 1380 }, { day: '25', vol: 1560 }, { day: '30', vol: 1120 },
    ],
    feeBreakdown: [
      { category: 'Interchange', amount: 1761.61, pct: 68.5 },
      { category: 'Assessment', amount: 387.70, pct: 15.1 },
      { category: 'Processor Markup', amount: 280.78, pct: 10.9 },
      { category: 'Other', amount: 140.81, pct: 5.5 },
    ],
    cardBreakdown: [
      { brand: 'Visa', txns: 497, volume: 20160.40, pct: 52 },
      { brand: 'Mastercard', txns: 309, volume: 10855.60, pct: 28 },
      { brand: 'Amex', txns: 155, volume: 5427.80, pct: 14 },
      { brand: 'Discover', txns: 143, volume: 2326.20, pct: 6 },
    ],
  },
]

export default function Statements() {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const selected = statements[selectedIdx]

  const brandColors: Record<string, string> = { 'Visa': '#1A1F71', 'Mastercard': '#EB001B', 'Amex': '#006FCF', 'Discover': '#FF6600' }

  return (
    <div style={{ display: 'flex', gap: 0, margin: '-16px -20px', overflow: 'hidden' }}>
      {/* ═══ Left: Statement List ═══ */}
      <div style={{
        width: 300, minWidth: 300, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 140px)',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>Monthly Statements</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{statements.length} statements available</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {statements.map((s, i) => {
            const isActive = selectedIdx === i
            return (
              <div key={s.month} onClick={() => setSelectedIdx(i)}
                style={{
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

      {/* ═══ Right: Statement Detail ═══ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', height: 'calc(100vh - 140px)' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{selected.month}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>
                Generated {selected.date} &middot; {selected.pages} pages
              </div>
            </div>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
              background: '#1578F7', color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 12, cursor: 'pointer',
            }}>
              <Download size={14} /> Download PDF
            </button>
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

          {/* Volume Chart + Card Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Daily Volume" />
              <div style={{ padding: '0 16px 16px', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selected.dailyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v/1000).toFixed(1)}K`} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                    <Bar dataKey="vol" fill="#1578F7" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Card Brand Breakdown" />
              <div style={{ padding: '0 16px 16px' }}>
                {selected.cardBreakdown.map(cb => (
                  <div key={cb.brand} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: brandColors[cb.brand] ?? '#94A3B8', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', width: 80 }}>{cb.brand}</span>
                    <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${cb.pct}%`, height: '100%', background: brandColors[cb.brand] ?? '#94A3B8', borderRadius: 3 }} />
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 70 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {selected.feeBreakdown.map(f => (
                  <div key={f.category} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, border: '1px solid #F1F5F9',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{f.category}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{f.pct}% of total fees</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>${f.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Additional Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Card noPadding>
              <CardHeader title="Adjustments" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Refunds', value: `$${selected.refunds.toFixed(2)}`, color: '#F59E0B' },
                  { label: 'Chargebacks', value: selected.chargebacks > 0 ? `$${selected.chargebacks.toFixed(2)}` : 'None', color: selected.chargebacks > 0 ? '#EF4444' : '#10B981' },
                  { label: 'Reserves', value: '$0.00', color: '#94A3B8' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card noPadding>
              <CardHeader title="Performance" />
              <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Approval Rate', value: `${selected.approvalRate}%`, color: '#10B981' },
                  { label: 'Avg Ticket', value: `$${selected.avgTicket.toFixed(2)}`, color: '#0F172A' },
                  { label: 'Txns/Day', value: Math.round(selected.txnCount / 28).toString(), color: '#0F172A' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
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
                  { label: 'Statement ID', value: `STM-${selected.month.split(' ').reverse().join('-').replace(' ', '')}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#64748B', fontWeight: 500 }}>{item.label}</span>
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
