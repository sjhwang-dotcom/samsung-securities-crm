import { useState } from 'react'
import { Phone, Users, MessageSquare, ArrowUpRight, Mic, Brain, Clock } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { interactions, actionItems } from '../data/mockData'
import type { Interaction, ActionItem } from '../types'

type ActivityTab = 'interactions' | 'followup' | 'transcript'

const interactionColumns: Column<Interaction>[] = [
  { key: 'date', header: '날짜', width: '80px' },
  { key: 'time', header: '시간', width: '55px' },
  { key: 'type', header: '유형', width: '80px', render: (r) => (
    <StatusBadge variant={
      r.type === '통화' ? 'blue' : r.type === '미팅' ? 'emerald' :
      r.type === '블룸버그' ? 'amber' : r.type === '이메일' ? 'purple' : 'gray'
    }>
      {r.type}
    </StatusBadge>
  )},
  { key: 'institutionName', header: '기관명', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.institutionName}</span>
  )},
  { key: 'keyPersonName', header: '담당자', width: '70px' },
  { key: 'summary', header: '요약', render: (r) => (
    <span style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>
      {r.summary.length > 40 ? r.summary.slice(0, 40) + '...' : r.summary}
    </span>
  )},
  { key: 'needsCount', header: '니즈', width: '40px', align: 'center', render: (r) => (
    <span style={{ fontWeight: 700, color: r.needsCount > 0 ? '#034EA2' : '#94A3B8' }}>{r.needsCount}</span>
  )},
  { key: 'sentiment', header: '감성', width: '60px', render: (r) => (
    <StatusBadge variant={r.sentiment === 'Positive' ? 'emerald' : r.sentiment === 'Negative' ? 'rose' : 'gray'}>
      {r.sentiment === 'Positive' ? '긍정' : r.sentiment === 'Negative' ? '부정' : '중립'}
    </StatusBadge>
  )},
]

const followUpColumns: Column<ActionItem>[] = [
  { key: 'institutionName', header: '기관', render: (r) => (
    <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.institutionName}</span>
  )},
  { key: 'description', header: '액션', render: (r) => (
    <span style={{ fontSize: 11, color: '#334155', lineHeight: 1.4 }}>
      {r.description.length > 40 ? r.description.slice(0, 40) + '...' : r.description}
    </span>
  )},
  { key: 'priority', header: '우선순위', width: '80px', render: (r) => (
    <StatusBadge variant={
      r.priority === 'URGENT' ? 'rose' : r.priority === 'THIS_WEEK' ? 'amber' :
      r.priority === 'THIS_MONTH' ? 'blue' : 'gray'
    }>
      {r.priority === 'URGENT' ? '긴급' : r.priority === 'THIS_WEEK' ? '이번주' : r.priority === 'THIS_MONTH' ? '이번달' : '모니터'}
    </StatusBadge>
  )},
  { key: 'status', header: '상태', width: '80px', render: (r) => (
    <StatusBadge variant={r.status === 'In Progress' ? 'amber' : r.status === 'Overdue' ? 'rose' : 'gray'}>
      {r.status}
    </StatusBadge>
  )},
  { key: 'deadline', header: '기한', width: '90px' },
  { key: 'assignee', header: '담당', width: '70px' },
]

const mockTranscript = [
  { time: '00:00', speaker: '김영호 (삼성증권)', text: '박정현 PM님, 안녕하세요. 오늘 반도체 섹터 관련해서 말씀드릴 게 있어서 연락드렸습니다.' },
  { time: '00:12', speaker: '박정현 (미래에셋)', text: '네, 김 부장님. 마침 저도 반도체 비중에 대해 고민하고 있었습니다.' },
  { time: '00:25', speaker: '김영호 (삼성증권)', text: 'HBM 관련해서 SK하이닉스 목표가를 상향했습니다. AI 서버 수요가 2분기부터 본격적으로 반영될 것으로 보고 있습니다.' },
  { time: '00:45', speaker: '박정현 (미래에셋)', text: 'HBM이요? 저희 내부적으로도 HBM3E 양산 일정에 주목하고 있는데, 구체적인 수치가 있을까요?' },
  { time: '01:02', speaker: '김영호 (삼성증권)', text: '네, 저희 리서치센터 분석에 따르면 SK하이닉스 HBM 매출이 전년 대비 85% 증가할 것으로 전망합니다. NVIDIA향 공급 비중이 핵심입니다.' },
  { time: '01:25', speaker: '박정현 (미래에셋)', text: '85%요? 상당히 공격적인 수치네요. 삼성전자 HBM3E 수율 이슈는 어떻게 보시나요?' },
  { time: '01:40', speaker: '김영호 (삼성증권)', text: '삼성전자는 3분기부터 수율 개선이 가시화될 것으로 보입니다. 다만 단기적으로는 SK하이닉스가 유리한 포지션입니다.' },
  { time: '02:05', speaker: '박정현 (미래에셋)', text: '알겠습니다. 그리고 저희 포트폴리오에서 반도체 장비주도 검토하고 싶은데요. ASML이나 국내 장비주 뷰가 있으신가요?' },
  { time: '02:22', speaker: '김영호 (삼성증권)', text: '반도체 장비는 저희가 다음 주에 심층 리포트를 발간할 예정입니다. 초안이 나오면 먼저 공유드리겠습니다.' },
  { time: '02:40', speaker: '박정현 (미래에셋)', text: '좋습니다. 그리고 하나 더, 다음 달 SK하이닉스 NDR 일정이 있으면 참석하고 싶습니다.' },
  { time: '02:55', speaker: '김영호 (삼성증권)', text: '네, 5월 셋째 주에 예정되어 있습니다. 초대장 보내드리겠습니다. 1:1 미팅도 세팅 가능합니다.' },
  { time: '03:10', speaker: '박정현 (미래에셋)', text: '1:1 미팅도 부탁드립니다. 감사합니다, 김 부장님.' },
]

const aiExtractedNeeds = [
  { time: '00:45', category: '리서치요청', description: 'HBM3E 양산 일정 및 구체적 수치 요청', urgency: 'HIGH', confidence: 0.95 },
  { time: '01:25', category: '종목추천', description: '삼성전자 HBM3E 수율 관련 뷰 요청', urgency: 'MEDIUM', confidence: 0.88 },
  { time: '02:05', category: '리서치요청', description: '반도체 장비주 분석 (ASML, 국내 장비주)', urgency: 'HIGH', confidence: 0.92 },
  { time: '02:40', category: '기업탐방', description: 'SK하이닉스 NDR 참석 희망', urgency: 'HIGH', confidence: 0.97 },
  { time: '02:55', category: '기업탐방', description: 'SK하이닉스 경영진 1:1 미팅 요청', urgency: 'MEDIUM', confidence: 0.94 },
]

const tabBtnStyle = (active: boolean) => ({
  padding: '8px 20px',
  fontSize: 13,
  fontWeight: active ? 700 : 500,
  color: active ? '#034EA2' : '#64748B',
  background: active ? '#EFF6FF' : 'transparent',
  border: active ? '1px solid #BFDBFE' : '1px solid transparent',
  borderRadius: 8,
  cursor: 'pointer' as const,
  transition: 'all 0.15s ease',
  display: 'flex',
  alignItems: 'center' as const,
  gap: 6,
})

export default function ActivityManagement() {
  const [activeTab, setActiveTab] = useState<ActivityTab>('interactions')

  const todayCalls = interactions.filter(i => i.type === '통화').length
  const todayMeetings = interactions.filter(i => i.type === '미팅').length
  const todayBloomberg = interactions.filter(i => i.type === '블룸버그').length

  const pendingActions = actionItems
    .filter(a => a.status === 'Pending' || a.status === 'In Progress' || a.status === 'Overdue')
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { URGENT: 0, THIS_WEEK: 1, THIS_MONTH: 2, MONITOR: 3 }
      return (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9)
    })

  const sortedInteractions = [...interactions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div className="kpi-row">
        <KpiCard icon={Phone} label="오늘 통화" value={`${todayCalls}건`} color="blue" trend="+5 전일대비" trendDirection="up" trendPositive />
        <KpiCard icon={Users} label="오늘 미팅" value={`${todayMeetings}건`} color="emerald" trend="예정 1건" trendDirection="up" trendPositive />
        <KpiCard icon={MessageSquare} label="오늘 블룸버그" value={`${todayBloomberg}건`} color="amber" trend="활성 채팅" trendDirection="up" trendPositive />
      </div>

      {/* Tab Bar */}
      <div style={{ gridColumn: 'span 3', display: 'flex', gap: 8, padding: '4px 0' }}>
        <button style={tabBtnStyle(activeTab === 'interactions')} onClick={() => setActiveTab('interactions')}>
          <MessageSquare size={14} /> 인터랙션 로그
        </button>
        <button style={tabBtnStyle(activeTab === 'followup')} onClick={() => setActiveTab('followup')}>
          <ArrowUpRight size={14} /> 후속 조치
        </button>
        <button style={tabBtnStyle(activeTab === 'transcript')} onClick={() => setActiveTab('transcript')}>
          <Mic size={14} /> 음성 트랜스크립트
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'interactions' && (
        <Card noPadding style={{ gridColumn: 'span 3' }}>
          <CardHeader
            title="인터랙션 로그"
            subtitle={`총 ${interactions.length}건`}
            action={
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#034EA2', fontWeight: 600, cursor: 'pointer' }}>
                전체 보기 <ArrowUpRight size={12} />
              </div>
            }
          />
          <DataTable columns={interactionColumns} data={sortedInteractions.slice(0, 15)} compact hoverable />
        </Card>
      )}

      {activeTab === 'followup' && (
        <Card noPadding style={{ gridColumn: 'span 3' }}>
          <CardHeader
            title="후속 조치 대기열"
            subtitle={`${pendingActions.length}건 대기중`}
            badge={
              <StatusBadge variant="rose" dot pulse>
                {pendingActions.filter(a => a.priority === 'URGENT').length}건 긴급
              </StatusBadge>
            }
          />
          <DataTable columns={followUpColumns} data={pendingActions.slice(0, 15)} compact hoverable />
        </Card>
      )}

      {activeTab === 'transcript' && (
        <Card style={{ gridColumn: 'span 3' }}>
          <CardHeader
            title="음성 트랜스크립트 - AI 니즈 추출"
            subtitle="2025-04-11 | 김영호 <> 미래에셋 박정현 PM | 통화 03:10"
            badge={
              <StatusBadge variant="emerald" dot>
                AI 분석 완료
              </StatusBadge>
            }
          />
          <div style={{ display: 'flex', gap: 20, padding: '0 18px 18px' }}>
            {/* Left: Transcript */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Mic size={14} color="#034EA2" /> 통화 녹취록
              </div>
              <div style={{
                maxHeight: 480, overflow: 'auto',
                border: '1px solid #E5E7EB', borderRadius: 10, padding: 14,
                background: '#FAFBFC',
              }}>
                {mockTranscript.map((line, i) => {
                  const isSamsung = line.speaker.includes('삼성증권')
                  const hasNeed = aiExtractedNeeds.some(n => n.time === line.time)
                  return (
                    <div key={i} style={{
                      padding: '8px 10px', marginBottom: 6, borderRadius: 8,
                      background: hasNeed ? '#FFF7ED' : (isSamsung ? '#F0F9FF' : 'white'),
                      border: hasNeed ? '1px solid #FED7AA' : '1px solid #F1F5F9',
                      position: 'relative',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <span style={{
                          fontSize: 10, color: '#94A3B8', fontFamily: 'monospace',
                          display: 'flex', alignItems: 'center', gap: 3,
                        }}>
                          <Clock size={10} /> {line.time}
                        </span>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          color: isSamsung ? '#034EA2' : '#7C3AED',
                        }}>
                          {line.speaker}
                        </span>
                        {hasNeed && (
                          <StatusBadge variant="amber" size="sm">니즈 감지</StatusBadge>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.6, paddingLeft: 2 }}>
                        {line.text}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: AI Extracted Needs */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Brain size={14} color="#034EA2" /> AI 추출 니즈 ({aiExtractedNeeds.length}건)
              </div>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                {aiExtractedNeeds.map((need, i) => (
                  <div key={i} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: 'white', border: '1px solid #E5E7EB',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <StatusBadge variant={
                        need.category === '리서치요청' ? 'blue' :
                        need.category === '종목추천' ? 'purple' :
                        need.category === '기업탐방' ? 'emerald' : 'gray'
                      }>
                        {need.category}
                      </StatusBadge>
                      <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: 'monospace' }}>{need.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, marginBottom: 8 }}>
                      {need.description}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <StatusBadge variant={need.urgency === 'HIGH' ? 'rose' : 'amber'} size="sm">
                        {need.urgency === 'HIGH' ? '긴급' : '보통'}
                      </StatusBadge>
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: need.confidence >= 0.9 ? '#059669' : '#64748B',
                      }}>
                        신뢰도 {(need.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}

                {/* Summary */}
                <div style={{
                  marginTop: 8, padding: '14px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
                  border: '1px solid #BFDBFE',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#034EA2', marginBottom: 8 }}>
                    AI 요약
                  </div>
                  <div style={{ fontSize: 11, color: '#334155', lineHeight: 1.6 }}>
                    미래에셋 박정현 PM은 HBM/반도체 섹터에 높은 관심을 보이고 있으며,
                    특히 SK하이닉스 NDR 참석과 장비주 리서치를 요청했습니다.
                    총 5건의 니즈가 추출되었으며, 3건이 긴급으로 분류됩니다.
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      <span style={{ fontWeight: 700, color: '#034EA2' }}>5</span> 니즈 추출
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      <span style={{ fontWeight: 700, color: '#E11D48' }}>3</span> 긴급
                    </div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      <span style={{ fontWeight: 700, color: '#059669' }}>93%</span> 평균 신뢰도
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
