import { Card, CardHeader, StatusBadge } from '../../components/ui'
import { Shield, Building2, HardHat, Phone, DollarSign, CalendarDays, FileWarning, CheckCircle } from 'lucide-react'

const coverageTypes = [
  {
    icon: Shield,
    name: 'General Liability',
    description: 'Covers claims of bodily injury, property damage, and personal injury from your business operations.',
    estimated: '$47 - $85/mo',
    popular: true,
  },
  {
    icon: Building2,
    name: 'Property Coverage',
    description: 'Protects your physical business assets including equipment, inventory, and your location from damage or theft.',
    estimated: '$55 - $120/mo',
    popular: false,
  },
  {
    icon: HardHat,
    name: "Workers' Compensation",
    description: 'Required in most states. Covers medical costs and lost wages if an employee is injured on the job.',
    estimated: '$62 - $150/mo',
    popular: false,
  },
]

const claimsSteps = [
  { step: 1, title: 'Report the Incident', desc: 'File a claim online or call our support line within 24 hours of the incident.' },
  { step: 2, title: 'Documentation Review', desc: 'Our team reviews your claim and may request photos, receipts, or other documentation.' },
  { step: 3, title: 'Resolution', desc: 'Most claims are resolved within 5-10 business days. Approved claims are paid directly to you.' },
]

export default function BizInsurance() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: DollarSign, label: 'Total Coverage', value: '$1.2M', sub: 'Combined policy limit' },
          { icon: Shield, label: 'Monthly Premium', value: '$165/mo', sub: 'Standard Bundle plan' },
          { icon: CalendarDays, label: 'Next Renewal', value: 'Oct 1, 2026', sub: '175 days remaining' },
          { icon: FileWarning, label: 'Claims Filed', value: '0', sub: 'No open claims' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Status Banner */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={24} color="#16A34A" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Business Insurance</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Standard Bundle: General Liability + Property Coverage</div>
            </div>
          </div>
          <StatusBadge variant="emerald" size="md" dot pulse>Active Policy</StatusBadge>
        </div>
      </Card>

      {/* Coverage Types */}
      <Card>
        <CardHeader title="Your Coverage" subtitle="Active and available coverage types" />
        <div style={{ padding: '0 20px 20px' }}>
          {coverageTypes.map((c, i) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', borderTop: i > 0 ? '1px solid #F1F5F9' : 'none' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0FDFA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={22} color="#1578F7" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{c.name}</span>
                  {c.popular && <StatusBadge variant="teal">Most Popular</StatusBadge>}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5, marginBottom: 8 }}>{c.description}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1578F7' }}>Estimated: {c.estimated}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Estimated Premiums */}
      <Card>
        <CardHeader title="Estimated Premiums" subtitle="Based on your business type and size" />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { label: 'Basic Protection', desc: 'General Liability only', price: '$47 - $85/mo' },
              { label: 'Standard Bundle', desc: 'General Liability + Property', price: '$89 - $165/mo', recommended: true },
              { label: 'Complete Coverage', desc: 'All three coverage types', price: '$140 - $290/mo' },
            ].map(tier => (
              <div key={tier.label} style={{
                padding: 20,
                background: tier.recommended ? '#F0FDFA' : '#F8FAFC',
                borderRadius: 10,
                border: tier.recommended ? '2px solid #1578F7' : '1px solid #E2E8F0',
                textAlign: 'center',
              }}>
                {tier.recommended && (
                  <div style={{ marginBottom: 8 }}>
                    <StatusBadge variant="teal">Current Plan</StatusBadge>
                  </div>
                )}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{tier.label}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{tier.desc}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{tier.price}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button style={{ padding: '12px 32px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              Upgrade Coverage
            </button>
          </div>
        </div>
      </Card>

      {/* Claims Process */}
      <Card>
        <CardHeader title="How Claims Work" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {claimsSteps.map(s => (
            <div key={s.step} style={{ textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1578F7', color: 'white', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                {s.step}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Contact */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Phone size={18} color="#64748B" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Have questions about coverage?</div>
              <div style={{ fontSize: 12, color: '#64748B' }}>Our insurance specialists are available Mon-Fri, 9am-6pm ET</div>
            </div>
          </div>
          <button style={{ padding: '8px 20px', background: 'white', color: '#0F172A', border: '1px solid #E2E8F0', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
            Talk to a Specialist
          </button>
        </div>
      </Card>
    </div>
  )
}
