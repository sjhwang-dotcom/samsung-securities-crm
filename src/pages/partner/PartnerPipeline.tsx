import { useState } from 'react'
import {
  Search, Plus, Building2, Calendar, DollarSign,
  MapPin, Phone, Mail, Link2, Percent, Clock,
  PhoneCall, Send, Users, Target, Timer, Rocket,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, KpiCard } from '../../components/ui'

interface Lead {
  id: number
  business: string
  contact: string
  email: string
  phone: string
  location: string
  stage: 'Lead' | 'Proposal' | 'Application' | 'Boarding' | 'Live'
  estimatedVolume: string
  submitted: string
  notes: string
  industry: string
}

const stageVariant: Record<string, 'gray' | 'amber' | 'blue' | 'indigo' | 'emerald'> = {
  Lead: 'gray', Proposal: 'amber', Application: 'blue', Boarding: 'indigo', Live: 'emerald',
}

const stageColors: Record<string, string> = {
  Lead: '#94A3B8', Proposal: '#F59E0B', Application: '#3B82F6', Boarding: '#6366F1', Live: '#10B981',
}

const leads: Lead[] = [
  { id: 1, business: 'Fresh Bakes Co.', contact: 'Sarah Chen', email: 'sarah@freshbakes.com', phone: '(415) 555-0112', location: 'San Francisco, CA', stage: 'Lead', estimatedVolume: '$12,000/mo', submitted: 'Apr 7, 2026', notes: 'Interested in POS terminal + online payments. Currently with Square.', industry: 'Bakery' },
  { id: 2, business: 'Mountain View Deli', contact: 'Tom Harris', email: 'tom@mvdeli.com', phone: '(650) 555-0198', location: 'Mountain View, CA', stage: 'Boarding', estimatedVolume: '$18,500/mo', submitted: 'Mar 22, 2026', notes: 'Application approved. Awaiting equipment shipment. Multi-location.', industry: 'Restaurant' },
  { id: 3, business: 'Sunset Grill', contact: 'Maria Lopez', email: 'maria@sunsetgrill.com', phone: '(408) 555-0134', location: 'San Jose, CA', stage: 'Application', estimatedVolume: '$22,000/mo', submitted: 'Mar 28, 2026', notes: 'High volume restaurant. Needs tableside payment solution.', industry: 'Restaurant' },
  { id: 4, business: 'Bayshore Auto Parts', contact: 'Dave Kim', email: 'dave@bayshoreap.com', phone: '(510) 555-0177', location: 'Oakland, CA', stage: 'Proposal', estimatedVolume: '$15,000/mo', submitted: 'Apr 1, 2026', notes: 'Looking for better rates than current provider. B2B transactions.', industry: 'Auto Parts' },
  { id: 5, business: 'Pacific Yoga Studio', contact: 'Jen Walsh', email: 'jen@pacificyoga.com', phone: '(415) 555-0156', location: 'San Francisco, CA', stage: 'Lead', estimatedVolume: '$8,000/mo', submitted: 'Apr 5, 2026', notes: 'Membership recurring billing + walk-in payments.', industry: 'Fitness' },
  { id: 6, business: 'Golden Gate Flowers', contact: 'Amy Park', email: 'amy@ggflowers.com', phone: '(415) 555-0143', location: 'San Francisco, CA', stage: 'Proposal', estimatedVolume: '$6,500/mo', submitted: 'Mar 30, 2026', notes: 'Small retail florist. Needs simple terminal + online ordering.', industry: 'Retail' },
  { id: 7, business: 'Harbor Seafood', contact: 'Rick Torres', email: 'rick@harborseafood.com', phone: '(650) 555-0121', location: 'Half Moon Bay, CA', stage: 'Live', estimatedVolume: '$32,000/mo', submitted: 'Feb 15, 2026', notes: 'Boarded and processing. High ticket restaurant. Very satisfied.', industry: 'Restaurant' },
  { id: 8, business: 'Summit Dry Cleaners', contact: 'Paul Green', email: 'paul@summitdc.com', phone: '(408) 555-0188', location: 'Cupertino, CA', stage: 'Application', estimatedVolume: '$9,200/mo', submitted: 'Mar 25, 2026', notes: 'Two locations. Needs integrated POS with customer tracking.', industry: 'Services' },
  { id: 9, business: 'Redwood Dental', contact: 'Dr. Lisa Tran', email: 'lisa@redwooddental.com', phone: '(650) 555-0166', location: 'Redwood City, CA', stage: 'Proposal', estimatedVolume: '$45,000/mo', submitted: 'Mar 18, 2026', notes: 'Medical practice. High average ticket. Needs recurring billing.', industry: 'Healthcare' },
  { id: 10, business: 'Valley Pet Care', contact: 'Mike Adams', email: 'mike@valleypet.com', phone: '(408) 555-0199', location: 'Campbell, CA', stage: 'Lead', estimatedVolume: '$11,000/mo', submitted: 'Apr 4, 2026', notes: 'Veterinary clinic. Interested in mobile payment solution.', industry: 'Healthcare' },
  { id: 11, business: 'Nob Hill Bistro', contact: 'Chef Andre', email: 'andre@nobhillbistro.com', phone: '(415) 555-0177', location: 'San Francisco, CA', stage: 'Live', estimatedVolume: '$28,000/mo', submitted: 'Jan 20, 2026', notes: 'Fine dining. Live and processing well. Great referral source.', industry: 'Restaurant' },
  { id: 12, business: 'Tech Gadgets Plus', contact: 'Kevin Wu', email: 'kevin@techgadgets.com', phone: '(408) 555-0144', location: 'Santa Clara, CA', stage: 'Lead', estimatedVolume: '$14,000/mo', submitted: 'Apr 6, 2026', notes: 'Electronics retailer. Needs e-commerce + in-store solution.', industry: 'Retail' },
  { id: 13, business: 'Paws & Claws Grooming', contact: 'Diana Ross', email: 'diana@pawsclaws.com', phone: '(510) 555-0133', location: 'Berkeley, CA', stage: 'Proposal', estimatedVolume: '$7,500/mo', submitted: 'Mar 29, 2026', notes: 'Pet grooming salon. Appointment-based with walk-ins.', industry: 'Services' },
  { id: 14, business: 'Bay Area HVAC', contact: 'Steve Miller', email: 'steve@bahvac.com', phone: '(650) 555-0155', location: 'San Mateo, CA', stage: 'Application', estimatedVolume: '$35,000/mo', submitted: 'Mar 20, 2026', notes: 'Service company. Mobile invoicing + card-not-present needed.', industry: 'Services' },
  { id: 15, business: 'Craft Coffee Roasters', contact: 'Emily Stone', email: 'emily@craftcoffee.com', phone: '(415) 555-0189', location: 'San Francisco, CA', stage: 'Live', estimatedVolume: '$16,000/mo', submitted: 'Feb 28, 2026', notes: 'Multi-location coffee chain. Very happy with service.', industry: 'Restaurant' },
]

const lastActivities: Record<number, string> = {
  1: 'Voice Agent called 2h ago — Positive sentiment',
  2: 'Equipment tracking updated 4h ago',
  3: 'Underwriting review in progress — 1 day ago',
  4: 'Proposal sent via email 6h ago',
  5: 'Initial outreach scheduled for tomorrow',
  6: 'Follow-up call completed yesterday — Interested',
  7: 'Monthly check-in call 3 days ago — Very satisfied',
  8: 'Document upload received 2 days ago',
  9: 'Rate comparison sent 1 day ago',
  10: 'Voice Agent called 5h ago — Requested callback',
  11: 'Referral bonus processed last week',
  12: 'Demo scheduled for Apr 12',
  13: 'Proposal draft in review',
  14: 'Application submitted to underwriting 2 days ago',
  15: 'Processing volume on track — no issues',
}

function parseVolume(vol: string): number {
  const match = vol.replace(/[^0-9]/g, '')
  return parseInt(match) || 0
}

const stages = ['Lead', 'Proposal', 'Application', 'Boarding', 'Live'] as const
const stageCounts = stages.map(s => ({ stage: s, count: leads.filter(l => l.stage === s).length }))

export default function PartnerPipeline() {
  const [selectedId, setSelectedId] = useState(leads[0].id)
  const [searchTerm, setSearchTerm] = useState('')
  const selected = leads.find(l => l.id === selectedId) ?? leads[0]

  const filtered = leads.filter(l =>
    l.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalCount = leads.length
  const estResidual = Math.round(parseVolume(selected.estimatedVolume) * 0.6 * 0.0275)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', margin: '-16px -20px', overflow: 'hidden' }}>
      {/* KPI Cards */}
      <div style={{ padding: '16px 20px 0', background: '#FAFBFC' }}>
        <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          <KpiCard label="Active Leads" value="15" icon={Users} color="emerald" trend="+3" trendDirection="up" trendPositive sub="in pipeline" />
          <KpiCard label="Pipeline Value" value="$285K/mo" icon={DollarSign} color="teal" trend="+18%" trendDirection="up" trendPositive sub="est. volume" />
          <KpiCard label="Conversion Rate" value="28%" icon={Percent} color="blue" trend="+2.1%" trendDirection="up" trendPositive sub="lead to live" />
          <KpiCard label="Avg Time to Close" value="22d" icon={Timer} color="purple" trend="-3d" trendDirection="down" trendPositive sub="vs last quarter" />
          <KpiCard label="This Month Submitted" value="4" icon={Target} color="amber" sub="new leads" />
          <KpiCard label="Go-Live Rate" value="20%" icon={Rocket} color="indigo" trend="+4%" trendDirection="up" trendPositive sub="last 90 days" />
        </div>

        {/* Stage Distribution Bar */}
        <div style={{ marginTop: 14, marginBottom: 14 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Stage Distribution</span>
              <span style={{ fontSize: 11, color: '#94A3B8' }}>{totalCount} total leads</span>
            </div>
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', height: 28 }}>
              {stageCounts.map(({ stage, count }) => (
                <div key={stage} style={{
                  flex: count, background: stageColors[stage], display: 'flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: count > 0 ? 48 : 0, transition: 'flex 0.3s ease',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                    {stage} ({count})
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
              {stageCounts.map(({ stage, count }) => (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: stageColors[stage] }} />
                  <span style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>{stage}: {count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Master-Detail */}
      <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden' }}>
        {/* Left Panel */}
        <div style={{
          width: 320, minWidth: 320, background: 'white',
          borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 310px)',
        }}>
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Pipeline</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {stageCounts.map(({ stage, count }) => (
                    <span key={stage} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: stageColors[stage], display: 'inline-block' }} />
                      <span>{count}</span>
                    </span>
                  ))}
                </div>
              </div>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px',
                background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>
                <Plus size={12} /> New Lead
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 9 }} />
              <input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%', padding: '8px 8px 8px 32px', border: '1px solid #E5E7EB',
                  borderRadius: 8, fontSize: 12, outline: 'none', background: '#F8FAFC',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(lead => {
              const isActive = selectedId === lead.id
              return (
                <div key={lead.id} onClick={() => setSelectedId(lead.id)} className="sidebar-item"
                  style={{
                    padding: '12px 16px',
                    borderLeft: isActive ? '3px solid #10B981' : '3px solid transparent',
                    background: isActive ? 'linear-gradient(90deg, rgba(16,185,129,0.06) 0%, rgba(16,185,129,0.01) 100%)' : 'transparent',
                    cursor: 'pointer',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: isActive ? 'linear-gradient(135deg, #10B981, #059669)' : '#F1F5F9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Building2 size={16} color={isActive ? 'white' : '#94A3B8'} strokeWidth={1.8} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.business}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{lead.contact}</div>
                    </div>
                    <StatusBadge variant={stageVariant[lead.stage]}>{lead.stage}</StatusBadge>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Detail */}
        <div style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 310px)', padding: 24, background: '#FAFBFC' }}>
          <div style={{ maxWidth: 720 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{selected.business}</h2>
                <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0' }}>{selected.industry}</p>
              </div>
              <StatusBadge variant={stageVariant[selected.stage]} size="md">{selected.stage}</StatusBadge>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
                border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                <PhoneCall size={14} /> Schedule Call
              </button>
              <button style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
                background: 'white', color: '#10B981',
                border: '1px solid #10B981', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}>
                <Send size={14} /> Send Application Link
              </button>
            </div>

            {/* Estimated Residual + Last Activity */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              <div style={{
                flex: 1, padding: '14px 16px', background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
                borderRadius: 12, border: '1px solid #D1FAE5',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#059669', marginBottom: 4 }}>Est. Monthly Residual</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#047857' }}>
                  ${estResidual.toLocaleString()}/mo
                </div>
                <div style={{ fontSize: 10, color: '#6EE7B7', marginTop: 2 }}>at {selected.estimatedVolume} volume, 60% split</div>
              </div>
              <div style={{
                flex: 1, padding: '14px 16px', background: '#F8FAFC',
                borderRadius: 12, border: '1px solid #E2E8F0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Clock size={12} color="#64748B" />
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>Last Activity</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.5 }}>
                  {lastActivities[selected.id] || 'No recent activity'}
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <Card>
                <CardHeader title="Contact Information" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                  <InfoRow icon={Building2} label="Contact" value={selected.contact} />
                  <InfoRow icon={Mail} label="Email" value={selected.email} />
                  <InfoRow icon={Phone} label="Phone" value={selected.phone} />
                  <InfoRow icon={MapPin} label="Location" value={selected.location} />
                </div>
              </Card>

              <Card>
                <CardHeader title="Deal Details" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                  <InfoRow icon={DollarSign} label="Est. Volume" value={selected.estimatedVolume} />
                  <InfoRow icon={Calendar} label="Submitted" value={selected.submitted} />
                  <InfoRow icon={Building2} label="Industry" value={selected.industry} />
                  <InfoRow icon={Link2} label="Shareable Link" value="partner.harlow.com/apply/jw-2849" />
                </div>
              </Card>
            </div>

            {/* Notes */}
            <Card>
              <CardHeader title="Notes" />
              <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.7, marginTop: 4 }}>
                {selected.notes}
              </div>
            </Card>

            {/* Stage Timeline */}
            <Card>
              <CardHeader title="Stage Progress" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 8 }}>
                {stages.map((stage, i) => {
                  const currentIdx = stages.indexOf(selected.stage)
                  const isCompleted = i <= currentIdx
                  const isCurrent = i === currentIdx
                  return (
                    <div key={stage} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: isCompleted ? '#10B981' : '#E5E7EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: isCurrent ? '2px solid #059669' : 'none',
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: isCompleted ? 'white' : '#94A3B8' }}>{i + 1}</span>
                      </div>
                      {i < 4 && (
                        <div style={{ flex: 1, height: 2, background: i < currentIdx ? '#10B981' : '#E5E7EB' }} />
                      )}
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {stages.map(stage => (
                  <span key={stage} style={{ fontSize: 10, color: '#64748B', fontWeight: 500, width: '20%', textAlign: 'center' }}>{stage}</span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={14} color="#94A3B8" strokeWidth={1.8} />
      <span style={{ fontSize: 11, color: '#94A3B8', width: 72, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: '#0F172A', fontWeight: 600 }}>{value}</span>
    </div>
  )
}
