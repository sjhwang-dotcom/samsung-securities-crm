import { Phone, Users, MessageSquare, ArrowUpRight } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { interactions, actionItems } from '../data/mockData'
import type { Interaction, ActionItem } from '../types'

const interactionColumns: Column<Interaction>[] = [
  { key: 'date', header: '날짜', width: '80px' },
  { key: 'time', header: '시간', width: '55px' },
  { key: 'type', header: '유형', width: '80px', render: (r) => (
    <StatusBadge variant={
      r.type === '통화' ? 'blue' : r.type === '미팅' ? 'emerald' :
      r.type === '블룸버그' ? 'amber' : r.type === '이메일' ? 'purple' : 'gray'
    }>
      {r.type}
    </StatusBadge>
  )},
  { key: 'institutionName', header: '기관명', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.institutionName}</span>
  )},
  { key: 'keyPersonName', header: '담당자', width: '70px' },
  { key: 'summary', header: '요약', render: (r) => (
    <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>
      {r.summary.length > 40 ? r.summary.slice(0, 40) + '...' : r.summary}
    </span>
  )},
  { key: 'needsCount', header: '니즈', width: '40px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 700, color: r.needsCount > 0 ? '#034EA2' : '#94A3B8' }}>{r.needsCount}</span>
  )},
  { key: 'sentiment', header: '감성', width: '60px', render: (r) => (
    <StatusBadge variant={r.sentiment === 'Positive' ? 'emerald' : r.sentiment === 'Negative' ? 'rose' : 'gray'}>
      {r.sentiment === 'Positive' ? '긍정' : r.sentiment === 'Negative' ? '부정' : '중립'}
    </StatusBadge>
  )},
]

const followUpColumns: Column<ActionItem>[] = [
  { key: 'institutionName', header: '기관', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.institutionName}</span>
  )},
  { key: 'description', header: '액션', render: (r) => (
    <span style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>
      {r.description.length > 40 ? r.description.slice(0, 40) + '...' : r.description}
    </span>
  )},
  { key: 'priority', header: '우선순위', width: '80px', render: (r) => (
    <StatusBadge variant={
      r.priority === 'URGENT' ? 'rose' : r.priority === 'THIS_WEEK' ? 'amber' :
      r.priority === 'THIS_MONTH' ? 'blue' : 'gray'
    }>
      {r.priority === 'URGENT' ? '긴급' : r.priority === 'THIS_WEEK' ? '이번주' : r.priority === 'THIS_MONTH' ? '이번달' : '모니터'}
    </StatusBadge>
  )},
  { key: 'status', header: '상태', width: '80px', render: (r) => (
    <StatusBadge variant={r.status === 'In Progress' ? 'amber' : r.status === 'Overdue' ? 'rose' : 'gray'}>
      {r.status}
    </StatusBadge>
  )},
  { key: 'deadline', header: '기한', width: '90px' },
  { key: 'assignee', header: '담당', width: '70px' },
]

export default function ActivityManagement() {
  const todayCalls = interactions.filter(i => i.type === '통화').length
  const todayMeetings = interactions.filter(i => i.type === '미팅').length
  const todayBloomberg = interactions.filter(i => i.type === '블룸버그').length


  const pendingActions = actionItems
    .filter(a => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Overdue')
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { URGENT: 0, THIS_WEEK: 1, THIS_MONTH: 2, MONITOR: 3 }
      return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
    })

  const sortedInteractions = [...interactions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="dashboard-grid">
      {/* KPI Row — span full width */}
      <div className="kpi-row">
        <KpiCard icon={Phone} label="오늘 통화" value={`${todayCalls}건`} color="blue" trend="+5 전일대비" trendDirection="up" trendPositive />
        <KpiCard icon={Users} label="오늘 미팅" value={`${todayMeetings}건`} color="emerald" trend="예정 1건" trendDirection="up" trendPositive />
        <KpiCard icon={MessageSquare} label="오늘 블룸버그" value={`${todayBloomberg}건`} color="amber" trend="활성 채팅" trendDirection="up" trendPositive />
      </div>

      {/* Interaction Log — 2 columns wide */}
      <Card noPadding style={{ gridColumn: 'span 2' }}>
        <CardHeader
          title="인터랙션 로그"
          subtitle={`총 ${interactions.length}건`}
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#034EA2', fontWeight: 600, cursor: 'pointer' }}>
              전체 보기 <ArrowUpRight size={12} />
            </div>
          }
        />
        <DataTable columns={interactionColumns} data={sortedInteractions.slice(0, 15)} compact hoverable />
      </Card>

      {/* Follow-up Queue — 1 column */}
      <Card noPadding>
        <CardHeader
          title="후속 조치 대기열"
          subtitle={`${pendingActions.length}건 대기중`}
          badge={
            <StatusBadge variant="rose" dot pulse>
              {pendingActions.filter(a => a.priority === 'URGENT').length}건 긴급
            </StatusBadge>
          }
        />
        <DataTable columns={followUpColumns} data={pendingActions.slice(0, 12)} compact hoverable />
      </Card>
    </div>
  )
}
