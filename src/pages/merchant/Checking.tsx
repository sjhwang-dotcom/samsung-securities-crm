import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { Landmark, ArrowDownToLine, CreditCard, TrendingUp, ArrowUpRight, Send } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

type TxRow = { date: string; description: string; type: string; amount: string; balance: string; status: string }

const transactions: TxRow[] = [
  { date: 'Apr 8, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$2,413.60', balance: '$24,187.52', status: 'Completed' },
  { date: 'Apr 8, 2026', description: 'Vendor Payment - Sysco Foods', type: 'Payment', amount: '-$1,245.00', balance: '$21,773.92', status: 'Completed' },
  { date: 'Apr 7, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$1,985.30', balance: '$23,018.92', status: 'Completed' },
  { date: 'Apr 7, 2026', description: 'Funding Payback', type: 'Repayment', amount: '-$95.83', balance: '$21,033.62', status: 'Completed' },
  { date: 'Apr 6, 2026', description: 'Payroll - Biweekly', type: 'Payroll', amount: '-$5,307.06', balance: '$21,129.45', status: 'Completed' },
  { date: 'Apr 5, 2026', description: 'Daily Card Settlement', type: 'Settlement', amount: '+$2,751.20', balance: '$26,436.51', status: 'Completed' },
]

const cols: Column<TxRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'description', header: 'Description', render: (r) => <span style={{ fontWeight: 500, color: '#0F172A' }}>{r.description}</span> },
  { key: 'type', header: 'Type', render: (r) => {
    const variant = r.type === 'Settlement' ? 'emerald' : r.type === 'Payroll' ? 'blue' : r.type === 'Payment' ? 'purple' : 'amber'
    return <StatusBadge variant={variant}>{r.type}</StatusBadge>
  }},
  { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
    <span style={{ fontWeight: 600, color: r.amount.startsWith('+') ? '#059669' : '#EF4444' }}>{r.amount}</span>
  )},
  { key: 'balance', header: 'Balance', align: 'right', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{r.balance}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

const interestData = [
  { month: 'Nov', interest: 28.40 },
  { month: 'Dec', interest: 34.10 },
  { month: 'Jan', interest: 31.55 },
  { month: 'Feb', interest: 29.80 },
  { month: 'Mar', interest: 36.20 },
  { month: 'Apr', interest: 18.75 },
]

const connectedProducts = [
  { name: 'Business Funding', description: 'Daily automatic payback deduction', status: 'Active' },
  { name: 'Payroll', description: 'Biweekly payroll withdrawals', status: 'Active' },
  { name: 'Card Processing', description: 'Daily settlement deposits', status: 'Active' },
  { name: 'Accounting (QuickBooks)', description: 'Auto-sync transactions nightly', status: 'Active' },
]

export default function Checking() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: Landmark, label: 'Available Balance', value: '$24,187.52', sub: 'Harlow Business Checking' },
          { icon: TrendingUp, label: 'APY Earnings', value: '3.75%', sub: '$178.80 earned YTD' },
          { icon: ArrowDownToLine, label: "Today's Settlement", value: '$2,413.60', sub: '156 transactions' },
          { icon: CreditCard, label: 'This Month', value: '$52,340', sub: '32 settlements' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Account Balance Card + Transfer CTA */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Account Details" badge={<StatusBadge variant="emerald" dot pulse>Active</StatusBadge>} />
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Interest Earned (MTD)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>$18.75</div>
              </div>
              <div style={{ padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Interest Earned (YTD)</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1578F7' }}>$178.80</div>
              </div>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Average Balance</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>$21,430</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={26} color="#1578F7" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>Transfer Money</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>Move funds to an external bank or between Harlow accounts</div>
            </div>
            <button style={{ padding: '10px 28px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <ArrowUpRight size={14} /> New Transfer
            </button>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>ACH transfers: 1-2 business days</div>
          </div>
        </Card>
      </div>

      {/* Monthly Interest Earned Chart */}
      <Card>
        <CardHeader title="Monthly Interest Earned" subtitle="3.75% APY on average daily balance" />
        <div style={{ padding: '0 20px 20px', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={interestData}>
              <defs>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toFixed(2)}`, 'Interest']} />
              <Area type="monotone" dataKey="interest" stroke="#10B981" strokeWidth={2} fill="url(#interestGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card noPadding>
        <CardHeader title="Recent Transactions" subtitle="All account activity" />
        <DataTable columns={cols} data={transactions} hoverable />
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
