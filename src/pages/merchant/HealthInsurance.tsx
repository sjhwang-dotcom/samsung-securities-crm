import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { ShieldCheck, Heart, Users, CalendarDays, FileText, DollarSign } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

type EmployeeRow = { name: string; plan: string; dependents: number; status: string; enrolled: string; monthlyPremium: string }

const enrolledEmployees: EmployeeRow[] = [
  { name: 'Maria Santos', plan: 'Silver', dependents: 2, status: 'Active', enrolled: 'Jan 15, 2026', monthlyPremium: '$480' },
  { name: 'James Chen', plan: 'Silver', dependents: 0, status: 'Active', enrolled: 'Jan 15, 2026', monthlyPremium: '$480' },
  { name: 'Aisha Johnson', plan: 'Bronze', dependents: 1, status: 'Active', enrolled: 'Feb 1, 2026', monthlyPremium: '$320' },
  { name: 'Carlos Rivera', plan: 'Bronze', dependents: 0, status: 'Waived', enrolled: '-', monthlyPremium: '$0' },
]

const employeeCols: Column<EmployeeRow>[] = [
  { key: 'name', header: 'Employee', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
  { key: 'plan', header: 'Plan', render: (r) => {
    const variant = r.plan === 'Silver' ? 'blue' : r.plan === 'Bronze' ? 'amber' : 'purple'
    return r.status === 'Waived' ? <span style={{ color: '#94A3B8', fontSize: 12 }}>-</span> : <StatusBadge variant={variant}>{r.plan}</StatusBadge>
  }},
  { key: 'dependents', header: 'Dependents', align: 'center' },
  { key: 'enrolled', header: 'Enrolled Since', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.enrolled}</span> },
  { key: 'monthlyPremium', header: 'Monthly', align: 'right', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.monthlyPremium}</span> },
  { key: 'status', header: 'Status', render: (r) => {
    const variant = r.status === 'Active' ? 'emerald' : 'gray'
    return <StatusBadge variant={variant}>{r.status}</StatusBadge>
  }},
]

type ClaimRow = { date: string; employee: string; type: string; provider: string; billed: string; covered: string; status: string }

const recentClaims: ClaimRow[] = [
  { date: 'Apr 2, 2026', employee: 'Maria Santos', type: 'Office Visit', provider: 'CityMD Urgent Care', billed: '$185.00', covered: '$160.00', status: 'Paid' },
  { date: 'Mar 18, 2026', employee: 'James Chen', type: 'Lab Work', provider: 'Quest Diagnostics', billed: '$340.00', covered: '$238.00', status: 'Paid' },
  { date: 'Mar 5, 2026', employee: 'Aisha Johnson', type: 'Prescription', provider: 'CVS Pharmacy', billed: '$65.00', covered: '$39.00', status: 'Paid' },
  { date: 'Feb 20, 2026', employee: 'Maria Santos', type: 'Dental Cleaning', provider: 'Bright Smile Dental', billed: '$210.00', covered: '$147.00', status: 'Paid' },
]

const claimCols: Column<ClaimRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'employee', header: 'Employee', render: (r) => <span style={{ fontWeight: 500 }}>{r.employee}</span> },
  { key: 'type', header: 'Type', render: (r) => <StatusBadge variant="blue">{r.type}</StatusBadge> },
  { key: 'provider', header: 'Provider', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.provider}</span> },
  { key: 'billed', header: 'Billed', align: 'right' },
  { key: 'covered', header: 'Covered', align: 'right', render: (r) => <span style={{ fontWeight: 600, color: '#059669' }}>{r.covered}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

const premiumHistory = [
  { month: 'Jan', employer: 960, employee: 320 },
  { month: 'Feb', employer: 960, employee: 320 },
  { month: 'Mar', employer: 960, employee: 320 },
  { month: 'Apr', employer: 960, employee: 320 },
  { month: 'May', employer: 960, employee: 320 },
  { month: 'Jun', employer: 960, employee: 320 },
]

export default function HealthInsurance() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: ShieldCheck, label: 'Plan Status', value: 'Active', sub: 'Silver & Bronze plans' },
          { icon: Users, label: 'Enrolled', value: '3 of 4', sub: '1 employee waived' },
          { icon: DollarSign, label: 'Monthly Premium', value: '$1,280', sub: 'Employer contribution' },
          { icon: CalendarDays, label: 'Next Renewal', value: 'Jan 15, 2027', sub: '281 days remaining' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Plan Overview + Premium Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Plan Overview" badge={<StatusBadge variant="emerald" dot pulse>Active</StatusBadge>} />
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Provider', value: 'Harlow Health Partners' },
                { label: 'Plan Year', value: 'Jan 2026 - Jan 2027' },
                { label: 'Network', value: 'PPO Nationwide' },
                { label: 'Group ID', value: 'HHP-2026-4821' },
              ].map(item => (
                <div key={item.label} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#16A34A', textTransform: 'uppercase' }}>Preventive Care</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>100% Covered</div>
              </div>
              <div style={{ padding: 12, background: '#EFF6FF', borderRadius: 8, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#2563EB', textTransform: 'uppercase' }}>Telehealth</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1578F7' }}>$0 Copay</div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Monthly Premium Breakdown" subtitle="Total: $1,280/month" />
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ marginBottom: 16 }}>
              {[
                { label: 'Silver Plan (2 employees)', amount: '$960', detail: '$480/employee x 2' },
                { label: 'Bronze Plan (1 employee)', amount: '$320', detail: '$320/employee x 1' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.label}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{item.detail}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.amount}</div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Total Monthly</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1578F7' }}>$1,280</div>
              </div>
            </div>
            <div style={{ padding: 12, background: '#F0FDF4', borderRadius: 8, border: '1px solid #BBF7D0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Heart size={14} color="#16A34A" />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#16A34A' }}>Tax deductible as a business expense</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>YTD premiums paid: $5,120 (Jan-Apr)</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Premium History Chart */}
      <Card>
        <CardHeader title="Premium Cost Trend" subtitle="Monthly employer vs employee contribution" />
        <div style={{ padding: '0 20px 20px', height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={premiumHistory} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${v}`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
              <Bar dataKey="employer" stackId="a" fill="#1578F7" radius={[0, 0, 0, 0]} name="Employer" />
              <Bar dataKey="employee" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} name="Employee" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Enrolled Employees */}
      <Card noPadding>
        <CardHeader title="Enrolled Employees" subtitle="Current enrollment status" />
        <DataTable columns={employeeCols} data={enrolledEmployees} hoverable />
      </Card>

      {/* Claims Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Total Claims (YTD)', value: '8', sub: 'All processed', color: '#0F172A' },
          { label: 'Total Billed', value: '$2,840', sub: 'From providers', color: '#0F172A' },
          { label: 'Total Covered', value: '$2,124', sub: '74.8% coverage rate', color: '#059669' },
          { label: 'Out-of-Pocket', value: '$716', sub: 'Employee responsibility', color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20, color: k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Claims */}
      <Card noPadding>
        <CardHeader title="Recent Claims" subtitle="Claims filed and processed" badge={<StatusBadge variant="emerald">All Resolved</StatusBadge>} />
        <DataTable columns={claimCols} data={recentClaims} hoverable />
      </Card>

      {/* Renewal Info */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#1578F7" />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>Annual Renewal: January 15, 2027</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Open enrollment window: Dec 1 - Dec 31, 2026</div>
            </div>
          </div>
          <button style={{ padding: '8px 20px', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            View Plan Documents
          </button>
        </div>
      </Card>
    </div>
  )
}
