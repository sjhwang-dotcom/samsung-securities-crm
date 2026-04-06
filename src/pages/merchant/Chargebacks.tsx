import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

type CbRow = { id: string; date: string; card: string; amount: string; reason: string; deadline: string; status: string }

const chargebacks: CbRow[] = [
  { id: 'CB-2026-0047', date: 'Mar 12, 2026', card: 'Visa ****4821', amount: '$487.50', reason: 'Merchandise Not Received', deadline: 'Mar 26, 2026', status: 'Open — Response Needed' },
  { id: 'CB-2026-0039', date: 'Feb 22, 2026', card: 'MC ****7190', amount: '$124.00', reason: 'Duplicate Transaction', deadline: 'Mar 8, 2026', status: 'Won — Resolved' },
  { id: 'CB-2026-0031', date: 'Feb 10, 2026', card: 'Visa ****9905', amount: '$67.30', reason: 'Credit Not Processed', deadline: 'Feb 24, 2026', status: 'Won — Resolved' },
  { id: 'CB-2026-0024', date: 'Jan 28, 2026', card: 'Amex ****3312', amount: '$215.00', reason: 'Not Recognized', deadline: 'Feb 11, 2026', status: 'Lost' },
  { id: 'CB-2025-0418', date: 'Dec 15, 2025', card: 'Visa ****2277', amount: '$89.50', reason: 'Merchandise Not Received', deadline: 'Dec 29, 2025', status: 'Won — Resolved' },
]

const cols: Column<CbRow>[] = [
  { key: 'id', header: 'Case ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{r.id}</span> },
  { key: 'date', header: 'Filed Date' },
  { key: 'card', header: 'Card', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.card}</span> },
  { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 700, color: '#EF4444' }}>{r.amount}</span> },
  { key: 'reason', header: 'Reason' },
  { key: 'deadline', header: 'Deadline' },
  { key: 'status', header: 'Status', render: (r) => {
    const v = r.status.includes('Open') ? 'rose' as const : r.status.includes('Won') ? 'emerald' as const : 'gray' as const
    return <StatusBadge variant={v}>{r.status}</StatusBadge>
  }},
]

export default function Chargebacks() {
  return (
    <div className="dashboard-grid">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Open Cases', value: '1', sub: '$487.50 at risk' },
          { label: 'Win Rate', value: '66.7%', sub: '2 won / 3 resolved' },
          { label: 'Total This Year', value: '$983.30', sub: '5 cases filed' },
          { label: 'Chargeback Ratio', value: '0.18%', sub: 'Well below Visa 1.0% threshold' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Open Case Alert */}
      <Card>
        <div style={{ padding: 16, background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>Action Required: CB-2026-0047</div>
              <div style={{ fontSize: 12, color: '#B91C1C', marginTop: 2, fontWeight: 500 }}>
                Visa ****4821 &middot; $487.50 &middot; "Merchandise Not Received" &middot; Due by Mar 26, 2026
              </div>
              <div style={{ fontSize: 11, color: '#DC2626', marginTop: 6, fontWeight: 500 }}>
                Lumina AI has drafted a response with delivery proof from your POS. Review and submit.
              </div>
            </div>
            <button style={{ background: '#DC2626', color: 'white', fontWeight: 700, padding: '8px 16px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}>
              Review & Respond
            </button>
          </div>
        </div>
      </Card>

      <Card noPadding>
        <CardHeader title="Chargeback History" />
        <DataTable columns={cols} data={chargebacks as unknown as Record<string, unknown>[]} hoverable />
      </Card>
    </div>
  )
}
