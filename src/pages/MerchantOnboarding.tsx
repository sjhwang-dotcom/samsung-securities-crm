import { useState } from 'react'
import { Plus, CheckCircle, AlertTriangle, FileText, Upload, ChevronRight } from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { onboardingApps } from '../data/mockData'

export default function MerchantOnboarding() {
  const [selected, setSelected] = useState<string | null>(null)

  if (selected) return <OnboardingDetail onBack={() => setSelected(null)} />

  type AppRow = { merchant: string; bank: string; submitted: string; stage: string; riskScore: number | null; riskLabel: string; status: string; assigned: string }

  const riskVariant = (label: string) => label === 'Low Risk' ? 'emerald' as const : label === 'Medium' ? 'amber' as const : label === 'High Risk' ? 'rose' as const : 'gray' as const
  const statusVariant = (s: string) => s === 'In Progress' ? 'blue' as const : s === 'In Review' ? 'indigo' as const : s.includes('Needs') ? 'rose' as const : 'amber' as const

  const columns: Column<AppRow>[] = [
    { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
    { key: 'bank', header: 'Bank' },
    { key: 'submitted', header: 'Submitted' },
    { key: 'stage', header: 'Stage' },
    { key: 'riskScore', header: 'Risk Score', render: (r) =>
      r.riskScore ? <StatusBadge variant={riskVariant(r.riskLabel)}>{r.riskScore} -- {r.riskLabel}</StatusBadge> : <span style={{ color: '#94A3B8', fontSize: 12 }}>Pending</span>
    },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={statusVariant(r.status)}>{r.status}</StatusBadge> },
    { key: 'assigned', header: 'Assigned' },
    { key: '', header: '', render: () => <ChevronRight size={14} style={{ color: '#94A3B8' }} /> },
  ]

  return (
    <div className="dashboard-grid">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          background: 'linear-gradient(to right, #609FFF, #1578F7)',
          color: 'white', borderRadius: 8, padding: '8px 16px', fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          <Plus size={16} /> New Application
        </button>
      </div>

      <Card noPadding>
        <DataTable
          columns={columns}
          data={onboardingApps as unknown as AppRow[]}
          hoverable
          onRowClick={(row) => setSelected(row.merchant)}
        />
      </Card>
    </div>
  )
}

function OnboardingDetail({ onBack }: { onBack: () => void }) {
  const steps = [
    { label: 'Application Received', done: true },
    { label: 'Document Collection', done: true },
    { label: 'KYB/KYC Verification', current: true },
    { label: 'AI Risk Assessment', done: false },
    { label: 'Pricing & Terms', done: false },
    { label: 'Boarding Complete', done: false },
  ]

  const docs = [
    { name: 'Articles_of_Incorporation.pdf', status: 'AI Processed', extracted: 'Entity name, State, EIN, Formation date' },
    { name: 'Drivers_License_Rossi.jpg', status: 'AI Processed', extracted: 'Name, DOB, Address, ID number' },
    { name: '3mo_Bank_Statements.pdf', status: 'AI Processed', extracted: 'Avg monthly balance $47,200 | Deposit velocity: 142/mo' },
    { name: 'Voided_Check.png', status: 'AI Processed', extracted: 'Routing #, Account #' },
    { name: 'Processing_Statements_Previous.pdf', status: 'AI Processed', extracted: 'Monthly volume $89K | Avg ticket $34 | CB rate 0.3%' },
  ]

  const kybResults = [
    { icon: CheckCircle, color: '#10B981', title: 'Business Entity Verified', sub: "Bella's Bistro LLC, Delaware Corp, EIN validated", tag: 'Agentic Lakehouse -- Auto-Extracted from uploaded Articles of Incorporation' },
    { icon: CheckCircle, color: '#10B981', title: 'Beneficial Ownership Confirmed', sub: 'Maria Rossi, 100% owner', tag: 'Graph DB -- Ownership chain resolved, no layered structures detected' },
    { icon: CheckCircle, color: '#10B981', title: 'Sanctions & PEP Screening -- Clear', sub: 'No matches found', tag: 'Real-time screening against OFAC, EU, UN consolidated lists' },
    { icon: AlertTriangle, color: '#F59E0B', title: 'Adverse Media Check -- 1 result flagged', sub: 'Awaiting review', tag: 'AI flagged: local health dept citation (2023) -- low relevance score 0.12' },
    { icon: CheckCircle, color: '#10B981', title: 'Identity Verification -- Maria Rossi', sub: 'Verified', tag: 'Document AI -- Passport OCR + liveness check passed' },
  ]

  return (
    <div className="dashboard-grid">
      <button onClick={onBack} style={{ fontSize: 13, color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, alignSelf: 'flex-start' }}>&larr; Back</button>

      {/* Progress Bar */}
      <Card>
        <div style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: step.done ? '#10B981' : step.current ? '#1578F7' : '#E2E8F0',
                  color: step.done || step.current ? 'white' : '#94A3B8',
                }}>
                  {step.done ? <CheckCircle size={14} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: step.done ? '#059669' : step.current ? '#1578F7' : '#94A3B8' }}>
                  {step.label}
                </span>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: step.done ? '#A7F3D0' : '#E2E8F0' }} />}
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }}>
        {/* Left Column */}
        <div className="dashboard-grid">
          {/* KYB/KYC Results */}
          <Card noPadding>
            <CardHeader title="KYB / KYC Results" />
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {kybResults.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, borderRadius: 8, border: '1px solid #F1F5F9' }}>
                  <item.icon size={18} style={{ marginTop: 2, flexShrink: 0, color: item.color }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{item.sub}</div>
                    <div style={{ fontSize: 10, color: '#4F46E5', marginTop: 4, background: '#EEF2FF', padding: '2px 8px', borderRadius: 12, display: 'inline-block' }}>{item.tag}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Assessment Preview */}
          <Card noPadding>
            <CardHeader title="AI Risk Assessment Preview" />
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
                <div style={{ position: 'relative', width: 112, height: 112 }}>
                  <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray={`${72 * 2.64} ${100 * 2.64}`} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 24, fontWeight: 800, color: '#0F172A' }}>72</span>
                    <span style={{ fontSize: 10, color: '#059669', fontWeight: 500 }}>LOW RISK</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> MCC 5812 -- Chargeback: 0.3% vs industry 0.8%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> Volume Consistency: stable &plusmn;6%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={14} style={{ color: '#10B981' }} /> Fraud Signal Scan: No anomalies</div>
                </div>
              </div>
              <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F766E' }}>AUTO-APPROVE -- Suggest Tier 2 pricing at 2.69% + $0.10</div>
                <div style={{ fontSize: 12, color: '#1578F7', marginTop: 4, fontWeight: 500 }}>ML model trained on 50K+ merchant profiles | Human override available at Step 5</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Documents */}
        <div className="dashboard-grid">
          <Card noPadding>
            <CardHeader title="Uploaded Documents" />
            <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {docs.map((doc, i) => (
                <div key={i} style={{ padding: 12, borderRadius: 8, border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={14} style={{ color: '#94A3B8' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</span>
                    <StatusBadge variant="indigo">{doc.status}</StatusBadge>
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4, marginLeft: 22 }}>{doc.extracted}</div>
                </div>
              ))}
              <button style={{
                width: '100%', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 13, color: '#64748B', border: '1px dashed #CBD5E1', borderRadius: 8, padding: '10px 0',
                background: 'none', cursor: 'pointer',
              }}>
                <Upload size={14} /> Add Document
              </button>
            </div>
          </Card>

          <div style={{ background: '#FAFBFC', borderRadius: 12, padding: 16, fontSize: 12, color: '#64748B', fontWeight: 500 }}>
            <div>Application ID: HRW-2026-0488292</div>
            <div style={{ marginTop: 4 }}>Submitted: Mar 28, 2026 | SLA: 4h remaining</div>
            <div style={{ marginTop: 4 }}>Assigned: Sarah Chen</div>
          </div>
        </div>
      </div>
    </div>
  )
}
