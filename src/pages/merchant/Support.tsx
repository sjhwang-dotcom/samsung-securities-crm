import { Phone, Mail, MessageSquare, FileText, ChevronRight } from 'lucide-react'
import { Card, CardHeader, StatusBadge } from '../../components/ui'

export default function Support() {
  return (
    <div className="dashboard-grid">
      {/* Contact Options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { icon: Phone, label: 'Call Us', sub: '1-800-HARLOW (427-569)', detail: 'Mon-Fri 8am-8pm EST', color: '#1578F7' },
          { icon: Mail, label: 'Email Support', sub: 'support@harlowpayments.com', detail: 'Response within 4 hours', color: '#3B82F6' },
          { icon: MessageSquare, label: 'Ask Lumina', sub: 'AI-powered instant help', detail: 'Available 24/7', color: '#8B5CF6' },
        ].map(c => (
          <Card key={c.label}>
            <div style={{ padding: 18, textAlign: 'center', cursor: 'pointer' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${c.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <c.icon size={22} color={c.color} strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{c.label}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{c.sub}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>{c.detail}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Open Tickets */}
      <Card noPadding>
        <CardHeader title="Your Support Tickets" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { id: 'TKT-2026-0312', title: 'Question about settlement timing', status: 'Resolved', date: 'Mar 12', color: 'emerald' as const },
            { id: 'TKT-2026-0228', title: 'Request for additional terminal', status: 'Closed', date: 'Feb 28', color: 'gray' as const },
            { id: 'TKT-2026-0215', title: 'Rate review request', status: 'Closed', date: 'Feb 15', color: 'gray' as const },
          ].map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 10, border: '1px solid #F1F5F9', cursor: 'pointer' }}>
              <FileText size={16} color="#94A3B8" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{t.title}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{t.id} &middot; {t.date}</div>
              </div>
              <StatusBadge variant={t.color}>{t.status}</StatusBadge>
              <ChevronRight size={14} color="#CBD5E1" />
            </div>
          ))}
        </div>
      </Card>

      {/* FAQ */}
      <Card noPadding>
        <CardHeader title="Frequently Asked Questions" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'When will I receive my deposit?',
            'How do I respond to a chargeback?',
            'How do I update my bank account?',
            'What is my effective processing rate?',
            'How do I order a replacement terminal?',
            'How does the funding program work?',
          ].map((q, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 8, border: '1px solid #F1F5F9', cursor: 'pointer', fontSize: 12, fontWeight: 500, color: '#334155' }}>
              {q}
              <ChevronRight size={14} color="#CBD5E1" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
