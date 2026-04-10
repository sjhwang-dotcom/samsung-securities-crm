import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts'
import { Users, DollarSign, TrendingUp, UserMinus, AlertTriangle, Zap, Clock, ShieldCheck, ArrowUpRight, Package } from 'lucide-react'
import { volumeData, categoryMixData, atRiskMerchants, recentActivity, isoPortfolio } from '../data/mockData'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable, ActivityFeed } from '../components/ui'
import WaterfallChart from '../components/ui/WaterfallChart'
import type { Column } from '../components/ui'

/* ─── Data from DB ─── */

// Health matrix derived from ISO portfolio data
const healthMatrix = isoPortfolio.map(iso => {
  const churnVal = parseFloat(iso.churn)
  return {
    iso: iso.name,
    revenue: 'Strong',
    margin: 'Strong',
    churn: churnVal > 2.5 ? 'Watch' : churnVal > 1.5 ? 'Good' : 'Strong',
    volume: 'Strong',
    compliance: churnVal > 3 ? 'Good' : 'Strong',
  }
})

// ISO volume from portfolio
const isoVolumeData = isoPortfolio.map(iso => ({
  name: iso.name.replace(' Payments', '').replace(' Processing', ''),
  value: parseFloat(iso.volume.replace(/[$M]/g, '')),
}))

// Waterfall: each bar has invisible base + visible delta
// Starting=28.5, +1.8 Organic, +1.2 Zenith, +0.8 Products, -0.2 Churn, =32.1 Current
// Waterfall data for ApexCharts rangeBar
const waterfallData = [
  { category: 'Starting', value: 28.5, type: 'total' as const },
  { category: 'Organic', value: 1.8, type: 'delta' as const },
  { category: 'ISO Acquisition', value: 1.2, type: 'delta' as const },
  { category: 'Products', value: 0.8, type: 'delta' as const },
  { category: 'Churn', value: -0.2, type: 'delta' as const },
  { category: 'Current', value: 32.1, type: 'total' as const },
]

const tooltipStyle = {
  borderRadius: 10,
  fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
  backdropFilter: 'blur(8px)',
}


type HealthLevel = 'Strong' | 'Good' | 'Watch' | 'Weak'
const healthVariant: Record<HealthLevel, 'emerald' | 'teal' | 'amber' | 'rose'> = {
  Strong: 'emerald',
  Good: 'teal',
  Watch: 'amber',
  Weak: 'rose',
}

type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INACTIVE'
const severityVariant: Record<SeverityLevel, 'critical' | 'high' | 'moderate' | 'inactive'> = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MODERATE: 'moderate',
  INACTIVE: 'inactive',
}

/* ─── ISO Table Columns ─── */
type IsoRow = { name: string; merchants: string; volume: string; churn: string; penetration: string; status: string; statusColor: string }

const isoColumns: Column<IsoRow>[] = [
  { key: 'name', header: 'ISO Name', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.name}</span> },
  { key: 'merchants', header: 'Merchants', align: 'center' },
  { key: 'volume', header: 'Monthly Volume', align: 'center', render: (r) => <span style={{ fontWeight: 600 }}>{r.volume}</span> },
  { key: 'churn', header: 'Churn', align: 'center', render: (r) => {
    const val = parseFloat(r.churn)
    return <span style={{ color: val > 2.5 ? '#E11D48' : val > 1.5 ? '#D97706' : '#059669', fontWeight: 600 }}>{r.churn}</span>
  }},
  { key: 'penetration', header: 'Products', align: 'center' },
  { key: 'status', header: 'Status', align: 'center', render: (r) => (
    <StatusBadge variant={r.statusColor === 'teal' ? 'primary' : 'emerald'} size="sm">{r.status}</StatusBadge>
  )},
]

/* ─── Component ─── */

export default function Dashboard() {
  return (
    <div className="dashboard-grid">
      {/* ═══ KPI Row 1 ═══ */}
      <div className="kpi-row">
        <KpiCard icon={Users} label="Total Merchants" value="4,612" sub="Across 3 ISOs" color="teal" trend="3.2%" trendDirection="up" trendPositive />
        <KpiCard icon={DollarSign} label="Monthly Volume" value="$32.1M" sub="Trailing 30 days" color="blue" trend="8.4%" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingUp} label="Monthly Residuals" value="$3.21M" sub="Net revenue" color="emerald" trend="5.2%" trendDirection="up" trendPositive />
        <KpiCard icon={UserMinus} label="Portfolio Churn" value="1.4%" sub="vs 2.1% prior month" color="emerald" trend="0.4%" trendDirection="down" trendPositive />
        <KpiCard icon={AlertTriangle} label="Chargeback Rate" value="0.35%" sub="Visa threshold: 1.0%" color="amber" trend="0.02%" trendDirection="down" trendPositive />
      </div>

      {/* ═══ KPI Row 2 ═══ */}
      <div className="kpi-row">
        <KpiCard icon={ShieldCheck} label="Auto-Approve Rate" value="60.9%" sub="14 of 23 apps" color="blue" />
        <KpiCard icon={Package} label="Product Penetration" value="4.7%" sub="Avg across 8 products" color="purple" />
        <KpiCard icon={Zap} label="AI Cost Efficiency" value="$498K" sub="monthly savings" color="indigo" />
        <KpiCard icon={Clock} label="Avg Onboard Time" value="2.3h" sub="vs 48h pre-AI" color="teal" />
        <KpiCard icon={ArrowUpRight} label="Revenue Growth YoY" value="+76.4%" sub="Year-over-year" color="emerald" trend="+76.4%" trendDirection="up" trendPositive />
      </div>

      {/* ═══ Health Matrix + Attrition Watch ═══ */}
      <div className="grid-2-1">
        {/* Health Matrix */}
        <Card>
          <CardHeader
            title="Portfolio Health Matrix"
            badge={<StatusBadge variant="live" dot pulse>Live</StatusBadge>}
            subtitle="2m ago"
            menu
          />
          <div className="health-matrix">
            {/* Legend */}
            <div className="health-legend">
              {(['Strong', 'Good', 'Watch', 'Weak'] as HealthLevel[]).map(level => (
                <span key={level} className="health-legend-item">
                  <StatusBadge variant={healthVariant[level]} size="sm">{level}</StatusBadge>
                </span>
              ))}
            </div>
            {/* Table */}
            <table className="harlow-table">
              <thead>
                <tr>
                  <th>ISO</th>
                  {['Revenue Growth', 'Residual Margin', 'Churn', 'Volume', 'Compliance'].map(h => (
                    <th key={h} style={{ textAlign: 'center' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {healthMatrix.map(row => (
                  <tr key={row.iso}>
                    <td style={{ fontWeight: 700, color: '#0F172A' }}>{row.iso}</td>
                    {[row.revenue, row.margin, row.churn, row.volume, row.compliance].map((val, i) => (
                      <td key={i} style={{ textAlign: 'center' }}>
                        <StatusBadge variant={healthVariant[val as HealthLevel]}>{val}</StatusBadge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Attrition Watch */}
        <Card>
          <CardHeader
            title="AI Attrition Watch"
            badge={<StatusBadge variant="rose" size="sm">6 flagged</StatusBadge>}
            menu
          />
          <div className="attrition-list">
            {atRiskMerchants.map(m => (
              <div key={m.name} className="attrition-item">
                <div className="attrition-left">
                  <div className="attrition-name">{m.name}</div>
                  <div className="attrition-meta">
                    <span>{m.volume}/mo</span>
                    <span className="attrition-trend">▼{m.trend}</span>
                  </div>
                  {m.name === 'Sunrise Deli' && (
                    <div className="attrition-rec">Recommended: Call immediately — offer rate review</div>
                  )}
                </div>
                <div className="attrition-right">
                  <span className="attrition-score" style={{
                    color: m.riskScore >= 80 ? '#E11D48' : m.riskScore >= 70 ? '#EA580C' : '#D97706'
                  }}>{m.riskScore}%</span>
                  <StatusBadge variant={severityVariant[m.severity as SeverityLevel]}>{m.severity}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══ Charts Row ═══ */}
      <div className="grid-3">
        {/* Volume by ISO */}
        <Card>
          <CardHeader title="Volume by ISO" badge={<StatusBadge variant="live" dot pulse>Live</StatusBadge>} />
          <div style={{ padding: '0 16px 16px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={isoVolumeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v}M`} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
                  {isoVolumeData.map((_, i) => (
                    <Cell key={i} fill={['#1578F7', '#10B981', '#F59E0B'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Portfolio Value Bridge — ApexCharts Waterfall */}
        <Card>
          <CardHeader title="Portfolio Value Bridge" subtitle="Q1 2026 → Q2 2026" menu />
          <div style={{ padding: '0 12px 8px' }}>
            <WaterfallChart data={waterfallData} height={200} />
          </div>
        </Card>

        {/* Category Mix */}
        <Card>
          <CardHeader title="Merchant Category Mix" subtitle="By MCC classification" menu />
          <div style={{ padding: '0 16px 16px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryMixData} innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {categoryMixData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <Legend iconType="circle" iconSize={6} wrapperStyle={{ fontSize: 10, fontWeight: 500 }} />
                <text x="50%" y="42%" textAnchor="middle" style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Inter', sans-serif", fill: '#0F172A' }}>4,612</text>
                <text x="50%" y="56%" textAnchor="middle" style={{ fontSize: 9, fontWeight: 500, fill: '#94a3b8' }}>merchants</text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ═══ Volume Trend + Activity ═══ */}
      <div className="grid-2-1">
        <Card>
          <CardHeader
            title="Processing Volume & Residuals"
            subtitle="Last 12 months"
            action={
              <div className="chart-legend">
                <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#1578F7' }} />Volume</span>
                <span className="chart-legend-item"><span className="chart-legend-dot" style={{ background: '#10B981' }} />Residuals</span>
              </div>
            }
          />
          <div style={{ padding: '0 16px 16px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="vgd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1578F7" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#1578F7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rgd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} width={45} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any, name: any) => [`$${v}M`, name]} />
                <Area type="monotone" dataKey="volume" stroke="#1578F7" fill="url(#vgd)" strokeWidth={2.5} name="Volume" dot={false} />
                <Area type="monotone" dataKey="residuals" stroke="#10B981" fill="url(#rgd)" strokeWidth={2} name="Residuals" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Recent Activity"
            action={<a href="#" className="card-view-all">View All →</a>}
          />
          <div style={{ padding: '0 16px 16px' }}>
            <ActivityFeed
              items={recentActivity.map(a => ({
                text: a.text,
                time: a.time,
                dot: 'green',
              }))}
            />
          </div>
        </Card>
      </div>

      {/* ═══ ISO Table ═══ */}
      <Card>
        <CardHeader
          title="ISO Portfolio Companies"
          action={<a href="#" className="card-view-all">View All →</a>}
        />
        <div style={{ padding: '0 16px 16px' }}>
          <DataTable<IsoRow> columns={isoColumns} data={isoPortfolio as unknown as IsoRow[]} />
        </div>
      </Card>
    </div>
  )
}
