import { useState } from 'react'
import {
  Search, Building2, User, MessageSquare, Lightbulb, CheckSquare,
  Phone, Mail, Star, Clock, Filter,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import {
  institutions, keyPersons, interactions, clientNeeds, actionItems,
} from '../data/mockData'
import type { Interaction, ActionItem } from '../types'

type Tab = 'profile' | 'timeline' | 'needs-actions'
type TimelineFilter = 'all' | 'byPerson' | 'byTime' | 'byType'

const tierVariant: Record<string, 'purple' | 'amber' | 'gray' | 'rose'> = {
  Platinum: 'purple',
  Gold: 'amber',
  Silver: 'gray',
  Bronze: 'rose',
}

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: 'profile', label: '프로필', icon: Building2 },
  { id: 'timeline', label: '활동 타임라인', icon: MessageSquare },
  { id: 'needs-actions', label: '니즈/액션', icon: Lightbulb },
]

const typeVariant = (type: string) =>
  type === '통화' ? 'blue' : type === '미팅' ? 'emerald' :
  type === '블룸버그' ? 'amber' : type === '이메일' ? 'purple' :
  type === '기업탐방' ? 'rose' : type === '리서치배포' ? 'indigo' as any : 'gray'

// needColumns removed — needs are rendered inline in 니즈/액션 tab

const actionColumns: Column<ActionItem>[] = [
  { key: 'description', header: '액션', render: (r) => (
    <span style={{ fontSize: 12, color: '#334155' }}>{r.description.length > 60 ? r.description.slice(0, 60) + '...' : r.description}</span>
  )},
  { key: 'priority', header: '우선순위', render: (r) => (
    <StatusBadge variant={r.priority === 'URGENT' ? 'rose' : r.priority === 'THIS_WEEK' ? 'amber' : r.priority === 'THIS_MONTH' ? 'blue' : 'gray'}>
      {r.priority === 'URGENT' ? '긴급' : r.priority === 'THIS_WEEK' ? '이번주' : r.priority === 'THIS_MONTH' ? '이번달' : '모니터링'}
    </StatusBadge>
  )},
  { key: 'status', header: '상태', render: (r) => (
    <StatusBadge variant={r.status === 'Completed' ? 'emerald' : r.status === 'In Progress' ? 'amber' : r.status === 'Overdue' ? 'rose' : 'gray'}>
      {r.status}
    </StatusBadge>
  )},
  { key: 'deadline', header: '기한' },
  { key: 'assignee', header: '담당' },
]

function TimelineItem({ interaction }: { interaction: Interaction }) {
  return (
    <div style={{ display: 'flex', gap: 12, position: 'relative' }}>
      {/* Timeline dot and line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%', marginTop: 4,
          background: interaction.sentiment === 'Positive' ? '#10B981' :
                     interaction.sentiment === 'Negative' ? '#F43F5E' : '#94A3B8',
          border: '2px solid white',
          boxShadow: '0 0 0 2px ' + (interaction.sentiment === 'Positive' ? '#D1FAE5' :
                     interaction.sentiment === 'Negative' ? '#FFE4E6' : '#F1F5F9'),
        }} />
        <div style={{ width: 2, flex: 1, background: '#E5E7EB', marginTop: 4 }} />
      </div>

      {/* Content */}
      <div style={{
        flex: 1, padding: '10px 14px', background: '#FAFBFC', borderRadius: 10,
        border: '1px solid #F1F5F9', marginBottom: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} /> {interaction.date} {interaction.time}
          </span>
          <StatusBadge variant={typeVariant(interaction.type)} size="sm">{interaction.type}</StatusBadge>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>
            <User size={10} style={{ display: 'inline', marginRight: 3, verticalAlign: 'middle' }} />
            {interaction.keyPersonName}
          </span>
          {interaction.needsCount > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: '#034EA2', background: '#EFF6FF', padding: '1px 6px', borderRadius: 10 }}>
              니즈 {interaction.needsCount}건
            </span>
          )}
          <StatusBadge variant={interaction.sentiment === 'Positive' ? 'emerald' : interaction.sentiment === 'Negative' ? 'rose' : 'gray'} size="sm">
            {interaction.sentiment === 'Positive' ? '긍정' : interaction.sentiment === 'Negative' ? '부정' : '중립'}
          </StatusBadge>
        </div>
        <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>
          {interaction.summary}
        </div>
      </div>
    </div>
  )
}

export default function ClientManagement() {
  const [selectedInstitution, setSelectedInstitution] = useState(institutions[0])
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string | null>(null)
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('byTime')

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = !tierFilter || inst.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const instPersons = keyPersons.filter(p => p.institutionId === selectedInstitution.id)
  const instInteractions = interactions.filter(i => i.institutionId === selectedInstitution.id)
  const instNeeds = clientNeeds.filter(n => n.institutionId === selectedInstitution.id)
  const instActions = actionItems.filter(a => a.institutionId === selectedInstitution.id)

  const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'] as const

  const sortedInteractions = [...instInteractions].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  // Group by person
  const byPerson: Record<string, Interaction[]> = {}
  instInteractions.forEach(i => {
    if (!byPerson[i.keyPersonName]) byPerson[i.keyPersonName] = []
    byPerson[i.keyPersonName].push(i)
  })

  // Group by type
  const byType: Record<string, Interaction[]> = {}
  instInteractions.forEach(i => {
    if (!byType[i.type]) byType[i.type] = []
    byType[i.type].push(i)
  })

  const filterBtnStyle = (active: boolean) => ({
    padding: '5px 12px', fontSize: 11, fontWeight: active ? 700 : 500,
    color: active ? '#034EA2' : '#64748B',
    background: active ? '#EFF6FF' : '#F8FAFC',
    border: active ? '1px solid #BFDBFE' : '1px solid #E5E7EB',
    borderRadius: 6, cursor: 'pointer' as const,
  })

  return (
    <div className="dashboard-grid" style={{ display: 'flex', gap: 16, height: 'calc(100vh - 120px)' }}>
      {/* Left Sidebar */}
      <div style={{ width: 320, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            placeholder="기관 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
              paddingLeft: 34, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
              fontSize: 13, outline: 'none', color: '#334155', boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Tier filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setTierFilter(null)}
            style={{
              fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: !tierFilter ? '#034EA2' : '#F1F5F9', color: !tierFilter ? 'white' : '#64748B',
            }}
          >
            전체
          </button>
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tierFilter === tier ? null : tier)}
              style={{
                fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer',
                background: tierFilter === tier ? '#034EA2' : '#F1F5F9',
                color: tierFilter === tier ? 'white' : '#64748B',
              }}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Institution list */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredInstitutions.map(inst => (
            <div
              key={inst.id}
              onClick={() => { setSelectedInstitution(inst); setActiveTab('profile') }}
              style={{
                padding: '10px 12px', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                background: selectedInstitution.id === inst.id ? '#EFF6FF' : 'white',
                border: selectedInstitution.id === inst.id ? '1px solid #BFDBFE' : '1px solid transparent',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{inst.name}</span>
                <StatusBadge variant={tierVariant[inst.tier]} size="sm">{inst.tier}</StatusBadge>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>
                {inst.type} | AUM {inst.aum}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #034EA2, #2B7DE9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Building2 size={20} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{selectedInstitution.name}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{selectedInstitution.nameEn}</div>
          </div>
          <StatusBadge variant={tierVariant[selectedInstitution.tier]} size="md">{selectedInstitution.tier}</StatusBadge>
          <StatusBadge
            variant={selectedInstitution.status === 'Active' ? 'emerald' : selectedInstitution.status === 'At Risk' ? 'rose' : 'amber'}
            size="md"
            dot
            pulse={selectedInstitution.status === 'At Risk'}
          >
            {selectedInstitution.status}
          </StatusBadge>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', marginBottom: 16 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                padding: '10px 14px', fontSize: 12,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? '#034EA2' : '#64748B',
                background: 'none', border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #034EA2' : '2px solid transparent',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              <tab.icon size={14} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Card>
                <CardHeader title="기관 프로필" subtitle={selectedInstitution.nameEn} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '0 18px 18px' }}>
                  {[
                    { label: '기관유형', value: selectedInstitution.type },
                    { label: 'AUM', value: selectedInstitution.aum },
                    { label: '투자스타일', value: selectedInstitution.style },
                    { label: '벤치마크', value: selectedInstitution.benchmark },
                    { label: '리밸런싱 주기', value: selectedInstitution.rebalancingCycle },
                    { label: '수수료 예산', value: selectedInstitution.commissionBudget },
                    { label: '연간 수수료', value: `${selectedInstitution.annualCommission}억원` },
                    { label: '보트 점수', value: String(selectedInstitution.brokerVoteScore) },
                    { label: '담당 세일즈', value: selectedInstitution.salesperson },
                    { label: '위험 점수', value: String(selectedInstitution.riskScore) },
                  ].map(item => (
                    <div key={item.label} style={{ padding: 12, background: '#FAFBFC', borderRadius: 10 }}>
                      <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ padding: '0 18px 18px', display: 'flex', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                    <Phone size={12} /> 주요 연락처 {instPersons.length}명
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                    <Mail size={12} /> 최근 인터랙션 {instInteractions.length}건
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
                    <Star size={12} /> 니즈 {instNeeds.length}건
                  </div>
                </div>
              </Card>

              {/* Key Persons inline */}
              <Card>
                <CardHeader title="핵심인물" subtitle={`${instPersons.length}명`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 18px 18px' }}>
                  {instPersons.map(person => (
                    <div key={person.id} style={{
                      padding: '12px 14px', background: '#FAFBFC', borderRadius: 10,
                      border: '1px solid #F1F5F9',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: 'linear-gradient(135deg, #034EA2, #2B7DE9)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color: 'white',
                        }}>
                          {person.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{person.name}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{person.role} | {person.department}</div>
                        </div>
                        <StatusBadge variant={person.decisionAuthority === 'High' ? 'rose' : person.decisionAuthority === 'Medium' ? 'amber' : 'gray'} size="sm">
                          의사결정: {person.decisionAuthority}
                        </StatusBadge>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#034EA2' }}>영향력 {person.influenceScore}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#64748B', paddingLeft: 42 }}>
                        {person.phone && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Phone size={10} /> {person.phone}
                          </span>
                        )}
                        {person.email && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Mail size={10} /> {person.email}
                          </span>
                        )}
                        <span>선호: {person.contactPreference}</span>
                      </div>
                      {person.notes && (
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 4, paddingLeft: 42, lineHeight: 1.4 }}>
                          {person.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              {/* Filter bar */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 16, alignItems: 'center' }}>
                <Filter size={13} color="#64748B" />
                <button style={filterBtnStyle(timelineFilter === 'all')} onClick={() => setTimelineFilter('all')}>전체</button>
                <button style={filterBtnStyle(timelineFilter === 'byPerson')} onClick={() => setTimelineFilter('byPerson')}>인물별</button>
                <button style={filterBtnStyle(timelineFilter === 'byTime')} onClick={() => setTimelineFilter('byTime')}>시간순</button>
                <button style={filterBtnStyle(timelineFilter === 'byType')} onClick={() => setTimelineFilter('byType')}>유형별</button>
                <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>총 {instInteractions.length}건</span>
              </div>

              {/* Chronological / All */}
              {(timelineFilter === 'byTime' || timelineFilter === 'all') && (
                <div>
                  {sortedInteractions.map(interaction => (
                    <TimelineItem key={interaction.id} interaction={interaction} />
                  ))}
                  {sortedInteractions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8', fontSize: 13 }}>
                      인터랙션 이력이 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* By Person */}
              {timelineFilter === 'byPerson' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {Object.entries(byPerson).map(([personName, personInteractions]) => (
                    <div key={personName}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                        padding: '8px 12px', background: '#EFF6FF', borderRadius: 8,
                      }}>
                        <User size={14} color="#034EA2" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#034EA2' }}>{personName}</span>
                        <span style={{ fontSize: 11, color: '#64748B' }}>{personInteractions.length}건</span>
                      </div>
                      {personInteractions
                        .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
                        .map(interaction => (
                          <TimelineItem key={interaction.id} interaction={interaction} />
                        ))
                      }
                    </div>
                  ))}
                </div>
              )}

              {/* By Type */}
              {timelineFilter === 'byType' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {Object.entries(byType).map(([typeName, typeInteractions]) => (
                    <div key={typeName}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                        padding: '8px 12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E5E7EB',
                      }}>
                        <StatusBadge variant={typeVariant(typeName)}>{typeName}</StatusBadge>
                        <span style={{ fontSize: 11, color: '#64748B' }}>{typeInteractions.length}건</span>
                      </div>
                      {typeInteractions
                        .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime())
                        .map(interaction => (
                          <TimelineItem key={interaction.id} interaction={interaction} />
                        ))
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Needs/Actions Tab */}
          {activeTab === 'needs-actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Needs with linked actions */}
              <Card>
                <CardHeader title="AI 추출 니즈" subtitle={`${instNeeds.length}건`} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 18px 18px' }}>
                  {instNeeds.map(need => {
                    const linkedActions = instActions.filter(a => a.needId === need.id)
                    return (
                      <div key={need.id} style={{
                        padding: '12px 14px', background: '#FAFBFC', borderRadius: 10,
                        border: '1px solid #F1F5F9',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                          <StatusBadge variant="blue">{need.category}</StatusBadge>
                          <StatusBadge variant={need.urgency === 'HIGH' ? 'rose' : need.urgency === 'MEDIUM' ? 'amber' : 'gray'} size="sm">
                            {need.urgency === 'HIGH' ? '긴급' : need.urgency === 'MEDIUM' ? '보통' : '낮음'}
                          </StatusBadge>
                          <StatusBadge variant={need.status === 'New' ? 'blue' : need.status === 'In Progress' ? 'amber' : need.status === 'Resolved' ? 'emerald' : 'gray'} size="sm">
                            {need.status}
                          </StatusBadge>
                          <span style={{ fontSize: 10, fontWeight: 600, color: need.confidence >= 0.8 ? '#059669' : '#64748B', marginLeft: 'auto' }}>
                            신뢰도 {(need.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5, marginBottom: linkedActions.length > 0 ? 8 : 0 }}>
                          {need.description}
                        </div>
                        {need.sector && (
                          <div style={{ fontSize: 11, color: '#64748B', marginBottom: linkedActions.length > 0 ? 6 : 0 }}>
                            섹터: {need.sector} {need.stocks && need.stocks.length > 0 && `| 종목: ${need.stocks.join(', ')}`}
                          </div>
                        )}

                        {/* Linked actions */}
                        {linkedActions.length > 0 && (
                          <div style={{
                            marginTop: 6, paddingTop: 8,
                            borderTop: '1px dashed #E5E7EB',
                          }}>
                            {linkedActions.map(action => (
                              <div key={action.id} style={{
                                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
                              }}>
                                <CheckSquare size={12} color="#034EA2" />
                                <span style={{ fontSize: 11, color: '#334155', flex: 1 }}>
                                  {action.description.length > 60 ? action.description.slice(0, 60) + '...' : action.description}
                                </span>
                                <StatusBadge variant={action.priority === 'URGENT' ? 'rose' : action.priority === 'THIS_WEEK' ? 'amber' : 'blue'} size="sm">
                                  {action.priority === 'URGENT' ? '긴급' : action.priority === 'THIS_WEEK' ? '이번주' : action.priority === 'THIS_MONTH' ? '이번달' : '모니터링'}
                                </StatusBadge>
                                <StatusBadge variant={action.status === 'Completed' ? 'emerald' : action.status === 'In Progress' ? 'amber' : action.status === 'Overdue' ? 'rose' : 'gray'} size="sm">
                                  {action.status}
                                </StatusBadge>
                                <span style={{ fontSize: 10, color: '#94A3B8' }}>{action.deadline}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                  {instNeeds.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 30, color: '#94A3B8', fontSize: 13 }}>
                      추출된 니즈가 없습니다.
                    </div>
                  )}
                </div>
              </Card>

              {/* Unlinked actions (those without a needId or whose needId is not in instNeeds) */}
              {(() => {
                const linkedNeedIds = new Set(instNeeds.map(n => n.id))
                const unlinkedActions = instActions.filter(a => !a.needId || !linkedNeedIds.has(a.needId))
                if (unlinkedActions.length === 0) return null
                return (
                  <Card noPadding>
                    <CardHeader title="추가 액션 아이템" subtitle={`${unlinkedActions.length}건`} />
                    <DataTable columns={actionColumns} data={unlinkedActions} hoverable />
                  </Card>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
