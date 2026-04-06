import { Users, AlertTriangle, ShieldCheck, TrendingDown } from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

export default function ComplianceCenter() {
  /* ── PCI Table ── */
  type PciRow = { name: string; iso: string; last: string; days: number; reminder: string }
  const pciData: PciRow[] = [
    { name: 'Sunrise Deli', iso: 'Harlow Direct', last: 'Dec 2025', days: 127, reminder: '3 reminders sent, no response' },
    { name: 'Lucky Nail Salon', iso: 'Harlow Direct', last: 'Jan 2026', days: 96, reminder: 'Renewal in progress' },
    { name: 'Metro Tobacco', iso: 'Harlow Direct', last: 'Nov 2025', days: 157, reminder: 'Escalated to agent' },
  ]
  const pciColumns: Column<PciRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'iso', header: 'ISO' },
    { key: 'last', header: 'Last Compliant' },
    { key: 'days', header: 'Days Overdue', render: (r) => <StatusBadge variant="rose">{r.days} days</StatusBadge> },
    { key: 'reminder', header: 'Auto-Reminder', render: (r) => <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{r.reminder}</span> },
  ]

  /* ── KYB/KYC Table ── */
  type KybRow = { name: string; last: string; due: string; status: string }
  const kybData: KybRow[] = [
    { name: "Mario's Pizzeria", last: 'Jan 2026', due: 'Jul 2026', status: 'Current' },
    { name: 'Jade Garden', last: 'Dec 2025', due: 'Jun 2026', status: 'Current' },
    { name: 'Brooklyn Dry Cleaners', last: 'Nov 2025', due: 'May 2026', status: 'Due Soon' },
  ]
  const kybColumns: Column<KybRow>[] = [
    { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
    { key: 'last', header: 'Last Screening' },
    { key: 'due', header: 'Next Due' },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Current' ? 'emerald' : 'amber'}>{r.status}</StatusBadge> },
  ]

  return (
    <div className="dashboard-grid">
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <select style={{ fontSize: 13, background: 'white', border: '1px solid #E5E7EB', borderRadius: 8, padding: '8px 12px', outline: 'none', fontWeight: 500 }}>
          <option>All ISOs</option><option>Harlow Direct</option><option>Zenith</option><option>Liberty</option>
        </select>
        <button style={{
          fontSize: 13, background: 'linear-gradient(to right, #609FFF, #1578F7)',
          color: 'white', borderRadius: 8, padding: '8px 16px', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>Export Report</button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard icon={AlertTriangle} label="PCI Compliant" value="91.9%" color="amber" trend="Below 95% target" trendDirection="down" trendPositive={false} />
        <KpiCard icon={ShieldCheck} label="TCPA Verified" value="100%" color="emerald" trend="847/847" trendDirection="up" trendPositive sub="" />
        <KpiCard icon={Users} label="KYB/KYC Current" value="99.5%" color="emerald" trend="4,588/4,612" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingDown} label="CB Threshold" value="0" color="emerald" trend="No merchants above 1.0%" trendDirection="down" trendPositive />
      </div>

      {/* PCI Compliance */}
      <Card noPadding>
        <CardHeader
          title="PCI Compliance Status"
          subtitle="142 auto-reminders sent this month, 67 renewals completed"
        />
        <div style={{ padding: '0 18px 12px' }}>
          <div className="grid-3" style={{ marginBottom: 16 }}>
            {[
              { label: 'Compliant', count: '4,241', color: '#10B981' },
              { label: 'Expiring (30 days)', count: '184', color: '#F59E0B' },
              { label: 'Non-Compliant', count: '187', color: '#F43F5E' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, background: '#FAFBFC' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.color }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>{s.count}</div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DataTable columns={pciColumns} data={pciData} hoverable />
      </Card>

      {/* TCPA */}
      <Card noPadding>
        <CardHeader title="TCPA / DNC Compliance" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Outbound Calls Today', value: '847' },
              { label: 'DNC Checks', value: '847 (100%)' },
              { label: 'Calls Blocked', value: '23' },
              { label: 'Timezone Violations', value: '0' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: 16, background: '#FAFBFC', borderRadius: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#059669', marginTop: 12, background: '#ECFDF5', borderRadius: 12, padding: 12, fontWeight: 500 }}>
            All outbound calls verified before dial. Full audit trail maintained.
          </div>
        </div>
      </Card>

      {/* KYB/KYC */}
      <Card noPadding>
        <CardHeader title="KYB/KYC Monitoring" />
        <div style={{ padding: '0 18px 0' }}>
          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: 12, fontSize: 13, color: '#92400E', fontWeight: 500, marginBottom: 12 }}>
            AI flag: 2 merchants with ownership structure changes detected -- awaiting human review
          </div>
        </div>
        <DataTable columns={kybColumns} data={kybData} hoverable />
      </Card>

      {/* Chargeback Threshold */}
      <Card>
        <div style={{ padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Chargeback Threshold Monitor</div>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: 12, fontSize: 13, color: '#1E40AF', fontWeight: 500 }}>
            AI prediction: 3 merchants projected to exceed Visa 1.0% threshold within 60 days if current trend continues
          </div>
        </div>
      </Card>
    </div>
  )
}
