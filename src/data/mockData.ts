/**
 * Data layer — sources from DuckDB-exported JSON files.
 * Re-exports in the same shape as the original hardcoded mock data
 * so all existing component imports continue to work.
 */
import type { Merchant, Lead, AtRiskMerchant, ActivityItem, OnboardingApp, VoiceCall } from '../types'

// ═══ Raw DB imports ═══
import _isos from './db/isos.json'
import _merchants from './db/merchants.json'
import _kpis from './db/dashboard_kpis.json'
import _volumeTrend from './db/volume_trend.json'
import _categoryMix from './db/category_mix.json'
import _isoPortfolio from './db/iso_portfolio.json'
import _atRisk from './db/at_risk_merchants.json'
import _activity from './db/recent_activity.json'
import _crm from './db/crm_data.json'
import _partnerPortal from './db/partner_portal.json'
import _riskDist from './db/risk_distribution.json'
import _procDist from './db/processor_distribution.json'
import _prodPen from './db/product_penetration.json'
import _cbTrend from './db/chargeback_trend.json'
import _voiceCalls from './db/voice_calls.json'
import _voiceHourly from './db/voice_hourly.json'
import _callOutcomes from './db/call_outcomes.json'

// ═══ Helper ═══
const fmt = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${(n / 1e3).toFixed(0)}K`
const fmtPct = (n: number) => `${n.toFixed(1)}%`
const monthLabel = (iso: string) => {
  const d = new Date(iso)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return `${months[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`
}

// ═══ Dashboard KPIs ═══
const k = _kpis as any
export const dashboardKPIs = [
  { label: 'Total Merchants', value: k.total_merchants?.toLocaleString() ?? '4,612', trend: '3.2%', trendDirection: 'up' as const, trendPositive: true, icon: 'Users', color: 'teal' },
  { label: 'Monthly Volume', value: fmt(k.monthly_volume ?? 32100000), trend: fmtPct(k.monthly_volume_trend ?? 8.4), trendDirection: 'up' as const, trendPositive: true, icon: 'DollarSign', color: 'indigo' },
  { label: 'Monthly Residuals', value: fmt(k.monthly_residuals ?? 3210000), trend: fmtPct(k.monthly_residuals_trend ?? 5.2), trendDirection: 'up' as const, trendPositive: true, icon: 'TrendingUp', color: 'emerald' },
  { label: 'Portfolio Churn', value: fmtPct(k.churn_rate ?? 1.4), trend: '0.4%', trendDirection: 'down' as const, trendPositive: true, icon: 'UserMinus', color: 'emerald' },
  { label: 'Chargeback Rate', value: fmtPct(k.chargeback_rate ?? 0.35), trend: '0.02%', trendDirection: 'down' as const, trendPositive: true, icon: 'AlertTriangle', color: 'amber' },
]

// ═══ Volume Trend ═══
export const volumeData = (_volumeTrend as any[]).map((r: any) => ({
  month: monthLabel(r.month),
  volume: r.volume_m,
  residuals: r.residuals_m,
}))

// ═══ Category Mix ═══
export const categoryMixData = (_categoryMix as any[]).map((r: any) => ({
  name: r.name,
  value: r.value,
  color: r.color,
}))

// ═══ ISO Portfolio ═══
export const isoPortfolio = (_isoPortfolio as any[]).map((r: any) => ({
  name: r.name,
  merchants: r.merchants?.toLocaleString() ?? '0',
  volume: `$${r.volume_m}M`,
  churn: fmtPct(r.churn_rate ?? 0),
  penetration: fmtPct(r.penetration ?? 0),
  status: r.status === 'Primary' ? 'Primary' : `Acquired`,
  statusColor: r.status === 'Primary' ? 'teal' as const : 'emerald' as const,
}))

// ═══ At-Risk Merchants ═══
export const atRiskMerchants: AtRiskMerchant[] = (_atRisk as any[]).map((r: any) => ({
  name: r.name,
  riskScore: r.riskScore,
  volume: r.volume,
  trend: r.trend,
  severity: r.severity as AtRiskMerchant['severity'],
}))

// ═══ Recent Activity ═══
export const recentActivity: ActivityItem[] = (_activity as any[]).map((r: any) => ({
  text: r.text,
  time: r.time,
}))

// ═══ Lead Pipeline ═══
// ═══ Lead Pipeline (from DuckDB leads table) ═══
export const leadPipeline: Record<string, Lead[]> = Object.fromEntries(
  Object.entries((_crm as any).leadPipeline as Record<string, any[]>).map(([stage, leads]) => [
    stage,
    leads.map((l: any) => ({
      name: l.name,
      location: l.location ?? '',
      mcc: l.mcc ?? '',
      estVolume: l.estVolume ?? l.estvolume ?? '',
      aiScore: l.aiScore ?? l.aiscore ?? 50,
      detail: l.detail ?? undefined,
    })),
  ])
)

// ═══ Merchants (use DB data, map to existing type) ═══
export const merchants: Merchant[] = (_merchants as any[]).slice(0, 50).map((m: any) => ({
  name: m.dba_name,
  mid: m.mid ?? '—',
  processor: m.processor ?? '—',
  equipment: 'PAX A920', // equipment is separate table, simplified
  monthlyVol: fmt((m.annual_volume_estimate ?? 0) / 12),
  pciStatus: (['Active'].includes(m.status) ? (Math.random() > 0.15 ? 'Compliant' : 'Non-Compliant') : 'N/A') as Merchant['pciStatus'],
  status: m.status as Merchant['status'],
}))

// Full merchant list for ISO Management
export const allMerchants = (_merchants as any[]).map((m: any) => ({
  merchant_id: m.merchant_id,
  iso_id: m.iso_id,
  iso_name: m.iso_name,
  name: m.dba_name,
  mid: m.mid,
  mcc: m.mcc,
  mcc_desc: m.mcc_desc,
  category: m.category,
  processor: m.processor,
  status: m.status,
  avg_ticket: m.avg_ticket,
  risk_score: m.risk_score,
  city: m.address_city,
  state: m.address_state,
  boarding_date: m.boarding_date,
  annual_volume: m.annual_volume_estimate,
}))

// ═══ Onboarding Apps ═══
export const onboardingApps: OnboardingApp[] = ((_crm as any).applications as any[]).map((a: any) => ({
  merchant: a.merchant,
  bank: a.bank ?? 'Esquire Bank',
  submitted: a.submitted ? new Date(a.submitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
  stage: a.stage,
  riskScore: a.riskScore ?? a.riskscore ?? null,
  riskLabel: a.riskLabel ?? a.risklabel ?? 'Pending',
  status: a.status,
  assigned: a.assigned ?? '',
}))

// ═══ Voice Calls ═══
export const voiceCalls: VoiceCall[] = (_voiceCalls as any[]).map((c: any) => ({
  phone: c.phone ?? '',
  merchant: c.merchant ?? '',
  status: c.status,
  duration: c.duration ?? '0:00',
  stage: c.stage ?? '—',
  sentiment: c.sentiment ?? 'Neutral',
}))

export const voiceHourlyData = (_voiceHourly as any[]).map((r: any) => ({
  hour: r.hour,
  calls: r.calls,
  transferRate: r.transferRate ?? r.transferrate ?? 0,
}))

export const callOutcomeData = (_callOutcomes as any[]).map((r: any) => ({
  name: r.name,
  value: r.value,
  color: r.color,
}))

// ═══ Risk ═══
export const riskDistribution = (_riskDist as any[]).map((r: any) => ({
  range: r.range,
  label: r.label,
  pct: r.pct,
  color: r.color,
}))

export const riskByMCC = [
  { mcc: '5944', label: 'Jewelry', avgScore: 42, color: '#F43F5E' },
  { mcc: '7542', label: 'Car Wash', avgScore: 51, color: '#F59E0B' },
  { mcc: '7941', label: 'Recreation', avgScore: 58, color: '#EAB308' },
  { mcc: '5812', label: 'Restaurants', avgScore: 71, color: '#86EFAC' },
  { mcc: '5411', label: 'Grocery', avgScore: 78, color: '#10B981' },
]

// ═══ Processor ═══
export const processorDistribution = (_procDist as any[]).map((r: any) => ({
  name: r.name,
  volume: r.volume,
  pct: r.pct,
}))

// ═══ Products ═══
export const productPenetration = (_prodPen as any[]).map((r: any) => ({
  product: r.product,
  enrolled: r.enrolled,
  eligible: r.eligible,
  rate: r.rate,
  revenue: r.revenue,
}))

// ═══ Chargebacks ═══
export const chargebackTrendData = (_cbTrend as any[]).map((r: any) => ({
  month: monthLabel(r.month),
  portfolio: r.portfolio,
  visa: r.visa,
  mc: r.mc,
}))

// ═══ Merchant Deposits (keep hardcoded - specific to merchant portal) ═══
export const merchantDeposits = [
  { date: 'Mar 14', amount: '$2,013.90', status: 'Deposited' },
  { date: 'Mar 13', amount: '$1,795.50', status: 'Deposited' },
  { date: 'Mar 12', amount: '$1,496.80', status: 'Deposited' },
  { date: 'Mar 11', amount: '$2,155.80', status: 'Deposited' },
]

// ═══ Lumina (keep hardcoded - AI conversation) ═══
export const luminaChatMessages = [
  { role: 'ai' as const, text: "Good morning, Sarah. I've completed my overnight analysis across all 3 ISOs. Key highlights:" },
  { role: 'ai' as const, text: `Portfolio volume is up ${fmtPct(k.monthly_volume_trend ?? 8.4)} month-over-month to ${fmt(k.monthly_volume ?? 32100000)}. Zenith integration is tracking ahead of schedule — 96% of merchants migrated.` },
  { role: 'ai' as const, text: `I've flagged ${_atRisk.length} merchants for attrition risk. ${(_atRisk as any[])[0]?.name ?? 'Top merchant'} is the most urgent. Recommend immediate outreach.` },
  { role: 'user' as const, text: `What's driving the ${(_atRisk as any[])[0]?.name ?? 'merchant'} decline?` },
  { role: 'ai' as const, text: "Three factors: (1) PCI non-compliant for 94 days — they may be shopping processors, (2) a new competing business opened nearby in January, (3) their average ticket dropped significantly suggesting operational changes. I'd recommend calling with a retention offer — perhaps waive the PCI fee and offer a rate review." },
]

export const luminaInsights = [
  { title: 'Attrition Alert', text: `${_atRisk.length} merchants flagged — volume at risk`, severity: 'high' as const, time: '2h ago' },
  { title: 'Volume Milestone', text: `Portfolio crossed ${fmt(k.monthly_volume ?? 32100000)} monthly volume`, severity: 'positive' as const, time: '4h ago' },
  { title: 'Compliance Gap', text: `${Math.round((k.total_merchants ?? 4612) * 0.04)} merchants PCI non-compliant — auto-reminders sent`, severity: 'medium' as const, time: 'Today' },
  { title: 'Migration Update', text: 'Liberty Processing integration at 92% — on track for completion', severity: 'info' as const, time: 'Yesterday' },
  { title: 'Cost Saving', text: 'Voice Agent saved $498K vs human openers this month', severity: 'positive' as const, time: 'Yesterday' },
]

// ═══ ISO Data (for ISO Management page) ═══
export const isoData = (_isos as any[])

// ═══ Partner Portal Data (from DuckDB) ═══
export const partnerData = _partnerPortal as any
