import { DollarSign, TrendingUp, BarChart3, Users } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { commissions, institutions, brokerVotes, deals } from '../data/mockData'
import type { Deal } from '../types'

const tooltipStyle = {
  borderRadius: 10, fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
}

// Commission trend data (stacked areas)
const commissionTrend = commissions.map(c => {
  const d = new Date(c.month)
  const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  return {
    month: `${months[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`,
    highTouch: c.byType.highTouch,
    dma: c.byType.dma,
    algo: c.byType.algo,
    total: c.total,
  }
})

// Commission by tier
const tierColors: Record<string, string> = { Platinum: '#8B5CF6', Gold: '#F59E0B', Silver: '#94A3B8', Bronze: '#CD7F32' }
const commissionByTier = (() => {
  const tierMap: Record<string, number> = { Platinum: 0, Gold: 0, Silver: 0, Bronze: 0 }
  brokerVotes.forEach(v => {
    const inst = institutions.find(i => i.id === v.institutionId)
    if (inst) {
      tierMap[inst.tier] = (tierMap[inst.tier] || 0) + v.estimatedCommission
    }
  })
  return Object.entries(tierMap).map(([name, value]) => ({
    name,
    value: Math.round(value / 10000 * 10) / 10,
    color: tierColors[name],
  }))
})()

// Deal participation from JSON
const dealData = [...deals].sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime())

const dealColumns: Column<Deal>[] = [
  { key: 'company', header: '기업', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.company}</span> },
  { key: 'dealType', header: '유형', render: (r) => (
    <StatusBadge variant={r.dealType === 'IPO' ? 'blue' : r.dealType === '블록딜' ? 'purple' : 'emerald'}>
      {r.dealType}
    </StatusBadge>
  )},
  { key: 'dealSize', header: '규모', align: 'right' },
  { key: 'role', header: '역할', render: (r) => (
    <StatusBadge variant={r.role === '단독주선' ? 'rose' : r.role === '공동주관' ? 'amber' : 'gray'}>
      {r.role}
    </StatusBadge>
  )},
  { key: 'commission', header: '수수료', align: 'right', render: (r) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.commission}억</span>
  )},
  { key: 'launchDate', header: '날짜' },
  { key: 'status', header: '상태', render: (r) => (
    <StatusBadge variant={r.status === '진행중' ? 'amber' : r.status === '완료' ? 'emerald' : 'gray'}>
      {r.status}
    </StatusBadge>
  )},
]

export default function RevenueIntelligence() {
  const latestMonth = commissions.length > 0 ? commissions[commissions.length - 1] : null
  // commissions.total is already in 억원
  const monthlyComm = latestMonth ? latestMonth.total.toFixed(1) : '0'

  const quarterTotal = commissions.slice(-3).reduce((s, c) => s + c.total, 0)
  const quarterComm = quarterTotal.toFixed(1)

  const yearTotal = commissions.reduce((s, c) => s + c.total, 0)
  const yearComm = yearTotal.toFixed(1)

  const activeClients = institutions.filter(i => i.status === 'Active').length
  const avgPerClient = activeClients > 0 ? (yearTotal / activeClients).toFixed(2) : '0'

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={DollarSign} label="월간 수수료" value={`${monthlyComm}억원`} color="indigo" trend="+5.3%" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingUp} label="분기 수수료" value={`${quarterComm}억원`} color="emerald" trend="Q1 2026" trendDirection="up" trendPositive />
        <KpiCard icon={BarChart3} label="연간 수수료" value={`${yearComm}억원`} color="blue" trend="+8.2% YoY" trendDirection="up" trendPositive />
        <KpiCard icon={Users} label="고객당 평균" value={`${avgPerClient}억원`} color="amber" trend={`${activeClients}곳 활성`} trendDirection="up" trendPositive />
      </div>

      {/* Commission Trend */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="수수료 트렌드" subtitle="유형별 월별 추이 (High-touch / DMA / Algo)" />
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={commissionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradHT" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#034EA2" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#034EA2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradDMA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2B7DE9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2B7DE9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAlgo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}억`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${Number(v).toFixed(1)}억원`]} />
              <Area type="monotone" dataKey="highTouch" stackId="1" stroke="#034EA2" strokeWidth={2} fill="url(#gradHT)" name="High-touch" />
              <Area type="monotone" dataKey="dma" stackId="1" stroke="#2B7DE9" strokeWidth={2} fill="url(#gradDMA)" name="DMA" />
              <Area type="monotone" dataKey="algo" stackId="1" stroke="#60A5FA" strokeWidth={2} fill="url(#gradAlgo)" name="Algo" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Commission by Tier PieChart */}
      <Card>
        <CardHeader title="등급별 수수료 기여" subtitle="Platinum / Gold / Silver / Bronze" />
        <div style={{ height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={commissionByTier}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}억`}
                labelLine={false}
              >
                {commissionByTier.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}억원`, '수수료']} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value: string) => <span style={{ fontSize: 11, color: '#64748B' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Deal Participation Table */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="딜 참여 현황" subtitle="최근 주요 딜 (IPO / 블록딜 / 세컨더리)" />
        <DataTable columns={dealColumns} data={dealData} hoverable />
      </Card>
    </div>
  )
}
