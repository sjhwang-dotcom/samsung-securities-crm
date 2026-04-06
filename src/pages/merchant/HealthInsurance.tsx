import { Card, CardHeader, StatusBadge } from '../../components/ui'
import { ShieldCheck, Heart, Stethoscope, Pill } from 'lucide-react'

const plans = [
  {
    name: 'Bronze',
    monthlyPerEmployee: '$320',
    deductible: '$6,500',
    copay: '$40',
    coverage: '60%',
    color: '#CD7F32',
    features: ['Preventive care at no cost', 'Prescription drug coverage', 'Emergency room visits', 'Mental health services'],
  },
  {
    name: 'Silver',
    monthlyPerEmployee: '$480',
    deductible: '$3,500',
    copay: '$25',
    coverage: '70%',
    color: '#94A3B8',
    features: ['Everything in Bronze', 'Lower deductible', 'Specialist visits', 'Urgent care coverage', 'Vision & dental basics'],
    recommended: true,
  },
  {
    name: 'Gold',
    monthlyPerEmployee: '$640',
    deductible: '$1,500',
    copay: '$15',
    coverage: '80%',
    color: '#EAB308',
    features: ['Everything in Silver', 'Lowest deductible', 'Full vision & dental', 'Extended mental health', 'Wellness programs', 'Telehealth included'],
  },
]

export default function HealthInsurance() {
  const employeeCount = 4

  return (
    <div className="dashboard-grid">
      {/* Status Banner */}
      <Card>
        <div style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="#D97706" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>Health Insurance</div>
              <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>Provide health coverage for you and your employees</div>
            </div>
          </div>
          <StatusBadge variant="amber" size="md">Not Enrolled</StatusBadge>
        </div>
      </Card>

      {/* Estimated Cost */}
      <Card>
        <CardHeader title="Estimated Monthly Cost" subtitle={`Based on ${employeeCount} employees`} />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.name} style={{ padding: 16, background: '#F8FAFC', borderRadius: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: plan.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{plan.name}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>${(parseInt(plan.monthlyPerEmployee.replace('$', '')) * employeeCount).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>/month for {employeeCount} employees</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Plans */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {plans.map(plan => (
          <Card key={plan.name}>
            <div style={{ padding: 20 }}>
              {plan.recommended && (
                <div style={{ marginBottom: 12 }}>
                  <StatusBadge variant="teal">Recommended</StatusBadge>
                </div>
              )}
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{plan.name} Plan</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>
                {plan.monthlyPerEmployee}
                <span style={{ fontSize: 13, fontWeight: 500, color: '#94A3B8' }}>/employee/mo</span>
              </div>

              <div style={{ margin: '16px 0', borderTop: '1px solid #F1F5F9' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div style={{ padding: 8, background: '#F8FAFC', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Deductible</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{plan.deductible}</div>
                </div>
                <div style={{ padding: 8, background: '#F8FAFC', borderRadius: 6 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase' }}>Copay</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{plan.copay}</div>
                </div>
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>Coverage: {plan.coverage} after deductible</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 12, color: '#64748B', padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#1578F7', fontWeight: 700 }}>&#10003;</span> {f}
                  </li>
                ))}
              </ul>

              <button style={{
                width: '100%',
                marginTop: 16,
                padding: '10px 0',
                background: plan.recommended ? '#1578F7' : 'white',
                color: plan.recommended ? 'white' : '#0F172A',
                border: plan.recommended ? 'none' : '1px solid #E2E8F0',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}>
                Select {plan.name}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Benefits Summary */}
      <Card>
        <CardHeader title="Why Offer Health Insurance?" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { icon: Heart, title: 'Attract Top Talent', desc: 'Stand out when hiring by offering competitive benefits your team values.' },
            { icon: Stethoscope, title: 'Healthier Team', desc: 'Employees with coverage take fewer sick days and stay more productive.' },
            { icon: Pill, title: 'Tax Benefits', desc: 'Health insurance premiums are tax-deductible as a business expense.' },
          ].map(b => (
            <div key={b.title} style={{ textAlign: 'center', padding: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F0FDFA', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
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
