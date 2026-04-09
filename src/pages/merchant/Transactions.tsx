import { useState } from 'react'
import { ArrowLeftRight, Landmark, AlertTriangle, CreditCard, DollarSign, TrendingUp, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

type SubTab = 'transactions' | 'deposits' | 'chargebacks'

const subTabs: { id: SubTab; label: string; icon: typeof ArrowLeftRight }[] = [
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'deposits', label: 'Deposits', icon: Landmark },
  { id: 'chargebacks', label: 'Chargebacks', icon: AlertTriangle },
]

export default function Transactions() {
  const [activeTab, setActiveTab] = useState<SubTab>('transactions')

  return (
    <div className="dashboard-grid">
      {/* Sub-navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', overflowX: 'auto', flexShrink: 0 }}>
        {subTabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
            padding: '10px 16px', fontSize: 12,
            fontWeight: activeTab === t.id ? 700 : 500,
            color: activeTab === t.id ? '#1578F7' : '#64748B',
            background: 'none', border: 'none',
            borderBottom: activeTab === t.id ? '2px solid #1578F7' : '2px solid transparent',
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}>
            <t.icon size={14} strokeWidth={1.8} />
            {t.label}
            {t.id === 'chargebacks' && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 700, background: '#FEE2E2', color: '#EF4444', marginLeft: 2 }}>1</span>}
          </button>
        ))}
      </div>

      {activeTab === 'transactions' && <TransactionsTab />}
      {activeTab === 'deposits' && <DepositsTab />}
      {activeTab === 'chargebacks' && <ChargebacksTab />}
    </div>
  )
}

/* ═══ Transactions Tab ═══ */
function TransactionsTab() {
  const [filter, setFilter] = useState('All')
  const [page, setPage] = useState(0)

  type TxnRow = { id: string; date: string; type: string; card: string; amount: string; tip: string; total: string; status: string; auth: string }

  // Generate 50 transactions
  const allTxns: TxnRow[] = Array.from({ length: 50 }, (_, i) => {
    const types = ['Sale', 'Sale', 'Sale', 'Sale', 'Sale', 'Sale', 'Sale', 'Refund', 'Void']
    const type = types[i % types.length]
    const brands = ['Visa', 'MC', 'Amex', 'Discover']
    const brand = brands[i % brands.length]
    const day = 14 - Math.floor(i / 8)
    const hours = [14, 13, 12, 11, 10, 9, 15, 16]
    const mins = [34, 28, 15, 52, 41, 33, 18, 55]
    const amount = type === 'Sale' ? (15 + Math.random() * 60).toFixed(2) : `-${(15 + Math.random() * 40).toFixed(2)}`
    const tip = type === 'Sale' && Math.random() > 0.3 ? (3 + Math.random() * 10).toFixed(2) : '0.00'
    const total = type === 'Sale' ? (parseFloat(amount) + parseFloat(tip)).toFixed(2) : amount
    return {
      id: `TXN-${9841 - i}`,
      date: `Mar ${day}, ${hours[i % 8]}:${String(mins[i % 8]).padStart(2, '0')}${hours[i % 8] >= 12 ? 'pm' : 'am'}`,
      type, card: `${brand} ****${1000 + ((i * 1337) % 9000)}`,
      amount: type === 'Sale' ? `$${amount}` : `$${amount}`,
      tip: `$${tip}`, total: `$${total}`,
      status: type === 'Sale' ? 'Settled' : type === 'Refund' ? 'Processed' : 'Voided',
      auth: String(847291 - i),
    }
  })

  const filtered = filter === 'All' ? allTxns : allTxns.filter(t => t.type === filter)
  const PAGE_SIZE = 15
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const cols: Column<TxnRow>[] = [
    { key: 'id', header: 'Txn ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.id}</span> },
    { key: 'date', header: 'Date & Time' },
    { key: 'type', header: 'Type', render: (r) => <StatusBadge variant={r.type === 'Refund' ? 'amber' : r.type === 'Void' ? 'rose' : 'emerald'}>{r.type}</StatusBadge> },
    { key: 'card', header: 'Card', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.card}</span> },
    { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 600, color: r.amount.includes('-') ? '#EF4444' : '#0F172A' }}>{r.amount}</span> },
    { key: 'tip', header: 'Tip' },
    { key: 'total', header: 'Total', render: (r) => <span style={{ fontWeight: 700, color: r.total.includes('-') ? '#EF4444' : '#0F172A' }}>{r.total}</span> },
    { key: 'auth', header: 'Auth', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.auth}</span> },
  ]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Today', value: '$2,148.20', sub: '134 transactions', icon: CreditCard, color: '#1578F7' },
          { label: 'This Week', value: '$13,018.40', sub: '858 transactions', icon: TrendingUp, color: '#4F46E5' },
          { label: 'This Month', value: '$47,230.00', sub: '1,342 transactions', icon: DollarSign, color: '#10B981' },
          { label: 'Avg Ticket', value: '$35.19', sub: '+$1.20 vs last month', icon: ArrowLeftRight, color: '#0891B2' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <k.icon size={12} color={k.color} />
              <span className="kpi-label" style={{ margin: 0 }}>{k.label}</span>
            </div>
            <div className="kpi-value" style={{ fontSize: 20, color: k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
            <input placeholder="Search transactions..." style={{ width: '100%', background: '#FAFBFC', border: '1px solid #E5E7EB', borderRadius: 8, paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, fontSize: 12, outline: 'none', color: '#334155' }} />
          </div>
          {['All', 'Sale', 'Refund', 'Void'].map(f => (
            <button key={f} onClick={() => { setFilter(f); setPage(0) }} style={{
              padding: '6px 12px', fontSize: 11, fontWeight: 600, borderRadius: 6, cursor: 'pointer',
              background: filter === f ? '#1578F7' : 'white', color: filter === f ? 'white' : '#64748B',
              border: filter === f ? 'none' : '1px solid #E5E7EB',
            }}>{f}</button>
          ))}
          <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 'auto' }}>{filtered.length} results</span>
        </div>
        <DataTable columns={cols} data={pageData} hoverable compact />
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderTop: '1px solid #F1F5F9', fontSize: 12, color: '#64748B' }}>
            <span>Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #E5E7EB', background: 'white', cursor: page === 0 ? 'default' : 'pointer', opacity: page === 0 ? 0.4 : 1, fontSize: 12 }}>
                <ChevronLeft size={14} />
              </button>
              <span style={{ padding: '5px 8px', fontSize: 12, fontWeight: 600 }}>{page + 1} / {totalPages}</span>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid #E5E7EB', background: 'white', cursor: page >= totalPages - 1 ? 'default' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, fontSize: 12 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  )
}

/* ═══ Deposits Tab ═══ */
function DepositsTab() {
  type DepRow = { date: string; batchId: string; txns: number; gross: string; fees: string; net: string; status: string }

  // Generate 30 days of deposits
  const deposits: DepRow[] = Array.from({ length: 30 }, (_, i) => {
    const day = 14 - i
    const month = day > 0 ? 'Mar' : 'Feb'
    const d = day > 0 ? day : 28 + day
    const txns = Math.round(80 + Math.random() * 80)
    const gross = Math.round(1200 + Math.random() * 1500)
    const fees = Math.round(gross * 0.0269)
    return {
      date: `${month} ${d}, 2026`,
      batchId: `BTH-2026-${String(month === 'Mar' ? 300 + d : 200 + d).padStart(4, '0')}`,
      txns, gross: `$${gross.toLocaleString()}.${String(Math.round(Math.random() * 99)).padStart(2, '0')}`,
      fees: `-$${fees}.${String(Math.round(Math.random() * 99)).padStart(2, '0')}`,
      net: `$${(gross - fees).toLocaleString()}.${String(Math.round(Math.random() * 99)).padStart(2, '0')}`,
      status: 'Deposited',
    }
  })

  const cols: Column<DepRow>[] = [
    { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
    { key: 'batchId', header: 'Deposit ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.batchId}</span> },
    { key: 'txns', header: 'Txns' },
    { key: 'gross', header: 'Gross' },
    { key: 'fees', header: 'Fees', render: (r) => <span style={{ color: '#EF4444', fontWeight: 500 }}>{r.fees}</span> },
    { key: 'net', header: 'Net Deposit', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.net}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
  ]

  const thisMonth = deposits.slice(0, 14)
  const totalNet = thisMonth.reduce((s, d) => s + parseFloat(d.net.replace(/[$,]/g, '')), 0)

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'This Month', value: `$${Math.round(totalNet).toLocaleString()}`, sub: `${thisMonth.length} deposits`, color: '#1578F7' },
          { label: 'Last Month', value: '$44,105', sub: '28 deposits', color: '#4F46E5' },
          { label: 'Avg Daily', value: `$${Math.round(totalNet / thisMonth.length).toLocaleString()}`, sub: 'Same-day settlement', color: '#10B981' },
          { label: 'Total Fees MTD', value: `$${Math.round(totalNet * 0.0269).toLocaleString()}`, sub: 'Effective rate: 2.69%', color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20, color: k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Settlement Account</div>
            <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Chase Business Checking ****8834 &middot; Routing: ****0021</div>
          </div>
          <StatusBadge variant="emerald">Same-day settlement</StatusBadge>
        </div>
      </Card>

      <Card noPadding>
        <CardHeader title="Deposit History" subtitle={`${deposits.length} deposits — last 30 days`} />
        <DataTable columns={cols} data={deposits} hoverable compact />
      </Card>
    </>
  )
}

/* ═══ Chargebacks Tab ═══ */
function ChargebacksTab() {
  type CbRow = { id: string; date: string; card: string; amount: string; reason: string; deadline: string; status: string }

  const chargebacks: CbRow[] = [
    { id: 'CB-2026-0047', date: 'Mar 12, 2026', card: 'Visa ****4821', amount: '$487.50', reason: 'Merchandise Not Received', deadline: 'Mar 26, 2026', status: 'Open — Response Needed' },
    { id: 'CB-2026-0039', date: 'Feb 22, 2026', card: 'MC ****7190', amount: '$124.00', reason: 'Duplicate Transaction', deadline: 'Mar 8, 2026', status: 'Won — Resolved' },
    { id: 'CB-2026-0031', date: 'Feb 10, 2026', card: 'Visa ****9905', amount: '$67.30', reason: 'Credit Not Processed', deadline: 'Feb 24, 2026', status: 'Won — Resolved' },
    { id: 'CB-2026-0024', date: 'Jan 28, 2026', card: 'Amex ****3312', amount: '$215.00', reason: 'Not Recognized', deadline: 'Feb 11, 2026', status: 'Lost' },
    { id: 'CB-2025-0418', date: 'Dec 15, 2025', card: 'Visa ****2277', amount: '$89.50', reason: 'Merchandise Not Received', deadline: 'Dec 29, 2025', status: 'Won — Resolved' },
  ]

  const open = chargebacks.filter(c => c.status.includes('Open')).length
  const won = chargebacks.filter(c => c.status.includes('Won')).length
  const lost = chargebacks.filter(c => c.status.includes('Lost')).length
  const totalAmount = chargebacks.reduce((s, c) => s + parseFloat(c.amount.replace('$', '').replace(',', '')), 0)

  const cols: Column<CbRow>[] = [
    { key: 'id', header: 'Case ID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{r.id}</span> },
    { key: 'date', header: 'Filed Date' },
    { key: 'card', header: 'Card', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.card}</span> },
    { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 700, color: '#EF4444' }}>{r.amount}</span> },
    { key: 'reason', header: 'Reason' },
    { key: 'deadline', header: 'Deadline', render: (r) => {
      const isUrgent = r.status.includes('Open')
      return <span style={{ fontWeight: isUrgent ? 700 : 400, color: isUrgent ? '#EF4444' : '#64748B' }}>{r.deadline}</span>
    }},
    { key: 'status', header: 'Status', render: (r) => {
      const v = r.status.includes('Open') ? 'rose' as const : r.status.includes('Won') ? 'emerald' as const : 'gray' as const
      return <StatusBadge variant={v}>{r.status}</StatusBadge>
    }},
  ]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Open Cases', value: String(open), sub: 'Response needed', color: '#EF4444' },
          { label: 'Won', value: String(won), sub: `${Math.round(won / chargebacks.length * 100)}% win rate`, color: '#10B981' },
          { label: 'Lost', value: String(lost), sub: 'Funds debited', color: '#94A3B8' },
          { label: 'Total Amount', value: `$${totalAmount.toLocaleString()}`, sub: `${chargebacks.length} total cases`, color: '#F59E0B' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20, color: k.color }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Urgent alert */}
      {open > 0 && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={16} color="#EF4444" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#991B1B' }}>Action Required</div>
            <div style={{ fontSize: 12, color: '#B91C1C' }}>You have {open} open chargeback(s) requiring a response. Deadline approaching.</div>
          </div>
          <button style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, background: '#EF4444', color: 'white', border: 'none', borderRadius: 7, cursor: 'pointer' }}>Respond Now</button>
        </div>
      )}

      <Card noPadding>
        <CardHeader title="Chargeback History" subtitle="All dispute cases" />
        <DataTable columns={cols} data={chargebacks} hoverable />
      </Card>
    </>
  )
}
