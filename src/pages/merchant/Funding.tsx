import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { DollarSign, Clock, TrendingUp, CalendarDays } from 'lucide-react'

type PaybackRow = { date: string; amount: string; method: string; remaining: string; status: string }

const paybacks: PaybackRow[] = [
  { date: 'Mar 14, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,167.40', status: 'Completed' },
  { date: 'Mar 13, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,263.23', status: 'Completed' },
  { date: 'Mar 12, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,359.06', status: 'Completed' },
  { date: 'Mar 11, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,454.89', status: 'Completed' },
  { date: 'Mar 10, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,550.72', status: 'Completed' },
  { date: 'Mar 9, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,646.55', status: 'Completed' },
  { date: 'Mar 8, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,742.38', status: 'Completed' },
]

const cols: Column<PaybackRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.amount}</span> },
  { key: 'method', header: 'Method' },
  { key: 'remaining', header: 'Remaining Balance', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{r.remaining}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

export default function Funding() {
  const totalPayback = 24375
  const remaining = 3167.40
  const paid = totalPayback - remaining
  const progress = Math.round((paid / totalPayback) * 100)

  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: DollarSign, label: 'Pre-approved Amount', value: '$25,000', sub: 'Based on your sales history' },
          { icon: TrendingUp, label: 'Current Balance', value: '$3,167.40', sub: 'Remaining to pay back' },
          { icon: Clock, label: 'Daily Payback', value: '$95.83', sub: 'Automatically deducted' },
          { icon: CalendarDays, label: 'Days Remaining', value: '33', sub: 'Estimated payoff: Apr 16' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Repayment Progress */}
      <Card>
        <CardHeader title="Repayment Progress" badge={<StatusBadge variant="emerald" dot pulse>On Track</StatusBadge>} />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#64748B' }}>
            <span>${paid.toLocaleString()} paid</span>
            <span>{progress}% complete</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#94A3B8' }}>
            <span>Started: Feb 10, 2026</span>
            <span>Est. completion: Apr 16, 2026</span>
          </div>
        </div>
      </Card>

      {/* Funding Terms */}
      <Card>
        <CardHeader title="Your Funding Terms" />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              { label: 'Funded Amount', value: '$25,000.00' },
              { label: 'Total Payback', value: '$24,375.00' },
              { label: 'Total Cost of Funding', value: '$3,375.00' },
              { label: 'Daily Hold Percentage', value: '10% of daily sales' },
              { label: 'Minimum Daily Payback', value: '$95.83' },
              { label: 'Term Length', value: '~255 days (based on sales)' },
            ].map(item => (
              <div key={item.label} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Payback History */}
      <Card noPadding>
        <CardHeader title="Payback History" subtitle="Daily automatic deductions" />
        <DataTable columns={cols} data={paybacks} hoverable />
      </Card>

      {/* Apply for Additional Funding */}
      <Card>
        <CardHeader title="Apply for Additional Funding" />
        <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#64748B', marginBottom: 16, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
            Based on your sales performance, you may qualify for additional funding once your current balance drops below 25%.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button style={{ padding: '10px 24px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Check Eligibility
            </button>
            <button style={{ padding: '10px 24px', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Contact Advisor
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
