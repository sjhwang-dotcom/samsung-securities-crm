import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { TrendingUp, Building2, Award, AlertTriangle, Brain, CheckCircle, ArrowUpRight } from 'lucide-react'
import { dashboardKPIs, volumeData, tierDistribution, sectorInterest, atRiskClients, recentActivity, actionItems, commissionByType } from '../data/mockData'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable, ActivityFeed } from '../components/ui'
import type { Column } from '../components/ui'

const iconMap: Record<string, any> = { TrendingUp, Building2, Award, AlertTriangle, Brain, CheckCircle }

const tooltipStyle = {
  borderRadius: 10, fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
}

// At-risk client columns
const riskColumns: Column[] = [
  { key: 'name', label: '기관명', width: '25%' },
  { key: 'severity', label: '등급', width: '15%', render: (r: any) => <StatusBadge status={r.severity} /> },
  { key: 'riskScore', label: '위험점수', width: '15%', render: (r: any) => (
    <span style={{ fontWeight: 700, color: r.riskScore >= 85 ? '#E11D48' : r.riskScore >= 75 ? '#F59E0B' : '#64748B' }}>{r.riskScore}</span>
  )},
  { key: 'trend', label: '추이', width: '15%' },
  { key: 'recommendation', label: '추천 액션', width: '30%', render: (r: any) => (
    <span style={{ fontSize: 11, color: '#475569' }}>{r.recommendation}</span>
  )},
]

// Action columns
const actionColumns: Column[] = [
  { key: 'institutionName', label: '고객', width: '20%' },
  { key: 'description', label: '액션', width: '35%', render: (r: any) => (
    <span style={{ fontSize: 11 }}>{r.description}</span>
  )},
  { key: 'priority', label: '우선순위', width: '15%', render: (r: any) => <StatusBadge status={r.priority} /> },
  { key: 'deadline', label: '기한', width: '15%' },
  { key: 'status', label: '상태', width: '15%', render: (r: any) => <StatusBadge status={r.status} /> },
]

export default function Dashboard() {
  const urgentActions = actionItems.filter(a => a.priority === 'URGENT' || a.priority === 'THIS_WEEK').slice(0, 8)

  return (
    <div className="dashboard-grid">
      {/* KPI Row — single row */}
      <div className="kpi-row">
        {dashboardKPIs.map((kpi, i) => (
          <KpiCard key={i} {...kpi} icon={iconMap[kpi.icon] || TrendingUp} />
        ))}
      </div>

      {/* Commission Trend */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="월별 수수료 트렌드" subtitle="최근 12개월" />
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#034EA2" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#034EA2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}억`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}억원`, '수수료']} />
              <Area type="monotone" dataKey="commission" stroke="#034EA2" strokeWidth={2.5} fill="url(#commGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tier Distribution */}
      <Card>
        <CardHeader title="고객 등급 분포" subtitle="Platinum / Gold / Silver / Bronze" />
        <div style={{ height: 260 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {tierDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Sector Interest + Commission by Type + At-Risk — fills 3 cols */}
      <Card>
        <CardHeader title="섹터별 고객 관심도" subtitle="AI 추출 니즈 기반" />
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={sectorInterest} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {sectorInterest.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="수수료 유형별 구성" subtitle="High-touch / DMA / Algo" />
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={commissionByType} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}억`} labelLine={false}>
                {commissionByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}억원`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="최근 활동" subtitle="실시간 영업 활동 피드" />
        <ActivityFeed items={recentActivity.slice(0, 8)} />
      </Card>

      {/* At-Risk Clients — full width */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader title="이탈 위험 고객" subtitle={`${atRiskClients.length}개 기관 모니터링 중`} action={
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#034EA2', cursor: 'pointer', fontWeight: 600 }}>
            전체 보기 <ArrowUpRight size={12} />
          </span>
        } />
        <DataTable columns={riskColumns} data={atRiskClients.slice(0, 6)} />
      </Card>

      {/* Today's Actions — full width */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader title="오늘의 추천 액션" subtitle="AI가 분석한 우선 실행 항목" action={
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#034EA2', cursor: 'pointer', fontWeight: 600 }}>
            전체 보기 <ArrowUpRight size={12} />
          </span>
        } />
        <DataTable columns={actionColumns} data={urgentActions} />
      </Card>
    </div>
  )
}
