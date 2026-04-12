import { useState } from 'react'
import {
  Search, Building2, User, MessageSquare, Lightbulb, CheckSquare,
  Phone, Mail, Star,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import {
  institutions, keyPersons, interactions, clientNeeds, actionItems,
} from '../data/mockData'
import type { KeyPerson, Interaction, ClientNeed, ActionItem } from '../types'

type Tab = 'profile' | 'persons' | 'interactions' | 'needs' | 'actions'

const tierVariant: Record<string, 'purple' | 'amber' | 'gray' | 'rose'> = {
  Platinum: 'purple',
  Gold: 'amber',
  Silver: 'gray',
  Bronze: 'rose',
}

const tabs: { id: Tab; label: string; icon: typeof Building2 }[] = [
  { id: 'profile', label: '프로필', icon: Building2 },
  { id: 'persons', label: '핵심인물', icon: User },
  { id: 'interactions', label: '인터랙션', icon: MessageSquare },
  { id: 'needs', label: '니즈', icon: Lightbulb },
  { id: 'actions', label: '액션', icon: CheckSquare },
]

const personColumns: Column<KeyPerson>[] = [
  { key: 'name', header: '이름', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
  { key: 'role', header: '직책' },
  { key: 'department', header: '부서' },
  { key: 'decisionAuthority', header: '의사결정권한', render: (r) => (
    <StatusBadge variant={r.decisionAuthority === 'High' ? 'rose' : r.decisionAuthority === 'Medium' ? 'amber' : 'gray'}>
      {r.decisionAuthority}
    </StatusBadge>
  )},
  { key: 'influenceScore', header: '영향력', render: (r) => (
    <span style={{ fontWeight: 700, color: '#034EA2' }}>{r.influenceScore}</span>
  )},
  { key: 'contactPreference', header: '선호채널' },
]

const interactionColumns: Column<Interaction>[] = [
  { key: 'date', header: '날짜' },
  { key: 'type', header: '유형', render: (r) => (
    <StatusBadge variant={r.type === '통화' ? 'blue' : r.type === '미팅' ? 'emerald' : r.type === '블룸버그' ? 'amber' : 'gray'}>
      {r.type}
    </StatusBadge>
  )},
  { key: 'keyPersonName', header: '담당자' },
  { key: 'summary', header: '요약', render: (r) => (
    <span style={{ fontSize: 12, color: '#475569' }}>{r.summary.length > 60 ? r.summary.slice(0, 60) + '...' : r.summary}</span>
  )},
  { key: 'sentiment', header: '감성', render: (r) => (
    <StatusBadge variant={r.sentiment === 'Positive' ? 'emerald' : r.sentiment === 'Negative' ? 'rose' : 'gray'}>
      {r.sentiment === 'Positive' ? '긍정' : r.sentiment === 'Negative' ? '부정' : '중립'}
    </StatusBadge>
  )},
]

const needColumns: Column<ClientNeed>[] = [
  { key: 'category', header: '카테고리', render: (r) => <StatusBadge variant="blue">{r.category}</StatusBadge> },
  { key: 'description', header: '설명', render: (r) => (
    <span style={{ fontSize: 12, color: '#334155' }}>{r.description.length > 80 ? r.description.slice(0, 80) + '...' : r.description}</span>
  )},
  { key: 'urgency', header: '긴급도', render: (r) => (
    <StatusBadge variant={r.urgency === 'HIGH' ? 'rose' : r.urgency === 'MEDIUM' ? 'amber' : 'gray'}>
      {r.urgency}
    </StatusBadge>
  )},
  { key: 'confidence', header: '신뢰도', render: (r) => (
    <span style={{ fontWeight: 600, color: r.confidence >= 0.8 ? '#059669' : '#64748B' }}>{(r.confidence * 100).toFixed(0)}%</span>
  )},
  { key: 'status', header: '상태', render: (r) => (
    <StatusBadge variant={r.status === 'New' ? 'blue' : r.status === 'In Progress' ? 'amber' : r.status === 'Resolved' ? 'emerald' : 'gray'}>
      {r.status}
    </StatusBadge>
  )},
]

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

export default function ClientManagement() {
  const [selectedInstitution, setSelectedInstitution] = useState(institutions[0])
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState<string | null>(null)

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
          {activeTab === 'profile' && (
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
          )}

          {activeTab === 'persons' && (
            <Card noPadding>
              <CardHeader title="핵심인물" subtitle={`${instPersons.length}명`} />
              <DataTable columns={personColumns} data={instPersons} hoverable />
            </Card>
          )}

          {activeTab === 'interactions' && (
            <Card noPadding>
              <CardHeader title="인터랙션 이력" subtitle={`${instInteractions.length}건`} />
              <DataTable columns={interactionColumns} data={instInteractions} hoverable />
            </Card>
          )}

          {activeTab === 'needs' && (
            <Card noPadding>
              <CardHeader title="AI 추출 니즈" subtitle={`${instNeeds.length}건`} />
              <DataTable columns={needColumns} data={instNeeds} hoverable />
            </Card>
          )}

          {activeTab === 'actions' && (
            <Card noPadding>
              <CardHeader title="추천 액션" subtitle={`${instActions.length}건`} />
              <DataTable columns={actionColumns} data={instActions} hoverable />
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
