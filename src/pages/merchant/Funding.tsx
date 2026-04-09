import { useState } from 'react'
import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { DollarSign, Clock, TrendingUp, CalendarDays, CheckCircle, FileText, CreditCard, Shield, ArrowRight } from 'lucide-react'

type PaybackRow = { date: string; amount: string; method: string; remaining: string; status: string }

const paybacks: PaybackRow[] = [
  { date: 'Mar 14, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,167.40', status: 'Completed' },
  { date: 'Mar 13, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,263.23', status: 'Completed' },
  { date: 'Mar 12, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,359.06', status: 'Completed' },
  { date: 'Mar 11, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,454.89', status: 'Completed' },
  { date: 'Mar 10, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,550.72', status: 'Completed' },
  { date: 'Mar 9, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,646.55', status: 'Completed' },
  { date: 'Mar 8, 2026', amount: '$95.83', method: 'Auto-debit', remaining: '$3,742.38', status: 'Completed' },
]

const cols: Column<PaybackRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.amount}</span> },
  { key: 'method', header: 'Method' },
  { key: 'remaining', header: 'Remaining Balance', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{r.remaining}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald">{r.status}</StatusBadge> },
]

export default function Funding() {
  const [view, setView] = useState<'current' | 'apply'>('current')

  return (
    <div className="dashboard-grid">
      {/* Toggle */}
      <div style={{ display: 'flex', gap: 2, background: '#F1F5F9', borderRadius: 10, padding: 3, width: 'fit-content' }}>
        {[
          { id: 'current' as const, label: 'Current Funding' },
          { id: 'apply' as const, label: 'Apply for Funding' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '7px 16px', borderRadius: 7, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            background: view === t.id ? 'white' : 'transparent',
            color: view === t.id ? '#0F172A' : '#94A3B8',
            boxShadow: view === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {view === 'current' ? <CurrentFunding /> : <ApplyFunding />}
    </div>
  )
}

function CurrentFunding() {
  const totalPayback = 24375
  const remaining = 3167.40
  const paid = totalPayback - remaining
  const progress = Math.round((paid / totalPayback) * 100)

  return (
    <>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { icon: DollarSign, label: 'Funded Amount', value: '$25,000', sub: 'Feb 10, 2026', color: '#1578F7' },
          { icon: TrendingUp, label: 'Remaining', value: '$3,167', sub: `${progress}% repaid`, color: '#F59E0B' },
          { icon: Clock, label: 'Daily Payback', value: '$95.83', sub: 'Auto-deducted', color: '#10B981' },
          { icon: CalendarDays, label: 'Est. Payoff', value: 'Apr 16', sub: '33 days left', color: '#4F46E5' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${k.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={12} color={k.color} strokeWidth={2} />
              </div>
              <div className="kpi-label" style={{ margin: 0 }}>{k.label}</div>
            </div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Repayment Progress */}
      <Card>
        <CardHeader title="Repayment Progress" badge={<StatusBadge variant="emerald" dot pulse>On Track</StatusBadge>} />
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: '#64748B' }}>
            <span>${paid.toLocaleString()} paid</span>
            <span>{progress}% complete</span>
          </div>
          <div style={{ height: 10, background: '#F1F5F9', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #1578F7, #10B981)', borderRadius: 5, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#94A3B8' }}>
            <span>Started: Feb 10, 2026</span>
            <span>Est. completion: Apr 16, 2026</span>
          </div>
        </div>
      </Card>

      {/* Funding Terms */}
      <Card>
        <CardHeader title="Funding Terms" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Funded Amount', value: '$25,000.00' },
            { label: 'Total Payback', value: '$24,375.00' },
            { label: 'Cost of Funding', value: '$3,375.00' },
            { label: 'Factor Rate', value: '1.15' },
            { label: 'Daily Hold', value: '10% of daily sales' },
            { label: 'Term Length', value: '~255 days' },
          ].map(item => (
            <div key={item.label} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payback History */}
      <Card noPadding>
        <CardHeader title="Payback History" subtitle="Daily automatic deductions" />
        <DataTable columns={cols} data={paybacks} hoverable />
      </Card>
    </>
  )
}

function ApplyFunding() {
  const [step, setStep] = useState(0)

  const steps = [
    { label: 'Qualification', icon: CheckCircle },
    { label: 'Select Amount', icon: DollarSign },
    { label: 'Review Terms', icon: FileText },
    { label: 'Verification', icon: Shield },
    { label: 'Approval', icon: CheckCircle },
  ]

  return (
    <>
      {/* Progress Steps */}
      <Card>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: i < step ? '#10B981' : i === step ? '#1578F7' : '#E2E8F0',
                  color: i <= step ? 'white' : '#94A3B8',
                }}>
                  {i < step ? <CheckCircle size={14} /> : <s.icon size={14} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: i < step ? '#059669' : i === step ? '#1578F7' : '#94A3B8' }}>{s.label}</span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? '#A7F3D0' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {step === 0 && (
        <>
          {/* AI Qualification Summary */}
          <Card noPadding>
            <CardHeader title="AI Qualification Summary" badge={<StatusBadge variant="emerald">Pre-Qualified</StatusBadge>} />
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>Your Business Profile</div>
                  {[
                    { label: 'Monthly Volume', value: '$47,230', status: 'strong' },
                    { label: 'Time in Business', value: '4+ years', status: 'strong' },
                    { label: 'Approval Rate', value: '98.7%', status: 'strong' },
                    { label: 'Chargeback Rate', value: '0.3%', status: 'strong' },
                    { label: 'Existing Funding', value: '$3,167 remaining', status: 'ok' },
                    { label: 'PCI Status', value: 'Compliant', status: 'strong' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
                      <span style={{ fontSize: 12, color: '#64748B' }}>{item.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.value}</span>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.status === 'strong' ? '#10B981' : '#F59E0B' }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 12 }}>AI Funding Benchmark</div>
                  <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#0F766E', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Recommended Amount</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A' }}>$15,000 – $35,000</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Based on your monthly volume and repayment capacity</div>
                  </div>

                  {[
                    { label: 'Your volume vs industry avg', value: '+32%', color: '#10B981' },
                    { label: 'Estimated factor rate', value: '1.12 – 1.18', color: '#1578F7' },
                    { label: 'Daily hold (est.)', value: '$48 – $112', color: '#4F46E5' },
                    { label: 'Term estimate', value: '120 – 300 days', color: '#64748B' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12 }}>
                      <span style={{ color: '#64748B' }}>{item.label}</span>
                      <span style={{ fontWeight: 700, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setStep(1)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
              background: '#1578F7', color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Continue to Select Amount <ArrowRight size={14} /></button>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <Card noPadding>
            <CardHeader title="Select Funding Amount" />
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[
                  { amount: '$15,000', daily: '$48/day', term: '~312 days', factor: '1.12', cost: '$1,800', recommended: false },
                  { amount: '$25,000', daily: '$83/day', term: '~300 days', factor: '1.15', cost: '$3,750', recommended: true },
                  { amount: '$35,000', daily: '$112/day', term: '~312 days', factor: '1.18', cost: '$6,300', recommended: false },
                ].map(opt => (
                  <div key={opt.amount} style={{
                    padding: 20, borderRadius: 12, textAlign: 'center', cursor: 'pointer',
                    border: opt.recommended ? '2px solid #1578F7' : '1px solid #E2E8F0',
                    background: opt.recommended ? '#F0F7FF' : 'white',
                  }}>
                    {opt.recommended && <StatusBadge variant="teal">Recommended</StatusBadge>}
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', margin: '12px 0 4px' }}>{opt.amount}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>{opt.daily} &middot; {opt.term}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8' }}>
                      <span>Factor: {opt.factor}</span>
                      <span>Cost: {opt.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(0)} style={{
              padding: '10px 24px', background: 'white', color: '#64748B', border: '1px solid #E2E8F0',
              borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Back</button>
            <button onClick={() => setStep(2)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
              background: '#1578F7', color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Review Terms <ArrowRight size={14} /></button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <Card noPadding>
            <CardHeader title="Review Your Terms" />
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Funding Amount', value: '$25,000.00' },
                    { label: 'Total Payback', value: '$28,750.00' },
                    { label: 'Factor Rate', value: '1.15' },
                    { label: 'Cost of Funding', value: '$3,750.00' },
                    { label: 'Daily Hold', value: '10% of daily sales' },
                    { label: 'Min Daily Payment', value: '$83.33' },
                    { label: 'Estimated Term', value: '~300 business days' },
                    { label: 'Funding Speed', value: '24–48 hours' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>{item.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: 16, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                <strong>Important:</strong> This is a merchant cash advance, not a loan. Repayment is based on a percentage of your daily card sales. If sales are lower, daily payments decrease. There are no fixed monthly payments or late fees.
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setStep(1)} style={{
              padding: '10px 24px', background: 'white', color: '#64748B', border: '1px solid #E2E8F0',
              borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Back</button>
            <button onClick={() => setStep(3)} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px',
              background: '#1578F7', color: 'white', border: 'none', borderRadius: 8,
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>Accept & Submit <ArrowRight size={14} /></button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Card>
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#D1FAE5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <CreditCard size={28} color="#059669" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Identity Verification</div>
              <div style={{ fontSize: 13, color: '#64748B', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
                We need to verify your identity before processing the funding. Since you're already a verified Harlow merchant, this is a quick check.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 360, margin: '0 auto', textAlign: 'left' }}>
                {[
                  { label: 'Business Entity', value: 'Verified via KYB', done: true },
                  { label: 'Owner Identity', value: 'Verified (Mario Rossi)', done: true },
                  { label: 'Bank Account', value: 'Chase ****8834 confirmed', done: true },
                  { label: 'Processing History', value: '12+ months verified', done: true },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#F0FDFA', borderRadius: 8 }}>
                    <CheckCircle size={16} color="#10B981" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(4)} style={{
                marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '12px 32px', background: '#10B981', color: 'white', border: 'none',
                borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>All Verified — Submit Application <ArrowRight size={14} /></button>
            </div>
          </Card>
        </>
      )}

      {step === 4 && (
        <Card>
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#D1FAE5', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <CheckCircle size={36} color="#059669" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>Application Submitted!</div>
            <div style={{ fontSize: 14, color: '#64748B', maxWidth: 440, margin: '0 auto 8px', lineHeight: 1.6 }}>
              Your funding application for <strong>$25,000</strong> has been submitted successfully.
            </div>
            <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>
              Expected approval: <strong style={{ color: '#1578F7' }}>Within 2 hours</strong> &middot; Funds deposited in 24-48 hours
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 480, margin: '0 auto' }}>
              {[
                { label: 'Application ID', value: 'FND-2026-0891' },
                { label: 'Submitted', value: 'Just now' },
                { label: 'Status', value: 'Under Review' },
              ].map(item => (
                <div key={item.label} style={{ padding: 12, background: '#F8FAFC', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  )
}
