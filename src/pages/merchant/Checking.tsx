import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { Landmark, ArrowDownToLine, CreditCard, Link2 } from 'lucide-react'

type TxRow = { date: string; description: string; type: string; amount: string; balance: string; status: string }

const transactions: TxRow[] = [
  { date: 'Mar 14, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$2,013.90', balance: '$14,847.32', status: 'Completed' },
  { date: 'Mar 14, 2026', description: 'Funding Payback', type: 'Repayment', amount: '-$95.83', balance: '$12,833.42', status: 'Completed' },
  { date: 'Mar 13, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$1,795.50', balance: '$12,929.25', status: 'Completed' },
  { date: 'Mar 13, 2026', description: 'Payroll - Biweekly', type: 'Payroll', amount: '-$5,307.06', balance: '$11,133.75', status: 'Completed' },
  { date: 'Mar 13, 2026', description: 'Funding Payback', type: 'Repayment', amount: '-$95.83', balance: '$16,440.81', status: 'Completed' },
  { date: 'Mar 12, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$1,496.80', balance: '$16,536.64', status: 'Completed' },
  { date: 'Mar 12, 2026', description: 'Funding Payback', type: 'Repayment', amount: '-$95.83', balance: '$15,039.84', status: 'Completed' },
  { date: 'Mar 11, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$2,155.80', balance: '$15,135.67', status: 'Completed' },
]

const cols: Column<TxRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'description', header: 'Description', render: (r) => <span style={{ fontWeight: 500, color: '#0F172A' }}>{r.description}</span> },
  { key: 'type', header: 'Type', render: (r) => {
    const variant = r.type === 'Settlement' ? 'emerald' : r.type === 'Payroll' ? 'blue' : 'amber'
    return <StatusBadge variant={variant}>{r.type}</StatusBadge>
  }},
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
    <span style={{ fontWeight: 600, color: r.amount.startsWith('+') ? '#059669' : '#EF4444' }}>{r.amount}</span>
  )},
  { key: 'balance', header: 'Balance', align: 'right', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{r.balance}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

const connectedProducts = [
  { name: 'Business Funding', description: 'Daily automatic payback deduction', status: 'Active' },
  { name: 'Payroll', description: 'Biweekly payroll withdrawals', status: 'Active' },
  { name: 'Card Processing', description: 'Daily settlement deposits', status: 'Active' },
]

export default function Checking() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: Landmark, label: 'Available Balance', value: '$14,847.32', sub: 'As of today' },
          { icon: ArrowDownToLine, label: "Today's Settlement", value: '$2,013.90', sub: '134 transactions' },
          { icon: CreditCard, label: 'This Week', value: '$6,247.10', sub: '4 business days' },
          { icon: Link2, label: 'This Month', value: '$47,230', sub: '28 settlements' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Account Details */}
      <Card>
        <CardHeader title="Account Details" badge={<StatusBadge variant="emerald" dot pulse>Active</StatusBadge>} />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Bank', value: 'Harlow Business Checking' },
              { label: 'Routing Number', value: '021000021' },
              { label: 'Account Number', value: '****8834' },
            ].map(item => (
              <div key={item.label} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', fontFamily: item.label !== 'Bank' ? 'monospace' : 'inherit' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card noPadding>
        <CardHeader title="Recent Transactions" subtitle="All account activity" />
        <DataTable columns={cols} data={transactions as unknown as Record<string, unknown>[]} hoverable />
      </Card>

      {/* Connected Products */}
      <Card>
        <CardHeader title="Connected Products" subtitle="Products linked to this account" />
        <div style={{ padding: '0 20px 20px' }}>
          {connectedProducts.map((p, i) => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{p.description}</div>
              </div>
              <StatusBadge variant="emerald" dot>{p.status}</StatusBadge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
