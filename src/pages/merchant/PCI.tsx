import { ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '../../components/ui'

export default function PCI() {
  return (
    <div className="dashboard-grid">
      {/* Status */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={28} color="#059669" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: '#0F172A' }}>PCI DSS Compliant</span>
              <StatusBadge variant="emerald" size="md">Level 1</StatusBadge>
            </div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 500 }}>
              Your business is fully compliant with PCI DSS requirements. Valid through December 31, 2026.
            </div>
          </div>
        </div>
      </Card>

      {/* Compliance Checklist */}
      <Card noPadding>
        <CardHeader title="Compliance Checklist" subtitle="All requirements met" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { title: 'SAQ-A Self-Assessment Questionnaire', sub: 'Completed Oct 15, 2025 — annual renewal Oct 2026', done: true },
            { title: 'Quarterly Network Scan (ASV)', sub: 'Last scan: Jan 12, 2026 — PASS — next scan Apr 2026', done: true },
            { title: 'P2PE (Point-to-Point Encryption)', sub: 'PAX A920 — P2PE validated, PCI PTS 5.x certified', done: true },
            { title: 'Tokenization', sub: 'All stored card data tokenized via Harlow Payment Gateway', done: true },
            { title: 'Employee Security Training', sub: 'Mario Rossi + 3 staff completed Dec 2025', done: true },
            { title: 'Data Breach Response Plan', sub: 'Filed with Harlow Payments — auto-generated from your profile', done: true },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 10, border: '1px solid #F1F5F9' }}>
              <CheckCircle size={18} color="#10B981" strokeWidth={2} style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Info */}
      <Card>
        <div style={{ padding: 16, fontSize: 12, color: '#64748B', fontWeight: 500, lineHeight: 1.6 }}>
          <strong style={{ color: '#0F172A' }}>Why PCI compliance matters:</strong> PCI DSS compliance protects your customers' card data and reduces your liability in case of a data breach. Non-compliant merchants face monthly fees of $19.95 and increased chargeback liability. Harlow handles most requirements automatically through our P2PE terminals and tokenized payment gateway.
        </div>
      </Card>
    </div>
  )
}
