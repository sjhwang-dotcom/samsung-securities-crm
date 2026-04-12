/**
 * Data layer — Samsung Securities Agentic CRM
 * Sources from JSON files, re-exports typed data for all components.
 */
import type {
  Institution, KeyPerson, Salesperson, Interaction, ClientNeed,
  ActionItem, BrokerVote, ResearchReport, CorporateAccessEvent,
  CommissionData, AtRiskClient, ComplianceAlert, ActivityItem,
} from '../types'

// ═══ Raw DB imports ═══
import _institutions from './db/institutions.json'
import _keyPersons from './db/key_persons.json'
import _salespeople from './db/salespeople.json'
import _interactions from './db/interactions.json'
import _needs from './db/needs.json'
import _actions from './db/actions.json'
import _brokerVotes from './db/broker_votes.json'
import _commissions from './db/commissions.json'
import _research from './db/research_reports.json'
import _corporateAccess from './db/corporate_access.json'
import _kpis from './db/dashboard_kpis.json'
import _volumeTrend from './db/volume_trend.json'
import _atRisk from './db/at_risk_clients.json'
import _activity from './db/recent_activity.json'
import _compliance from './db/compliance_alerts.json'

// ═══ Helper ═══
const fmtPct = (n: number) => `${n.toFixed(1)}%`
const monthLabel = (iso: string) => {
  const d = new Date(iso)
  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  return `${months[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`
}

// ═══ Dashboard KPIs ═══
const k = _kpis as any
export const dashboardKPIs = [
  { label: '월간 수수료', value: `${k.monthly_commission ?? 16.7}억원`, trend: fmtPct(k.commission_trend ?? 5.3), trendDirection: 'up' as const, trendPositive: true, icon: 'TrendingUp', color: 'indigo' },
  { label: '활성 고객', value: `${k.active_clients ?? 287}`, trend: `${k.total_clients ?? 300} 중`, trendDirection: 'up' as const, trendPositive: true, icon: 'Building2', color: 'teal' },
  { label: '평균 보트 점수', value: `${k.avg_broker_vote ?? 7.2}`, trend: `+${k.vote_trend ?? 0.3}`, trendDirection: 'up' as const, trendPositive: true, icon: 'Award', color: 'emerald' },
  { label: '이탈 위험 고객', value: `${k.at_risk_count ?? 12}`, trend: `${k.risk_trend ?? -2}`, trendDirection: 'down' as const, trendPositive: true, icon: 'AlertTriangle', color: 'amber' },
  { label: '니즈 추출', value: `${k.needs_extracted ?? 847}건`, trend: fmtPct(k.needs_trend ?? 12.5), trendDirection: 'up' as const, trendPositive: true, icon: 'Brain', color: 'rose' },
  { label: '액션 완료율', value: fmtPct(k.action_completion_rate ?? 82.3), trend: `+${fmtPct(k.action_trend ?? 4.1)}`, trendDirection: 'up' as const, trendPositive: true, icon: 'CheckCircle', color: 'emerald' },
]

// ═══ Volume Trend ═══
export const volumeData = (_volumeTrend as any[]).map((r: any) => ({
  month: monthLabel(r.month),
  commission: r.commission,
  interactions: r.interactions,
}))

// ═══ Institutions ═══
export const institutions: Institution[] = _institutions as Institution[]

// ═══ Key Persons ═══
export const keyPersons: KeyPerson[] = _keyPersons as KeyPerson[]

// ═══ Salespeople ═══
export const salespeople: Salesperson[] = _salespeople as Salesperson[]

// ═══ Interactions ═══
export const interactions: Interaction[] = (_interactions as any[]).map((r: any) => ({
  ...r,
  duration: r.duration != null ? String(r.duration) : undefined,
})) as Interaction[]

// ═══ Client Needs ═══
export const clientNeeds: ClientNeed[] = _needs as ClientNeed[]

// ═══ Action Items ═══
export const actionItems: ActionItem[] = _actions as ActionItem[]

// ═══ Broker Votes ═══
export const brokerVotes: BrokerVote[] = _brokerVotes as BrokerVote[]

// ═══ Commissions ═══
export const commissions: CommissionData[] = _commissions as CommissionData[]

// ═══ Research Reports ═══
export const researchReports: ResearchReport[] = (_research as any[]).map((r: any) => ({
  ...r,
  recommendation: r.recommendation ?? undefined,
  targetPrice: r.targetPrice ?? undefined,
})) as ResearchReport[]

// ═══ Corporate Access ═══
export const corporateAccessEvents: CorporateAccessEvent[] = _corporateAccess as CorporateAccessEvent[]

// ═══ At-Risk Clients ═══
export const atRiskClients: AtRiskClient[] = _atRisk as AtRiskClient[]

// ═══ Recent Activity ═══
export const recentActivity: ActivityItem[] = (_activity as any[]).map((r: any) => ({
  text: r.text,
  time: r.time,
  type: r.type,
}))

// ═══ Compliance Alerts ═══
export const complianceAlerts: ComplianceAlert[] = _compliance as ComplianceAlert[]

// ═══ Tier Distribution (computed) ═══
export const tierDistribution = [
  { name: 'Platinum', value: institutions.filter(i => i.tier === 'Platinum').length, color: '#8B5CF6' },
  { name: 'Gold', value: institutions.filter(i => i.tier === 'Gold').length, color: '#F59E0B' },
  { name: 'Silver', value: institutions.filter(i => i.tier === 'Silver').length, color: '#94A3B8' },
  { name: 'Bronze', value: institutions.filter(i => i.tier === 'Bronze').length, color: '#CD7F32' },
]

// ═══ Sector Interest (computed from needs) ═══
export const sectorInterest = (() => {
  const sectorMap: Record<string, number> = {}
  clientNeeds.forEach(n => {
    if (n.sector) {
      sectorMap[n.sector] = (sectorMap[n.sector] || 0) + 1
    }
  })
  const colors = ['#034EA2', '#2B7DE9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6', '#EC4899', '#06B6D4']
  return Object.entries(sectorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }))
})()

// ═══ AI Assistant pre-seeded conversations ═══
export const aiChatMessages = [
  { role: 'ai' as const, text: "안녕하세요, 김영호 차장님. 오늘의 AI 분석 결과를 정리했습니다." },
  { role: 'ai' as const, text: `월간 수수료가 전월 대비 ${fmtPct(k.commission_trend ?? 5.3)} 증가한 ${k.monthly_commission ?? 16.7}억원입니다. 미래에셋자산운용의 수수료 기여가 특히 늘었습니다.` },
  { role: 'ai' as const, text: `이탈 위험 고객 ${k.at_risk_count ?? 12}곳 중 3곳이 CRITICAL 등급입니다. 한국밸류자산운용의 참여도가 급감했습니다. 즉시 연락을 권장합니다.` },
  { role: 'user' as const, text: "한국밸류 이탈 위험 원인이 뭐야?" },
  { role: 'ai' as const, text: "세 가지 요인입니다: (1) 최근 3개월간 통화 빈도 60% 감소, (2) 브로커 보트 리서치 카테고리 점수 7.2→5.8 하락, (3) 경쟁사(NH투자증권)의 반도체 애널리스트 커버리지가 강화됐습니다. 반도체 섹터 심층 리포트 배포와 SK하이닉스 기업탐방 초대를 추천합니다." },
]

export const aiInsights = [
  { title: '이탈 경고', text: `${k.at_risk_count ?? 12}곳 이탈 위험 — 위험 수수료 ${(k.monthly_commission * 0.15).toFixed(1)}억원`, severity: 'high' as const, time: '2시간 전' },
  { title: '보트 시즌 준비', text: '2026 H1 보트 시즌 D-45 — 상위 20개 고객 준비 현황 확인', severity: 'medium' as const, time: '오늘' },
  { title: '니즈 급증', text: '반도체 섹터 관련 니즈 전주 대비 35% 증가 — 리서치 배포 추천', severity: 'info' as const, time: '4시간 전' },
  { title: '수수료 마일스톤', text: '분기 수수료 50억원 돌파 — 전년 동기 대비 8.2% 성장', severity: 'positive' as const, time: '어제' },
  { title: '컴플라이언스', text: '정보교류차단 알림 2건 — 자동 차단 처리 완료', severity: 'medium' as const, time: '어제' },
]

// ═══ Commission by Type (for waterfall chart) ═══
export const commissionByType = [
  { name: 'High-touch', value: 9.8, color: '#034EA2' },
  { name: 'DMA', value: 4.2, color: '#2B7DE9' },
  { name: 'Algo', value: 2.7, color: '#60A5FA' },
]

// ═══ Broker Vote Category Averages ═══
export const brokerVoteCategoryAvg = (() => {
  const cats = { research: 0, sales: 0, trading: 0, corporateAccess: 0, events: 0 }
  const count = brokerVotes.length || 1
  brokerVotes.forEach(v => {
    cats.research += v.categories.research
    cats.sales += v.categories.sales
    cats.trading += v.categories.trading
    cats.corporateAccess += v.categories.corporateAccess
    cats.events += v.categories.events
  })
  return [
    { category: '리서치', score: +(cats.research / count).toFixed(1) },
    { category: '세일즈', score: +(cats.sales / count).toFixed(1) },
    { category: '트레이딩', score: +(cats.trading / count).toFixed(1) },
    { category: '기업탐방', score: +(cats.corporateAccess / count).toFixed(1) },
    { category: '이벤트', score: +(cats.events / count).toFixed(1) },
  ]
})()
