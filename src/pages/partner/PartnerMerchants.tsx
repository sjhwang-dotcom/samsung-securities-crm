import { useState } from 'react'
import {
  Store, Search, ChevronLeft, MapPin, Calendar, DollarSign,
  CreditCard, TrendingUp, Phone, Mail,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, DataTable, KpiCard } from '../../components/ui'
import type { Column } from '../../components/ui'

interface Merchant {
  id: number
  name: string
  mid: string
  volume: string
  split: string
  payout: string
  status: string
  boarded: string
  location: string
  contact: string
  email: string
  phone: string
  industry: string
  avgTicket: string
}

const merchants: Merchant[] = [
  { id: 1, name: 'Coastal Cafe', mid: '5489-7821-0034', volume: '$28,400', split: '60/40', payout: '$284', status: 'Active', boarded: 'Jan 15, 2025', location: 'San Francisco, CA', contact: 'Anna Bell', email: 'anna@coastalcafe.com', phone: '(415) 555-0101', industry: 'Restaurant', avgTicket: '$18.50' },
  { id: 2, name: 'Metro Fitness', mid: '5489-7821-0035', volume: '$24,100', split: '60/40', payout: '$241', status: 'Active', boarded: 'Feb 3, 2025', location: 'Oakland, CA', contact: 'James Park', email: 'james@metrofit.com', phone: '(510) 555-0102', industry: 'Fitness', avgTicket: '$45.00' },
  { id: 3, name: 'Urban Bites', mid: '5489-7821-0036', volume: '$21,800', split: '50/50', payout: '$218', status: 'Active', boarded: 'Feb 20, 2025', location: 'San Jose, CA', contact: 'Carlos Ruiz', email: 'carlos@urbanbites.com', phone: '(408) 555-0103', industry: 'Restaurant', avgTicket: '$22.75' },
  { id: 4, name: 'Summit Auto', mid: '5489-7821-0037', volume: '$19,500', split: '60/40', payout: '$195', status: 'Active', boarded: 'Mar 8, 2025', location: 'Fremont, CA', contact: 'Dave Long', email: 'dave@summitauto.com', phone: '(510) 555-0104', industry: 'Auto Services', avgTicket: '$125.00' },
  { id: 5, name: 'Harbor Books', mid: '5489-7821-0038', volume: '$16,200', split: '50/50', payout: '$162', status: 'Active', boarded: 'Mar 22, 2025', location: 'Half Moon Bay, CA', contact: 'Lisa Ng', email: 'lisa@harborbooks.com', phone: '(650) 555-0105', industry: 'Retail', avgTicket: '$32.40' },
  { id: 6, name: 'Nob Hill Bistro', mid: '5489-7821-0039', volume: '$28,000', split: '60/40', payout: '$280', status: 'Active', boarded: 'Jan 20, 2025', location: 'San Francisco, CA', contact: 'Chef Andre', email: 'andre@nobhillbistro.com', phone: '(415) 555-0106', industry: 'Restaurant', avgTicket: '$68.00' },
  { id: 7, name: 'Craft Coffee Roasters', mid: '5489-7821-0040', volume: '$16,000', split: '50/50', payout: '$160', status: 'Active', boarded: 'Feb 28, 2025', location: 'San Francisco, CA', contact: 'Emily Stone', email: 'emily@craftcoffee.com', phone: '(415) 555-0107', industry: 'Restaurant', avgTicket: '$8.50' },
  { id: 8, name: 'Harbor Seafood', mid: '5489-7821-0041', volume: '$32,000', split: '60/40', payout: '$320', status: 'Active', boarded: 'Feb 15, 2025', location: 'Half Moon Bay, CA', contact: 'Rick Torres', email: 'rick@harborseafood.com', phone: '(650) 555-0108', industry: 'Restaurant', avgTicket: '$52.00' },
  { id: 9, name: 'Bay Dental Group', mid: '5489-7821-0042', volume: '$44,000', split: '60/40', payout: '$440', status: 'Active', boarded: 'Apr 5, 2025', location: 'Palo Alto, CA', contact: 'Dr. Kim', email: 'kim@baydental.com', phone: '(650) 555-0109', industry: 'Healthcare', avgTicket: '$285.00' },
  { id: 10, name: 'Valley Hardware', mid: '5489-7821-0043', volume: '$14,200', split: '50/50', payout: '$142', status: 'Active', boarded: 'Apr 18, 2025', location: 'Campbell, CA', contact: 'Bob Miller', email: 'bob@valleyhw.com', phone: '(408) 555-0110', industry: 'Retail', avgTicket: '$42.80' },
  { id: 11, name: 'Pacific Cleaners', mid: '5489-7821-0044', volume: '$9,800', split: '50/50', payout: '$98', status: 'Active', boarded: 'May 10, 2025', location: 'Cupertino, CA', contact: 'Mei Chen', email: 'mei@pacclean.com', phone: '(408) 555-0111', industry: 'Services', avgTicket: '$18.00' },
  { id: 12, name: 'Sunset Spa', mid: '5489-7821-0045', volume: '$18,500', split: '60/40', payout: '$185', status: 'Active', boarded: 'May 25, 2025', location: 'San Mateo, CA', contact: 'Tina Park', email: 'tina@sunsetspa.com', phone: '(650) 555-0112', industry: 'Wellness', avgTicket: '$95.00' },
  { id: 13, name: 'Quick Lube Express', mid: '5489-7821-0046', volume: '$12,400', split: '50/50', payout: '$124', status: 'Active', boarded: 'Jun 8, 2025', location: 'Milpitas, CA', contact: 'Joe Adams', email: 'joe@quicklube.com', phone: '(408) 555-0113', industry: 'Auto Services', avgTicket: '$65.00' },
  { id: 14, name: 'Green Thumb Garden', mid: '5489-7821-0047', volume: '$8,600', split: '50/50', payout: '$86', status: 'Active', boarded: 'Jun 22, 2025', location: 'Los Gatos, CA', contact: 'Nancy Lee', email: 'nancy@greenthumb.com', phone: '(408) 555-0114', industry: 'Retail', avgTicket: '$38.50' },
  { id: 15, name: 'Downtown Diner', mid: '5489-7821-0048', volume: '$15,200', split: '60/40', payout: '$152', status: 'Active', boarded: 'Jul 3, 2025', location: 'San Francisco, CA', contact: 'Pete Wilson', email: 'pete@downtowndiner.com', phone: '(415) 555-0115', industry: 'Restaurant', avgTicket: '$16.20' },
  { id: 16, name: 'Bright Smile Dental', mid: '5489-7821-0049', volume: '$38,000', split: '60/40', payout: '$380', status: 'Active', boarded: 'Jul 20, 2025', location: 'Sunnyvale, CA', contact: 'Dr. Patel', email: 'patel@brightsmile.com', phone: '(408) 555-0116', industry: 'Healthcare', avgTicket: '$310.00' },
  { id: 17, name: 'Bay Yoga Center', mid: '5489-7821-0050', volume: '$10,400', split: '50/50', payout: '$104', status: 'Active', boarded: 'Aug 5, 2025', location: 'Berkeley, CA', contact: 'Sara Wu', email: 'sara@bayyoga.com', phone: '(510) 555-0117', industry: 'Fitness', avgTicket: '$25.00' },
  { id: 18, name: 'Redwood Pizza', mid: '5489-7821-0051', volume: '$22,800', split: '60/40', payout: '$228', status: 'Active', boarded: 'Aug 18, 2025', location: 'Redwood City, CA', contact: 'Tony Bianchi', email: 'tony@redwoodpizza.com', phone: '(650) 555-0118', industry: 'Restaurant', avgTicket: '$24.50' },
  { id: 19, name: 'Elite Barber Shop', mid: '5489-7821-0052', volume: '$7,200', split: '50/50', payout: '$72', status: 'Active', boarded: 'Sep 2, 2025', location: 'San Jose, CA', contact: 'Marcus Brown', email: 'marcus@elitebarber.com', phone: '(408) 555-0119', industry: 'Services', avgTicket: '$35.00' },
  { id: 20, name: 'Mountain Bikes Plus', mid: '5489-7821-0053', volume: '$13,600', split: '50/50', payout: '$136', status: 'Active', boarded: 'Sep 18, 2025', location: 'Los Altos, CA', contact: 'Chris Hall', email: 'chris@mtbikes.com', phone: '(650) 555-0120', industry: 'Retail', avgTicket: '$185.00' },
  { id: 21, name: 'Fresh Juice Bar', mid: '5489-7821-0054', volume: '$6,800', split: '50/50', payout: '$68', status: 'Active', boarded: 'Oct 1, 2025', location: 'Palo Alto, CA', contact: 'Maya Singh', email: 'maya@freshjuice.com', phone: '(650) 555-0121', industry: 'Restaurant', avgTicket: '$12.00' },
  { id: 22, name: 'Bay Tech Repair', mid: '5489-7821-0055', volume: '$11,200', split: '50/50', payout: '$112', status: 'Active', boarded: 'Oct 15, 2025', location: 'Santa Clara, CA', contact: 'Alan Cho', email: 'alan@baytechrepair.com', phone: '(408) 555-0122', industry: 'Services', avgTicket: '$95.00' },
  { id: 23, name: 'Parkside Florist', mid: '5489-7821-0056', volume: '$5,400', split: '50/50', payout: '$54', status: 'Active', boarded: 'Oct 28, 2025', location: 'San Francisco, CA', contact: 'Rose Kim', email: 'rose@parkside.com', phone: '(415) 555-0123', industry: 'Retail', avgTicket: '$48.00' },
  { id: 24, name: 'Crossfit Bay Area', mid: '5489-7821-0057', volume: '$14,600', split: '60/40', payout: '$146', status: 'Active', boarded: 'Nov 5, 2025', location: 'San Mateo, CA', contact: 'Jake Reed', email: 'jake@crossfitba.com', phone: '(650) 555-0124', industry: 'Fitness', avgTicket: '$150.00' },
  { id: 25, name: 'Lucky Wok', mid: '5489-7821-0058', volume: '$17,800', split: '60/40', payout: '$178', status: 'Active', boarded: 'Nov 20, 2025', location: 'Daly City, CA', contact: 'Henry Lam', email: 'henry@luckywok.com', phone: '(650) 555-0125', industry: 'Restaurant', avgTicket: '$19.50' },
  { id: 26, name: 'Pet Paradise', mid: '5489-7821-0059', volume: '$9,200', split: '50/50', payout: '$92', status: 'Active', boarded: 'Dec 3, 2025', location: 'Fremont, CA', contact: 'Diana Ross', email: 'diana@petparadise.com', phone: '(510) 555-0126', industry: 'Retail', avgTicket: '$42.00' },
  { id: 27, name: 'Golden Wok Express', mid: '5489-7821-0060', volume: '$11,600', split: '50/50', payout: '$116', status: 'Active', boarded: 'Dec 15, 2025', location: 'Milpitas, CA', contact: 'Ken Zhao', email: 'ken@goldenwok.com', phone: '(408) 555-0127', industry: 'Restaurant', avgTicket: '$14.80' },
  { id: 28, name: 'Bay Plumbing Co', mid: '5489-7821-0061', volume: '$21,000', split: '60/40', payout: '$210', status: 'Active', boarded: 'Jan 8, 2026', location: 'San Jose, CA', contact: 'Bill Thomas', email: 'bill@bayplumbing.com', phone: '(408) 555-0128', industry: 'Services', avgTicket: '$175.00' },
  { id: 29, name: 'Sunrise Bakery', mid: '5489-7821-0062', volume: '$8,400', split: '50/50', payout: '$84', status: 'Active', boarded: 'Jan 22, 2026', location: 'Mountain View, CA', contact: 'Marie Claire', email: 'marie@sunrise.com', phone: '(650) 555-0129', industry: 'Restaurant', avgTicket: '$11.20' },
  { id: 30, name: 'Ace Auto Detail', mid: '5489-7821-0063', volume: '$13,800', split: '50/50', payout: '$138', status: 'Active', boarded: 'Feb 5, 2026', location: 'Sunnyvale, CA', contact: 'Ray Garcia', email: 'ray@aceauto.com', phone: '(408) 555-0130', industry: 'Auto Services', avgTicket: '$85.00' },
  { id: 31, name: 'The Wine Cellar', mid: '5489-7821-0064', volume: '$19,200', split: '60/40', payout: '$192', status: 'Active', boarded: 'Feb 18, 2026', location: 'Los Gatos, CA', contact: 'Victor Stein', email: 'victor@winecellar.com', phone: '(408) 555-0131', industry: 'Retail', avgTicket: '$55.00' },
  { id: 32, name: 'FitLife Studio', mid: '5489-7821-0065', volume: '$11,800', split: '50/50', payout: '$118', status: 'Active', boarded: 'Mar 2, 2026', location: 'Palo Alto, CA', contact: 'Kim Lee', email: 'kim@fitlife.com', phone: '(650) 555-0132', industry: 'Fitness', avgTicket: '$30.00' },
  { id: 33, name: 'Taqueria El Sol', mid: '5489-7821-0066', volume: '$14,800', split: '60/40', payout: '$148', status: 'Active', boarded: 'Mar 15, 2026', location: 'San Francisco, CA', contact: 'Miguel Santos', email: 'miguel@elsol.com', phone: '(415) 555-0133', industry: 'Restaurant', avgTicket: '$15.50' },
  { id: 34, name: 'Cloud Nine Spa', mid: '5489-7821-0067', volume: '$20,400', split: '60/40', payout: '$204', status: 'Active', boarded: 'Mar 28, 2026', location: 'Saratoga, CA', contact: 'Lynn Wang', email: 'lynn@cloudnine.com', phone: '(408) 555-0134', industry: 'Wellness', avgTicket: '$120.00' },
]

export default function PartnerMerchants() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const selected = merchants.find(m => m.id === selectedId)

  const filtered = merchants.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.mid.includes(searchTerm)
  )

  if (selected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <button onClick={() => setSelectedId(null)} style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          fontSize: 13, fontWeight: 600, color: '#10B981', cursor: 'pointer', padding: 0,
        }}>
          <ChevronLeft size={16} /> Back to Merchants
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Store size={22} color="white" strokeWidth={1.8} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{selected.name}</h2>
            <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>MID: {selected.mid} | {selected.industry}</p>
          </div>
          <StatusBadge variant="emerald" dot size="md">{selected.status}</StatusBadge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <KpiCard label="Monthly Volume" value={selected.volume} icon={CreditCard} color="emerald" />
          <KpiCard label="Residual Split" value={selected.split} icon={DollarSign} color="blue" />
          <KpiCard label="Monthly Payout" value={selected.payout} icon={TrendingUp} color="teal" />
          <KpiCard label="Avg Ticket" value={selected.avgTicket} icon={DollarSign} color="purple" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card>
            <CardHeader title="Contact Information" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              <InfoRow icon={Store} label="Contact" value={selected.contact} />
              <InfoRow icon={Mail} label="Email" value={selected.email} />
              <InfoRow icon={Phone} label="Phone" value={selected.phone} />
              <InfoRow icon={MapPin} label="Location" value={selected.location} />
            </div>
          </Card>
          <Card>
            <CardHeader title="Account Details" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
              <InfoRow icon={CreditCard} label="MID" value={selected.mid} />
              <InfoRow icon={Calendar} label="Boarded" value={selected.boarded} />
              <InfoRow icon={Store} label="Industry" value={selected.industry} />
              <InfoRow icon={DollarSign} label="Split" value={selected.split} />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const cols: Column<Merchant>[] = [
    { key: 'name', header: 'Merchant', render: (r) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7, background: '#F0FDF4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Store size={13} color="#10B981" strokeWidth={2} />
        </div>
        <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span>
      </div>
    )},
    { key: 'mid', header: 'MID', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.mid}</span> },
    { key: 'volume', header: 'Volume', render: (r) => <span style={{ fontWeight: 600 }}>{r.volume}</span> },
    { key: 'split', header: 'Split', render: (r) => <StatusBadge variant="blue">{r.split}</StatusBadge> },
    { key: 'payout', header: 'Payout', render: (r) => <span style={{ fontWeight: 600, color: '#059669' }}>{r.payout}</span> },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald" dot>{r.status}</StatusBadge> },
    { key: 'boarded', header: 'Boarded', render: (r) => <span style={{ fontSize: 11, color: '#64748B' }}>{r.boarded}</span> },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.3px' }}>My Merchants</h2>
          <p style={{ fontSize: 12, color: '#94A3B8', margin: '4px 0 0' }}>{merchants.length} active merchants</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 9 }} />
          <input
            placeholder="Search merchants..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 8px 8px 32px', border: '1px solid #E5E7EB',
              borderRadius: 8, fontSize: 12, outline: 'none', background: 'white', width: 240,
            }}
          />
        </div>
      </div>

      <Card noPadding>
        <DataTable columns={cols} data={filtered} onRowClick={(r) => setSelectedId(r.id)} />
      </Card>
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
