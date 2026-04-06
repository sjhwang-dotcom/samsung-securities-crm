import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { CalendarDays, DollarSign, Users, Calculator } from 'lucide-react'

type EmployeeRow = { name: string; type: string; hours: number; rate: string; gross: string; deductions: string; net: string }

const employees: EmployeeRow[] = [
  { name: 'Maria Santos', type: 'Full-time', hours: 80, rate: '$18.00/hr', gross: '$1,440.00', deductions: '-$172.80', net: '$1,267.20' },
  { name: 'James Chen', type: 'Full-time', hours: 80, rate: '$16.50/hr', gross: '$1,320.00', deductions: '-$158.40', net: '$1,161.60' },
  { name: 'Aisha Johnson', type: 'Part-time', hours: 52, rate: '$15.00/hr', gross: '$780.00', deductions: '-$62.40', net: '$717.60' },
  { name: 'Carlos Rivera', type: 'Part-time', hours: 48, rate: '$15.00/hr', gross: '$720.00', deductions: '-$57.60', net: '$662.40' },
]

const empCols: Column<EmployeeRow>[] = [
  { key: 'name', header: 'Employee', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
  { key: 'type', header: 'Type', render: (r) => {
    const variant = r.type === 'Full-time' ? 'blue' : 'purple'
    return <StatusBadge variant={variant}>{r.type}</StatusBadge>
  }},
  { key: 'hours', header: 'Hours', align: 'right' },
  { key: 'rate', header: 'Rate', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.rate}</span> },
  { key: 'gross', header: 'Gross Pay', align: 'right', render: (r) => <span style={{ fontWeight: 500 }}>{r.gross}</span> },
  { key: 'deductions', header: 'Deductions', align: 'right', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.deductions}</span> },
  { key: 'net', header: 'Net Pay', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.net}</span> },
]

type HistoryRow = { date: string; period: string; employees: number; grossPay: string; taxes: string; totalCost: string; status: string }

const history: HistoryRow[] = [
  { date: 'Mar 13, 2026', period: 'Feb 28 - Mar 13', employees: 4, grossPay: '$4,840.00', taxes: '$467.06', totalCost: '$5,307.06', status: 'Paid' },
  { date: 'Feb 27, 2026', period: 'Feb 14 - Feb 27', employees: 4, grossPay: '$4,620.00', taxes: '$445.88', totalCost: '$5,065.88', status: 'Paid' },
  { date: 'Feb 13, 2026', period: 'Jan 31 - Feb 13', employees: 4, grossPay: '$4,720.00', taxes: '$455.52', totalCost: '$5,175.52', status: 'Paid' },
]

const historyCols: Column<HistoryRow>[] = [
  { key: 'date', header: 'Run Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'period', header: 'Pay Period', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.period}</span> },
  { key: 'employees', header: 'Employees', align: 'center' },
  { key: 'grossPay', header: 'Gross Pay', align: 'right' },
  { key: 'taxes', header: 'Taxes & Fees', align: 'right', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.taxes}</span> },
  { key: 'totalCost', header: 'Total Cost', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.totalCost}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

export default function PayrollPage() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: CalendarDays, label: 'Next Payroll', value: 'Mar 28', sub: 'Biweekly schedule' },
          { icon: DollarSign, label: 'Gross Pay', value: '$4,840', sub: 'Current pay period' },
          { icon: Users, label: 'Employees', value: '4', sub: '2 full-time, 2 part-time' },
          { icon: Calculator, label: 'Total Cost', value: '$5,307.06', sub: 'Including taxes & fees' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tax Compliance */}
      <Card>
        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Tax Compliance</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>All federal and state filings are up to date. Next quarterly filing: Apr 15, 2026.</div>
          </div>
          <StatusBadge variant="emerald" dot pulse>Compliant</StatusBadge>
        </div>
      </Card>

      {/* Employee Breakdown */}
      <Card noPadding>
        <CardHeader title="Employee Breakdown" subtitle="Current pay period: Mar 14 - Mar 27" />
        <DataTable columns={empCols} data={employees} hoverable />
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL GROSS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>$4,840.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL DEDUCTIONS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>-$451.20</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL NET</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>$3,808.80</div>
          </div>
        </div>
      </Card>

      {/* Payroll History */}
      <Card noPadding>
        <CardHeader title="Payroll History" subtitle="Last 3 pay runs" />
        <DataTable columns={historyCols} data={history} hoverable striped />
      </Card>
    </div>
  )
}
