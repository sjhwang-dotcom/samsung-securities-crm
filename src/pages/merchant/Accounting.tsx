import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { DollarSign, TrendingDown, TrendingUp, Receipt, RefreshCw, Link2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

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

const monthlyTrendChart = [
  { month: 'Nov', revenue: 44850, expenses: 11340, profit: 33510 },
  { month: 'Dec', revenue: 52100, expenses: 13200, profit: 38900 },
  { month: 'Jan', revenue: 39700, expenses: 11100, profit: 28600 },
  { month: 'Feb', revenue: 43500, expenses: 12050, profit: 31450 },
  { month: 'Mar', revenue: 47230, expenses: 12450, profit: 34780 },
  { month: 'Apr', revenue: 18920, expenses: 5100, profit: 13820 },
]

const expenseBreakdown = [
  { name: 'COGS', value: 8501, color: '#F43F5E' },
  { name: 'Payroll', value: 5307, color: '#1578F7' },
  { name: 'Rent & Utilities', value: 3200, color: '#F59E0B' },
  { name: 'Supplies', value: 2140, color: '#10B981' },
  { name: 'Processing', value: 924, color: '#4F46E5' },
  { name: 'Insurance', value: 879, color: '#0891B2' },
]

type SyncRow = { date: string; description: string; category: string; amount: string; status: string }

const recentSynced: SyncRow[] = [
  { date: 'Apr 8, 2026', description: 'Card Processing Settlement', category: 'Revenue', amount: '+$2,413.60', status: 'Synced' },
  { date: 'Apr 8, 2026', description: 'Sysco Foods - Inventory', category: 'COGS', amount: '-$1,245.00', status: 'Synced' },
  { date: 'Apr 7, 2026', description: 'ConEd - Electric Bill', category: 'Utilities', amount: '-$342.50', status: 'Synced' },
  { date: 'Apr 7, 2026', description: 'Card Processing Settlement', category: 'Revenue', amount: '+$1,985.30', status: 'Synced' },
  { date: 'Apr 6, 2026', description: 'Payroll - Biweekly', category: 'Payroll', amount: '-$5,307.06', status: 'Synced' },
]

const syncCols: Column<SyncRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'description', header: 'Description', render: (r) => <span style={{ fontWeight: 500, color: '#0F172A' }}>{r.description}</span> },
  { key: 'category', header: 'Category', render: (r) => {
    const variant = r.category === 'Revenue' ? 'emerald' : r.category === 'COGS' ? 'rose' : r.category === 'Payroll' ? 'blue' : 'amber'
    return <StatusBadge variant={variant}>{r.category}</StatusBadge>
  }},
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
    <span style={{ fontWeight: 600, color: r.amount.startsWith('+') ? '#059669' : '#EF4444' }}>{r.amount}</span>
  )},
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

const connectedAccounts = [
  { name: 'Harlow Business Checking', type: 'Bank Account', status: 'Connected' },
  { name: 'Harlow Card Processing', type: 'Payment Processing', status: 'Connected' },
  { name: 'Harlow Payroll', type: 'Payroll', status: 'Connected' },
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Link2 size={20} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>QuickBooks Online</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>Last synced: Apr 9, 2026 at 8:15 AM</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusBadge variant="emerald" dot pulse>Connected</StatusBadge>
            <button style={{ padding: '6px 14px', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 6, fontWeight: 600, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={12} /> Sync Now
            </button>
          </div>
        </div>
      </Card>

      {/* Revenue vs Expenses Chart + Expense Donut */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <Card>
          <CardHeader title="Revenue vs Expenses" subtitle="Last 6 months" />
          <div style={{ padding: '0 20px 20px', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendChart} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
                <Bar dataKey="revenue" fill="#1578F7" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Expense Breakdown" subtitle="March 2026" />
          <div style={{ padding: '0 20px 20px', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseBreakdown} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tax Estimates */}
      <Card>
        <CardHeader title="Quarterly Tax Estimates" subtitle="Based on current year-to-date income" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { quarter: 'Q1 2026', due: 'Apr 15', amount: '$8,695', status: 'Due Soon' },
            { quarter: 'Q2 2026', due: 'Jun 15', amount: '$8,695', status: 'Upcoming' },
            { quarter: 'Q3 2026', due: 'Sep 15', amount: '$8,695', status: 'Upcoming' },
            { quarter: 'Q4 2026', due: 'Jan 15, 2027', amount: '$8,695', status: 'Upcoming' },
          ].map(q => (
            <div key={q.quarter} style={{ padding: 16, background: q.status === 'Due Soon' ? '#FEF3C7' : '#F8FAFC', borderRadius: 10, border: q.status === 'Due Soon' ? '1px solid #FDE68A' : '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{q.quarter}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '4px 0' }}>{q.amount}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>Due: {q.due}</div>
              <div style={{ marginTop: 8 }}>
                <StatusBadge variant={q.status === 'Due Soon' ? 'amber' : 'gray'}>{q.status}</StatusBadge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Profit & Loss Summary */}
      <Card noPadding>
        <CardHeader title="Profit & Loss Summary" subtitle="March 2026 (month to date)" />
        <DataTable columns={plCols} data={plData} hoverable />
      </Card>

      {/* Recently Synced Transactions */}
      <Card noPadding>
        <CardHeader title="Recently Synced Transactions" subtitle="Auto-synced from Harlow accounts" />
        <DataTable columns={syncCols} data={recentSynced} hoverable />
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader title="Connected Accounts" subtitle="Data sources syncing to QuickBooks" />
        <div style={{ padding: '0 20px 20px' }}>
          {connectedAccounts.map((a, i) => (
            <div key={a.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{a.type}</div>
              </div>
              <StatusBadge variant="emerald" dot>{a.status}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
