import { Calendar, Users, Star, DollarSign } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { corporateAccessEvents } from '../data/mockData'
import type { CorporateAccessEvent } from '../types'

const tooltipStyle = {
  borderRadius: 10, fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
}

const eventColumns: Column<CorporateAccessEvent>[] = [
  { key: 'company', header: '기업', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.company}</span>
  )},
  { key: 'type', header: '유형', render: (r) => (
    <StatusBadge variant={
      r.type === 'NDR' ? 'blue' : r.type === 'Conference' ? 'purple' :
      r.type === '1:1 Meeting' ? 'emerald' : r.type === 'Site Visit' ? 'amber' : 'teal'
    }>
      {r.type}
    </StatusBadge>
  )},
  { key: 'date', header: '일자', width: '100px' },
  { key: 'status', header: '상태', width: '80px', render: (r) => (
    <StatusBadge variant={r.status === '완료' ? 'emerald' : r.status === '예정' ? 'blue' : 'rose'} dot>
      {r.status}
    </StatusBadge>
  )},
  { key: 'invitedCount', header: '초대', width: '60px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 600, color: '#64748B' }}>{r.invitedCount}</span>
  )},
  { key: 'attendedCount', header: '참석', width: '60px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.attendedCount}</span>
  )},
  { key: 'feedbackScore', header: '피드백', width: '70px', align: 'center', render: (r) => r.feedbackScore ? (
    <span style={{ fontWeight: 700, color: r.feedbackScore >= 4 ? '#059669' : r.feedbackScore >= 3 ? '#F59E0B' : '#E11D48' }}>
      {r.feedbackScore.toFixed(1)}
    </span>
  ) : <span style={{ color: '#94A3B8' }}>-</span> },
  { key: 'cost', header: '비용', width: '80px', align: 'right', render: (r) => (
    <span style={{ fontWeight: 600, color: '#334155' }}>{r.cost.toLocaleString()}만원</span>
  )},
]

// Event type distribution
const typeColors: Record<string, string> = {
  NDR: '#034EA2', Conference: '#8B5CF6', '1:1 Meeting': '#10B981',
  'Site Visit': '#F59E0B', 'Expert Call': '#06B6D4',
}
const typeDistribution = (() => {
  const map: Record<string, number> = {}
  corporateAccessEvents.forEach(e => {
    map[e.type] = (map[e.type] || 0) + 1
  })
  return Object.entries(map).map(([name, value]) => ({
    name, value, color: typeColors[name] || '#94A3B8',
  }))
})()

export default function CorporateAccess() {
  const totalEvents = corporateAccessEvents.length
  const completedEvents = corporateAccessEvents.filter(e => e.status === '완료')
  const totalAttended = completedEvents.reduce((s, e) => s + e.attendedCount, 0)
  const totalInvited = completedEvents.reduce((s, e) => s + e.invitedCount, 0)
  const attendanceRate = totalInvited > 0 ? ((totalAttended / totalInvited) * 100).toFixed(0) : '0'

  const feedbackScores = completedEvents.filter(e => e.feedbackScore != null).map(e => e.feedbackScore!)
  const avgFeedback = feedbackScores.length > 0
    ? (feedbackScores.reduce((s, v) => s + v, 0) / feedbackScores.length).toFixed(1)
    : '0'

  const totalCommContrib = corporateAccessEvents
    .filter(e => e.commissionContribution != null)
    .reduce((s, e) => s + (e.commissionContribution || 0), 0)
  const commContribStr = (totalCommContrib / 10000).toFixed(1)

  const sortedEvents = [...corporateAccessEvents].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={Calendar} label="이번달 이벤트" value={`${totalEvents}건`} color="indigo" trend={`NDR ${corporateAccessEvents.filter(e => e.type === 'NDR').length}건 포함`} trendDirection="up" trendPositive />
        <KpiCard icon={Users} label="참석률" value={`${attendanceRate}%`} color="emerald" trend={`${totalAttended}/${totalInvited}명`} trendDirection="up" trendPositive />
        <KpiCard icon={Star} label="평균 피드백" value={`${avgFeedback}/5.0`} color="amber" trend="+0.3 전월대비" trendDirection="up" trendPositive />
        <KpiCard icon={DollarSign} label="수수료 기여" value={`${commContribStr}억`} color="blue" trend="기업탐방 효과" trendDirection="up" trendPositive />
      </div>

      {/* Events Table */}
      <Card noPadding style={{ gridColumn: 'span 2' }}>
        <CardHeader title="기업탐방 이벤트" subtitle={`총 ${totalEvents}건`} />
        <DataTable columns={eventColumns} data={sortedEvents} hoverable />
      </Card>

      {/* Event Type Distribution */}
      <Card>
        <CardHeader title="이벤트 유형 분포" subtitle="NDR / Conference / 1:1 / Site Visit / Expert Call" />
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={typeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
              >
                {typeDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}건`, '이벤트']} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value: string) => <span style={{ fontSize: 11, color: '#64748B' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
