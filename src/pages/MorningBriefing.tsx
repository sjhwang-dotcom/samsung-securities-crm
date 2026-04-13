import { useState } from 'react'
import { StatusBadge } from '../components/ui'
import { actionItems, atRiskClients, researchReports, interactions } from '../data/mockData'
import {
  Sun, CheckCircle, Clock, Calendar, TrendingUp, AlertTriangle,
  FileText, Radio, Mail, Phone, MessageSquare, Database, BarChart3,
} from 'lucide-react'

// ═══ Hardcoded schedule data ═══
const todaySchedule = [
  { time: '08:00', title: '모닝 미팅', detail: '리서치센터 합동', type: 'meeting' },
  { time: '09:00', title: '미래에셋 박정현 PM 통화', detail: '방산 섹터 업데이트', type: 'call' },
  { time: '10:30', title: '국민연금공단 이승재 CIO 방문', detail: '2분기 리밸런싱 논의', type: 'visit' },
  { time: '12:00', title: '삼성자산운용 점심 미팅', detail: '반도체 뷰 공유', type: 'meeting' },
  { time: '14:00', title: 'SK하이닉스 기업탐방', detail: 'IR팀', type: 'visit' },
  { time: '16:00', title: '한국밸류자산운용 관계 회복 통화', detail: '', type: 'call' },
]

const marketData = [
  { label: 'KOSPI', value: '2,845.32', change: '+0.8%', positive: true },
  { label: 'KOSDAQ', value: '892.15', change: '+1.2%', positive: true },
  { label: 'USD/KRW', value: '1,342.50', change: '-0.3%', positive: true },
  { label: '국고채 3년', value: '3.25%', change: '+2bp', positive: false },
]

// Channel stats derived from actual interaction data
const channelStats = (() => {
  const typeMap: Record<string, string> = { '통화': '전화', '미팅': '미팅', '블룸버그': '블룸버그', '이메일': '이메일', '기업탐방': '기업탐방', '리서치배포': '리서치 포탈' }
  const counts: Record<string, number> = {}
  interactions.forEach(i => {
    const ch = typeMap[i.type] || i.type
    counts[ch] = (counts[ch] || 0) + 1
  })
  return counts
})()

const channels = [
  { icon: Mail, name: '이메일', protocol: 'Exchange API', status: '연결됨', lastSync: '08:00', count: channelStats['이메일'] || 0 },
  { icon: Phone, name: '전화', protocol: 'STT 자동기록', status: '연결됨', lastSync: '실시간', count: channelStats['전화'] || 0 },
  { icon: MessageSquare, name: '블룸버그', protocol: 'B-PIPE / IB Chat', status: '연결됨', lastSync: '실시간', count: channelStats['블룸버그'] || 0 },
  { icon: Calendar, name: '캘린더', protocol: 'MS Graph API', status: '동기화중', lastSync: '07:55', count: channelStats['미팅'] || 0 },
  { icon: Database, name: 'OMS', protocol: '실시간 체결 연동', status: '연결됨', lastSync: '실시간', count: 0 },
  { icon: FileText, name: '리서치 포탈', protocol: 'REST API', status: '연결됨', lastSync: '07:50', count: channelStats['리서치 포탈'] || 0 },
]

// ═══ Helper: priority sort order ═══
const priorityOrder: Record<string, number> = { URGENT: 0, THIS_WEEK: 1, THIS_MONTH: 2, MONITOR: 3 }

export default function MorningBriefing() {
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set())

  // Filter & sort action items
  const priorityActions = actionItems
    .filter(a => a.priority === 'URGENT' || a.priority === 'THIS_WEEK')
    .sort((a, b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9))
    .slice(0, 5)

  // Top 3 at-risk (CRITICAL/WARNING)
  const topRisks = atRiskClients
    .filter(c => c.severity === 'CRITICAL' || c.severity === 'WARNING')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3)

  // Top 3 research by relevance
  const topResearch = [...researchReports]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3)

  const toggleAction = (id: string) => {
    setCheckedActions(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* ── Section 1: Header ── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748B', fontSize: 14, marginBottom: 4 }}>
            <Sun size={16} />
            <span>2026년 4월 13일 월요일</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0F172A', margin: '4px 0 12px' }}>
            좋은 아침입니다, 김영호 차장님
          </h1>
          <div style={{
            background: 'linear-gradient(135deg, #034EA2 0%, #2B7DE9 100%)',
            borderRadius: 12,
            padding: '16px 20px',
            color: '#fff',
            fontSize: 14,
            lineHeight: 1.7,
          }}>
            <strong>AI 브리핑</strong> &mdash; 오늘 핵심 3가지: (1) 국민연금 이승재 CIO 방문 &mdash; 2분기 리밸런싱 논의 준비 필수, (2) 한국밸류자산운용 이탈 위험 CRITICAL &mdash; 관계 회복 통화 예정, (3) SK하이닉스 기업탐방 &mdash; 반도체 뷰 최신화 필요
          </div>
        </div>

        {/* ── Section 2: 오늘의 우선 액션 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<CheckCircle size={16} />} title="오늘의 우선 액션" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {priorityActions.map(action => (
              <div
                key={action.id}
                style={{
                  background: '#fff',
                  borderRadius: 10,
                  padding: '14px 18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${action.priority === 'URGENT' ? '#EF4444' : '#F59E0B'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                }}
              >
                <input
                  type="checkbox"
                  checked={checkedActions.has(action.id)}
                  onChange={() => toggleAction(action.id)}
                  style={{ marginTop: 3, accentColor: '#034EA2', width: 16, height: 16, cursor: 'pointer' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{action.institutionName}</span>
                    <StatusBadge status={action.priority} size="sm" />
                  </div>
                  <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{action.description}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                    <Clock size={11} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                    기한: {action.deadline}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: 오늘 일정 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<Calendar size={16} />} title="오늘 일정" />
          <div style={{ position: 'relative', paddingLeft: 72 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 56, top: 8, bottom: 8, width: 2,
              background: '#E2E8F0', borderRadius: 1,
            }} />
            {todaySchedule.map((item, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: i < todaySchedule.length - 1 ? 16 : 0 }}>
                {/* Time label */}
                <div style={{
                  position: 'absolute', left: -72, top: 12, width: 48,
                  textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#64748B',
                }}>
                  {item.time}
                </div>
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: -21, top: 14, width: 10, height: 10,
                  borderRadius: '50%', background: item.type === 'visit' ? '#034EA2' : item.type === 'call' ? '#10B981' : '#F59E0B',
                  border: '2px solid #fff', boxShadow: '0 0 0 2px #E2E8F0',
                }} />
                {/* Card */}
                <div style={{
                  background: '#fff', borderRadius: 10, padding: '12px 16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{item.title}</div>
                  {item.detail && (
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{item.detail}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 4: 시장 현황 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<TrendingUp size={16} />} title="시장 현황" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {marketData.map(m => (
              <div key={m.label} style={{
                background: '#fff', borderRadius: 10, padding: '14px 16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6, fontWeight: 500 }}>{m.label}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>{m.value}</div>
                <div style={{
                  fontSize: 13, fontWeight: 600, marginTop: 4,
                  color: m.change.startsWith('+') ? '#10B981' : m.change.startsWith('-') ? '#EF4444' : '#64748B',
                }}>
                  {m.change}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 5: 이탈 위험 알림 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<AlertTriangle size={16} />} title="이탈 위험 알림" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topRisks.map(client => (
              <div
                key={client.id}
                style={{
                  background: '#fff', borderRadius: 10, padding: '14px 18px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${client.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{client.name}</span>
                  <StatusBadge status={client.severity} size="sm" />
                  <span style={{ fontSize: 12, color: '#94A3B8', marginLeft: 'auto' }}>
                    위험 점수: {client.riskScore}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{client.recommendation}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 6: 리서치 하이라이트 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<FileText size={16} />} title="리서치 하이라이트" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topResearch.map(report => (
              <div key={report.id} style={{
                background: '#fff', borderRadius: 10, padding: '14px 18px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{report.title}</span>
                  {report.recommendation && <StatusBadge status={report.recommendation} size="sm" />}
                </div>
                <div style={{ fontSize: 13, color: '#64748B' }}>
                  {report.analyst} &middot; {report.sector} &middot; 관련도 {report.relevanceScore}%
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>
                  {report.stocksCovered.slice(0, 3).join(', ')} 커버리지
                  {report.targetPrice ? ` &middot; 목표가 ${report.targetPrice}` : ''}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 7: 연동 채널 현황 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<Radio size={16} />} title="연동 채널 현황" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
            {channels.map(ch => {
              const Icon = ch.icon
              return (
                <div key={ch.name} style={{
                  background: '#fff', borderRadius: 10, padding: '12px 10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', textAlign: 'center',
                }}>
                  <Icon size={18} style={{ color: '#034EA2', marginBottom: 4 }} />
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#0F172A', marginBottom: 2 }}>{ch.name}</div>
                  <div style={{ fontSize: 9, color: '#94A3B8', marginBottom: 4 }}>{ch.protocol}</div>
                  <StatusBadge
                    variant={ch.status === '연결됨' ? 'emerald' : 'amber'}
                    size="sm"
                    dot
                    pulse={ch.status === '동기화중'}
                  >
                    {ch.status}
                  </StatusBadge>
                  {ch.count > 0 && (
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#034EA2', marginTop: 4 }}>{ch.count}건</div>
                  )}
                  <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>최근: {ch.lastSync}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Section 8: 어제 활동 요약 ── */}
        <section style={{ marginBottom: 32 }}>
          <SectionHeader icon={<BarChart3 size={16} />} title="어제 활동 요약" />
          <div style={{
            background: '#fff', borderRadius: 10, padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            {/* Activity stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
              {[
                { label: '통화', value: `${channelStats['전화'] || 0}건`, icon: Phone, color: '#10B981' },
                { label: '미팅', value: `${channelStats['미팅'] || 0}건`, icon: Calendar, color: '#034EA2' },
                { label: '이메일', value: `${channelStats['이메일'] || 0}건`, icon: Mail, color: '#F59E0B' },
                { label: '블룸버그', value: `${channelStats['블룸버그'] || 0}건`, icon: MessageSquare, color: '#8B5CF6' },
              ].map(s => {
                const SIcon = s.icon
                return (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <SIcon size={18} style={{ color: s.color, marginBottom: 4 }} />
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{s.label}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 14, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <StatItem label="AI 추출 니즈" value="18건" sub="전일 대비 +3" />
              <StatItem label="완료 액션" value="8건" sub="" />
              <StatItem label="미완료 액션" value="4건" sub="" />
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

// ═══ Sub-components ═══

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 14, fontWeight: 700, color: '#0F172A',
      marginBottom: 12,
    }}>
      {icon}
      {title}
    </div>
  )
}

function StatItem({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: '#10B981' }}>{sub}</span>}
      </div>
    </div>
  )
}
