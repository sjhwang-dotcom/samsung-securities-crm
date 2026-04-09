import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { CalendarDays, DollarSign, Users, Calculator, ShieldCheck, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

type EmployeeRow = { name: string; type: string; hours: number; rate: string; gross: string; tax: string; deductions: string; net: string }

const employees: EmployeeRow[] = [
  { name: 'Maria Santos', type: 'Full-time', hours: 80, rate: '$18.00/hr', gross: '$1,440.00', tax: '-$115.20', deductions: '-$57.60', net: '$1,267.20' },
  { name: 'James Chen', type: 'Full-time', hours: 80, rate: '$16.50/hr', gross: '$1,320.00', tax: '-$105.60', deductions: '-$52.80', net: '$1,161.60' },
  { name: 'Aisha Johnson', type: 'Part-time', hours: 52, rate: '$15.00/hr', gross: '$780.00', tax: '-$46.80', deductions: '-$15.60', net: '$717.60' },
  { name: 'Carlos Rivera', type: 'Part-time', hours: 48, rate: '$15.00/hr', gross: '$720.00', tax: '-$43.20', deductions: '-$14.40', net: '$662.40' },
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
  { key: 'tax', header: 'Tax', align: 'right', render: (r) => <span style={{ color: '#F59E0B', fontWeight: 500 }}>{r.tax}</span> },
  { key: 'deductions', header: 'Deductions', align: 'right', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.deductions}</span> },
  { key: 'net', header: 'Net Pay', align: 'right', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.net}</span> },
]

const payrollHistory = [
  { month: 'Nov', grossPay: 9240, taxes: 891, total: 10131 },
  { month: 'Dec', grossPay: 9680, taxes: 933, total: 10613 },
  { month: 'Jan', grossPay: 9420, taxes: 908, total: 10328 },
  { month: 'Feb', grossPay: 9340, taxes: 901, total: 10241 },
  { month: 'Mar', grossPay: 9680, taxes: 934, total: 10614 },
  { month: 'Apr', grossPay: 4840, taxes: 467, total: 5307 },
]

type HistoryRow = { date: string; period: string; employees: number; grossPay: string; taxes: string; totalCost: string; status: string }

const history: HistoryRow[] = [
  { date: 'Apr 6, 2026', period: 'Mar 28 - Apr 10', employees: 4, grossPay: '$4,840.00', taxes: '$467.06', totalCost: '$5,307.06', status: 'Paid' },
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
          { icon: CalendarDays, label: 'Next Payroll', value: 'Apr 24', sub: 'Biweekly schedule' },
          { icon: DollarSign, label: 'Est. Next Run', value: '$5,307', sub: 'Gross + taxes & fees' },
          { icon: Users, label: 'Employees', value: '4', sub: '2 full-time, 2 part-time' },
          { icon: Calculator, label: 'YTD Payroll Cost', value: '$36,497', sub: '7 pay runs this year' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Next Payroll Card + Tax Compliance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={22} color="#1578F7" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Next Payroll: April 24, 2026</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Pay period: Apr 11 - Apr 24</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Gross Pay</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0F172A' }}>$4,260</div>
              </div>
              <div style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Taxes</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#F59E0B' }}>$411</div>
              </div>
              <div style={{ padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#2563EB', textTransform: 'uppercase' }}>Total</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#1578F7' }}>$4,671</div>
              </div>
            </div>
            <button style={{ marginTop: 16, width: '100%', padding: '10px 0', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Review & Run Payroll
            </button>
          </div>
        </Card>

        <Card>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#16A34A" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Tax Compliance</div>
                <StatusBadge variant="emerald" dot pulse>All filings current</StatusBadge>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {[
                { label: 'Federal 941', status: 'Filed', date: 'Q1 due Apr 30' },
                { label: 'State Withholding', status: 'Filed', date: 'Q1 due Apr 30' },
                { label: 'FUTA (940)', status: 'On Track', date: 'Annual - Jan 31, 2027' },
                { label: 'W-2 / 1099', status: 'Complete', date: 'Filed Jan 28, 2026' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: 6 }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.label}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>{item.date}</span>
                  </div>
                  <StatusBadge variant="emerald">{item.status}</StatusBadge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Payroll History Chart */}
      <Card>
        <CardHeader title="Monthly Payroll Cost" subtitle="Gross pay vs taxes over 6 months" />
        <div style={{ padding: '0 20px 20px', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={payrollHistory} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
              <Bar dataKey="grossPay" stackId="a" fill="#1578F7" radius={[0, 0, 0, 0]} name="Gross Pay" />
              <Bar dataKey="taxes" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Taxes & Fees" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Year-to-Date Totals */}
      <Card>
        <CardHeader title="Year-to-Date Totals" subtitle="January 1 - April 9, 2026" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {[
            { label: 'Total Gross Pay', value: '$32,060', color: '#0F172A' },
            { label: 'Federal Tax', value: '$2,565', color: '#F43F5E' },
            { label: 'State Tax', value: '$961', color: '#F59E0B' },
            { label: 'FICA (SS + Med)', value: '$2,453', color: '#4F46E5' },
            { label: 'Total Employer Cost', value: '$36,497', color: '#1578F7' },
          ].map(item => (
            <div key={item.label} style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Employee Breakdown */}
      <Card noPadding>
        <CardHeader title="Employee Breakdown" subtitle="Current pay period: Apr 11 - Apr 24" />
        <DataTable columns={empCols} data={employees} hoverable />
        <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL GROSS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>$4,260.00</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL TAX</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F59E0B' }}>-$310.80</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL DEDUCTIONS</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#EF4444' }}>-$140.40</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600 }}>TOTAL NET</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>$3,808.80</div>
          </div>
        </div>
      </Card>

      {/* Payroll History */}
      <Card noPadding>
        <CardHeader title="Payroll History" subtitle="Recent pay runs" />
        <DataTable columns={historyCols} data={history} hoverable striped />
      </Card>
    </div>
  )
}
