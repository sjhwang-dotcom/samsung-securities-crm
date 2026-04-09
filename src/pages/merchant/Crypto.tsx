import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { Bitcoin, Wallet, ArrowRightLeft, Zap, ShieldCheck, Globe, TrendingUp, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '\u20BF', color: '#F7931A', volume: '$4,230', txCount: 12 },
  { symbol: 'ETH', name: 'Ethereum', icon: '\u039E', color: '#627EEA', volume: '$2,815', txCount: 8 },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', color: '#2775CA', volume: '$6,410', txCount: 24 },
  { symbol: 'SOL', name: 'Solana', icon: 'S', color: '#9945FF', volume: '$1,120', txCount: 5 },
  { symbol: 'USDT', name: 'Tether', icon: '\u20AE', color: '#50AF95', volume: '$3,680', txCount: 15 },
]

const volumeData = [
  { month: 'Nov', volume: 8400 },
  { month: 'Dec', volume: 12600 },
  { month: 'Jan', volume: 10200 },
  { month: 'Feb', volume: 14800 },
  { month: 'Mar', volume: 16900 },
  { month: 'Apr', volume: 18255 },
]

type TxRow = { date: string; customer: string; currency: string; cryptoAmount: string; usdAmount: string; fee: string; status: string }

const recentTransactions: TxRow[] = [
  { date: 'Apr 8, 2026', customer: 'Walk-in #1042', currency: 'USDC', cryptoAmount: '85.50 USDC', usdAmount: '$85.50', fee: '$0.86', status: 'Settled' },
  { date: 'Apr 8, 2026', customer: 'Online #3891', currency: 'BTC', cryptoAmount: '0.00412 BTC', usdAmount: '$342.00', fee: '$3.42', status: 'Settled' },
  { date: 'Apr 7, 2026', customer: 'Walk-in #1039', currency: 'ETH', cryptoAmount: '0.1240 ETH', usdAmount: '$415.60', fee: '$4.16', status: 'Settled' },
  { date: 'Apr 7, 2026', customer: 'Online #3887', currency: 'USDC', cryptoAmount: '127.00 USDC', usdAmount: '$127.00', fee: '$1.27', status: 'Settled' },
  { date: 'Apr 6, 2026', customer: 'Walk-in #1035', currency: 'SOL', cryptoAmount: '3.42 SOL', usdAmount: '$224.00', fee: '$2.24', status: 'Settled' },
  { date: 'Apr 5, 2026', customer: 'Online #3880', currency: 'BTC', cryptoAmount: '0.00183 BTC', usdAmount: '$152.00', fee: '$1.52', status: 'Settled' },
]

const txCols: Column<TxRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'customer', header: 'Customer', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.customer}</span> },
  { key: 'currency', header: 'Currency', render: (r) => {
    const colorMap: Record<string, 'amber' | 'blue' | 'teal' | 'purple' | 'emerald' | 'gray'> = { BTC: 'amber', ETH: 'blue', USDC: 'teal', SOL: 'purple', USDT: 'emerald' }
    return <StatusBadge variant={colorMap[r.currency] || 'gray'}>{r.currency}</StatusBadge>
  }},
  { key: 'cryptoAmount', header: 'Crypto Amount', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{r.cryptoAmount}</span> },
  { key: 'usdAmount', header: 'USD Amount', align: 'right', render: (r) => <span style={{ fontWeight: 600, color: '#059669' }}>{r.usdAmount}</span> },
  { key: 'fee', header: 'Fee', align: 'right', render: (r) => <span style={{ fontSize: 12, color: '#94A3B8' }}>{r.fee}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

const steps = [
  { icon: Wallet, title: 'Customer Pays with Crypto', desc: 'Your customer selects crypto at checkout and sends payment from their wallet.' },
  { icon: ArrowRightLeft, title: 'Instant Conversion', desc: 'The crypto is automatically converted to US dollars at the current market rate.' },
  { icon: Zap, title: 'You Get Paid in USD', desc: 'Funds are deposited to your Harlow checking account with your regular settlement.' },
]

export default function Crypto() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: TrendingUp, label: 'Volume (MTD)', value: '$18,255', sub: '+8.0% vs last month' },
          { icon: Activity, label: 'Transactions', value: '64', sub: 'This month' },
          { icon: Bitcoin, label: 'Avg Transaction', value: '$285.23', sub: 'Across all currencies' },
          { icon: Zap, label: 'Settlement', value: 'Same Day', sub: 'With card deposits' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Integration Status */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bitcoin size={24} color="#F7931A" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Crypto Payments</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Accepting BTC, ETH, USDC, SOL, USDT -- settled in USD</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusBadge variant="emerald" dot pulse>Active</StatusBadge>
            <div style={{ padding: '6px 14px', background: '#F8FAFC', borderRadius: 6, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Processing Fee</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>1.0%</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Transaction Volume Chart + Supported Currencies */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        <Card>
          <CardHeader title="Monthly Transaction Volume" subtitle="Total USD value of crypto payments" />
          <div style={{ padding: '0 20px 20px', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                <Bar dataKey="volume" fill="#F7931A" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Supported Currencies" subtitle="Volume this month" />
          <div style={{ padding: '0 20px 20px' }}>
            {currencies.map((c, i) => (
              <div key={c.symbol} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: c.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{c.name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{c.volume}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{c.symbol}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{c.txCount} transactions</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Settlement Info */}
      <Card>
        <CardHeader title="Settlement Details" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Settlement Speed', value: 'Same Day', note: 'With your card deposits' },
            { label: 'Settlement Account', value: '****8834', note: 'Harlow Business Checking' },
            { label: 'Conversion Rate', value: 'Market', note: 'Real-time spot rate' },
            { label: 'Fees Collected (MTD)', value: '$182.55', note: '1.0% flat rate' },
          ].map(f => (
            <div key={f.label} style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{f.value}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{f.note}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Crypto Transactions */}
      <Card noPadding>
        <CardHeader title="Recent Crypto Transactions" subtitle="All crypto payments received" />
        <DataTable columns={txCols} data={recentTransactions} hoverable />
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader title="How It Works" subtitle="Accept crypto without the complexity" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={s.title} style={{ textAlign: 'center', position: 'relative' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <s.icon size={24} color="#1578F7" />
              </div>
              <div style={{ position: 'absolute', top: 0, right: -8, width: 22, height: 22, borderRadius: '50%', background: '#1578F7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader title="Why Accept Crypto?" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: Globe, title: 'Reach More Customers', desc: 'Tap into a growing base of crypto-savvy customers looking to spend.' },
            { icon: ShieldCheck, title: 'No Chargebacks', desc: 'Crypto payments are final. No disputes, no reversed transactions.' },
            { icon: Zap, title: 'Lower Fees', desc: '1% flat rate compared to typical 2.5-3.5% for card transactions.' },
          ].map(b => (
            <div key={b.title} style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <b.icon size={20} color="#1578F7" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{b.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
