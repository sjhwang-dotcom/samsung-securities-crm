import { ShieldCheck, Eye, FileText, Award, AlertTriangle, Lock } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { complianceAlerts } from '../data/mockData'
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

// Audit trail (hardcoded 10 entries)
type AuditEntry = { time: string; action: string; user: string; detail: string; severity: 'info' | 'warning' | 'critical' }
const auditTrail: AuditEntry[] = [
  { time: '2026-04-12 09:34', action: '고객정보 조회', user: '김영호', detail: '미래에셋자산운용 핵심인물 정보 열람', severity: 'info' },
  { time: '2026-04-12 09:12', action: '정보교류차단 설정', user: '시스템', detail: 'SK바이오팜 IPO 관련 차단벽 생성', severity: 'critical' },
  { time: '2026-04-12 08:55', action: '리서치 배포', user: '박성진', detail: '반도체 섹터 리포트 287개 기관 배포', severity: 'info' },
  { time: '2026-04-11 17:30', action: '거래 모니터링', user: '시스템', detail: '이상거래 패턴 감지 - 자동 검토 완료', severity: 'warning' },
  { time: '2026-04-11 16:45', action: '고객정보 수정', user: '이지현', detail: '한국투자밸류자산운용 담당자 정보 업데이트', severity: 'info' },
  { time: '2026-04-11 15:20', action: '차단벽 해제', user: '컴플라이언스팀', detail: '카카오게임즈 블록딜 완료 - 차단 해제', severity: 'critical' },
  { time: '2026-04-11 14:10', action: '접근 권한 변경', user: '관리자', detail: '신규 세일즈 담당자 권한 부여', severity: 'warning' },
  { time: '2026-04-11 11:30', action: '감사 로그 내보내기', user: '감사팀', detail: '3월 월간 감사 로그 PDF 생성', severity: 'info' },
  { time: '2026-04-11 10:05', action: '컴플라이언스 교육', user: '시스템', detail: '분기 교육 이수 현황 자동 확인', severity: 'info' },
  { time: '2026-04-10 17:00', action: '정보교류차단 알림', user: '시스템', detail: 'LG에너지솔루션 유상증자 관련 차단 알림 발송', severity: 'critical' },
]

export default function ComplianceCenterSS() {
  const chineseWallAlerts = complianceAlerts.filter(a => a.type === '정보교류차단')
  const activeChineseWall = chineseWallAlerts.filter(a => a.status === 'Active')

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
              {activeChineseWall.map(alert => (
                <div key={alert.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <AlertTriangle size={16} color="#DC2626" />
                    <div>
                      <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 13 }}>
                        {alert.restrictedStock || '미지정'}
                      </div>
                      <div style={{ fontSize: 11, color: '#991B1B', marginTop: 2 }}>
                        {alert.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StatusBadge variant={alert.severity === 'HIGH' ? 'critical' : 'high'}>
                      {alert.severity}
                    </StatusBadge>
                    <span style={{ fontSize: 11, color: '#64748B' }}>{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: 24, textAlign: 'center', color: '#059669', fontSize: 13, background: '#ECFDF5', borderRadius: 10 }}>
              현재 활성화된 정보교류차단 항목이 없습니다.
            </div>
          )}

          {/* All Chinese Wall alerts including resolved */}
          {chineseWallAlerts.filter(a => a.status !== 'Active').length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>해제된 차단 이력</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {chineseWallAlerts.filter(a => a.status !== 'Active').map(alert => (
                  <div key={alert.id} style={{
                    padding: '6px 10px', background: '#F8FAFC', borderRadius: 8, fontSize: 11,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <ShieldCheck size={12} color="#059669" />
                    <span style={{ color: '#334155' }}>{alert.restrictedStock || alert.description.slice(0, 20)}</span>
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
