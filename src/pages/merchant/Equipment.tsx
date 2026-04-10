import { Monitor, Wifi, CheckCircle, Smartphone, ShoppingCart, Download, Settings } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '../../components/ui'
import portalData from '../../data/db/merchant_portal.json'

const eq = (portalData as any).equipment
const catalog = ((portalData as any).terminalCatalog || []) as any[]

export default function Equipment() {
  const model = eq?.makeModel || 'PAX A920'
  const isPosCapable = !['Virtual Terminal'].includes(model) && !model.includes('Ingenico') && !model.includes('Fiserv')
  const posInstalled = true // This merchant has POS installed

  return (
    <div className="dashboard-grid">
      {/* Terminal Card */}
      <Card noPadding>
        <CardHeader title="Your Terminal" badge={<StatusBadge variant="emerald" dot pulse>{eq?.isOnline ? 'Online' : 'Offline'}</StatusBadge>} />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'flex', gap: 20, padding: 16, borderRadius: 12, border: '1px solid #E5E7EB', background: '#FAFBFC' }}>
            <div style={{ width: 80, height: 100, borderRadius: 10, background: 'linear-gradient(135deg, #E8F0FE, #DBEAFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Monitor size={36} color="#1578F7" strokeWidth={1.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{model}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{eq?.deviceType || 'Mobile'} Terminal</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginTop: 12, fontSize: 12 }}>
                {[
                  { label: 'Serial', value: eq?.serialNumber || '—' },
                  { label: 'Firmware', value: eq?.firmwareVersion || '—' },
                  { label: 'Connection', value: eq?.connectionType || 'WiFi + 4G' },
                  { label: 'Last Transaction', value: eq?.lastTxnDate ? new Date(eq.lastTxnDate).toLocaleDateString() : 'Today' },
                  { label: 'P2PE', value: eq?.p2peCertified ? 'Certified' : 'Not Certified' },
                  { label: 'Deployed', value: eq?.deployedDate ? new Date(eq.deployedDate).toLocaleDateString() : '—' },
                ].map(d => (
                  <div key={d.label}>
                    <span style={{ color: '#94A3B8', fontWeight: 500, marginRight: 6 }}>{d.label}:</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* POS App Status */}
      <Card noPadding>
        <CardHeader title="Harlow POS App" badge={
          posInstalled
            ? <StatusBadge variant="emerald" dot>Installed</StatusBadge>
            : isPosCapable
              ? <StatusBadge variant="amber">Available</StatusBadge>
              : <StatusBadge variant="gray">Not Compatible</StatusBadge>
        } />
        <div style={{ padding: '0 18px 18px' }}>
          {posInstalled ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                  { icon: ShoppingCart, label: 'Item Tracking', value: 'Active', desc: '25 items in catalog', color: '#10B981' },
                  { icon: Smartphone, label: 'POS Version', value: 'v3.2.1', desc: 'Latest version', color: '#1578F7' },
                  { icon: Settings, label: 'Last Sync', value: 'Today', desc: 'Real-time sync enabled', color: '#4F46E5' },
                ].map(s => (
                  <div key={s.label} style={{ padding: 12, borderRadius: 10, border: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <s.icon size={20} color={s.color} style={{ margin: '0 auto 6px' }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{s.value}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>{s.label}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{s.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#F0FDFA', borderRadius: 10, padding: 14, border: '1px solid #D1FAE5' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#065F46', marginBottom: 4 }}>POS Features Active</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Menu Management', 'Item-Level Sales', 'Inventory Tracking', 'Receipt Customization', 'Tip Screen', 'Split Payments', 'Discount Codes', 'Sales Analytics'].map(f => (
                    <span key={f} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#D1FAE5', color: '#065F46', fontWeight: 600 }}>
                      <CheckCircle size={9} style={{ verticalAlign: 'middle', marginRight: 3 }} />{f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : isPosCapable ? (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Smartphone size={32} color="#1578F7" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>POS App Available for {model}</div>
              <div style={{ fontSize: 12, color: '#64748B', maxWidth: 400, margin: '0 auto 16px', lineHeight: 1.6 }}>
                Install the Harlow POS app to track item-level sales, manage your menu, and get detailed analytics on what your customers are buying.
              </div>
              <button style={{ padding: '10px 24px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} /> Install POS App
              </button>
            </div>
          ) : (
            <div style={{ padding: 16, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
              POS app is not compatible with {model}. Consider upgrading to a P Line or Clover terminal.
            </div>
          )}
        </div>
      </Card>

      {/* Health Checks */}
      <Card noPadding>
        <CardHeader title="Terminal Health" subtitle="All systems operational" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { icon: Wifi, label: 'Network', status: `Connected — ${eq?.connectionType || 'WiFi'}`, ok: true },
            { icon: Monitor, label: 'Firmware', status: `${eq?.firmwareVersion || 'v4.2.1'} — up to date`, ok: true },
            { icon: CheckCircle, label: 'P2PE', status: eq?.p2peCertified ? 'Active — transactions encrypted' : 'Not certified', ok: !!eq?.p2peCertified },
            { icon: CheckCircle, label: 'Battery', status: '87% — healthy', ok: true },
            { icon: CheckCircle, label: 'Printer', status: 'Operational — paper 60%', ok: true },
            ...(posInstalled ? [{ icon: ShoppingCart, label: 'POS App', status: 'v3.2.1 — synced', ok: true }] : []),
          ].map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: '1px solid #F1F5F9' }}>
              <h.icon size={16} color={h.ok ? '#10B981' : '#F59E0B'} strokeWidth={2} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', flex: 1 }}>{h.label}</span>
              <span style={{ fontSize: 11, color: h.ok ? '#64748B' : '#D97706', fontWeight: 500 }}>{h.status}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Terminals */}
      <Card noPadding>
        <CardHeader title="Available Terminals" subtitle="Upgrade or add a terminal" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {catalog.filter((t: any) => t.model !== 'Virtual Terminal').slice(0, 8).map((t: any) => (
              <div key={t.model} className="harlow-card" style={{ padding: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Monitor size={14} color="#1578F7" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{t.model}</span>
                </div>
                <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>{t.description}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 600, background: '#F1F5F9', color: '#64748B' }}>{t.type}</span>
                  {t.p2pe && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 600, background: '#D1FAE5', color: '#065F46' }}>P2PE</span>}
                  {t.nfc && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, fontWeight: 600, background: '#DBEAFE', color: '#1E40AF' }}>NFC</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
