import { useState } from 'react'
import {
  DollarSign, TrendingUp, Calendar, Store, CalendarDays, CheckCircle2, Clock,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, StatusBadge, KpiCard, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

const monthlyTrend = [
  { month: 'Nov', amount: 2810 }, { month: 'Dec', amount: 3120 },
  { month: 'Jan', amount: 3480 }, { month: 'Feb', amount: 3785 },
  { month: 'Mar', amount: 3985 }, { month: 'Apr', amount: 4218 },
]

type BreakdownRow = { merchant: string; volume: string; rate: string; residual: string; split: string }
const breakdownData: BreakdownRow[] = [
  { merchant: 'Bay Dental Group', volume: '$44,000', rate: '2.75%', residual: '$440', split: '60/40' },
  { merchant: 'Bright Smile Dental', volume: '$38,000', rate: '2.80%', residual: '$380', split: '60/40' },
  { merchant: 'Harbor Seafood', volume: '$32,000', rate: '2.65%', residual: '$320', split: '60/40' },
  { merchant: 'Coastal Cafe', volume: '$28,400', rate: '2.70%', residual: '$284', split: '60/40' },
  { merchant: 'Nob Hill Bistro', volume: '$28,000', rate: '2.60%', residual: '$280', split: '60/40' },
  { merchant: 'Metro Fitness', volume: '$24,100', rate: '2.75%', residual: '$241', split: '60/40' },
  { merchant: 'Redwood Pizza', volume: '$22,800', rate: '2.65%', residual: '$228', split: '60/40' },
  { merchant: 'Urban Bites', volume: '$21,800', rate: '2.70%', residual: '$218', split: '50/50' },
  { merchant: 'Bay Plumbing Co', volume: '$21,000', rate: '2.80%', residual: '$210', split: '60/40' },
  { merchant: 'Cloud Nine Spa', volume: '$20,400', rate: '2.75%', residual: '$204', split: '60/40' },
]

const breakdownCols: Column<BreakdownRow>[] = [
  { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
  { key: 'volume', header: 'Volume', render: (r) => <span style={{ fontWeight: 600 }}>{r.volume}</span> },
  { key: 'rate', header: 'Eff. Rate' },
  { key: 'split', header: 'Split', render: (r) => <StatusBadge variant="blue">{r.split}</StatusBadge> },
  { key: 'residual', header: 'Residual', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#059669' }}>{r.residual}</span> },
]

type PayoutRow = { month: string; merchants: number; volume: string; residual: string; status: string; paidDate: string }
const payoutHistory: PayoutRow[] = [
  { month: 'April 2026', merchants: 34, volume: '$534,200', residual: '$4,218', status: 'Pending', paidDate: 'Apr 15, 2026' },
  { month: 'March 2026', merchants: 33, volume: '$512,400', residual: '$3,985', status: 'Paid', paidDate: 'Mar 15, 2026' },
  { month: 'February 2026', merchants: 32, volume: '$498,600', residual: '$3,785', status: 'Paid', paidDate: 'Feb 15, 2026' },
  { month: 'January 2026', merchants: 31, volume: '$468,200', residual: '$3,480', status: 'Paid', paidDate: 'Jan 15, 2026' },
  { month: 'December 2025', merchants: 30, volume: '$442,800', residual: '$3,120', status: 'Paid', paidDate: 'Dec 15, 2025' },
  { month: 'November 2025', merchants: 28, volume: '$398,400', residual: '$2,810', status: 'Paid', paidDate: 'Nov 15, 2025' },
]

const payoutCols: Column<PayoutRow>[] = [
  { key: 'month', header: 'Month', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.month}</span> },
  { key: 'merchants', header: 'Merchants' },
  { key: 'volume', header: 'Total Volume', render: (r) => <span style={{ fontWeight: 600 }}>{r.volume}</span> },
  { key: 'residual', header: 'Payout', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#059669' }}>{r.residual}</span> },
  { key: 'status', header: 'Status', render: (r) => (
    <StatusBadge variant={r.status === 'Paid' ? 'emerald' : 'amber'} dot>{r.status}</StatusBadge>
  )},
  { key: 'paidDate', header: 'Date', render: (r) => <span style={{ fontSize: 11, color: '#64748B' }}>{r.paidDate}</span> },
]

interface MerchantDetail {
  name: string
  volume: string
  rate: string
  residual: string
  split: string
  mid: string
  boarded: string
  avgTicket: string
}

const merchantDetails: Record<string, MerchantDetail> = {
  'Bay Dental Group': { name: 'Bay Dental Group', volume: '$44,000', rate: '2.75%', residual: '$440', split: '60/40', mid: '5489-7821-0042', boarded: 'Apr 5, 2025', avgTicket: '$285.00' },
  'Bright Smile Dental': { name: 'Bright Smile Dental', volume: '$38,000', rate: '2.80%', residual: '$380', split: '60/40', mid: '5489-7821-0049', boarded: 'Jul 20, 2025', avgTicket: '$310.00' },
  'Harbor Seafood': { name: 'Harbor Seafood', volume: '$32,000', rate: '2.65%', residual: '$320', split: '60/40', mid: '5489-7821-0041', boarded: 'Feb 15, 2025', avgTicket: '$52.00' },
  'Coastal Cafe': { name: 'Coastal Cafe', volume: '$28,400', rate: '2.70%', residual: '$284', split: '60/40', mid: '5489-7821-0034', boarded: 'Jan 15, 2025', avgTicket: '$18.50' },
  'Nob Hill Bistro': { name: 'Nob Hill Bistro', volume: '$28,000', rate: '2.60%', residual: '$280', split: '60/40', mid: '5489-7821-0039', boarded: 'Jan 20, 2025', avgTicket: '$68.00' },
}

// Payout calendar data
const calendarMonths = [
  { month: 'Nov 2025', amount: '$2,810', status: 'paid' as const },
  { month: 'Dec 2025', amount: '$3,120', status: 'paid' as const },
  { month: 'Jan 2026', amount: '$3,480', status: 'paid' as const },
  { month: 'Feb 2026', amount: '$3,785', status: 'paid' as const },
  { month: 'Mar 2026', amount: '$3,985', status: 'paid' as const },
  { month: 'Apr 2026', amount: '$4,218', status: 'pending' as const },
]

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function PartnerResiduals() {
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null)
  const detail = selectedMerchant ? merchantDetails[selectedMerchant] : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPIs - now 5 */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
        <KpiCard label="This Month" value="$4,218" icon={DollarSign} color="emerald" trend="+5.8%" trendDirection="up" trendPositive sub="34 merchants" />
        <KpiCard label="Last Month" value="$3,985" icon={TrendingUp} color="teal" sub="33 merchants" />
        <KpiCard label="YTD Earnings" value="$38,420" icon={Calendar} color="blue" trend="+22%" trendDirection="up" trendPositive sub="vs last year" />
        <KpiCard label="Avg Per Merchant" value="$124" icon={Store} color="purple" trend="+3.2%" trendDirection="up" trendPositive sub="per month" />
        <KpiCard label="Next Payout Date" value="Apr 15" icon={CalendarDays} color="amber" sub="~$4,218 est." />
      </div>

      {/* Payout Calendar */}
      <Card>
        <CardHeader title="Payout Calendar" subtitle="Monthly payout status" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginTop: 8 }}>
          {calendarMonths.map((cm) => (
            <div key={cm.month} style={{
              padding: '14px 12px', borderRadius: 12, textAlign: 'center',
              background: cm.status === 'paid'
                ? 'linear-gradient(135deg, #F0FDF4, #ECFDF5)'
                : 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
              border: cm.status === 'paid' ? '1px solid #D1FAE5' : '1px solid #FDE68A',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', marginBottom: 6 }}>{cm.month}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: cm.status === 'paid' ? '#059669' : '#D97706' }}>{cm.amount}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 6 }}>
                {cm.status === 'paid'
                  ? <><CheckCircle2 size={12} color="#10B981" /><span style={{ fontSize: 10, fontWeight: 600, color: '#10B981' }}>Paid</span></>
                  : <><Clock size={12} color="#F59E0B" /><span style={{ fontSize: 10, fontWeight: 600, color: '#F59E0B' }}>Pending</span></>
                }
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader title="Monthly Residual Trend" subtitle="Last 6 months" />
        <div style={{ height: 260, padding: '0 8px 8px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="residualAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(1)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Residuals']} />
              <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} fill="url(#residualAreaGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Breakdown - clickable */}
      <Card noPadding>
        <div style={{ padding: '16px 16px 0' }}>
          <CardHeader title="Residual Breakdown by Merchant" subtitle="Top 10 merchants by volume — click for details" />
        </div>
        <DataTable columns={breakdownCols} data={breakdownData} onRowClick={(r) => setSelectedMerchant(r.merchant)} />
      </Card>

      {/* Merchant Detail Drawer */}
      {detail && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <CardHeader title={detail.name} subtitle={`MID: ${detail.mid}`} />
            <button onClick={() => setSelectedMerchant(null)} style={{
              padding: '6px 12px', background: '#F1F5F9', border: 'none', borderRadius: 8,
              fontSize: 11, fontWeight: 600, color: '#64748B', cursor: 'pointer',
            }}>
              Close
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>Volume</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{detail.volume}</div>
            </div>
            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>Eff. Rate</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{detail.rate}</div>
            </div>
            <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' as const }}>Split</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginTop: 2 }}>{detail.split}</div>
            </div>
            <div style={{ padding: '12px', background: '#F0FDF4', borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: '#059669', fontWeight: 600, textTransform: 'uppercase' as const }}>Residual</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#059669', marginTop: 2 }}>{detail.residual}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#64748B' }}>Boarded: <span style={{ fontWeight: 600, color: '#0F172A' }}>{detail.boarded}</span></div>
            <div style={{ fontSize: 12, color: '#64748B' }}>Avg Ticket: <span style={{ fontWeight: 600, color: '#0F172A' }}>{detail.avgTicket}</span></div>
          </div>
        </Card>
      )}

      {/* Payout History */}
      <Card noPadding>
        <div style={{ padding: '16px 16px 0' }}>
          <CardHeader title="Payout History" subtitle="Last 6 months" />
        </div>
        <DataTable columns={payoutCols} data={payoutHistory} />
      </Card>
    </div>
  )
}
