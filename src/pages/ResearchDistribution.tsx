import { FileText, Mail, Users, AlertCircle, ArrowUpRight } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { researchReports, sectorInterest } from '../data/mockData'
import type { ResearchReport } from '../types'

const reportColumns: Column<ResearchReport>[] = [
  { key: 'title', header: '제목', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>
      {r.title.length > 40 ? r.title.slice(0, 40) + '...' : r.title}
    </span>
  )},
  { key: 'analyst', header: '애널리스트' },
  { key: 'sector', header: '섹터', render: (r) => (
    <StatusBadge variant="blue">{r.sector}</StatusBadge>
  )},
  { key: 'type', header: '유형', render: (r) => (
    <StatusBadge variant={
      r.type === '기업분석' ? 'indigo' : r.type === '산업분석' ? 'emerald' :
      r.type === '전략' ? 'amber' : r.type === '매크로' ? 'purple' : 'teal'
    }>
      {r.type}
    </StatusBadge>
  )},
  { key: 'date', header: '발행일', width: '90px' },
  { key: 'recommendation', header: '투자의견', width: '80px', render: (r) => r.recommendation ? (
    <StatusBadge variant={r.recommendation === 'BUY' ? 'emerald' : r.recommendation === 'SELL' ? 'rose' : 'amber'}>
      {r.recommendation}
    </StatusBadge>
  ) : <span style={{ color: '#94A3B8', fontSize: 11 }}>-</span> },
  { key: 'distributionCount', header: '배포수', width: '70px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.distributionCount}</span>
  )},
  { key: 'openRate', header: '오픈율', width: '70px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 600, color: r.openRate >= 70 ? '#059669' : r.openRate >= 50 ? '#F59E0B' : '#E11D48' }}>
      {(r.openRate * 100).toFixed(0)}%
    </span>
  )},
]

export default function ResearchDistribution() {
  const totalReports = researchReports.length
  const avgOpenRate = totalReports > 0
    ? (researchReports.reduce((s, r) => s + r.openRate, 0) / totalReports * 100).toFixed(0)
    : '0'
  const totalDist = researchReports.reduce((s, r) => s + r.distributionCount, 0)

  // Coverage gap: sectors with high client interest but few research reports
  const sectorResearchCount: Record<string, number> = {}
  researchReports.forEach(r => {
    sectorResearchCount[r.sector] = (sectorResearchCount[r.sector] || 0) + 1
  })

  const coverageGaps = sectorInterest
    .filter(s => {
      const reportCount = sectorResearchCount[s.name] || 0
      return s.value >= 3 && reportCount <= 1
    })
    .map(s => ({
      sector: s.name,
      clientInterest: s.value,
      reportCount: sectorResearchCount[s.name] || 0,
    }))

  const sortedReports = [...researchReports].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={FileText} label="발행 리포트" value={`${totalReports}건`} color="indigo" trend="+3 이번주" trendDirection="up" trendPositive />
        <KpiCard icon={Mail} label="평균 오픈율" value={`${avgOpenRate}%`} color="emerald" trend="+2.1% 전주대비" trendDirection="up" trendPositive />
        <KpiCard icon={Users} label="배포 고객" value={`${totalDist}개`} color="blue" trend="누적 배포수" trendDirection="up" trendPositive />
        <KpiCard icon={AlertCircle} label="커버리지 갭" value={`${coverageGaps.length}건`} color="amber" trend="관심 대비 부족" trendDirection="down" trendPositive={false} />
      </div>

      {/* Research Reports Table */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader
          title="리서치 리포트"
          subtitle={`총 ${totalReports}건`}
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#034EA2', fontWeight: 600, cursor: 'pointer' }}>
              전체 보기 <ArrowUpRight size={12} />
            </div>
          }
        />
        <DataTable columns={reportColumns} data={sortedReports} hoverable />
      </Card>

      {/* Coverage Gap Analysis */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader
          title="커버리지 갭 분석"
          subtitle="고객 관심도 대비 리서치 부족 섹터"
          badge={coverageGaps.length > 0 ? <StatusBadge variant="amber" dot>{coverageGaps.length}건 갭</StatusBadge> : undefined}
        />
        <div style={{ padding: '0 18px 18px' }}>
          {coverageGaps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {coverageGaps.map(gap => (
                <div key={gap.sector} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: '#FFFBEB', border: '1px solid #FDE68A',
                  borderRadius: 10,
                }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>{gap.sector}</span>
                    <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>
                      고객 관심도 {gap.clientInterest}건 | 리서치 {gap.reportCount}건
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 120, height: 6, background: '#FDE68A', borderRadius: 3, overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${Math.min((gap.reportCount / gap.clientInterest) * 100, 100)}%`,
                        height: '100%', background: '#F59E0B', borderRadius: 3,
                      }} />
                    </div>
                    <StatusBadge variant="amber">
                      {((gap.reportCount / gap.clientInterest) * 100).toFixed(0)}% 커버리지
                    </StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: '#64748B', fontSize: 13 }}>
              모든 관심 섹터에 대해 충분한 리서치 커버리지가 제공되고 있습니다.
            </div>
          )}

          {/* Sector interest summary */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>섹터별 고객 관심도</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {sectorInterest.map(s => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px',
                  background: '#F8FAFC', borderRadius: 8, fontSize: 12,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  <span style={{ fontWeight: 600, color: '#334155' }}>{s.name}</span>
                  <span style={{ color: '#94A3B8' }}>{s.value}건</span>
                  <span style={{ color: sectorResearchCount[s.name] ? '#059669' : '#E11D48', fontWeight: 600 }}>
                    리서치 {sectorResearchCount[s.name] || 0}건
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
