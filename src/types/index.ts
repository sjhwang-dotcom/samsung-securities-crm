// ═══ Core Domain Types — Samsung Securities Agentic CRM ═══

export interface KPI {
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  trendPositive: boolean
  icon: string
  color: string
}

export interface Institution {
  id: string
  name: string
  nameEn: string
  type: '자산운용사' | '연기금' | '보험사' | '은행신탁' | '외국인기관'
  tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze'
  aum: string
  style: string
  benchmark: string
  rebalancingCycle: string
  commissionBudget: string
  annualCommission: number
  brokerVoteScore: number
  riskScore: number
  salesperson: string
  status: 'Active' | 'Watch' | 'At Risk'
}

export interface KeyPerson {
  id: string
  institutionId: string
  name: string
  role: string
  department: string
  decisionAuthority: 'High' | 'Medium' | 'Low'
  contactPreference: string
  communicationStyle: string
  influenceScore: number
  phone?: string
  email?: string
  notes?: string
}

export interface Salesperson {
  id: string
  name: string
  team: string
  clientCount: number
  monthlyCommission: number
  needsExtracted: number
  actionCompletionRate: number
  avgBrokerVoteScore: number
}

export interface Interaction {
  id: string
  date: string
  time: string
  type: '통화' | '미팅' | '블룸버그' | '이메일' | '기업탐방' | '리서치배포'
  institutionId: string
  institutionName: string
  keyPersonName: string
  salesperson: string
  summary: string
  duration?: string
  needsCount: number
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  followUpRequired: boolean
}

export interface ClientNeed {
  id: string
  interactionId: string
  institutionId: string
  institutionName: string
  category: '종목추천' | '리서치요청' | '기업탐방' | '트레이딩' | '딜참여' | 'ESG' | '기타'
  description: string
  urgency: 'HIGH' | 'MEDIUM' | 'LOW'
  confidence: number
  status: 'New' | 'In Progress' | 'Resolved' | 'Expired'
  extractedDate: string
  sector?: string
  stocks?: string[]
}

export interface ActionItem {
  id: string
  needId?: string
  institutionId: string
  institutionName: string
  description: string
  priority: 'URGENT' | 'THIS_WEEK' | 'THIS_MONTH' | 'MONITOR'
  rationale: string
  assignee: string
  channel: string
  deadline: string
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue'
  revenueImpact?: string
  completionCriteria?: string
}

export interface BrokerVote {
  id: string
  institutionId: string
  institutionName: string
  period: string
  overallScore: number
  previousScore: number
  categories: {
    research: number
    sales: number
    trading: number
    corporateAccess: number
    events: number
  }
  rank: number
  previousRank: number
  estimatedCommission: number
}

export interface ResearchReport {
  id: string
  title: string
  analyst: string
  sector: string
  type: '기업분석' | '산업분석' | '전략' | '매크로' | '퀀트'
  date: string
  stocksCovered: string[]
  recommendation?: 'BUY' | 'HOLD' | 'SELL'
  targetPrice?: string
  distributionCount: number
  openRate: number
  relevanceScore: number
}

export interface CorporateAccessEvent {
  id: string
  company: string
  type: 'NDR' | 'Conference' | '1:1 Meeting' | 'Site Visit' | 'Expert Call'
  date: string
  status: '예정' | '완료' | '취소'
  invitedCount: number
  attendedCount: number
  feedbackScore?: number
  cost: number
  commissionContribution?: number
}

export interface CommissionData {
  month: string
  total: number
  byType: {
    highTouch: number
    dma: number
    algo: number
  }
}

export interface AtRiskClient {
  id: string
  institutionId: string
  name: string
  riskScore: number
  previousRiskScore: number
  severity: 'CRITICAL' | 'WARNING' | 'WATCH'
  factors: {
    engagement: number
    revenueTrajectory: number
    brokerVoteSignal: number
    competitivePressure: number
    coverageGap: number
    personnelChange: number
  }
  recommendation: string
  trend: string
}

export interface ComplianceAlert {
  id: string
  type: '정보교류차단' | '고객정보접근' | '거래제한' | '감사요청'
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  date: string
  status: 'Active' | 'Resolved' | 'Acknowledged'
  restrictedStock?: string
  salesperson?: string
}

export interface ActivityItem {
  text: string
  time: string
  type?: string
}

export interface ChatMessage {
  role: 'ai' | 'user'
  text: string
}

export interface Trade {
  id: string; tradeDate: string; tradeTime: string; institutionId: string; institutionName: string
  stockCode: string; stockName: string; orderType: '매수' | '매도' | '공매도'
  quantity: number; price: number; amount: number; commission: number; commissionRate: number
  executionType: 'High-touch' | 'DMA' | 'Algo'; algoStrategy?: string
}

export interface Deal {
  id: string; company: string; dealType: string; dealSize: string; dealSizeAmount: number
  role: string; commission: number; commissionRate?: number
  participatingInstitutions: string[]; launchDate: string; closeDate?: string; status: string
}

export interface Schedule {
  id: string; salespersonId: string; date: string; startTime: string; endTime?: string
  type: string; title: string; institutionId?: string; keyPersonId?: string; location?: string; description?: string
}

export interface MarketSnapshot {
  id: string; snapshotDate: string; indexName: string; value: number; changePct: number; changeValue: number
}

export interface PortfolioEstimate {
  id: string; institutionId: string; institutionName: string; estimateDate: string
  sectorWeights: Record<string, number>; topHoldings: { stock: string; weight: number }[]
  benchmarkDeviation: number; source: string
}

export interface ClientInterest {
  id: string; institutionId: string; institutionName: string
  interestType: string; interestValue: string; intensity: number
  firstDetected: string; lastDetected: string; mentionCount: number; isActive: boolean
}

export interface CompetitorMention {
  id: string; interactionId: string; institutionId: string; institutionName: string
  competitorName: string; mentionType: string; context: string; threatLevel: string; detectedDate: string
}

export interface ChineseWallRestriction {
  id: string; stockCode: string; stockName: string; reason: string
  restrictedFrom: string; restrictedUntil?: string; isActive: boolean
}

export interface AuditTrailEntry {
  id: string; timestamp: string; eventType: string; actorType: string; actorId: string
  entityType: string; entityId: string; description: string
}

export interface ResearchDistribution {
  id: string; reportId: string; institutionId: string; institutionName: string; keyPersonName: string
  distributedAt: string; channel: string; opened: boolean; openedAt?: string
  downloaded: boolean; timeSpentSecs?: number; feedback?: string
}

export interface CorporateAccessAttendee {
  id: string; eventId: string; institutionId: string; institutionName: string; keyPersonName: string
  rsvpStatus: string; attended: boolean; feedback?: string; feedbackScore?: number
}

export interface SalespersonMetric {
  id: string; salespersonId: string; salespersonName: string; metricDate: string
  callsMade: number; meetingsHeld: number; emailsSent: number; bloombergMsgs: number
  needsExtracted: number; actionCompletionRate: number; avgResponseTimeHours: number
  monthlyCommission: number; avgBrokerVoteScore: number; clientSatisfaction: number
}

export interface IntegrationChannel {
  id: string; channelName: string; protocol: string; status: string
  lastSyncAt: string; totalRecords: number
}
