import { AlertTriangle, ShieldAlert, DollarSign, Eye } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { atRiskClients } from '../data/mockData'
import type { AtRiskClient } from '../types'

const tooltipStyle = {
  borderRadius: 10, fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
}

// Risk score distribution histogram
const riskHistogram = (() => {
  const ranges = [
    { range: '60-70', min: 60, max: 70, count: 0, color: '#F59E0B' },
    { range: '70-80', min: 70, max: 80, count: 0, color: '#FB923C' },
    { range: '80-90', min: 80, max: 90, count: 0, color: '#F43F5E' },
    { range: '90-100', min: 90, max: 100, count: 0, color: '#DC2626' },
  ]
  atRiskClients.forEach(c => {
    const r = ranges.find(r => c.riskScore >= r.min && c.riskScore < r.max)
    if (r) r.count++
    else if (c.riskScore === 100) ranges[3].count++
  })
  return ranges
})()

const riskColumns: Column<AtRiskClient>[] = [
  { key: 'name', header: '기관명', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span>
  )},
  { key: 'riskScore', header: '위험점수', width: '120px', render: (r) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 60, height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden',
      }}>
        <div style={{
          width: `${r.riskScore}%`, height: '100%', borderRadius: 3,
          background: r.riskScore >= 85 ? '#DC2626' : r.riskScore >= 75 ? '#F43F5E' : r.riskScore >= 65 ? '#F59E0B' : '#94A3B8',
        }} />
      </div>
      <span style={{
        fontWeight: 700, fontSize: 13,
        color: r.riskScore >= 85 ? '#DC2626' : r.riskScore >= 75 ? '#F43F5E' : '#F59E0B',
      }}>
        {r.riskScore}
      </span>
    </div>
  )},
  { key: 'severity', header: '등급', width: '90px', render: (r) => (
    <StatusBadge
      variant={r.severity === 'CRITICAL' ? 'critical' : r.severity === 'WARNING' ? 'high' : 'moderate'}
      dot
      pulse={r.severity === 'CRITICAL'}
    >
      {r.severity}
    </StatusBadge>
  )},
  { key: 'factors', header: '위험 요인', width: '200px', render: (r) => {
    const factors = [
      { label: '참여', value: r.factors.engagement, color: '#3B82F6' },
      { label: '수익', value: r.factors.revenueTrajectory, color: '#10B981' },
      { label: '보트', value: r.factors.brokerVoteSignal, color: '#8B5CF6' },
      { label: '경쟁', value: r.factors.competitivePressure, color: '#F59E0B' },
      { label: '커버', value: r.factors.coverageGap, color: '#F43F5E' },
      { label: '인사', value: r.factors.personnelChange, color: '#06B6D4' },
    ]
    const total = factors.reduce((s, f) => s + f.value, 0)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', width: '100%' }}>
          {factors.map(f => (
            <div key={f.label} style={{
              width: `${(f.value / total) * 100}%`,
              background: f.color,
              minWidth: f.value > 0 ? 2 : 0,
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {factors.filter(f => f.value > 15).map(f => (
            <span key={f.label} style={{ fontSize: 9, color: f.color, fontWeight: 600 }}>
              {f.label} {f.value}%
            </span>
          ))}
        </div>
      </div>
    )
  }},
  { key: 'recommendation', header: '추천 액션', render: (r) => (
    <span style={{ fontSize: 11, color: '#475569' }}>
      {r.recommendation.length > 50 ? r.recommendation.slice(0, 50) + '...' : r.recommendation}
    </span>
  )},
  { key: 'trend', header: '추이', width: '80px', render: (r) => {
    const diff = r.riskScore - r.previousRiskScore
    return (
      <span style={{ fontWeight: 600, color: diff > 0 ? '#E11D48' : diff < 0 ? '#059669' : '#64748B' }}>
        {diff > 0 ? '+' : ''}{diff} {r.trend}
      </span>
    )
  }},
]

export default function AttritionWarning() {
  const totalAtRisk = atRiskClients.length
  const criticalCount = atRiskClients.filter(c => c.severity === 'CRITICAL').length
  const warningCount = atRiskClients.filter(c => c.severity === 'WARNING').length

  const sortedClients = [...atRiskClients].sort((a, b) => b.riskScore - a.riskScore)

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={AlertTriangle} label="이탈 위험" value={`${totalAtRisk}곳`} color="amber" trend={`WARNING ${warningCount}곳`} trendDirection="up" trendPositive={false} />
        <KpiCard icon={ShieldAlert} label="CRITICAL" value={`${criticalCount}곳`} color="rose" trend="즉시 대응 필요" trendDirection="up" trendPositive={false} />
        <KpiCard icon={DollarSign} label="위험 수수료" value="2.5억/월" color="indigo" trend="전체 대비 15%" trendDirection="down" trendPositive={false} />
        <KpiCard icon={Eye} label="조기 감지율" value="85%" color="emerald" trend="+5% 전분기 대비" trendDirection="up" trendPositive />
      </div>

      {/* Risk Score Distribution — 2 cols */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="위험 점수 분포" subtitle="이탈 위험 고객 점수대별 분포" />
        <div style={{ height: 180 }}>
          <ResponsiveContainer>
            <BarChart data={riskHistogram} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}곳`, '고객수']} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
                {riskHistogram.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Risk Factor Summary — 1 col */}
      <Card>
        <CardHeader title="위험 요인 가중치" subtitle="이탈 예측 모델" />
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { factor: '참여도 감소', weight: 25, color: '#034EA2' },
            { factor: '수익 궤적', weight: 25, color: '#2B7DE9' },
            { factor: '보트 신호', weight: 20, color: '#F59E0B' },
            { factor: '경쟁 압력', weight: 15, color: '#F43F5E' },
            { factor: '커버리지 갭', weight: 10, color: '#8B5CF6' },
            { factor: '인사 변동', weight: 5, color: '#94A3B8' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 11, color: '#475569', width: 70, fontWeight: 500 }}>{f.factor}</span>
              <div style={{ flex: 1, height: 16, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${f.weight * 3}%`, height: '100%', background: f.color, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                  <span style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>{f.weight}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* At-Risk Clients Table — full width */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader
          title="이탈 위험 고객"
          subtitle={`총 ${totalAtRisk}곳`}
          badge={
            <StatusBadge variant="critical" dot pulse>
              CRITICAL {criticalCount}곳
            </StatusBadge>
          }
        />
        <DataTable columns={riskColumns} data={sortedClients} hoverable />
      </Card>
    </div>
  )
}
