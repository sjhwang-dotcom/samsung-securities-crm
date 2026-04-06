import { useState } from 'react'
import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

type TxnRow = { id: string; date: string; type: string; card: string; amount: string; tip: string; total: string; status: string; auth: string }

const txns: TxnRow[] = [
  { id: 'TXN-9841', date: 'Mar 14, 2:34pm', type: 'Sale', card: 'Visa ****4821', amount: '$29.50', tip: '$5.00', total: '$34.50', status: 'Settled', auth: '847291' },
  { id: 'TXN-9840', date: 'Mar 14, 2:28pm', type: 'Sale', card: 'MC ****7190', amount: '$22.80', tip: '$0.00', total: '$22.80', status: 'Settled', auth: '847288' },
  { id: 'TXN-9839', date: 'Mar 14, 2:15pm', type: 'Sale', card: 'Amex ****3312', amount: '$57.20', tip: '$10.00', total: '$67.20', status: 'Settled', auth: '847285' },
  { id: 'TXN-9838', date: 'Mar 14, 1:52pm', type: 'Refund', card: 'Visa ****9905', amount: '-$18.50', tip: '$0.00', total: '-$18.50', status: 'Processed', auth: '847280' },
  { id: 'TXN-9837', date: 'Mar 14, 1:41pm', type: 'Sale', card: 'Discover ****6641', amount: '$36.00', tip: '$5.00', total: '$41.00', status: 'Settled', auth: '847276' },
  { id: 'TXN-9836', date: 'Mar 14, 1:33pm', type: 'Sale', card: 'Visa ****2277', amount: '$12.75', tip: '$3.00', total: '$15.75', status: 'Settled', auth: '847271' },
  { id: 'TXN-9835', date: 'Mar 14, 1:18pm', type: 'Sale', card: 'MC ****8834', amount: '$42.30', tip: '$10.00', total: '$52.30', status: 'Settled', auth: '847268' },
  { id: 'TXN-9834', date: 'Mar 14, 12:55pm', type: 'Sale', card: 'Visa ****1102', amount: '$24.90', tip: '$4.00', total: '$28.90', status: 'Settled', auth: '847264' },
  { id: 'TXN-9833', date: 'Mar 14, 12:41pm', type: 'Sale', card: 'MC ****5544', amount: '$18.25', tip: '$3.00', total: '$21.25', status: 'Settled', auth: '847260' },
  { id: 'TXN-9832', date: 'Mar 14, 12:22pm', type: 'Sale', card: 'Visa ****8872', amount: '$31.50', tip: '$6.00', total: '$37.50', status: 'Settled', auth: '847255' },
  { id: 'TXN-9831', date: 'Mar 14, 12:08pm', type: 'Void', card: 'Amex ****1293', amount: '-$44.00', tip: '$0.00', total: '-$44.00', status: 'Voided', auth: '847250' },
  { id: 'TXN-9830', date: 'Mar 14, 11:54am', type: 'Sale', card: 'Visa ****4821', amount: '$26.75', tip: '$5.00', total: '$31.75', status: 'Settled', auth: '847246' },
]

const cols: Column<TxnRow>[] = [
  { key: 'id', header: 'Txn ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.id}</span> },
  { key: 'date', header: 'Date & Time' },
  { key: 'type', header: 'Type', render: (r) => (
    <StatusBadge variant={r.type === 'Refund' ? 'amber' : r.type === 'Void' ? 'rose' : 'emerald'}>{r.type}</StatusBadge>
  )},
  { key: 'card', header: 'Card', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.card}</span> },
  { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 600, color: r.amount.startsWith('-') ? '#EF4444' : '#0F172A' }}>{r.amount}</span> },
  { key: 'tip', header: 'Tip' },
  { key: 'total', header: 'Total', render: (r) => <span style={{ fontWeight: 700, color: r.total.startsWith('-') ? '#EF4444' : '#0F172A' }}>{r.total}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Settled' ? 'emerald' : r.status === 'Processed' ? 'blue' : 'gray'}>{r.status}</StatusBadge> },
  { key: 'auth', header: 'Auth Code', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.auth}</span> },
]

export default function Transactions() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? txns : txns.filter(t => t.type.toLowerCase() === filter)

  return (
    <div className="dashboard-grid">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: "Today's Volume", value: '$2,013.90', sub: '134 transactions' },
          { label: "Today's Tips", value: '$187.50', sub: 'Avg tip: $4.82' },
          { label: 'This Month', value: '$47,230', sub: '2,847 transactions' },
          { label: 'Avg Ticket', value: '$16.59', sub: 'vs $15.90 last month' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 6 }}>
        {['all', 'sale', 'refund', 'void'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px', borderRadius: 6, border: '1px solid #E5E7EB',
              background: filter === f ? '#121212' : 'white',
              color: filter === f ? 'white' : '#64748B',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            }}
          >{f === 'all' ? 'All Types' : f + 's'}</button>
        ))}
      </div>

      <Card noPadding>
        <CardHeader title="Transaction History" subtitle="March 14, 2026" />
        <DataTable columns={cols} data={filtered as unknown as Record<string, unknown>[]} hoverable />
      </Card>
    </div>
  )
}
