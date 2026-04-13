import { ShieldCheck, Eye, FileText, Award, AlertTriangle, Lock } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { complianceAlerts, auditTrailEntries, chineseWallRestrictions } from '../data/mockData'
import type { ComplianceAlert } from '../types'

const alertColumns: Column<ComplianceAlert>[] = [
  { key: 'type', header: '유형', render: (r) => (
    <StatusBadge variant={
      r.type === '정보교류차단' ? 'rose' : r.type === '고객정보접근' ? 'amber' :
      r.type === '거래제한' ? 'purple' : 'blue'
    }>
      {r.type}
    </StatusBadge>
  )},
  { key: 'severity', header: '심각도', width: '80px', render: (r) => (
    <StatusBadge variant={r.severity === 'HIGH' ? 'critical' : r.severity === 'MEDIUM' ? 'high' : 'moderate'}>
      {r.severity}
    </StatusBadge>
  )},
  { key: 'description', header: '설명', render: (r) => (
    <span style={{ fontSize: 12, color: '#334155' }}>
      {r.description.length > 60 ? r.description.slice(0, 60) + '...' : r.description}
    </span>
  )},
  { key: 'date', header: '날짜', width: '100px' },
  { key: 'status', header: '상태', width: '90px', render: (r) => (
    <StatusBadge variant={r.status === 'Active' ? 'rose' : r.status === 'Resolved' ? 'emerald' : 'amber'} dot>
      {r.status === 'Active' ? '활성' : r.status === 'Resolved' ? '해결' : '확인'}
    </StatusBadge>
  )},
  { key: 'restrictedStock', header: '제한종목', width: '100px', render: (r) => r.restrictedStock ? (
    <span style={{ fontWeight: 600, color: '#E11D48', fontSize: 12 }}>{r.restrictedStock}</span>
  ) : <span style={{ color: '#94A3B8' }}>-</span> },
  { key: 'salesperson', header: '담당자', width: '80px', render: (r) => r.salesperson ? (
    <span style={{ fontSize: 12 }}>{r.salesperson}</span>
  ) : <span style={{ color: '#94A3B8' }}>-</span> },
]

// Audit trail from JSON
const severityMap: Record<string, 'info' | 'warning' | 'critical'> = {
  'chinese_wall_triggered': 'critical',
  'compliance_alert': 'critical',
  'action_completed': 'info',
  'need_extracted': 'info',
  'interaction_created': 'info',
  'research_distributed': 'info',
}
const auditTrail = auditTrailEntries
  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 10)
  .map(entry => {
    const d = new Date(entry.timestamp)
    const time = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    return {
      time,
      action: entry.eventType.replace(/_/g, ' '),
      user: entry.actorType === 'system' ? '시스템' : entry.actorType === 'agent' ? 'AI 에이전트' : entry.actorId,
      detail: entry.description,
      severity: severityMap[entry.eventType] || 'info' as 'info' | 'warning' | 'critical',
    }
  })

// Chinese Wall restrictions from JSON
const activeChineseWallRestrictions = chineseWallRestrictions.filter(r => r.isActive)

export default function ComplianceCenterSS() {

  const activeChineseWall = activeChineseWallRestrictions

  const sortedAlerts = [...complianceAlerts].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={Lock} label="정보교류차단 활성" value={`${activeChineseWall.length}건`} color="rose" trend="자동 차단 처리" trendDirection="up" trendPositive={false} />
        <KpiCard icon={Eye} label="고객정보 접근" value="정상" color="emerald" trend="이상 없음" trendDirection="up" trendPositive />
        <KpiCard icon={FileText} label="감사 추적 로그" value="2,847건" color="blue" trend="이번달 누적" trendDirection="up" trendPositive />
        <KpiCard icon={Award} label="컴플라이언스 점수" value="96%" color="emerald" trend="+2% 전월대비" trendDirection="up" trendPositive />
      </div>

      {/* Chinese Wall Section */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader
          title="정보교류차단 (Chinese Wall)"
          subtitle={`활성 ${activeChineseWall.length}건`}
          badge={activeChineseWall.length > 0 ? (
            <StatusBadge variant="rose" dot pulse>차단 활성</StatusBadge>
          ) : undefined}
        />
        <div style={{ padding: '0 18px 18px' }}>
          {activeChineseWall.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {activeChineseWall.map(restriction => (
                <div key={restriction.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={16} color="#DC2626" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>
                        {restriction.stockName} ({restriction.stockCode})
                      </div>
                      <div style={{ fontSize: 11, color: '#991B1B', marginTop: 2 }}>
                        {restriction.reason}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge variant="critical">
                      활성
                    </StatusBadge>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{restriction.restrictedFrom} ~ {restriction.restrictedUntil || '미정'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: '#059669', fontSize: 13, background: '#ECFDF5', borderRadius: 10 }}>
              현재 활성화된 정보교류차단 항목이 없습니다.
            </div>
          )}

          {/* Resolved Chinese Wall restrictions */}
          {chineseWallRestrictions.filter(r => !r.isActive).length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>해제된 차단 이력</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {chineseWallRestrictions.filter(r => !r.isActive).map(restriction => (
                  <div key={restriction.id} style={{
                    padding: '6px 10px', background: '#F8FAFC', borderRadius: 8, fontSize: 11,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <ShieldCheck size={12} color="#059669" />
                    <span style={{ color: '#334155' }}>{restriction.stockName}</span>
                    <StatusBadge variant="emerald" size="sm">해제</StatusBadge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Compliance Alerts Table */}
      <Card noPadding style={{ gridColumn: 'span 3' }}>
        <CardHeader
          title="컴플라이언스 알림"
          subtitle={`총 ${complianceAlerts.length}건`}
        />
        <DataTable columns={alertColumns} data={sortedAlerts} hoverable />
      </Card>

      {/* Audit Trail */}
      <Card style={{ gridColumn: 'span 3' }}>
        <CardHeader title="감사 추적 로그" subtitle="최근 10건" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {auditTrail.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 0',
                borderBottom: i < auditTrail.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                {/* Timeline dot */}
                <div style={{
                  width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                  background: entry.severity === 'critical' ? '#DC2626'
                    : entry.severity === 'warning' ? '#F59E0B' : '#10B981',
                }} />
                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{entry.action}</span>
                    <StatusBadge variant={
                      entry.severity === 'critical' ? 'rose'
                        : entry.severity === 'warning' ? 'amber' : 'gray'
                    } size="sm">
                      {entry.user}
                    </StatusBadge>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{entry.detail}</div>
                </div>
                {/* Time */}
                <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {entry.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
