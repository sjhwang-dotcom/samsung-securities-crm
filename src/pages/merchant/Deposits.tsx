import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

type DepRow = { date: string; batchId: string; txns: number; gross: string; fees: string; net: string; bank: string; status: string }

const deposits: DepRow[] = [
  { date: 'Mar 14, 2026', batchId: 'BTH-2026-0314', txns: 134, gross: '$2,148.20', fees: '-$134.30', net: '$2,013.90', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 13, 2026', batchId: 'BTH-2026-0313', txns: 121, gross: '$1,921.50', fees: '-$126.00', net: '$1,795.50', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 12, 2026', batchId: 'BTH-2026-0312', txns: 98, gross: '$1,602.40', fees: '-$105.60', net: '$1,496.80', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 11, 2026', batchId: 'BTH-2026-0311', txns: 142, gross: '$2,312.10', fees: '-$156.30', net: '$2,155.80', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 10, 2026', batchId: 'BTH-2026-0310', txns: 118, gross: '$1,967.80', fees: '-$135.40', net: '$1,832.40', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 9, 2026', batchId: 'BTH-2026-0309', txns: 89, gross: '$1,456.20', fees: '-$98.70', net: '$1,357.50', bank: 'Chase ****8834', status: 'Deposited' },
  { date: 'Mar 8, 2026', batchId: 'BTH-2026-0308', txns: 156, gross: '$2,534.60', fees: '-$168.10', net: '$2,366.50', bank: 'Chase ****8834', status: 'Deposited' },
]

const cols: Column<DepRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'batchId', header: 'Deposit ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.batchId}</span> },
  { key: 'txns', header: 'Transactions' },
  { key: 'gross', header: 'Gross' },
  { key: 'fees', header: 'Fees', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.fees}</span> },
  { key: 'net', header: 'Net Deposit', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.net}</span> },
  { key: 'bank', header: 'Bank Account', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.bank}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

export default function Deposits() {
  return (
    <div className="dashboard-grid">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'This Month', value: '$13,018.40', sub: '7 deposits' },
          { label: 'Last Month', value: '$47,230.00', sub: '28 deposits' },
          { label: 'Avg Daily Deposit', value: '$1,859.77', sub: 'Same-day settlement' },
          { label: 'Total Fees MTD', value: '$924.40', sub: 'Effective rate: 2.69%' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Bank Account Info */}
      <Card>
        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Settlement Account</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2, fontWeight: 500 }}>Chase Business Checking ****8834 &middot; Routing: ****0021</div>
          </div>
          <StatusBadge variant="emerald">Same-day settlement</StatusBadge>
        </div>
      </Card>

      <Card noPadding>
        <CardHeader title="Deposit History" subtitle="All deposits to Chase ****8834" />
        <DataTable columns={cols} data={deposits as unknown as Record<string, unknown>[]} hoverable />
      </Card>
    </div>
  )
}
