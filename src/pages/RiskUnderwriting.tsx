import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Users, TrendingUp, AlertTriangle, Clock, ShieldCheck } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { riskDistribution, riskByMCC } from '../data/mockData'

export default function RiskUnderwriting() {
  type AlertRow = { name: string; score: number; from: number; change: number; trigger: string; action: string }

  const alertData: AlertRow[] = [
    { name: 'Sunrise Deli', score: 28, from: 65, change: -37, trigger: 'Volume drop 42% + chargeback spike', action: 'Immediate review' },
    { name: 'Metro Tobacco', score: 35, from: 58, change: -23, trigger: 'PCI non-compliant 90+ days', action: 'Compliance outreach' },
  ]

  const alertColumns: Column<AlertRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'score', header: 'Current Score', render: (r) => (
      <span>
        <span style={{ color: '#E11D48', fontWeight: 800 }}>{r.score}</span>
        <span style={{ color: '#94A3B8', fontSize: 12 }}> from {r.from}</span>
      </span>
    )},
    { key: 'change', header: 'Change', render: (r) => <span style={{ color: '#E11D48', fontWeight: 800 }}>{r.change}</span> },
    { key: 'trigger', header: 'Trigger' },
    { key: 'action', header: 'Recommended Action', render: (r) => <StatusBadge variant="rose">{r.action}</StatusBadge> },
  ]

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={Users} label="Applications This Month" value="23" color="teal" />
        <KpiCard icon={ShieldCheck} label="Auto-Approved" value="14 (60.9%)" color="emerald" trend="5%" trendDirection="up" trendPositive />
        <KpiCard icon={AlertTriangle} label="Referred to Human" value="7 (30.4%)" color="amber" trend="3%" trendDirection="down" trendPositive />
        <KpiCard icon={AlertTriangle} label="Declined" value="2 (8.7%)" color="rose" />
        <KpiCard icon={Clock} label="Avg Processing Time" value="2.3h" color="indigo" trend="vs 48h before AI" trendDirection="down" trendPositive />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Risk Score Distribution */}
        <Card noPadding>
          <CardHeader title="Risk Score Distribution" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} formatter={(v: number) => `${v}%`} />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]} name="Merchants">
                  {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk by MCC */}
        <Card noPadding>
          <CardHeader title="Risk by MCC Category" />
          <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {riskByMCC.map(m => (
              <div key={m.mcc}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 500, color: '#334155' }}>MCC {m.mcc} -- {m.label}</span>
                  <span style={{ fontWeight: 500, color: m.color }}>Avg: {m.avgScore}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${m.avgScore}%`, background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Monitoring Alerts */}
      <Card noPadding>
        <CardHeader title="Active Monitoring Alerts" />
        <DataTable columns={alertColumns} data={alertData} hoverable />
      </Card>

      {/* Model Performance */}
      <Card noPadding>
        <CardHeader title="Model Performance" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Precision', value: '94.2%', color: '#059669' },
              { label: 'Recall', value: '91.8%', color: '#059669' },
              { label: 'False Positive Rate', value: '2.1%', color: '#D97706' },
              { label: 'False Negative Rate', value: '0.8%', color: '#059669' },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center', padding: 16, background: '#FAFBFC', borderRadius: 12 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 12, textAlign: 'center' }}>Model trained on 50K+ merchant profiles, updated weekly</div>
        </div>
      </Card>
    </div>
  )
}
