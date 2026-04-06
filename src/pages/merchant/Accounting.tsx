import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { DollarSign, TrendingDown, TrendingUp, Receipt } from 'lucide-react'

type PLRow = { category: string; amount: string; percentage: string; type: 'revenue' | 'expense' | 'total' }

const plData: PLRow[] = [
  { category: 'Sales Revenue', amount: '$47,230.00', percentage: '100%', type: 'revenue' },
  { category: 'Cost of Goods', amount: '-$8,501.40', percentage: '18.0%', type: 'expense' },
  { category: 'Gross Profit', amount: '$38,728.60', percentage: '82.0%', type: 'total' },
  { category: 'Rent & Utilities', amount: '-$3,200.00', percentage: '6.8%', type: 'expense' },
  { category: 'Payroll', amount: '-$5,307.06', percentage: '11.2%', type: 'expense' },
  { category: 'Supplies & Inventory', amount: '-$2,140.00', percentage: '4.5%', type: 'expense' },
  { category: 'Processing Fees', amount: '-$924.40', percentage: '2.0%', type: 'expense' },
  { category: 'Insurance', amount: '-$878.54', percentage: '1.9%', type: 'expense' },
  { category: 'Net Profit', amount: '$34,780.00', percentage: '73.6%', type: 'total' },
]

const plCols: Column<PLRow>[] = [
  { key: 'category', header: 'Category', render: (r) => (
    <span style={{ fontWeight: r.type === 'total' ? 700 : 500, color: '#0F172A', paddingLeft: r.type === 'expense' ? 16 : 0 }}>{r.category}</span>
  )},
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
    <span style={{ fontWeight: r.type === 'total' ? 700 : 500, color: r.type === 'expense' ? '#EF4444' : r.type === 'total' ? '#059669' : '#0F172A' }}>{r.amount}</span>
  )},
  { key: 'percentage', header: '% of Revenue', align: 'right', render: (r) => (
    <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: r.type === 'total' ? 600 : 400 }}>{r.percentage}</span>
  )},
]

const monthlyTrend = [
  { month: 'Oct 2025', revenue: '$41,200', expenses: '$10,800', profit: '$30,400' },
  { month: 'Nov 2025', revenue: '$44,850', expenses: '$11,340', profit: '$33,510' },
  { month: 'Dec 2025', revenue: '$52,100', expenses: '$13,200', profit: '$38,900' },
  { month: 'Jan 2026', revenue: '$39,700', expenses: '$11,100', profit: '$28,600' },
  { month: 'Feb 2026', revenue: '$43,500', expenses: '$12,050', profit: '$31,450' },
  { month: 'Mar 2026', revenue: '$47,230', expenses: '$12,450', profit: '$34,780' },
]

type TrendRow = { month: string; revenue: string; expenses: string; profit: string }

const trendCols: Column<TrendRow>[] = [
  { key: 'month', header: 'Month', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.month}</span> },
  { key: 'revenue', header: 'Revenue', align: 'right', render: (r) => <span style={{ fontWeight: 500 }}>{r.revenue}</span> },
  { key: 'expenses', header: 'Expenses', align: 'right', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.expenses}</span> },
  { key: 'profit', header: 'Net Profit', align: 'right', render: (r) => <span style={{ color: '#059669', fontWeight: 600 }}>{r.profit}</span> },
]

export default function Accounting() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: DollarSign, label: 'Revenue MTD', value: '$47,230', sub: '+8.6% vs last month' },
          { icon: TrendingDown, label: 'Expenses MTD', value: '$12,450', sub: '+3.3% vs last month' },
          { icon: TrendingUp, label: 'Net Profit', value: '$34,780', sub: '73.6% margin' },
          { icon: Receipt, label: 'Est. Tax Liability', value: '$8,695', sub: 'Q1 2026 estimate' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* QuickBooks Sync */}
      <Card>
        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>QuickBooks Online</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>Last synced: Mar 14, 2026 at 11:42 AM</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusBadge variant="emerald" dot pulse>Connected</StatusBadge>
            <button style={{ padding: '6px 14px', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>
              Sync Now
            </button>
          </div>
        </div>
      </Card>

      {/* Profit & Loss Summary */}
      <Card noPadding>
        <CardHeader title="Profit & Loss Summary" subtitle="March 2026 (month to date)" />
        <DataTable columns={plCols} data={plData as unknown as Record<string, unknown>[]} hoverable />
      </Card>

      {/* Monthly Trend */}
      <Card noPadding>
        <CardHeader title="Monthly Trend" subtitle="Last 6 months" />
        <DataTable columns={trendCols} data={monthlyTrend as unknown as Record<string, unknown>[]} hoverable striped />
      </Card>
    </div>
  )
}
