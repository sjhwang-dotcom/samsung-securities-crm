import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { volumeData, processorDistribution, productPenetration, chargebackTrendData } from '../data/mockData'
import { Card, CardHeader, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

export default function PortfolioAnalytics() {
  type ProductRow = { product: string; enrolled: number; eligible: number; rate: string; revenue: string }

  const productColumns: Column<ProductRow>[] = [
    { key: 'product', header: 'Product', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.product}</span> },
    { key: 'enrolled', header: 'Enrolled', render: (r) => r.enrolled.toLocaleString() },
    { key: 'eligible', header: 'Eligible', render: (r) => r.eligible.toLocaleString() },
    { key: 'rate', header: 'Penetration', render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="progress-bar" style={{ width: 64 }}>
          <div className="progress-fill" style={{ width: r.rate, background: '#4F46E5' }} />
        </div>
        <span>{r.rate}</span>
      </div>
    )},
    { key: 'revenue', header: 'Monthly Revenue', render: (r) => <span style={{ fontWeight: 800, color: '#0F172A' }}>{r.revenue}</span> },
    { key: '', header: '', render: () => (
      <button style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>AI Recommend</button>
    )},
  ]

  return (
    <div className="dashboard-grid">
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <select style={{ fontSize: 13, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', outline: 'none' }}>
          <option>All ISOs</option><option>Harlow Direct</option><option>Zenith Payments</option><option>Liberty Processing</option>
        </select>
        <select style={{ fontSize: 13, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', outline: 'none' }}>
          <option>12 months</option><option>6 months</option><option>3 months</option>
        </select>
      </div>

      {/* Volume Trends */}
      <Card noPadding>
        <CardHeader title="Processing Volume Trend" />
        <div style={{ padding: '0 18px 18px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volGradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891B2" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0891B2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}M`} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #E2E8F0' }} />
              <Area type="monotone" dataKey="volume" stroke="#0891B2" fill="url(#volGradA)" strokeWidth={2} name="Volume ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Chargeback Rate Trend */}
        <Card noPadding>
          <CardHeader title="Chargeback Rate Trend" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chargebackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0, 1.8]} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: any) => `${v}%`} />
                <Line type="monotone" dataKey="visa" stroke="#F43F5E" strokeWidth={1} strokeDasharray="5 5" name="Visa Threshold" dot={false} />
                <Line type="monotone" dataKey="mc" stroke="#F59E0B" strokeWidth={1} strokeDasharray="5 5" name="MC Threshold" dot={false} />
                <Line type="monotone" dataKey="portfolio" stroke="#0891B2" strokeWidth={2} name="Portfolio Avg" dot={{ r: 3, fill: '#0891B2' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Processor Distribution */}
        <Card noPadding>
          <CardHeader title="Processor Distribution" />
          <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {processorDistribution.map(p => (
              <div key={p.name}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: '#334155' }}>{p.name}</span>
                  <span style={{ fontWeight: 500, color: '#64748B' }}>${p.volume}M ({p.pct}%)</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.pct}%`, background: '#1578F7' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Product Penetration */}
      <Card noPadding>
        <CardHeader title="Product Penetration" />
        <DataTable columns={productColumns} data={productPenetration as unknown as ProductRow[]} hoverable />
      </Card>

      {/* Roll-Up Value Creation */}
      <div className="grid-3">
        {[
          { name: 'Zenith Payments', churnBefore: '4.1%', churnAfter: '2.1%', revenue: '+$1.2M', days: '34 days' },
          { name: 'Liberty Processing', churnBefore: '5.8%', churnAfter: '3.4%', revenue: '+$640K', days: '28 days' },
          { name: 'Next Acquisition', churnBefore: '--', churnAfter: '--', revenue: '+$800K-$2M', days: '<30 days' },
        ].map(iso => (
          <Card key={iso.name}>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>{iso.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 500, color: '#64748B' }}>Churn</span><span style={{ fontWeight: 500, color: '#0F172A' }}>{iso.churnBefore} &rarr; {iso.churnAfter}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 500, color: '#64748B' }}>Product Revenue</span><span style={{ fontWeight: 800, color: '#059669' }}>{iso.revenue}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 500, color: '#64748B' }}>Onboarded in</span><span style={{ fontWeight: 500, color: '#0F172A' }}>{iso.days}</span></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
