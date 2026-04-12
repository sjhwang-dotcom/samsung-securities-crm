import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FileText, TrendingUp, Users, Eye } from 'lucide-react'
import { researchReports, clientNeeds } from '../data/mockData'
import { KpiCard, Card, CardHeader, DataTable, StatusBadge } from '../components/ui'
import type { Column } from '../components/ui'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)' }

// Sector distribution of reports
const sectorDist = (() => {
  const map: Record<string, number> = {}
  researchReports.forEach(r => { map[r.sector] = (map[r.sector] || 0) + 1 })
  const colors = ['#034EA2', '#2B7DE9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4']
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
})()

// Top analysts by open rate
const analystPerf = (() => {
  const map: Record<string, { reports: number; totalOpen: number }> = {}
  researchReports.forEach(r => {
    if (!map[r.analyst]) map[r.analyst] = { reports: 0, totalOpen: 0 }
    map[r.analyst].reports++
    map[r.analyst].totalOpen += r.openRate
  })
  return Object.entries(map).map(([name, d]) => ({
    name, reports: d.reports, avgOpenRate: +(d.totalOpen / d.reports * 100).toFixed(1),
  })).sort((a, b) => b.avgOpenRate - a.avgOpenRate)
})()

// Client response (which reports drove interactions)
const researchImpact = researchReports.slice(0, 8).map(r => ({
  title: r.title.length > 25 ? r.title.slice(0, 25) + '...' : r.title,
  openRate: +(r.openRate * 100).toFixed(0),
  distributions: r.distributionCount,
}))

const reportColumns: Column[] = [
  { key: 'title', label: '제목', width: '30%', render: (r: any) => <span style={{ fontWeight: 600, fontSize: 12 }}>{r.title}</span> },
  { key: 'analyst', label: '애널리스트', width: '12%' },
  { key: 'sector', label: '섹터', width: '10%' },
  { key: 'type', label: '유형', width: '8%' },
  { key: 'date', label: '발행일', width: '10%' },
  { key: 'recommendation', label: '의견', width: '8%', render: (r: any) => r.recommendation ? <StatusBadge status={r.recommendation} /> : <span style={{ color: '#94A3B8' }}>-</span> },
  { key: 'distributionCount', label: '배포', width: '8%' },
  { key: 'openRate', label: '오픈율', width: '8%', render: (r: any) => (
    <span style={{ fontWeight: 600, color: r.openRate >= 0.7 ? '#10B981' : r.openRate >= 0.5 ? '#F59E0B' : '#F43F5E' }}>{(r.openRate * 100).toFixed(0)}%</span>
  )},
]

export default function ResearchPortal() {
  const totalReports = researchReports.length
  const avgOpenRate = researchReports.reduce((s, r) => s + r.openRate, 0) / totalReports
  const totalDist = researchReports.reduce((s, r) => s + r.distributionCount, 0)
  const researchNeeds = clientNeeds.filter(n => n.category === '리서치요청').length

  return (
    <div className="dashboard-grid">
      <div className="kpi-row">
        <KpiCard label="발행 리포트" value={`${totalReports}건`} trend="+3건" trendDirection="up" trendPositive={true} icon={FileText} color="indigo" />
        <KpiCard label="평균 오픈율" value={`${(avgOpenRate * 100).toFixed(0)}%`} trend="+3.2%" trendDirection="up" trendPositive={true} icon={Eye} color="emerald" />
        <KpiCard label="총 배포 건수" value={`${totalDist}건`} trend="+12%" trendDirection="up" trendPositive={true} icon={Users} color="teal" />
        <KpiCard label="리서치 요청" value={`${researchNeeds}건`} trend="미충족" trendDirection="up" trendPositive={false} icon={TrendingUp} color="amber" />
      </div>

      {/* Report Impact Chart */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="리포트별 오픈율" subtitle="최근 발행 리포트 반응" />
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={researchImpact} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="title" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} angle={-15} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="openRate" fill="#034EA2" radius={[4, 4, 0, 0]} barSize={24} name="오픈율(%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sector Distribution */}
      <Card>
        <CardHeader title="섹터별 리포트 분포" />
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={sectorDist} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {sectorDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Analyst Performance */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader title="애널리스트 성과" subtitle="평균 오픈율 기준" />
        <div style={{ padding: '0 16px 16px' }}>
          {analystPerf.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</span>
                <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>{a.reports}건</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 80, height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                  <div style={{ width: `${a.avgOpenRate}%`, height: '100%', background: a.avgOpenRate >= 70 ? '#10B981' : '#F59E0B', borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, width: 40, textAlign: 'right' }}>{a.avgOpenRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Full Report Table */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="전체 리서치 리포트" subtitle="최근 발행순" />
        <DataTable columns={reportColumns} data={[...researchReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())} hoverable />
      </Card>
    </div>
  )
}
