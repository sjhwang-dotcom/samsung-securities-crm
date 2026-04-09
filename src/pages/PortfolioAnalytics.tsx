import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie, Legend,
} from 'recharts'
import {
  volumeData, categoryMixData, isoPortfolio, processorDistribution,
  productPenetration, chargebackTrendData, riskDistribution, riskByMCC,
} from '../data/mockData'
import WaterfallChart from '../components/ui/WaterfallChart'
import { Card, CardHeader, StatusBadge, KpiCard, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import {
  ShieldCheck, TrendingUp, DollarSign, BarChart3, Users, Activity,
  Zap, Target, AlertTriangle, ArrowUpRight, Package,
} from 'lucide-react'

/* ─── Tooltip style (shared) ─── */
const tooltipStyle = {
  borderRadius: 10,
  fontSize: 11,
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

/* ─── Colors ─── */
const BRAND = '#1578F7'
const SUCCESS = '#10B981'
const WARNING = '#F59E0B'
const DANGER = '#F43F5E'

/* ─── Health Scorecard Data ─── */
const healthDimensions = [
  { label: 'Revenue Growth', score: 91, color: SUCCESS },
  { label: 'Margin', score: 84, color: BRAND },
  { label: 'Churn', score: 88, color: SUCCESS },
  { label: 'Volume Stability', score: 82, color: BRAND },
  { label: 'Compliance', score: 90, color: SUCCESS },
]
const overallHealthScore = Math.round(healthDimensions.reduce((s, d) => s + d.score, 0) / healthDimensions.length)

/* ─── Waterfall Data (ApexCharts format) ─── */
const apexWaterfallData = [
  { category: 'Starting', value: 28.5, type: 'total' as const },
  { category: 'Organic', value: 1.8, type: 'delta' as const },
  { category: 'Zenith Acq.', value: 1.2, type: 'delta' as const },
  { category: 'Product Rev', value: 0.8, type: 'delta' as const },
  { category: 'Churn Loss', value: -0.4, type: 'delta' as const },
  { category: 'Current', value: 32.1, type: 'total' as const },
]

/* ─── Processor colors ─── */
const processorColors = [BRAND, SUCCESS, WARNING, '#8B5CF6', '#64748B']

export default function PortfolioAnalytics() {
  type ProductRow = { product: string; enrolled: number; eligible: number; rate: string; revenue: string }

  const productColumns: Column<ProductRow>[] = [
    { key: 'product', header: 'Product', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.product}</span> },
    { key: 'enrolled', header: 'Enrolled', render: (r) => r.enrolled.toLocaleString() },
    { key: 'eligible', header: 'Eligible', render: (r) => r.eligible.toLocaleString() },
    { key: 'rate', header: 'Penetration', render: (r) => {
      const pct = parseFloat(r.rate)
      const barColor = pct >= 70 ? SUCCESS : pct >= 40 ? WARNING : DANGER
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="progress-bar" style={{ width: 80, height: 6 }}>
            <div className="progress-fill" style={{ width: r.rate, background: barColor, borderRadius: 3 }} />
          </div>
          <span style={{ fontWeight: 600, fontSize: 12 }}>{r.rate}</span>
        </div>
      )
    }},
    { key: 'revenue', header: 'Monthly Revenue', render: (r) => <span style={{ fontWeight: 800, color: '#0F172A' }}>{r.revenue}</span> },
    { key: '', header: '', render: () => (
      <button style={{ fontSize: 11, color: BRAND, fontWeight: 600, background: '#EFF6FF', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer' }}>
        <Zap size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />AI Recommend
      </button>
    )},
  ]

  return (
    <div className="dashboard-grid">
      {/* ═══ Filters ═══ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShieldCheck size={20} color={BRAND} />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Agentic Portfolio Intelligence</span>
          <StatusBadge variant="live" dot pulse>Live</StatusBadge>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <select style={{ fontSize: 12, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', outline: 'none', color: '#334155', fontWeight: 500 }}>
            <option>All ISOs</option><option>Harlow Direct</option><option>Zenith Payments</option><option>Liberty Processing</option>
          </select>
          <select style={{ fontSize: 12, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '6px 12px', outline: 'none', color: '#334155', fontWeight: 500 }}>
            <option>12 months</option><option>6 months</option><option>3 months</option>
          </select>
        </div>
      </div>

      {/* ═══ 1. Portfolio Health Scorecard ═══ */}
      <Card noPadding>
        <div style={{ padding: 24, display: 'flex', gap: 40, alignItems: 'center' }}>
          {/* Left: Big score ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 140 }}>
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: `conic-gradient(${SUCCESS} ${overallHealthScore * 3.6}deg, #F1F5F9 0deg)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{
                width: 86, height: 86, borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>{overallHealthScore}</span>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>/100</span>
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginTop: 8 }}>Health Score</span>
            <StatusBadge variant="emerald" size="sm">Excellent</StatusBadge>
          </div>

          {/* Right: Dimension gauges */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {healthDimensions.map(d => (
              <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{d.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{d.score}</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.score}%`, background: d.color, borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ═══ 2. KPI Row ═══ */}
      <div className="grid-6">
        <KpiCard label="Total Portfolio Value" value="$32.1M" icon={DollarSign} color="teal" trend="8.4%" trendDirection="up" trendPositive />
        <KpiCard label="Monthly Volume" value="$32.1M" icon={BarChart3} color="indigo" trend="12.6%" trendDirection="up" trendPositive />
        <KpiCard label="Monthly Residuals" value="$3.2M" icon={TrendingUp} color="emerald" trend="5.2%" trendDirection="up" trendPositive />
        <KpiCard label="YoY Growth" value="24.8%" icon={ArrowUpRight} color="blue" trend="3.1%" trendDirection="up" trendPositive />
        <KpiCard label="Avg Churn" value="1.4%" icon={Users} color="amber" trend="0.4%" trendDirection="down" trendPositive />
        <KpiCard label="Product Penetration" value="62%" icon={Package} color="purple" trend="8%" trendDirection="up" trendPositive />
      </div>

      {/* ═══ 3. Volume Waterfall + ISO Comparison ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Volume Waterfall */}
        <Card noPadding>
          <CardHeader title="Portfolio Value Bridge" subtitle="Q4 2025 -> Current" />
          <div style={{ padding: '0 12px 8px' }}>
            <WaterfallChart data={apexWaterfallData} height={260} />
          </div>
        </Card>

        {/* ═══ 4. ISO Comparison ═══ */}
        <Card noPadding>
          <CardHeader title="ISO Performance Comparison" />
          <div style={{ padding: '0 18px 18px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>ISO</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>Volume</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>Merchants</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>Churn</th>
                  <th style={{ textAlign: 'left', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>Penetration</th>
                  <th style={{ textAlign: 'right', padding: '8px 6px', color: '#64748B', fontWeight: 600, borderBottom: '1px solid #F1F5F9' }}>Residuals</th>
                </tr>
              </thead>
              <tbody>
                {isoPortfolio.map((iso, idx) => {
                  const churnNum = parseFloat(iso.churn)
                  const penNum = parseFloat(iso.penetration)
                  const churnColor = churnNum <= 1.5 ? SUCCESS : churnNum <= 3 ? WARNING : DANGER
                  const penColor = penNum >= 60 ? SUCCESS : penNum >= 40 ? WARNING : DANGER
                  const residuals = ['$1.8M', '$940K', '$460K'][idx] ?? '$0'
                  return (
                    <tr key={iso.name} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '10px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{iso.name}</span>
                          <StatusBadge variant={iso.statusColor}>{iso.status}</StatusBadge>
                        </div>
                      </td>
                      <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>{iso.volume}</td>
                      <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 500, color: '#334155' }}>{iso.merchants}</td>
                      <td style={{ padding: '10px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 48, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.min(churnNum * 20, 100)}%`, background: churnColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 600, color: churnColor, fontSize: 11 }}>{iso.churn}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 48, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${penNum}%`, background: penColor, borderRadius: 3 }} />
                          </div>
                          <span style={{ fontWeight: 600, color: penColor, fontSize: 11 }}>{iso.penetration}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 6px', textAlign: 'right', fontWeight: 800, color: SUCCESS }}>{residuals}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ═══ 5. Volume & Residuals Trend ═══ */}
      <Card noPadding>
        <CardHeader title="Volume & Residuals Trend" subtitle="12-month trailing" menu />
        <div style={{ padding: '0 18px 18px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="piVolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="piResGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SUCCESS} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={SUCCESS} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}M`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v}M`} />
              <Legend verticalAlign="top" height={30} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
              <Area yAxisId="left" type="monotone" dataKey="volume" stroke={BRAND} fill="url(#piVolGrad)" strokeWidth={2} name="Volume ($M)" dot={{ r: 2, fill: BRAND }} />
              <Area yAxisId="right" type="monotone" dataKey="residuals" stroke={SUCCESS} fill="url(#piResGrad)" strokeWidth={2} name="Residuals ($M)" dot={{ r: 2, fill: SUCCESS }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ═══ 6. Chargeback Trend + 7. Processor Distribution ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Chargeback Rate Trend" subtitle="vs. Network Thresholds" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chargebackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} domain={[0, 1.8]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="visa" stroke={DANGER} strokeWidth={1} strokeDasharray="5 5" name="Visa Threshold" dot={false} />
                <Line type="monotone" dataKey="mc" stroke={WARNING} strokeWidth={1} strokeDasharray="5 5" name="MC Threshold" dot={false} />
                <Line type="monotone" dataKey="portfolio" stroke={BRAND} strokeWidth={2.5} name="Portfolio Avg" dot={{ r: 3, fill: BRAND }} activeDot={{ r: 5, fill: BRAND }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Processor Distribution" subtitle="Volume allocation" />
          <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {processorDistribution.map((p, i) => (
              <div key={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: processorColors[i % processorColors.length] }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>${p.volume}M <span style={{ fontWeight: 400, color: '#94A3B8' }}>({p.pct}%)</span></span>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.pct}%`, background: processorColors[i % processorColors.length], borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ═══ 8. Product Penetration ═══ */}
      <Card noPadding>
        <CardHeader title="Product Penetration" badge={<StatusBadge variant="blue"><Target size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />Enrollment Rates</StatusBadge>} menu />
        <DataTable columns={productColumns} data={productPenetration as unknown as ProductRow[]} hoverable />
      </Card>

      {/* ═══ 9. Category Mix + 10. Risk Heat Map ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Category Mix Donut */}
        <Card noPadding>
          <CardHeader title="Merchant Category Mix" />
          <div style={{ padding: '0 18px 18px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="50%" height={240}>
              <PieChart>
                <Pie data={categoryMixData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} strokeWidth={0}>
                  {categoryMixData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {categoryMixData.map(c => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, color: '#334155', fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontWeight: 700, color: '#0F172A' }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk Heat Map */}
        <Card noPadding>
          <CardHeader title="Risk Heat Map" badge={<StatusBadge variant="amber"><AlertTriangle size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />By MCC</StatusBadge>} />
          <div style={{ padding: '0 18px 18px' }}>
            {/* Risk distribution summary */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {riskDistribution.map(r => (
                <div key={r.label} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: `${r.color}15`, borderRadius: 8, border: `1px solid ${r.color}30` }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: r.color }}>{r.pct}%</div>
                  <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>{r.label}</div>
                </div>
              ))}
            </div>
            {/* MCC risk grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {riskByMCC.map(m => {
                const heatColor = m.avgScore < 50 ? DANGER : m.avgScore < 60 ? WARNING : m.avgScore < 70 ? '#EAB308' : SUCCESS
                return (
                  <div key={m.mcc} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                    <span style={{ width: 36, fontWeight: 500, color: '#94A3B8', fontFamily: 'monospace', fontSize: 11 }}>{m.mcc}</span>
                    <span style={{ width: 80, fontWeight: 600, color: '#334155' }}>{m.label}</span>
                    <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${m.avgScore}%`, background: heatColor, borderRadius: 4 }} />
                    </div>
                    <span style={{ width: 28, fontWeight: 700, color: heatColor, textAlign: 'right', fontSize: 11 }}>{m.avgScore}</span>
                    <Activity size={12} color={heatColor} />
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
