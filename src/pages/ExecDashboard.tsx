import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Award, Target } from 'lucide-react'
import { salespeople, institutions, commissions, brokerVoteCategoryAvg, tierDistribution } from '../data/mockData'
import { KpiCard, Card, CardHeader, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)' }

// Commission trend data
const commissionTrend = commissions.map(c => ({
  month: c.month.slice(5),
  total: c.total,
  highTouch: c.byType.highTouch,
  dma: c.byType.dma,
  algo: c.byType.algo,
}))

// Salesperson performance sorted by commission
const salesRanking = [...salespeople].sort((a, b) => b.monthlyCommission - a.monthlyCommission)

// Team performance
const teamPerf = (() => {
  const teams: Record<string, { members: number; commission: number; avgVote: number; avgCompletion: number }> = {}
  salespeople.forEach(s => {
    if (!teams[s.team]) teams[s.team] = { members: 0, commission: 0, avgVote: 0, avgCompletion: 0 }
    teams[s.team].members++
    teams[s.team].commission += s.monthlyCommission
    teams[s.team].avgVote += s.avgBrokerVoteScore
    teams[s.team].avgCompletion += s.actionCompletionRate
  })
  return Object.entries(teams).map(([name, d]) => ({
    name,
    members: d.members,
    commission: d.commission,
    avgVote: +(d.avgVote / d.members).toFixed(1),
    avgCompletion: +(d.avgCompletion / d.members).toFixed(0),
  }))
})()

const salesColumns: Column[] = [
  { key: 'name', label: '이름', width: '15%', render: (r: any) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: 'team', label: '팀', width: '10%' },
  { key: 'clientCount', label: '담당 고객', width: '10%' },
  { key: 'monthlyCommission', label: '월 수수료(만원)', width: '15%', render: (r: any) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.monthlyCommission.toLocaleString()}</span>
  )},
  { key: 'needsExtracted', label: 'AI 니즈 추출', width: '12%' },
  { key: 'actionCompletionRate', label: '액션 완료율', width: '12%', render: (r: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 60, height: 6, background: '#F1F5F9', borderRadius: 3 }}>
        <div style={{ width: `${r.actionCompletionRate}%`, height: '100%', background: r.actionCompletionRate >= 80 ? '#10B981' : r.actionCompletionRate >= 60 ? '#F59E0B' : '#F43F5E', borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600 }}>{r.actionCompletionRate}%</span>
    </div>
  )},
  { key: 'avgBrokerVoteScore', label: '평균 보트 점수', width: '12%', render: (r: any) => (
    <span style={{ fontWeight: 600, color: r.avgBrokerVoteScore >= 7.5 ? '#10B981' : r.avgBrokerVoteScore >= 6.5 ? '#F59E0B' : '#F43F5E' }}>{r.avgBrokerVoteScore}</span>
  )},
]

const teamColumns: Column[] = [
  { key: 'name', label: '팀', width: '20%', render: (r: any) => <span style={{ fontWeight: 700 }}>{r.name}</span> },
  { key: 'members', label: '인원', width: '15%' },
  { key: 'commission', label: '총 수수료(만원)', width: '25%', render: (r: any) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.commission.toLocaleString()}</span>
  )},
  { key: 'avgVote', label: '평균 보트', width: '20%' },
  { key: 'avgCompletion', label: '액션 완료율', width: '20%', render: (r: any) => `${r.avgCompletion}%` },
]

export default function ExecDashboard() {
  const totalCommission = commissions[commissions.length - 1]?.total || 16.7
  const totalClients = institutions.length
  const avgVote = +(salespeople.reduce((s, sp) => s + sp.avgBrokerVoteScore, 0) / salespeople.length).toFixed(1)
  const avgCompletion = +(salespeople.reduce((s, sp) => s + sp.actionCompletionRate, 0) / salespeople.length).toFixed(0)

  return (
    <div className="dashboard-grid">
      <div className="kpi-row">
        <KpiCard label="월간 수수료" value={`${totalCommission}억원`} trend="+5.3%" trendDirection="up" trendPositive={true} icon={TrendingUp} color="indigo" />
        <KpiCard label="기관 고객" value={`${totalClients}개`} trend="15명 커버" trendDirection="up" trendPositive={true} icon={Users} color="teal" />
        <KpiCard label="평균 보트 점수" value={`${avgVote}`} trend="+0.3" trendDirection="up" trendPositive={true} icon={Award} color="emerald" />
        <KpiCard label="액션 완료율" value={`${avgCompletion}%`} trend="+4.1%" trendDirection="up" trendPositive={true} icon={Target} color="amber" />
      </div>

      {/* Commission Trend */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="월별 수수료 트렌드" subtitle="유형별 (High-touch / DMA / Algo)" />
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <AreaChart data={commissionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}억`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}억원`]} />
              <Area type="monotone" dataKey="highTouch" stackId="1" stroke="#034EA2" fill="#034EA2" fillOpacity={0.6} name="High-touch" />
              <Area type="monotone" dataKey="dma" stackId="1" stroke="#2B7DE9" fill="#2B7DE9" fillOpacity={0.6} name="DMA" />
              <Area type="monotone" dataKey="algo" stackId="1" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.6} name="Algo" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Broker Vote by Category */}
      <Card>
        <CardHeader title="브로커 보트 카테고리별" subtitle="전사 평균" />
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={brokerVoteCategoryAvg} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#034EA2" radius={[0, 4, 4, 0]} barSize={18} name="점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Tier Distribution */}
      <Card>
        <CardHeader title="고객 등급 분포" />
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {tierDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Team Performance */}
      <Card noPadding style={{ gridColumn: 'span 2' }}>
        <CardHeader title="팀별 성과" />
        <DataTable columns={teamColumns} data={teamPerf} hoverable />
      </Card>

      {/* Salesperson Ranking */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="세일즈 개인별 성과" subtitle="월 수수료 기준 정렬" />
        <DataTable columns={salesColumns} data={salesRanking} hoverable />
      </Card>
    </div>
  )
}
