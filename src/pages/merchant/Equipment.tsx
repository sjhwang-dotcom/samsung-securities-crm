import { Monitor, Wifi, CheckCircle } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '../../components/ui'

export default function Equipment() {
  return (
    <div className="dashboard-grid">
      {/* Terminal Card */}
      <Card noPadding>
        <CardHeader title="Your Terminal" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'flex', gap: 20, padding: 16, borderRadius: 12, border: '1px solid #E5E7EB', background: '#FAFBFC' }}>
            <div style={{ width: 80, height: 100, borderRadius: 10, background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Monitor size={36} color="#64748B" strokeWidth={1.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>PAX A920</span>
                <StatusBadge variant="emerald" dot pulse>Online</StatusBadge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', marginTop: 12, fontSize: 12 }}>
                {[
                  { label: 'Serial Number', value: 'A920-7821-0034' },
                  { label: 'Firmware', value: 'v4.2.1 (latest)' },
                  { label: 'Connection', value: 'WiFi + 4G LTE backup' },
                  { label: 'Last Transaction', value: 'Today, 2:34pm' },
                  { label: 'P2PE Certified', value: 'Yes — PCI PTS 5.x' },
                  { label: 'Deployed', value: 'Oct 15, 2024' },
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

      {/* Health Checks */}
      <Card noPadding>
        <CardHeader title="Terminal Health" subtitle="All systems operational" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { icon: Wifi, label: 'Network Connection', status: 'Connected — WiFi (fallback: 4G)', ok: true },
            { icon: Monitor, label: 'Firmware', status: 'v4.2.1 — up to date', ok: true },
            { icon: CheckCircle, label: 'P2PE Encryption', status: 'Active — all transactions encrypted', ok: true },
            { icon: CheckCircle, label: 'Battery', status: '87% — healthy', ok: true },
            { icon: CheckCircle, label: 'Printer', status: 'Operational — paper roll 60% remaining', ok: true },
          ].map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, border: '1px solid #F1F5F9' }}>
              <h.icon size={16} color={h.ok ? '#10B981' : '#F59E0B'} strokeWidth={2} />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{h.label}</span>
              </div>
              <span style={{ fontSize: 11, color: h.ok ? '#64748B' : '#D97706', fontWeight: 500 }}>{h.status}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Support */}
      <Card>
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>Need a replacement or upgrade?</div>
          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.6 }}>
            Contact support at 1-800-HARLOW or ask Lumina to request equipment service. Replacement terminals shipped within 24 hours. Upgrades available to PAX A920 Pro and Clover Flex.
          </div>
        </div>
      </Card>
    </div>
  )
}
