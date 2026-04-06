import { Card, CardHeader, StatusBadge } from '../../components/ui'
import { Bitcoin, Wallet, ArrowRightLeft, Zap, ShieldCheck, Globe } from 'lucide-react'

const currencies = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$', color: '#2775CA' },
]

const steps = [
  { icon: Wallet, title: 'Customer Pays with Crypto', desc: 'Your customer selects crypto at checkout and sends payment from their wallet.' },
  { icon: ArrowRightLeft, title: 'Instant Conversion', desc: 'The crypto is automatically converted to US dollars at the current market rate.' },
  { icon: Zap, title: 'You Get Paid in USD', desc: 'Funds are deposited to your Harlow checking account with your regular settlement.' },
]

const fees = [
  { label: 'Processing Fee', value: '1.0%', note: 'Per transaction' },
  { label: 'Conversion Fee', value: '0%', note: 'Included in processing' },
  { label: 'Monthly Fee', value: '$0', note: 'No subscription required' },
  { label: 'Settlement', value: 'Same day', note: 'With your card deposits' },
]

export default function Crypto() {
  return (
    <div className="dashboard-grid">
      {/* Status Banner */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bitcoin size={24} color="#F7931A" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Crypto Payments</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Accept cryptocurrency and get paid in US dollars</div>
            </div>
          </div>
          <StatusBadge variant="gray" size="md">Not Activated</StatusBadge>
        </div>
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
              <div style={{ position: 'absolute', top: 0, right: -8, width: 22, height: 22, borderRadius: '50%', background: '#1578F7', color: 'white', display: i < 2 ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Supported Currencies */}
      <Card>
        <CardHeader title="Supported Currencies" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {currencies.map(c => (
            <div key={c.symbol} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#F8FAFC', borderRadius: 10 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: c.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{c.name}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{c.symbol}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Fee Structure */}
      <Card>
        <CardHeader title="Simple, Transparent Pricing" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {fees.map(f => (
            <div key={f.label} style={{ padding: 16, background: '#F8FAFC', borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{f.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{f.value}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{f.note}</div>
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

      {/* Activation CTA */}
      <Card>
        <div style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>Ready to start accepting crypto?</div>
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 20, maxWidth: 400, marginLeft: 'auto', marginRight: 'auto' }}>
            Activation takes less than 5 minutes. No additional hardware needed.
          </div>
          <button style={{ padding: '12px 32px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Activate Crypto Payments
          </button>
        </div>
      </Card>
    </div>
  )
}
