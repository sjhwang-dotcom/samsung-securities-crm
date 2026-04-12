import { Award, TrendingUp, TrendingDown, CheckCircle, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { brokerVotes, brokerVoteCategoryAvg, interactions } from '../data/mockData'
import type { BrokerVote as BrokerVoteType } from '../types'

const tooltipStyle = {
  borderRadius: 10, fontSize: 11,
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
}

const categoryColors = ['#034EA2', '#2B7DE9', '#10B981', '#F59E0B', '#F43F5E']

// Build trend comparison data: previous period vs current period per category
const trendData = (() => {
  const cats = {
    research: { cur: 0, prev: 0 },
    sales: { cur: 0, prev: 0 },
    trading: { cur: 0, prev: 0 },
    corporateAccess: { cur: 0, prev: 0 },
    events: { cur: 0, prev: 0 },
  }
  const count = brokerVotes.length || 1
  brokerVotes.forEach(v => {
    cats.research.cur += v.categories.research
    cats.sales.cur += v.categories.sales
    cats.trading.cur += v.categories.trading
    cats.corporateAccess.cur += v.categories.corporateAccess
    cats.events.cur += v.categories.events
    // simulate previous from previousScore ratio
    const ratio = v.previousScore / (v.overallScore || 1)
    cats.research.prev += v.categories.research * ratio
    cats.sales.prev += v.categories.sales * ratio
    cats.trading.prev += v.categories.trading * ratio
    cats.corporateAccess.prev += v.categories.corporateAccess * ratio
    cats.events.prev += v.categories.events * ratio
  })
  return [
    { category: '리서치', prev: +(cats.research.prev / count).toFixed(1), cur: +(cats.research.cur / count).toFixed(1) },
    { category: '세일즈', prev: +(cats.sales.prev / count).toFixed(1), cur: +(cats.sales.cur / count).toFixed(1) },
    { category: '트레이딩', prev: +(cats.trading.prev / count).toFixed(1), cur: +(cats.trading.cur / count).toFixed(1) },
    { category: '기업탐방', prev: +(cats.corporateAccess.prev / count).toFixed(1), cur: +(cats.corporateAccess.cur / count).toFixed(1) },
    { category: '이벤트', prev: +(cats.events.prev / count).toFixed(1), cur: +(cats.events.cur / count).toFixed(1) },
  ]
})()

const voteColumns: Column<BrokerVoteType>[] = [
  { key: 'rank', header: '순위', width: '50px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 800, color: r.rank <= 3 ? '#034EA2' : '#64748B', fontSize: 13 }}>{r.rank}</span>
  )},
  { key: 'institutionName', header: '기관명', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.institutionName}</span>
  )},
  { key: 'overallScore', header: '종합점수', width: '80px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 700, color: '#034EA2', fontSize: 14 }}>{r.overallScore.toFixed(1)}</span>
  )},
  { key: 'previousScore', header: '전기점수', width: '80px', align: 'center', render: (r) => (
    <span style={{ color: '#64748B' }}>{r.previousScore.toFixed(1)}</span>
  )},
  { key: 'change', header: '변동', width: '70px', align: 'center', render: (r) => {
    const change = r.overallScore - r.previousScore
    return (
      <span style={{ fontWeight: 600, color: change > 0 ? '#059669' : change < 0 ? '#E11D48' : '#64748B' }}>
        {change > 0 ? '+' : ''}{change.toFixed(1)}
      </span>
    )
  }},
  { key: 'estimatedCommission', header: '예상수수료', width: '100px', align: 'right', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A' }}>{(r.estimatedCommission / 10000).toFixed(1)}억</span>
  )},
]

export default function BrokerVote() {
  const avgScore = brokerVotes.length > 0
    ? (brokerVotes.reduce((s, v) => s + v.overallScore, 0) / brokerVotes.length).toFixed(1)
    : '0'
  const avgPrev = brokerVotes.length > 0
    ? (brokerVotes.reduce((s, v) => s + v.previousScore, 0) / brokerVotes.length).toFixed(1)
    : '0'
  const change = (parseFloat(avgScore) - parseFloat(avgPrev)).toFixed(1)

  const sortedByScore = [...brokerVotes].sort((a, b) => b.overallScore - a.overallScore)
  const topClient = sortedByScore[0]
  const bottomClient = sortedByScore[sortedByScore.length - 1]
  const top10 = sortedByScore.slice(0, 10)

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={Award} label="평균 보트 점수" value={avgScore} color="indigo" trend={`전기 대비 ${parseFloat(change) >= 0 ? '+' : ''}${change}`} trendDirection={parseFloat(change) >= 0 ? 'up' : 'down'} trendPositive={parseFloat(change) >= 0} />
        <KpiCard icon={TrendingUp} label="Top 고객" value={topClient?.institutionName ?? '-'} color="emerald" trend={`${topClient?.overallScore.toFixed(1) ?? '-'}점`} trendDirection="up" trendPositive />
        <KpiCard icon={TrendingDown} label="Bottom 고객" value={bottomClient?.institutionName ?? '-'} color="amber" trend={`${bottomClient?.overallScore.toFixed(1) ?? '-'}점`} trendDirection="down" trendPositive={false} />
      </div>

      {/* Row 2: Category Bar Chart (horizontal) + Trend Comparison */}
      <Card style={{ gridColumn: 'span 2' }}>
        <CardHeader title="카테고리별 평균 점수" subtitle="리서치 / 세일즈 / 트레이딩 / 기업탐방 / 이벤트" />
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={brokerVoteCategoryAvg} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 12, fill: '#334155', fontWeight: 600 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v.toFixed(1)}점`, '점수']} />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                {brokerVoteCategoryAvg.map((_, i) => (
                  <Cell key={i} fill={categoryColors[i % categoryColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader title="보트 점수 추이" subtitle="전기 vs 이번기 비교" />
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={trendData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="category" tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any, name: any) => [`${Number(v).toFixed(1)}점`, name === 'prev' ? '전기' : '이번기']} />
              <Legend formatter={(value: string) => value === 'prev' ? '전기 (2025 H1)' : '이번기 (2025 H2)'} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="prev" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={14} />
              <Bar dataKey="cur" fill="#034EA2" radius={[4, 4, 0, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 3: Client Vote Scores Table */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader title="고객별 보트 점수" subtitle={`총 ${brokerVotes.length}곳`} />
        <DataTable columns={voteColumns} data={sortedByScore} compact hoverable />
      </Card>

      {/* Row 4: Vote Preparation Checklist */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader title="보트 시즌 준비 체크리스트" subtitle="상위 10개 고객 서비스 현황" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 18px 18px' }}>
          {top10.map((client, i) => {
            const instInteractions = interactions.filter(x => x.institutionId === client.institutionId)
            const recentCall = instInteractions.filter(x => x.type === '통화').length
            const recentMeeting = instInteractions.filter(x => x.type === '미팅').length
            const hasResearch = instInteractions.some(x => x.type === '리서치배포')
            const hasCorporateAccess = instInteractions.some(x => x.type === '기업탐방')

            return (
              <div key={client.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                background: '#FAFBFC', borderRadius: 10,
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#034EA2', width: 24, textAlign: 'center' }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', flex: 1 }}>{client.institutionName}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <StatusBadge variant={recentCall > 0 ? 'emerald' : 'gray'} size="sm">
                    {recentCall > 0 ? <CheckCircle size={10} /> : <Clock size={10} />} 통화 {recentCall}건
                  </StatusBadge>
                  <StatusBadge variant={recentMeeting > 0 ? 'emerald' : 'gray'} size="sm">
                    {recentMeeting > 0 ? <CheckCircle size={10} /> : <Clock size={10} />} 미팅 {recentMeeting}건
                  </StatusBadge>
                  <StatusBadge variant={hasResearch ? 'emerald' : 'amber'} size="sm">
                    {hasResearch ? '리서치 O' : '리서치 X'}
                  </StatusBadge>
                  <StatusBadge variant={hasCorporateAccess ? 'emerald' : 'amber'} size="sm">
                    {hasCorporateAccess ? '기업탐방 O' : '기업탐방 X'}
                  </StatusBadge>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#034EA2' }}>{client.overallScore.toFixed(1)}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
