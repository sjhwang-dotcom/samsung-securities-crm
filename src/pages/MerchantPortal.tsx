import {
  DollarSign, TrendingUp, ChevronRight, Download,
  CheckCircle, Landmark, AlertTriangle, FileText, Monitor, ShieldCheck,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

const dailySalesData = [
  { day: 'Mon', sales: 4210 }, { day: 'Tue', sales: 3890 }, { day: 'Wed', sales: 4520 },
  { day: 'Thu', sales: 3150 }, { day: 'Fri', sales: 5340 }, { day: 'Sat', sales: 6120 }, { day: 'Sun', sales: 2980 },
]
const cardBrandData = [
  { name: 'Visa', value: 52, color: '#1A1F71' },
  { name: 'Mastercard', value: 28, color: '#EB001B' },
  { name: 'Amex', value: 14, color: '#006FCF' },
  { name: 'Discover', value: 6, color: '#FF6600' },
]
const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

type DepositRow = { date: string; settled: string; txns: number; amount: string }

/** Merchant Portal — Home (default route /portal) */
export default function MerchantPortal() {
  const deposits: DepositRow[] = [
    { date: 'Mar 14', settled: 'Same-day', txns: 134, amount: '$2,013.90' },
    { date: 'Mar 13', settled: 'Same-day', txns: 121, amount: '$1,795.50' },
    { date: 'Mar 12', settled: 'Same-day', txns: 98, amount: '$1,496.80' },
    { date: 'Mar 11', settled: 'Same-day', txns: 142, amount: '$2,155.80' },
    { date: 'Mar 10', settled: 'Same-day', txns: 118, amount: '$1,832.40' },
  ]
  const depCols: Column<DepositRow>[] = [
    { key: 'date', header: 'Date' },
    { key: 'settled', header: 'Settlement', render: (r) => <StatusBadge variant="emerald">{r.settled}</StatusBadge> },
    { key: 'txns', header: 'Txns' },
    { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.amount}</span> },
  ]

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
          Mario's Italian Kitchen &middot; MID 4400-1892-7731
        </div>
        <StatusBadge variant="live" dot pulse>Active</StatusBadge>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'This Month', value: '$47,230', sub: '\u25B2 8.2% vs Feb', subColor: '#059669', icon: TrendingUp, color: '#1578F7' },
          { label: 'Last Deposit', value: '$2,013.90', sub: 'Today \u00B7 Chase ****8834', subColor: '#94A3B8', icon: Landmark, color: '#3B82F6' },
          { label: 'Open Chargebacks', value: '1', sub: '$487.50 \u00B7 Due Mar 26', subColor: '#EF4444', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Approval Rate', value: '98.7%', sub: '\u25B2 0.3% vs last month', subColor: '#059669', icon: CheckCircle, color: '#10B981' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-icon" style={{ background: `${kpi.color}15`, width: 30, height: 30, borderRadius: 8, marginBottom: 6 }}>
              <kpi.icon size={14} color={kpi.color} strokeWidth={2} />
            </div>
            <div className="kpi-value" style={{ fontSize: 22 }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: kpi.subColor, marginTop: 2 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Funding Offer */}
      <div style={{ background: 'linear-gradient(135deg, #121212, #1578F7)', borderRadius: 10, padding: '18px 22px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>You're pre-approved for up to $25,000</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, fontWeight: 500 }}>Based on your processing volume &middot; Funds in 24-48 hours &middot; Rate as low as 1.15 factor</div>
        </div>
        <button style={{ background: '#1578F7', color: '#121212', fontWeight: 700, padding: '9px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>See My Offer</button>
      </div>

      {/* Activity + PCI/Equipment */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Recent Activity" />
          <div style={{ padding: '0 16px 16px' }}>
            <div className="activity-feed">
              {[
                { icon: Landmark, color: '#10B981', text: 'Deposit: $2,013.90', detail: 'Settlement \u2192 Chase ****8834', time: 'Today' },
                { icon: Landmark, color: '#10B981', text: 'Deposit: $1,795.50', detail: 'Settlement \u2192 Chase ****8834', time: 'Yesterday' },
                { icon: AlertTriangle, color: '#EF4444', text: 'Chargeback: $487.50', detail: 'Visa ****4821 \u00B7 Merchandise Not Received', time: 'Mar 12' },
                { icon: FileText, color: '#3B82F6', text: 'Statement Ready', detail: 'February 2026 available for download', time: 'Mar 5' },
                { icon: DollarSign, color: '#1578F7', text: 'Funding Repayment', detail: '$95.83/day \u00B7 Balance: $3,167.40', time: 'Daily' },
              ].map((item, i) => (
                <div key={i} className="activity-item" style={{ gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={12} color={item.color} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{item.detail}</div>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="dashboard-grid" style={{ gap: 10 }}>
          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <ShieldCheck size={16} color="#10B981" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>PCI Compliance</span>
              </div>
              <StatusBadge variant="emerald" size="md">Compliant</StatusBadge>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8, fontWeight: 500 }}>Valid through Dec 2026<br />SAQ-A completed &middot; DSS Level 1</div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Monitor size={16} color="#3B82F6" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Equipment</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>PAX A920</div>
              <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>Serial: A920-7821-0034<br />Firmware: v4.2.1 &middot; Up to date</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Daily Sales — March 2026" />
          <div style={{ padding: '0 16px 16px' }}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(1)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Bar dataKey="sales" fill="#1578F7" radius={[4, 4, 0, 0]} barSize={28} name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card noPadding>
          <CardHeader title="Card Brand Mix" />
          <div style={{ padding: '0 16px 16px' }}>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={cardBrandData} innerRadius={35} outerRadius={52} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {cardBrandData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {cardBrandData.map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.color }} />{b.name} {b.value}%
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Deposits + Statements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Recent Deposits" action={<button className="card-view-all">See all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>} />
          <DataTable columns={depCols} data={deposits as unknown as Record<string, unknown>[]} hoverable compact />
        </Card>
        <Card noPadding>
          <CardHeader title="Statements" />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['February 2026', 'January 2026', 'December 2025'].map(mo => (
              <div key={mo} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={14} color="#3B82F6" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{mo}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>PDF</div>
                </div>
                <Download size={12} color="#94A3B8" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
