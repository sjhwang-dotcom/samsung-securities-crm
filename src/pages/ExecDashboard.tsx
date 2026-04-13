import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts'
import { TrendingUp, Users, Award, Target, AlertTriangle, Brain, Shield } from 'lucide-react'
import { salespeople, institutions, commissions, brokerVoteCategoryAvg, tierDistribution, atRiskClients, clientNeeds, actionItems, interactions, deals, competitorMentions } from '../data/mockData'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)' }

// Commission trend
const commissionTrend = commissions.map(c => ({
  month: c.month.slice(5),
  total: c.total,
  highTouch: c.byType.highTouch,
  dma: c.byType.dma,
  algo: c.byType.algo,
}))

// Salesperson ranking
const salesRanking = [...salespeople].sort((a, b) => b.monthlyCommission - a.monthlyCommission)

// Team performance
const teamPerf = (() => {
  const teams: Record<string, { members: number; commission: number; avgVote: number; avgCompletion: number; needs: number; clients: number }> = {}
  salespeople.forEach(s => {
    if (!teams[s.team]) teams[s.team] = { members: 0, commission: 0, avgVote: 0, avgCompletion: 0, needs: 0, clients: 0 }
    teams[s.team].members++
    teams[s.team].commission += s.monthlyCommission
    teams[s.team].avgVote += s.avgBrokerVoteScore
    teams[s.team].avgCompletion += s.actionCompletionRate
    teams[s.team].needs += s.needsExtracted
    teams[s.team].clients += s.clientCount
  })
  return Object.entries(teams).map(([name, d]) => ({
    name, members: d.members, commission: d.commission, clients: d.clients, needs: d.needs,
    avgVote: +(d.avgVote / d.members).toFixed(1),
    avgCompletion: +(d.avgCompletion / d.members).toFixed(0),
  }))
})()

// Channel distribution (interactions by type)
const channelDist = (() => {
  const map: Record<string, number> = {}
  interactions.forEach(i => { map[i.type] = (map[i.type] || 0) + 1 })
  const colors: Record<string, string> = { '통화': '#034EA2', '미팅': '#10B981', '블룸버그': '#F59E0B', '이메일': '#8B5CF6', '기업탐방': '#F43F5E', '리서치배포': '#06B6D4' }
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value, color: colors[name] || '#94A3B8' }))
})()

// Needs by category
const needsByCat = (() => {
  const map: Record<string, number> = {}
  clientNeeds.forEach(n => { map[n.category] = (map[n.category] || 0) + 1 })
  const colors = ['#034EA2', '#2B7DE9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#06B6D4']
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
})()

// Competitor threat summary
const competitorSummary = (() => {
  const map: Record<string, { total: number; high: number }> = {}
  competitorMentions.forEach(m => {
    if (!map[m.competitorName]) map[m.competitorName] = { total: 0, high: 0 }
    map[m.competitorName].total++
    if (m.threatLevel === 'High') map[m.competitorName].high++
  })
  return Object.entries(map).sort((a, b) => b[1].total - a[1].total).map(([name, d]) => ({ name, ...d }))
})()

const salesColumns: Column[] = [
  { key: 'name', label: '이름', width: '12%', render: (r: any) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: 'team', label: '팀', width: '8%' },
  { key: 'clientCount', label: '고객', width: '7%' },
  { key: 'monthlyCommission', label: '수수료(만원)', width: '12%', render: (r: any) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.monthlyCommission.toLocaleString()}</span>
  )},
  { key: 'needsExtracted', label: '니즈추출', width: '8%' },
  { key: 'actionCompletionRate', label: '액션완료', width: '12%', render: (r: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 50, height: 5, background: '#F1F5F9', borderRadius: 3 }}>
        <div style={{ width: `${r.actionCompletionRate}%`, height: '100%', background: r.actionCompletionRate >= 80 ? '#10B981' : r.actionCompletionRate >= 60 ? '#F59E0B' : '#F43F5E', borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 600 }}>{r.actionCompletionRate}%</span>
    </div>
  )},
  { key: 'avgBrokerVoteScore', label: '보트', width: '7%', render: (r: any) => (
    <span style={{ fontWeight: 600, color: r.avgBrokerVoteScore >= 7.5 ? '#10B981' : r.avgBrokerVoteScore >= 6.5 ? '#F59E0B' : '#F43F5E' }}>{r.avgBrokerVoteScore}</span>
  )},
]

const teamColumns: Column[] = [
  { key: 'name', label: '팀', width: '12%', render: (r: any) => <span style={{ fontWeight: 700 }}>{r.name}</span> },
  { key: 'members', label: '인원', width: '8%' },
  { key: 'clients', label: '고객수', width: '10%' },
  { key: 'commission', label: '수수료(만원)', width: '15%', render: (r: any) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.commission.toLocaleString()}</span>
  )},
  { key: 'needs', label: '니즈추출', width: '10%' },
  { key: 'avgVote', label: '보트', width: '10%' },
  { key: 'avgCompletion', label: '완료율', width: '10%', render: (r: any) => `${r.avgCompletion}%` },
]

const riskColumns: Column[] = [
  { key: 'name', label: '기관명', render: (r: any) => <span style={{ fontWeight: 600 }}>{r.name}</span> },
  { key: 'severity', label: '등급', width: '80px', render: (r: any) => <StatusBadge status={r.severity} /> },
  { key: 'riskScore', label: '점수', width: '60px', render: (r: any) => (
    <span style={{ fontWeight: 700, color: r.riskScore >= 85 ? '#E11D48' : '#F59E0B' }}>{r.riskScore}</span>
  )},
  { key: 'recommendation', label: '추천 개입', render: (r: any) => <span style={{ fontSize: 11, color: '#475569' }}>{r.recommendation}</span> },
]

const dealColumns: Column[] = [
  { key: 'company', label: '기업', render: (r: any) => <span style={{ fontWeight: 600 }}>{r.company}</span> },
  { key: 'dealType', label: '유형', width: '80px', render: (r: any) => <StatusBadge variant={r.dealType === 'IPO' ? 'blue' : r.dealType === '블록딜' ? 'purple' : 'emerald'}>{r.dealType}</StatusBadge> },
  { key: 'dealSize', label: '규모', width: '80px' },
  { key: 'role', label: '역할', width: '80px' },
  { key: 'commission', label: '수수료(억)', width: '80px', render: (r: any) => <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.commission}</span> },
  { key: 'status', label: '상태', width: '70px', render: (r: any) => <StatusBadge variant={r.status === '완료' ? 'emerald' : 'amber'}>{r.status}</StatusBadge> },
]

export default function ExecDashboard() {
  const totalCommission = commissions[commissions.length - 1]?.total || 16.7
  const yearCommission = commissions.reduce((s, c) => s + c.total, 0).toFixed(1)
  const totalClients = institutions.length
  const avgVote = +(salespeople.reduce((s, sp) => s + sp.avgBrokerVoteScore, 0) / salespeople.length).toFixed(1)
  const avgCompletion = +(salespeople.reduce((s, sp) => s + sp.actionCompletionRate, 0) / salespeople.length).toFixed(0)
  const totalNeeds = clientNeeds.length
  const totalActions = actionItems.length
  const completedActions = actionItems.filter(a => a.status === 'Completed').length
  const criticalClients = atRiskClients.filter(c => c.severity === 'CRITICAL').length

  return (
    <div className="dashboard-grid">
      {/* KPI Row — 8 metrics */}
      <div className="kpi-row">
        <KpiCard label="월간 수수료" value={`${totalCommission}억`} trend="+5.3%" trendDirection="up" trendPositive icon={TrendingUp} color="indigo" />
        <KpiCard label="연간 수수료" value={`${yearCommission}억`} trend="+8.2% YoY" trendDirection="up" trendPositive icon={TrendingUp} color="blue" />
        <KpiCard label="기관 고객" value={`${totalClients}개`} trend="15명 커버" trendDirection="up" trendPositive icon={Users} color="teal" />
        <KpiCard label="보트 점수" value={`${avgVote}`} trend="+0.3" trendDirection="up" trendPositive icon={Award} color="emerald" />
        <KpiCard label="니즈 추출" value={`${totalNeeds}건`} trend="+12.5%" trendDirection="up" trendPositive icon={Brain} color="purple" />
        <KpiCard label="액션 완료율" value={`${avgCompletion}%`} trend={`${completedActions}/${totalActions}`} trendDirection="up" trendPositive icon={Target} color="amber" />
        <KpiCard label="이탈 위험" value={`${atRiskClients.length}곳`} trend={`CRITICAL ${criticalClients}`} trendDirection="down" trendPositive={false} icon={AlertTriangle} color="rose" />
        <KpiCard label="컴플라이언스" value="96%" trend="정상" trendDirection="up" trendPositive icon={Shield} color="emerald" />
      </div>

      {/* Row 2: Commission Trend + Vote Category */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="월별 수수료 트렌드" subtitle="유형별 (High-touch / DMA / Algo)" />
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <AreaChart data={commissionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}억`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${Number(v).toFixed(1)}억원`]} />
              <Area type="monotone" dataKey="highTouch" stackId="1" stroke="#034EA2" fill="#034EA2" fillOpacity={0.6} name="High-touch" />
              <Area type="monotone" dataKey="dma" stackId="1" stroke="#2B7DE9" fill="#2B7DE9" fillOpacity={0.6} name="DMA" />
              <Area type="monotone" dataKey="algo" stackId="1" stroke="#60A5FA" fill="#60A5FA" fillOpacity={0.6} name="Algo" />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="브로커 보트 카테고리" subtitle="전사 평균" />
        <div style={{ height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={brokerVoteCategoryAvg} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="score" fill="#034EA2" radius={[4, 4, 0, 0]} barSize={28} name="점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 3: Channel Distribution + Needs Category + Tier */}
      <Card>
        <CardHeader title="채널별 인터랙션" subtitle="최근 30일" />
        <div style={{ height: 200 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={channelDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3} dataKey="value" label={({ name, value }: any) => `${name}(${value})`} labelLine={false}>
                {channelDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="니즈 카테고리 분포" subtitle="AI 추출 기준" />
        <div style={{ height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={needsByCat} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                {needsByCat.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="고객 등급 분포" />
        <div style={{ height: 200 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={tierDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value" label={({ name, value }: any) => `${name}(${value})`} labelLine={false}>
                {tierDistribution.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 4: At-Risk + Competitor Intelligence */}
      <Card noPadding style={{ gridColumn: 'span 2' }}>
        <CardHeader title="이탈 위험 고객" subtitle={`${atRiskClients.length}곳 모니터링`} />
        <DataTable columns={riskColumns} data={atRiskClients.slice(0, 5)} compact hoverable />
      </Card>

      <Card>
        <CardHeader title="경쟁사 위협 분석" subtitle="최근 인터랙션 기반" />
        <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {competitorSummary.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#FAFBFC', borderRadius: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: '#0F172A' }}>{c.name}</span>
              <span style={{ fontSize: 11, color: '#64748B' }}>{c.total}건</span>
              {c.high > 0 && <StatusBadge variant="rose" size="sm">{c.high} High</StatusBadge>}
            </div>
          ))}
        </div>
      </Card>

      {/* Row 5: Team Performance */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="팀별 성과 비교" />
        <DataTable columns={teamColumns} data={teamPerf} hoverable />
      </Card>

      {/* Row 6: Deal Pipeline */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="딜 파이프라인" subtitle={`${deals.length}건 — IPO, 블록딜, 세컨더리`} />
        <DataTable columns={dealColumns} data={deals} compact hoverable />
      </Card>

      {/* Row 7: Salesperson Ranking */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="세일즈 개인별 성과" subtitle="월 수수료 기준" />
        <DataTable columns={salesColumns} data={salesRanking} compact hoverable />
      </Card>
    </div>
  )
}
