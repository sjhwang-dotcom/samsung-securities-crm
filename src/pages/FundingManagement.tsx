import { useState } from 'react'
import {
  Banknote, DollarSign, TrendingUp, AlertTriangle, CheckCircle,
  XCircle, Clock, ChevronRight, Search, FileText, BarChart3,
  Activity, Shield, Brain, Percent,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, LineChart, Line, Cell,
} from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

/* ── Sub-navigation ── */
type SubNav = 'overview' | 'active' | 'applications' | 'collections' | 'analytics'

const subNavItems: { id: SubNav; label: string; icon: typeof Banknote }[] = [
  { id: 'overview', label: 'Portfolio Overview', icon: BarChart3 },
  { id: 'active', label: 'Active Fundings', icon: Banknote },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'collections', label: 'Collections', icon: AlertTriangle },
  { id: 'analytics', label: 'Analytics', icon: Activity },
]

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

/* ── Active Fundings data (25 entries) ── */
interface ActiveFunding {
  id: number
  merchant: string
  iso: string
  fundedAmount: number
  paybackAmount: number
  remaining: number
  dailyPayment: number
  factorRate: number
  term: number
  startDate: string
  mcc: string
  riskScore: number
  status: 'Active' | 'Slow Pay'
}

const activeFundings: ActiveFunding[] = [
  { id: 1, merchant: "Tony's Pizza Palace", iso: 'Harlow Direct', fundedAmount: 75000, paybackAmount: 97500, remaining: 42300, dailyPayment: 487, factorRate: 1.30, term: 200, startDate: '2025-11-15', mcc: '5812', riskScore: 82, status: 'Active' },
  { id: 2, merchant: 'GreenLeaf Market', iso: 'Zenith Payments', fundedAmount: 120000, paybackAmount: 148800, remaining: 68400, dailyPayment: 744, factorRate: 1.24, term: 200, startDate: '2025-10-20', mcc: '5411', riskScore: 88, status: 'Active' },
  { id: 3, merchant: 'Sunrise Auto Repair', iso: 'Harlow Direct', fundedAmount: 50000, paybackAmount: 62500, remaining: 31250, dailyPayment: 312, factorRate: 1.25, term: 200, startDate: '2025-12-01', mcc: '7538', riskScore: 75, status: 'Active' },
  { id: 4, merchant: 'Brooklyn Dry Cleaners', iso: 'Liberty Processing', fundedAmount: 35000, paybackAmount: 42000, remaining: 18900, dailyPayment: 210, factorRate: 1.20, term: 200, startDate: '2025-09-15', mcc: '7216', riskScore: 91, status: 'Active' },
  { id: 5, merchant: 'Metro Grill House', iso: 'Harlow Direct', fundedAmount: 200000, paybackAmount: 260000, remaining: 143000, dailyPayment: 1300, factorRate: 1.30, term: 200, startDate: '2025-11-01', mcc: '5812', riskScore: 79, status: 'Active' },
  { id: 6, merchant: "King's Crown Jewelry", iso: 'Zenith Payments', fundedAmount: 150000, paybackAmount: 180000, remaining: 99000, dailyPayment: 900, factorRate: 1.20, term: 200, startDate: '2025-10-10', mcc: '5944', riskScore: 72, status: 'Slow Pay' },
  { id: 7, merchant: 'Harbor Seafood Co', iso: 'Harlow Direct', fundedAmount: 85000, paybackAmount: 106250, remaining: 53125, dailyPayment: 531, factorRate: 1.25, term: 200, startDate: '2025-11-20', mcc: '5812', riskScore: 85, status: 'Active' },
  { id: 8, merchant: 'Summit Coffee Roasters', iso: 'Liberty Processing', fundedAmount: 40000, paybackAmount: 48000, remaining: 24000, dailyPayment: 240, factorRate: 1.20, term: 200, startDate: '2025-12-10', mcc: '5812', riskScore: 93, status: 'Active' },
  { id: 9, merchant: 'Valley Auto Parts', iso: 'Zenith Payments', fundedAmount: 65000, paybackAmount: 81250, remaining: 36562, dailyPayment: 406, factorRate: 1.25, term: 200, startDate: '2025-10-25', mcc: '5531', riskScore: 77, status: 'Active' },
  { id: 10, merchant: 'Cedar Salon & Spa', iso: 'Harlow Direct', fundedAmount: 30000, paybackAmount: 36000, remaining: 16200, dailyPayment: 180, factorRate: 1.20, term: 200, startDate: '2025-09-20', mcc: '7231', riskScore: 89, status: 'Active' },
  { id: 11, merchant: 'Prime Fitness Center', iso: 'Harlow Direct', fundedAmount: 100000, paybackAmount: 125000, remaining: 62500, dailyPayment: 625, factorRate: 1.25, term: 200, startDate: '2025-11-05', mcc: '7941', riskScore: 81, status: 'Active' },
  { id: 12, merchant: 'Oak Street Deli', iso: 'Liberty Processing', fundedAmount: 25000, paybackAmount: 30000, remaining: 13500, dailyPayment: 150, factorRate: 1.20, term: 200, startDate: '2025-10-01', mcc: '5812', riskScore: 86, status: 'Active' },
  { id: 13, merchant: 'Riverside Pharmacy', iso: 'Zenith Payments', fundedAmount: 90000, paybackAmount: 112500, remaining: 67500, dailyPayment: 562, factorRate: 1.25, term: 200, startDate: '2025-12-05', mcc: '5912', riskScore: 90, status: 'Active' },
  { id: 14, merchant: 'Empire Plumbing', iso: 'Harlow Direct', fundedAmount: 55000, paybackAmount: 68750, remaining: 30937, dailyPayment: 343, factorRate: 1.25, term: 200, startDate: '2025-10-15', mcc: '1711', riskScore: 74, status: 'Active' },
  { id: 15, merchant: 'Bella Nail Studio', iso: 'Liberty Processing', fundedAmount: 20000, paybackAmount: 24000, remaining: 10800, dailyPayment: 120, factorRate: 1.20, term: 200, startDate: '2025-09-10', mcc: '7231', riskScore: 92, status: 'Active' },
  { id: 16, merchant: 'Garden State Florist', iso: 'Zenith Payments', fundedAmount: 45000, paybackAmount: 54000, remaining: 29700, dailyPayment: 270, factorRate: 1.20, term: 200, startDate: '2025-11-25', mcc: '5992', riskScore: 83, status: 'Active' },
  { id: 17, merchant: 'Metro Dental Care', iso: 'Harlow Direct', fundedAmount: 175000, paybackAmount: 210000, remaining: 115500, dailyPayment: 1050, factorRate: 1.20, term: 200, startDate: '2025-10-30', mcc: '8021', riskScore: 95, status: 'Active' },
  { id: 18, merchant: 'Lucky Dragon Chinese', iso: 'Harlow Direct', fundedAmount: 60000, paybackAmount: 78000, remaining: 35100, dailyPayment: 390, factorRate: 1.30, term: 200, startDate: '2025-11-08', mcc: '5812', riskScore: 76, status: 'Slow Pay' },
  { id: 19, merchant: 'Parkview Laundromat', iso: 'Liberty Processing', fundedAmount: 35000, paybackAmount: 42000, remaining: 21000, dailyPayment: 210, factorRate: 1.20, term: 200, startDate: '2025-12-15', mcc: '7215', riskScore: 87, status: 'Active' },
  { id: 20, merchant: 'Apex Construction', iso: 'Zenith Payments', fundedAmount: 250000, paybackAmount: 325000, remaining: 178750, dailyPayment: 1625, factorRate: 1.30, term: 200, startDate: '2025-10-05', mcc: '1520', riskScore: 68, status: 'Slow Pay' },
  { id: 21, merchant: 'Coastal Pet Clinic', iso: 'Harlow Direct', fundedAmount: 80000, paybackAmount: 96000, remaining: 48000, dailyPayment: 480, factorRate: 1.20, term: 200, startDate: '2025-11-18', mcc: '0742', riskScore: 88, status: 'Active' },
  { id: 22, merchant: 'Downtown Barbershop', iso: 'Harlow Direct', fundedAmount: 15000, paybackAmount: 18000, remaining: 8100, dailyPayment: 90, factorRate: 1.20, term: 200, startDate: '2025-09-25', mcc: '7241', riskScore: 94, status: 'Active' },
  { id: 23, merchant: 'Quick Lube Express', iso: 'Zenith Payments', fundedAmount: 70000, paybackAmount: 87500, remaining: 43750, dailyPayment: 437, factorRate: 1.25, term: 200, startDate: '2025-12-08', mcc: '7542', riskScore: 80, status: 'Active' },
  { id: 24, merchant: 'Thai Orchid Kitchen', iso: 'Liberty Processing', fundedAmount: 55000, paybackAmount: 68750, remaining: 34375, dailyPayment: 343, factorRate: 1.25, term: 200, startDate: '2025-11-12', mcc: '5812', riskScore: 84, status: 'Active' },
  { id: 25, merchant: 'Bay Area Electronics', iso: 'Harlow Direct', fundedAmount: 130000, paybackAmount: 162500, remaining: 89375, dailyPayment: 812, factorRate: 1.25, term: 200, startDate: '2025-10-18', mcc: '5732', riskScore: 73, status: 'Active' },
]

/* ── Monthly volume data ── */
const monthlyVolume = [
  { month: 'Oct', funded: 4.2, count: 24 },
  { month: 'Nov', funded: 5.1, count: 29 },
  { month: 'Dec', funded: 4.8, count: 27 },
  { month: 'Jan', funded: 5.6, count: 31 },
  { month: 'Feb', funded: 5.9, count: 33 },
  { month: 'Mar', funded: 6.4, count: 36 },
]

/* ── Revenue data ── */
const revenueData = [
  { month: 'Oct', revenue: 680, fees: 420 },
  { month: 'Nov', revenue: 820, fees: 510 },
  { month: 'Dec', revenue: 770, fees: 480 },
  { month: 'Jan', revenue: 910, fees: 560 },
  { month: 'Feb', revenue: 960, fees: 590 },
  { month: 'Mar', revenue: 1040, fees: 640 },
]

/* ── Risk distribution ── */
const riskDistribution = [
  { range: '90-100', amount: 5.2, count: 42, color: '#10B981' },
  { range: '80-89', amount: 8.8, count: 51, color: '#0891B2' },
  { range: '70-79', amount: 10.4, count: 38, color: '#1578F7' },
  { range: '60-69', amount: 5.1, count: 18, color: '#F59E0B' },
  { range: 'Below 60', amount: 2.5, count: 11, color: '#F43F5E' },
]

/* ── Application data ── */
interface Application {
  id: number
  merchant: string
  requestedAmount: number
  recommendedAmount: number
  riskScore: number
  aiDecision: 'Auto-Approved' | 'Manual Review' | 'Declined'
  status: 'Pending' | 'Under Review' | 'Approved' | 'Declined'
  assignedTo: string
  submitted: string
  aiSummary: string
}

const applications: Application[] = [
  { id: 1, merchant: 'Fusion Sushi Bar', requestedAmount: 100000, recommendedAmount: 85000, riskScore: 82, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'Sarah Chen', submitted: 'Apr 7', aiSummary: 'Strong monthly revenue ($142K avg), 3+ years in business, clean payment history. Recommended reduced amount due to seasonal revenue dips.' },
  { id: 2, merchant: 'Metro Car Wash Plus', requestedAmount: 75000, recommendedAmount: 75000, riskScore: 88, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 7', aiSummary: 'Excellent cash flow consistency, low risk score, existing customer with perfect repayment on prior advance.' },
  { id: 3, merchant: 'Golden Gate Liquor', requestedAmount: 200000, recommendedAmount: 150000, riskScore: 64, aiDecision: 'Manual Review', status: 'Under Review', assignedTo: 'David Goldfarb', submitted: 'Apr 6', aiSummary: 'High requested amount relative to monthly revenue. Recent tax lien flagged. Recommend reduced funding with higher factor rate.' },
  { id: 4, merchant: 'Prestige Dry Clean', requestedAmount: 40000, recommendedAmount: 40000, riskScore: 91, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 6', aiSummary: 'Low-risk profile, consistent daily card volume, 5+ year business tenure. Auto-approved at full amount.' },
  { id: 5, merchant: 'Urban Tattoo Studio', requestedAmount: 60000, recommendedAmount: 0, riskScore: 38, aiDecision: 'Declined', status: 'Declined', assignedTo: 'AI Auto', submitted: 'Apr 6', aiSummary: 'Insufficient card volume history (only 2 months of statements). Multiple NSF occurrences. High risk of default.' },
  { id: 6, merchant: 'Jade Garden Restaurant', requestedAmount: 80000, recommendedAmount: 80000, riskScore: 85, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 5', aiSummary: 'Strong restaurant with consistent $95K monthly volume. Returning customer, prior advance fully repaid on time.' },
  { id: 7, merchant: 'Brooklyn Smoke Shop', requestedAmount: 50000, recommendedAmount: 30000, riskScore: 55, aiDecision: 'Manual Review', status: 'Under Review', assignedTo: 'Kate Palmarini', submitted: 'Apr 5', aiSummary: 'Industry risk flag (tobacco). Moderate card volume but cash-heavy business. Recommend reduced amount with weekly ACH.' },
  { id: 8, merchant: 'Sunshine Daycare', requestedAmount: 45000, recommendedAmount: 45000, riskScore: 87, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 5', aiSummary: 'Stable recurring revenue model. Licensed facility with 4+ years operating. Low risk profile.' },
  { id: 9, merchant: 'Empire Hookah Lounge', requestedAmount: 120000, recommendedAmount: 0, riskScore: 42, aiDecision: 'Declined', status: 'Declined', assignedTo: 'AI Auto', submitted: 'Apr 4', aiSummary: 'High industry risk. Inconsistent revenue patterns. Outstanding judgments found. Decline recommended.' },
  { id: 10, merchant: 'Park Avenue Dental', requestedAmount: 150000, recommendedAmount: 135000, riskScore: 78, aiDecision: 'Manual Review', status: 'Under Review', assignedTo: 'Sarah Chen', submitted: 'Apr 4', aiSummary: 'High-value practice but recent insurance billing disputes. Recommend manual review of bank statements for last 6 months.' },
  { id: 11, merchant: 'Fresh Bake Cafe', requestedAmount: 35000, recommendedAmount: 35000, riskScore: 90, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 4', aiSummary: 'Consistent daily deposits, strong foot traffic location, clean background. Auto-approved.' },
  { id: 12, merchant: 'Quick Print Solutions', requestedAmount: 25000, recommendedAmount: 25000, riskScore: 86, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 3', aiSummary: 'Small advance with strong business fundamentals. 10+ year business, owner has excellent personal credit.' },
  { id: 13, merchant: 'Harlem Grocery #3', requestedAmount: 55000, recommendedAmount: 55000, riskScore: 83, aiDecision: 'Auto-Approved', status: 'Approved', assignedTo: 'AI Auto', submitted: 'Apr 3', aiSummary: 'Part of multi-location grocery chain. Consistent volume across all locations. Auto-approved.' },
  { id: 14, merchant: 'Vape City NYC', requestedAmount: 90000, recommendedAmount: 60000, riskScore: 58, aiDecision: 'Manual Review', status: 'Under Review', assignedTo: 'Mike Rodriguez', submitted: 'Apr 3', aiSummary: 'Regulated industry with potential legislative risk. Revenue is strong but category risk requires manual underwriting.' },
  { id: 15, merchant: 'Liberty Tax Services', requestedAmount: 70000, recommendedAmount: 70000, riskScore: 84, aiDecision: 'Auto-Approved', status: 'Pending', assignedTo: 'AI Auto', submitted: 'Apr 2', aiSummary: 'Seasonal business but strong reserves. Known franchise model. Awaiting final document verification.' },
]

/* ── Collections data ── */
interface DelinquentMerchant {
  id: number
  merchant: string
  fundedAmount: number
  outstanding: number
  daysPastDue: number
  lastPayment: string
  assignedAgent: string
  status: 'Delinquent' | 'Default'
}

const delinquentMerchants: DelinquentMerchant[] = [
  { id: 1, merchant: 'Queens Hookah Lounge', fundedAmount: 80000, outstanding: 52000, daysPastDue: 45, lastPayment: 'Feb 22', assignedAgent: 'Collections Team A', status: 'Delinquent' },
  { id: 2, merchant: 'Bronx Auto Body #2', fundedAmount: 120000, outstanding: 78000, daysPastDue: 62, lastPayment: 'Feb 5', assignedAgent: 'Mike Rodriguez', status: 'Default' },
  { id: 3, merchant: 'Night Owl Bar & Grill', fundedAmount: 65000, outstanding: 41600, daysPastDue: 31, lastPayment: 'Mar 8', assignedAgent: 'Collections Team B', status: 'Delinquent' },
  { id: 4, merchant: 'Empire Vape Shop', fundedAmount: 45000, outstanding: 31500, daysPastDue: 90, lastPayment: 'Jan 8', assignedAgent: 'David Goldfarb', status: 'Default' },
  { id: 5, merchant: 'Lucky 7 Convenience', fundedAmount: 35000, outstanding: 22750, daysPastDue: 28, lastPayment: 'Mar 11', assignedAgent: 'Collections Team A', status: 'Delinquent' },
  { id: 6, merchant: 'Metro Smoke & Cigar', fundedAmount: 55000, outstanding: 38500, daysPastDue: 75, lastPayment: 'Jan 24', assignedAgent: 'Collections Team B', status: 'Default' },
  { id: 7, merchant: 'Sunset Tattoo Parlor', fundedAmount: 30000, outstanding: 19500, daysPastDue: 38, lastPayment: 'Mar 1', assignedAgent: 'Kate Palmarini', status: 'Delinquent' },
  { id: 8, merchant: 'Crown Fried Chicken #5', fundedAmount: 70000, outstanding: 49000, daysPastDue: 52, lastPayment: 'Feb 15', assignedAgent: 'Collections Team A', status: 'Delinquent' },
  { id: 9, merchant: 'Quick Cash Check #2', fundedAmount: 95000, outstanding: 66500, daysPastDue: 98, lastPayment: 'Dec 31', assignedAgent: 'Mike Rodriguez', status: 'Default' },
  { id: 10, merchant: 'Downtown Pawn & Gold', fundedAmount: 110000, outstanding: 77000, daysPastDue: 41, lastPayment: 'Feb 27', assignedAgent: 'Collections Team B', status: 'Delinquent' },
]

const collectionTimeline = [
  { date: 'Apr 8', merchant: 'Queens Hookah Lounge', action: 'Payment plan restructured - $800/week ACH', agent: 'Collections Team A' },
  { date: 'Apr 7', merchant: 'Night Owl Bar & Grill', action: 'Phone contact established, promised payment by Apr 12', agent: 'Collections Team B' },
  { date: 'Apr 7', merchant: 'Crown Fried Chicken #5', action: 'Demand letter sent via certified mail', agent: 'Collections Team A' },
  { date: 'Apr 6', merchant: 'Downtown Pawn & Gold', action: 'Partial payment received ($2,500)', agent: 'Collections Team B' },
  { date: 'Apr 5', merchant: 'Lucky 7 Convenience', action: 'ACH resumed after bank account update', agent: 'Collections Team A' },
  { date: 'Apr 4', merchant: 'Bronx Auto Body #2', action: 'Legal counsel engaged for recovery', agent: 'Mike Rodriguez' },
]

/* ── Analytics data ── */
const fundingByISO = [
  { iso: 'Harlow Direct', amount: 18.2, count: 186 },
  { iso: 'Zenith Payments', amount: 8.4, count: 82 },
  { iso: 'Liberty Processing', amount: 5.4, count: 52 },
]

const factorRateDistribution = [
  { rate: '1.15', count: 18 },
  { rate: '1.18', count: 32 },
  { rate: '1.20', count: 68 },
  { rate: '1.22', count: 45 },
  { rate: '1.25', count: 72 },
  { rate: '1.28', count: 38 },
  { rate: '1.30', count: 35 },
  { rate: '1.35', count: 12 },
]

const avgTermByMCC = [
  { mcc: 'Restaurants (5812)', term: 185 },
  { mcc: 'Grocery (5411)', term: 200 },
  { mcc: 'Auto Repair (7538)', term: 165 },
  { mcc: 'Retail (5999)', term: 175 },
  { mcc: 'Medical (8021)', term: 210 },
  { mcc: 'Salon/Spa (7231)', term: 155 },
]

const defaultRateTrend = [
  { month: 'Apr 25', rate: 7.2 },
  { month: 'May', rate: 7.5 },
  { month: 'Jun', rate: 7.8 },
  { month: 'Jul', rate: 8.1 },
  { month: 'Aug', rate: 7.9 },
  { month: 'Sep', rate: 8.0 },
  { month: 'Oct', rate: 8.3 },
  { month: 'Nov', rate: 8.5 },
  { month: 'Dec', rate: 8.2 },
  { month: 'Jan 26', rate: 8.6 },
  { month: 'Feb', rate: 8.7 },
  { month: 'Mar', rate: 8.8 },
]

/* ── Payment history for detail view ── */
const paymentHistory = [
  { month: 'Oct', paid: 8200, expected: 9000 },
  { month: 'Nov', paid: 9100, expected: 9000 },
  { month: 'Dec', paid: 8800, expected: 9000 },
  { month: 'Jan', paid: 9200, expected: 9000 },
  { month: 'Feb', paid: 9000, expected: 9000 },
  { month: 'Mar', paid: 9100, expected: 9000 },
]

const recentPayments = [
  { date: 'Apr 8', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Apr 7', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Apr 4', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Apr 3', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Apr 2', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Apr 1', amount: 487, method: 'ACH', status: 'Returned' },
  { date: 'Mar 31', amount: 487, method: 'ACH', status: 'Cleared' },
  { date: 'Mar 28', amount: 487, method: 'ACH', status: 'Cleared' },
]

/* ── Helpers ── */
const fmt = (n: number) => n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(0)}K` : `$${n}`
const fmtFull = (n: number) => `$${n.toLocaleString()}`

/* ══════════════════════════════════════════════ */
export default function FundingManagement() {
  const [activeNav, setActiveNav] = useState<SubNav>('overview')

  return (
    <div className="dashboard-grid">
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', overflowX: 'auto', flexShrink: 0 }}>
        {subNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              padding: '10px 14px', fontSize: 12,
              fontWeight: activeNav === item.id ? 700 : 500,
              color: activeNav === item.id ? '#1578F7' : '#64748B',
              background: 'none', border: 'none',
              borderBottom: activeNav === item.id ? '2px solid #1578F7' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <item.icon size={16} strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </div>

      {activeNav === 'overview' && <PortfolioOverview />}
      {activeNav === 'active' && <ActiveFundingsView />}
      {activeNav === 'applications' && <ApplicationsView />}
      {activeNav === 'collections' && <CollectionsView />}
      {activeNav === 'analytics' && <AnalyticsView />}
    </div>
  )
}

/* ══════════════════════════════════════════════ */
/* Tab 1: Portfolio Overview                     */
/* ══════════════════════════════════════════════ */
function PortfolioOverview() {
  return (
    <>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <KpiCard label="Total Funded" value="$32.0M" icon={DollarSign} color="blue" trend="12.4%" trendDirection="up" trendPositive />
        <KpiCard label="Outstanding" value="$13.7M" icon={Banknote} color="amber" sub="42.8% of funded" />
        <KpiCard label="Collected" value="$23.2M" icon={CheckCircle} color="emerald" trend="8.1%" trendDirection="up" trendPositive />
        <KpiCard label="Active Fundings" value="160" icon={Activity} color="teal" sub="of 320 total" />
        <KpiCard label="Default Rate" value="8.8%" icon={AlertTriangle} color="rose" trend="0.3%" trendDirection="up" trendPositive={false} />
        <KpiCard label="Avg Factor Rate" value="1.16" icon={Percent} color="indigo" sub="across portfolio" />
      </div>

      {/* Portfolio Health + Monthly Volume */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Funding Status Breakdown" />
          <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {([
              { label: 'Active', count: 160, total: 320, color: '#10B981' },
              { label: 'Paid Off', count: 95, total: 320, color: '#1578F7' },
              { label: 'Delinquent', count: 37, total: 320, color: '#F59E0B' },
              { label: 'Default', count: 28, total: 320, color: '#F43F5E' },
            ] as const).map(s => (
              <div key={s.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.count} ({(s.count / s.total * 100).toFixed(1)}%)</span>
                </div>
                <div style={{ height: 8, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(s.count / s.total * 100)}%`, background: s.color, borderRadius: 4, transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Monthly Funding Volume" />
          <div style={{ height: 220, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolume}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}M`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v}M`, 'Funded']} />
                <Bar dataKey="funded" fill="#1578F7" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue + Collection Rate + Risk Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Monthly MCA Revenue" />
          <div style={{ height: 220, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v}K`]} />
                <Area type="monotone" dataKey="revenue" stroke="#1578F7" fill="rgba(21,120,247,0.1)" strokeWidth={2} />
                <Area type="monotone" dataKey="fees" stroke="#10B981" fill="rgba(16,185,129,0.08)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Collection Rate" />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 24px', gap: 8 }}>
            <div style={{ position: 'relative', width: 120, height: 120 }}>
              <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={60} cy={60} r={50} fill="none" stroke="#F1F5F9" strokeWidth={10} />
                <circle cx={60} cy={60} r={50} fill="none" stroke="#10B981" strokeWidth={10}
                  strokeDasharray={`${0.725 * 2 * Math.PI * 50} ${2 * Math.PI * 50}`} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 800, color: '#10B981', lineHeight: 1 }}>72.5%</span>
                <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 2 }}>collected</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#64748B' }}>$23.2M of $32.0M total payback</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginTop: 2 }}>+2.1% vs last month</div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Risk Distribution" />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {riskDistribution.map(r => (
              <div key={r.range}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>{r.range}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>{fmt(r.amount * 1e6)}</span>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(r.amount / 10.4) * 100}%`, background: r.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════ */
/* Tab 2: Active Fundings (Master-Detail)        */
/* ══════════════════════════════════════════════ */
function ActiveFundingsView() {
  const [selectedId, setSelectedId] = useState(activeFundings[0].id)
  const selected = activeFundings.find(f => f.id === selectedId) ?? activeFundings[0]
  const progressPct = ((selected.paybackAmount - selected.remaining) / selected.paybackAmount) * 100

  const paymentCols: Column<typeof recentPayments[0]>[] = [
    { key: 'date', header: 'Date' },
    { key: 'amount', header: 'Amount', render: (r) => fmtFull(r.amount) },
    { key: 'method', header: 'Method' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Cleared' ? 'emerald' : 'rose'}>{r.status}</StatusBadge> },
  ]

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 180px)', margin: '-4px -20px -16px', overflow: 'hidden' }}>
      {/* Left: Funding List */}
      <div style={{
        width: 340, minWidth: 340, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Active Fundings</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>
            {activeFundings.length} of 160 shown
          </div>
          <div style={{ position: 'relative', marginTop: 8 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input
              placeholder="Search fundings..."
              style={{
                width: '100%', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 8,
                padding: '7px 12px 7px 30px', fontSize: 12, outline: 'none', color: '#334155',
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeFundings.map(f => {
            const isActive = selectedId === f.id
            const pct = ((f.paybackAmount - f.remaining) / f.paybackAmount) * 100
            return (
              <div key={f.id} onClick={() => setSelectedId(f.id)} className="sidebar-item"
                style={{
                  padding: '12px 16px',
                  borderLeft: isActive ? '3px solid #1578F7' : '3px solid transparent',
                  background: isActive ? 'linear-gradient(90deg, rgba(21,120,247,0.06) 0%, rgba(21,120,247,0.01) 100%)' : 'transparent',
                  cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? '#1578F7' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {f.merchant}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      {fmt(f.fundedAmount)} funded | {fmtFull(f.dailyPayment)}/day
                    </div>
                  </div>
                  {f.status === 'Slow Pay' && <StatusBadge variant="amber" size="sm">Slow</StatusBadge>}
                </div>
                <div style={{ marginTop: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: '#94A3B8' }}>Remaining: {fmt(f.remaining)}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: pct > 70 ? '#10B981' : pct > 40 ? '#1578F7' : '#F59E0B' }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 4, background: '#F1F5F9', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 70 ? '#10B981' : pct > 40 ? '#1578F7' : '#F59E0B', borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Detail Panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>{selected.merchant}</h2>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
              {selected.iso} | MCC: {selected.mcc} | Started: {selected.startDate}
            </div>
          </div>
          <StatusBadge variant={selected.status === 'Slow Pay' ? 'amber' : 'emerald'} size="md" dot>{selected.status}</StatusBadge>
        </div>

        {/* Terms Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {([
            { label: 'Funded Amount', value: fmtFull(selected.fundedAmount), color: '#1578F7' },
            { label: 'Payback Amount', value: fmtFull(selected.paybackAmount), color: '#0F172A' },
            { label: 'Remaining', value: fmtFull(selected.remaining), color: '#F59E0B' },
            { label: 'Daily Payment', value: fmtFull(selected.dailyPayment), color: '#10B981' },
          ] as const).map(t => (
            <Card key={t.label}>
              <div style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}>{t.label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: t.color }}>{t.value}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Repayment Progress */}
        <Card>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Repayment Progress</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1578F7' }}>{progressPct.toFixed(1)}%</span>
            </div>
            <div style={{ height: 12, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #1578F7, #609FFF)', borderRadius: 6, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Factor Rate: {selected.factorRate}x</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Term: {selected.term} days</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>Risk Score: {selected.riskScore}</span>
            </div>
          </div>
        </Card>

        {/* Payment History Chart + Recent Payments Table */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <Card>
            <CardHeader title="Payment History" />
            <div style={{ height: 200, padding: '0 12px 12px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [fmtFull(v)]} />
                  <Bar dataKey="expected" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={20} name="Expected" />
                  <Bar dataKey="paid" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} name="Paid" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader title="Recent Payments" />
            <DataTable columns={paymentCols} data={recentPayments} compact />
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════ */
/* Tab 3: Applications                           */
/* ══════════════════════════════════════════════ */
function ApplicationsView() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const autoApproved = applications.filter(a => a.aiDecision === 'Auto-Approved').length
  const manualReview = applications.filter(a => a.aiDecision === 'Manual Review').length
  const declined = applications.filter(a => a.aiDecision === 'Declined').length

  const decisionBadge = (d: string) => {
    if (d === 'Auto-Approved') return <StatusBadge variant="emerald">Auto-Approved</StatusBadge>
    if (d === 'Manual Review') return <StatusBadge variant="amber">Manual Review</StatusBadge>
    return <StatusBadge variant="rose">Declined</StatusBadge>
  }

  const statusBadge = (s: string) => {
    if (s === 'Approved') return <StatusBadge variant="emerald">{s}</StatusBadge>
    if (s === 'Under Review') return <StatusBadge variant="amber">{s}</StatusBadge>
    if (s === 'Pending') return <StatusBadge variant="blue">{s}</StatusBadge>
    return <StatusBadge variant="rose">{s}</StatusBadge>
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard label="Total Applications" value="15" icon={FileText} color="blue" sub="this month" />
        <KpiCard label="Auto-Approved" value={String(autoApproved)} icon={CheckCircle} color="emerald" sub={`${((autoApproved / 15) * 100).toFixed(0)}% approval rate`} />
        <KpiCard label="Manual Review" value={String(manualReview)} icon={Shield} color="amber" sub="awaiting underwriter" />
        <KpiCard label="Declined" value={String(declined)} icon={XCircle} color="rose" sub="by AI scoring" />
      </div>

      <Card>
        <CardHeader title="Pending Applications" badge={<StatusBadge variant="blue">{applications.length} total</StatusBadge>} />
        <div className="harlow-table-wrapper">
          <table className="harlow-table harlow-table--compact">
            <thead>
              <tr>
                <th>Merchant</th>
                <th style={{ textAlign: 'right' }}>Requested</th>
                <th style={{ textAlign: 'right' }}>Recommended</th>
                <th style={{ textAlign: 'center' }}>Risk Score</th>
                <th>AI Decision</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <>
                  <tr key={app.id} className="row--hoverable row--clickable" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ChevronRight size={12} style={{ transform: expandedId === app.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', color: '#94A3B8' }} />
                        <span style={{ fontWeight: 600 }}>{app.merchant}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>{fmtFull(app.requestedAmount)}</td>
                    <td style={{ textAlign: 'right', color: app.recommendedAmount === 0 ? '#F43F5E' : '#0F172A' }}>
                      {app.recommendedAmount > 0 ? fmtFull(app.recommendedAmount) : '---'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                        background: app.riskScore >= 80 ? '#D1FAE5' : app.riskScore >= 60 ? '#FEF3C7' : '#FEE2E2',
                        color: app.riskScore >= 80 ? '#059669' : app.riskScore >= 60 ? '#D97706' : '#DC2626',
                      }}>
                        {app.riskScore}
                      </span>
                    </td>
                    <td>{decisionBadge(app.aiDecision)}</td>
                    <td>{statusBadge(app.status)}</td>
                    <td style={{ fontSize: 12, color: app.assignedTo === 'AI Auto' ? '#1578F7' : '#334155' }}>{app.assignedTo}</td>
                    <td style={{ fontSize: 12, color: '#94A3B8' }}>{app.submitted}</td>
                  </tr>
                  {expandedId === app.id && (
                    <tr key={`${app.id}-detail`}>
                      <td colSpan={8} style={{ background: '#F8FAFC', padding: '12px 20px 12px 36px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <Brain size={14} color="#1578F7" style={{ marginTop: 1, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#1578F7', marginBottom: 4 }}>AI Qualification Summary</div>
                            <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{app.aiSummary}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

/* ══════════════════════════════════════════════ */
/* Tab 4: Collections                            */
/* ══════════════════════════════════════════════ */
function CollectionsView() {
  const delinquentCount = delinquentMerchants.filter(m => m.status === 'Delinquent').length
  const defaultCount = delinquentMerchants.filter(m => m.status === 'Default').length
  const avgDaysPastDue = Math.round(delinquentMerchants.reduce((s, m) => s + m.daysPastDue, 0) / delinquentMerchants.length)

  const cols: Column<DelinquentMerchant>[] = [
    { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600 }}>{r.merchant}</span> },
    { key: 'fundedAmount', header: 'Funded', align: 'right', render: (r) => fmtFull(r.fundedAmount) },
    { key: 'outstanding', header: 'Outstanding', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#F43F5E' }}>{fmtFull(r.outstanding)}</span> },
    { key: 'daysPastDue', header: 'Days Past Due', align: 'center', render: (r) => (
      <span style={{
        display: 'inline-block', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
        background: r.daysPastDue >= 90 ? '#FEE2E2' : r.daysPastDue >= 60 ? '#FEF3C7' : '#FFF7ED',
        color: r.daysPastDue >= 90 ? '#DC2626' : r.daysPastDue >= 60 ? '#D97706' : '#EA580C',
      }}>
        {r.daysPastDue}d
      </span>
    )},
    { key: 'lastPayment', header: 'Last Payment', render: (r) => <span style={{ fontSize: 12, color: '#94A3B8' }}>{r.lastPayment}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Default' ? 'rose' : 'amber'}>{r.status}</StatusBadge> },
    { key: 'assignedAgent', header: 'Assigned', render: (r) => <span style={{ fontSize: 12 }}>{r.assignedAgent}</span> },
    { key: 'actions', header: '', width: '160px', render: () => (
      <div style={{ display: 'flex', gap: 4 }}>
        {(['Contact', 'Restructure', 'Write Off'] as const).map(a => (
          <button key={a} style={{
            fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, border: '1px solid #E5E7EB',
            background: a === 'Write Off' ? '#FEE2E2' : 'white',
            color: a === 'Write Off' ? '#DC2626' : a === 'Contact' ? '#1578F7' : '#D97706',
            cursor: 'pointer',
          }}>
            {a}
          </button>
        ))}
      </div>
    )},
  ]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard label="Delinquent" value={`${delinquentCount}`} icon={AlertTriangle} color="amber" sub={`$${(delinquentMerchants.filter(m => m.status === 'Delinquent').reduce((s, m) => s + m.outstanding, 0) / 1e6).toFixed(1)}M outstanding`} />
        <KpiCard label="Default" value={`${defaultCount}`} icon={XCircle} color="rose" sub={`$${(delinquentMerchants.filter(m => m.status === 'Default').reduce((s, m) => s + m.outstanding, 0) / 1e6).toFixed(1)}M outstanding`} />
        <KpiCard label="Recovery Rate" value="34.2%" icon={TrendingUp} color="teal" trend="2.8%" trendDirection="up" trendPositive />
        <KpiCard label="Avg Days Delinquent" value={`${avgDaysPastDue}`} icon={Clock} color="indigo" sub="across all accounts" />
      </div>

      <Card>
        <CardHeader title="Delinquent & Default Accounts" badge={<StatusBadge variant="rose">{delinquentMerchants.length} accounts</StatusBadge>} />
        <DataTable columns={cols} data={delinquentMerchants} compact />
      </Card>

      <Card>
        <CardHeader title="Collection Activity Timeline" />
        <div style={{ padding: '0 20px 20px' }}>
          {collectionTimeline.map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, padding: '10px 0',
              borderBottom: i < collectionTimeline.length - 1 ? '1px solid #F1F5F9' : 'none',
            }}>
              <div style={{ width: 56, fontSize: 11, fontWeight: 600, color: '#94A3B8', flexShrink: 0 }}>{item.date}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{item.merchant}</span>
                <span style={{ fontSize: 12, color: '#64748B' }}> — {item.action}</span>
              </div>
              <div style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>{item.agent}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

/* ══════════════════════════════════════════════ */
/* Tab 5: Analytics                              */
/* ══════════════════════════════════════════════ */
function AnalyticsView() {
  return (
    <>
      {/* Funding by ISO + Factor Rate Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Funding by ISO" />
          <div style={{ height: 240, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fundingByISO} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}M`} />
                <YAxis dataKey="iso" type="category" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v}M`]} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={28}>
                  {fundingByISO.map((_, i) => (
                    <Cell key={i} fill={['#1578F7', '#0891B2', '#8B5CF6'][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Factor Rate Distribution" />
          <div style={{ height: 240, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={factorRateDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="rate" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [v, 'Fundings']} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Avg Term by MCC + Default Rate Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Avg Term by MCC" />
          <div style={{ height: 240, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgTermByMCC} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}d`} />
                <YAxis dataKey="mcc" type="category" tick={{ fontSize: 11, fill: '#334155' }} axisLine={false} tickLine={false} width={130} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} days`]} />
                <Bar dataKey="term" fill="#0891B2" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Default Rate Trend (12 months)" />
          <div style={{ height: 240, padding: '0 12px 12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={defaultRateTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} domain={[6, 10]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}%`]} />
                <Line type="monotone" dataKey="rate" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3, fill: '#F43F5E' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ROI Summary */}
      <Card>
        <CardHeader title="ROI Summary" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, padding: '0 20px 24px' }}>
          <div style={{ textAlign: 'center', padding: 20, background: '#F0FDF4', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>Total Fees Earned</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#059669' }}>$5.12M</div>
            <div style={{ fontSize: 11, color: '#10B981', marginTop: 4 }}>16.0% of total funded</div>
          </div>
          <div style={{ textAlign: 'center', padding: 20, background: '#FFF7ED', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>Cost of Capital</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#D97706' }}>$2.88M</div>
            <div style={{ fontSize: 11, color: '#F59E0B', marginTop: 4 }}>9.0% blended rate</div>
          </div>
          <div style={{ textAlign: 'center', padding: 20, background: '#EFF6FF', borderRadius: 12 }}>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>Net Margin</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1578F7' }}>$2.24M</div>
            <div style={{ fontSize: 11, color: '#1578F7', marginTop: 4 }}>43.8% margin on fees</div>
          </div>
        </div>
      </Card>
    </>
  )
}
