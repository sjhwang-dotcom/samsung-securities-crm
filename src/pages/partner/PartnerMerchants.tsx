import { useState } from 'react'
import {
  Store, Search, MapPin, Calendar, DollarSign,
  CreditCard, TrendingUp, Phone, Mail,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, StatusBadge, KpiCard } from '../../components/ui'

interface Merchant {
  id: number
  name: string
  mid: string
  volume: string
  split: string
  payout: string
  status: 'Active' | 'Boarding' | 'At Risk'
  boarded: string
  location: string
  contact: string
  email: string
  phone: string
  industry: string
  avgTicket: string
  mcc: string
  processor: string
  volumeTrend: { month: string; volume: number }[]
  recentPayouts: { month: string; amount: string; status: string }[]
}

const makeTrend = (base: number): { month: string; volume: number }[] => [
  { month: 'Nov', volume: Math.round(base * 0.88) },
  { month: 'Dec', volume: Math.round(base * 0.92) },
  { month: 'Jan', volume: Math.round(base * 0.95) },
  { month: 'Feb', volume: Math.round(base * 0.97) },
  { month: 'Mar', volume: Math.round(base * 1.0) },
  { month: 'Apr', volume: Math.round(base * 1.03) },
]

const makePayouts = (payout: number): { month: string; amount: string; status: string }[] => [
  { month: 'April 2026', amount: `$${Math.round(payout * 1.03)}`, status: 'Pending' },
  { month: 'March 2026', amount: `$${payout}`, status: 'Paid' },
  { month: 'February 2026', amount: `$${Math.round(payout * 0.97)}`, status: 'Paid' },
]

const merchants: Merchant[] = [
  { id: 1, name: 'Coastal Cafe', mid: '5489-7821-0034', volume: '$28,400', split: '60/40', payout: '$284', status: 'Active', boarded: 'Jan 15, 2025', location: 'San Francisco, CA', contact: 'Anna Bell', email: 'anna@coastalcafe.com', phone: '(415) 555-0101', industry: 'Restaurant', avgTicket: '$18.50', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(28400), recentPayouts: makePayouts(284) },
  { id: 2, name: 'Metro Fitness', mid: '5489-7821-0035', volume: '$24,100', split: '60/40', payout: '$241', status: 'Active', boarded: 'Feb 3, 2025', location: 'Oakland, CA', contact: 'James Park', email: 'james@metrofit.com', phone: '(510) 555-0102', industry: 'Fitness', avgTicket: '$45.00', mcc: '7941', processor: 'First Data', volumeTrend: makeTrend(24100), recentPayouts: makePayouts(241) },
  { id: 3, name: 'Urban Bites', mid: '5489-7821-0036', volume: '$21,800', split: '50/50', payout: '$218', status: 'Active', boarded: 'Feb 20, 2025', location: 'San Jose, CA', contact: 'Carlos Ruiz', email: 'carlos@urbanbites.com', phone: '(408) 555-0103', industry: 'Restaurant', avgTicket: '$22.75', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(21800), recentPayouts: makePayouts(218) },
  { id: 4, name: 'Summit Auto', mid: '5489-7821-0037', volume: '$19,500', split: '60/40', payout: '$195', status: 'Active', boarded: 'Mar 8, 2025', location: 'Fremont, CA', contact: 'Dave Long', email: 'dave@summitauto.com', phone: '(510) 555-0104', industry: 'Auto Services', avgTicket: '$125.00', mcc: '7538', processor: 'First Data', volumeTrend: makeTrend(19500), recentPayouts: makePayouts(195) },
  { id: 5, name: 'Harbor Books', mid: '5489-7821-0038', volume: '$16,200', split: '50/50', payout: '$162', status: 'Active', boarded: 'Mar 22, 2025', location: 'Half Moon Bay, CA', contact: 'Lisa Ng', email: 'lisa@harborbooks.com', phone: '(650) 555-0105', industry: 'Retail', avgTicket: '$32.40', mcc: '5942', processor: 'TSYS', volumeTrend: makeTrend(16200), recentPayouts: makePayouts(162) },
  { id: 6, name: 'Nob Hill Bistro', mid: '5489-7821-0039', volume: '$28,000', split: '60/40', payout: '$280', status: 'Active', boarded: 'Jan 20, 2025', location: 'San Francisco, CA', contact: 'Chef Andre', email: 'andre@nobhillbistro.com', phone: '(415) 555-0106', industry: 'Restaurant', avgTicket: '$68.00', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(28000), recentPayouts: makePayouts(280) },
  { id: 7, name: 'Craft Coffee Roasters', mid: '5489-7821-0040', volume: '$16,000', split: '50/50', payout: '$160', status: 'Active', boarded: 'Feb 28, 2025', location: 'San Francisco, CA', contact: 'Emily Stone', email: 'emily@craftcoffee.com', phone: '(415) 555-0107', industry: 'Restaurant', avgTicket: '$8.50', mcc: '5814', processor: 'TSYS', volumeTrend: makeTrend(16000), recentPayouts: makePayouts(160) },
  { id: 8, name: 'Harbor Seafood', mid: '5489-7821-0041', volume: '$32,000', split: '60/40', payout: '$320', status: 'Active', boarded: 'Feb 15, 2025', location: 'Half Moon Bay, CA', contact: 'Rick Torres', email: 'rick@harborseafood.com', phone: '(650) 555-0108', industry: 'Restaurant', avgTicket: '$52.00', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(32000), recentPayouts: makePayouts(320) },
  { id: 9, name: 'Bay Dental Group', mid: '5489-7821-0042', volume: '$44,000', split: '60/40', payout: '$440', status: 'Active', boarded: 'Apr 5, 2025', location: 'Palo Alto, CA', contact: 'Dr. Kim', email: 'kim@baydental.com', phone: '(650) 555-0109', industry: 'Healthcare', avgTicket: '$285.00', mcc: '8021', processor: 'First Data', volumeTrend: makeTrend(44000), recentPayouts: makePayouts(440) },
  { id: 10, name: 'Valley Hardware', mid: '5489-7821-0043', volume: '$14,200', split: '50/50', payout: '$142', status: 'At Risk', boarded: 'Apr 18, 2025', location: 'Campbell, CA', contact: 'Bob Miller', email: 'bob@valleyhw.com', phone: '(408) 555-0110', industry: 'Retail', avgTicket: '$42.80', mcc: '5251', processor: 'TSYS', volumeTrend: makeTrend(14200), recentPayouts: makePayouts(142) },
  { id: 11, name: 'Pacific Cleaners', mid: '5489-7821-0044', volume: '$9,800', split: '50/50', payout: '$98', status: 'Active', boarded: 'May 10, 2025', location: 'Cupertino, CA', contact: 'Mei Chen', email: 'mei@pacclean.com', phone: '(408) 555-0111', industry: 'Services', avgTicket: '$18.00', mcc: '7210', processor: 'TSYS', volumeTrend: makeTrend(9800), recentPayouts: makePayouts(98) },
  { id: 12, name: 'Sunset Spa', mid: '5489-7821-0045', volume: '$18,500', split: '60/40', payout: '$185', status: 'Active', boarded: 'May 25, 2025', location: 'San Mateo, CA', contact: 'Tina Park', email: 'tina@sunsetspa.com', phone: '(650) 555-0112', industry: 'Wellness', avgTicket: '$95.00', mcc: '7298', processor: 'First Data', volumeTrend: makeTrend(18500), recentPayouts: makePayouts(185) },
  { id: 13, name: 'Quick Lube Express', mid: '5489-7821-0046', volume: '$12,400', split: '50/50', payout: '$124', status: 'Active', boarded: 'Jun 8, 2025', location: 'Milpitas, CA', contact: 'Joe Adams', email: 'joe@quicklube.com', phone: '(408) 555-0113', industry: 'Auto Services', avgTicket: '$65.00', mcc: '7538', processor: 'TSYS', volumeTrend: makeTrend(12400), recentPayouts: makePayouts(124) },
  { id: 14, name: 'Green Thumb Garden', mid: '5489-7821-0047', volume: '$8,600', split: '50/50', payout: '$86', status: 'Active', boarded: 'Jun 22, 2025', location: 'Los Gatos, CA', contact: 'Nancy Lee', email: 'nancy@greenthumb.com', phone: '(408) 555-0114', industry: 'Retail', avgTicket: '$38.50', mcc: '5261', processor: 'TSYS', volumeTrend: makeTrend(8600), recentPayouts: makePayouts(86) },
  { id: 15, name: 'Downtown Diner', mid: '5489-7821-0048', volume: '$15,200', split: '60/40', payout: '$152', status: 'Active', boarded: 'Jul 3, 2025', location: 'San Francisco, CA', contact: 'Pete Wilson', email: 'pete@downtowndiner.com', phone: '(415) 555-0115', industry: 'Restaurant', avgTicket: '$16.20', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(15200), recentPayouts: makePayouts(152) },
  { id: 16, name: 'Bright Smile Dental', mid: '5489-7821-0049', volume: '$38,000', split: '60/40', payout: '$380', status: 'Active', boarded: 'Jul 20, 2025', location: 'Sunnyvale, CA', contact: 'Dr. Patel', email: 'patel@brightsmile.com', phone: '(408) 555-0116', industry: 'Healthcare', avgTicket: '$310.00', mcc: '8021', processor: 'First Data', volumeTrend: makeTrend(38000), recentPayouts: makePayouts(380) },
  { id: 17, name: 'Bay Yoga Center', mid: '5489-7821-0050', volume: '$10,400', split: '50/50', payout: '$104', status: 'Boarding', boarded: 'Aug 5, 2025', location: 'Berkeley, CA', contact: 'Sara Wu', email: 'sara@bayyoga.com', phone: '(510) 555-0117', industry: 'Fitness', avgTicket: '$25.00', mcc: '7941', processor: 'TSYS', volumeTrend: makeTrend(10400), recentPayouts: makePayouts(104) },
  { id: 18, name: 'Redwood Pizza', mid: '5489-7821-0051', volume: '$22,800', split: '60/40', payout: '$228', status: 'Active', boarded: 'Aug 18, 2025', location: 'Redwood City, CA', contact: 'Tony Bianchi', email: 'tony@redwoodpizza.com', phone: '(650) 555-0118', industry: 'Restaurant', avgTicket: '$24.50', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(22800), recentPayouts: makePayouts(228) },
  { id: 19, name: 'Elite Barber Shop', mid: '5489-7821-0052', volume: '$7,200', split: '50/50', payout: '$72', status: 'At Risk', boarded: 'Sep 2, 2025', location: 'San Jose, CA', contact: 'Marcus Brown', email: 'marcus@elitebarber.com', phone: '(408) 555-0119', industry: 'Services', avgTicket: '$35.00', mcc: '7241', processor: 'TSYS', volumeTrend: makeTrend(7200), recentPayouts: makePayouts(72) },
  { id: 20, name: 'Mountain Bikes Plus', mid: '5489-7821-0053', volume: '$13,600', split: '50/50', payout: '$136', status: 'Active', boarded: 'Sep 18, 2025', location: 'Los Altos, CA', contact: 'Chris Hall', email: 'chris@mtbikes.com', phone: '(650) 555-0120', industry: 'Retail', avgTicket: '$185.00', mcc: '5941', processor: 'First Data', volumeTrend: makeTrend(13600), recentPayouts: makePayouts(136) },
  { id: 21, name: 'Fresh Juice Bar', mid: '5489-7821-0054', volume: '$6,800', split: '50/50', payout: '$68', status: 'Active', boarded: 'Oct 1, 2025', location: 'Palo Alto, CA', contact: 'Maya Singh', email: 'maya@freshjuice.com', phone: '(650) 555-0121', industry: 'Restaurant', avgTicket: '$12.00', mcc: '5814', processor: 'TSYS', volumeTrend: makeTrend(6800), recentPayouts: makePayouts(68) },
  { id: 22, name: 'Bay Tech Repair', mid: '5489-7821-0055', volume: '$11,200', split: '50/50', payout: '$112', status: 'Active', boarded: 'Oct 15, 2025', location: 'Santa Clara, CA', contact: 'Alan Cho', email: 'alan@baytechrepair.com', phone: '(408) 555-0122', industry: 'Services', avgTicket: '$95.00', mcc: '7622', processor: 'TSYS', volumeTrend: makeTrend(11200), recentPayouts: makePayouts(112) },
  { id: 23, name: 'Parkside Florist', mid: '5489-7821-0056', volume: '$5,400', split: '50/50', payout: '$54', status: 'Active', boarded: 'Oct 28, 2025', location: 'San Francisco, CA', contact: 'Rose Kim', email: 'rose@parkside.com', phone: '(415) 555-0123', industry: 'Retail', avgTicket: '$48.00', mcc: '5992', processor: 'TSYS', volumeTrend: makeTrend(5400), recentPayouts: makePayouts(54) },
  { id: 24, name: 'Crossfit Bay Area', mid: '5489-7821-0057', volume: '$14,600', split: '60/40', payout: '$146', status: 'Active', boarded: 'Nov 5, 2025', location: 'San Mateo, CA', contact: 'Jake Reed', email: 'jake@crossfitba.com', phone: '(650) 555-0124', industry: 'Fitness', avgTicket: '$150.00', mcc: '7941', processor: 'First Data', volumeTrend: makeTrend(14600), recentPayouts: makePayouts(146) },
  { id: 25, name: 'Lucky Wok', mid: '5489-7821-0058', volume: '$17,800', split: '60/40', payout: '$178', status: 'Active', boarded: 'Nov 20, 2025', location: 'Daly City, CA', contact: 'Henry Lam', email: 'henry@luckywok.com', phone: '(650) 555-0125', industry: 'Restaurant', avgTicket: '$19.50', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(17800), recentPayouts: makePayouts(178) },
  { id: 26, name: 'Pet Paradise', mid: '5489-7821-0059', volume: '$9,200', split: '50/50', payout: '$92', status: 'Active', boarded: 'Dec 3, 2025', location: 'Fremont, CA', contact: 'Diana Ross', email: 'diana@petparadise.com', phone: '(510) 555-0126', industry: 'Retail', avgTicket: '$42.00', mcc: '5995', processor: 'TSYS', volumeTrend: makeTrend(9200), recentPayouts: makePayouts(92) },
  { id: 27, name: 'Golden Wok Express', mid: '5489-7821-0060', volume: '$11,600', split: '50/50', payout: '$116', status: 'Active', boarded: 'Dec 15, 2025', location: 'Milpitas, CA', contact: 'Ken Zhao', email: 'ken@goldenwok.com', phone: '(408) 555-0127', industry: 'Restaurant', avgTicket: '$14.80', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(11600), recentPayouts: makePayouts(116) },
  { id: 28, name: 'Bay Plumbing Co', mid: '5489-7821-0061', volume: '$21,000', split: '60/40', payout: '$210', status: 'Active', boarded: 'Jan 8, 2026', location: 'San Jose, CA', contact: 'Bill Thomas', email: 'bill@bayplumbing.com', phone: '(408) 555-0128', industry: 'Services', avgTicket: '$175.00', mcc: '1711', processor: 'First Data', volumeTrend: makeTrend(21000), recentPayouts: makePayouts(210) },
  { id: 29, name: 'Sunrise Bakery', mid: '5489-7821-0062', volume: '$8,400', split: '50/50', payout: '$84', status: 'Active', boarded: 'Jan 22, 2026', location: 'Mountain View, CA', contact: 'Marie Claire', email: 'marie@sunrise.com', phone: '(650) 555-0129', industry: 'Restaurant', avgTicket: '$11.20', mcc: '5462', processor: 'TSYS', volumeTrend: makeTrend(8400), recentPayouts: makePayouts(84) },
  { id: 30, name: 'Ace Auto Detail', mid: '5489-7821-0063', volume: '$13,800', split: '50/50', payout: '$138', status: 'Active', boarded: 'Feb 5, 2026', location: 'Sunnyvale, CA', contact: 'Ray Garcia', email: 'ray@aceauto.com', phone: '(408) 555-0130', industry: 'Auto Services', avgTicket: '$85.00', mcc: '7542', processor: 'TSYS', volumeTrend: makeTrend(13800), recentPayouts: makePayouts(138) },
  { id: 31, name: 'The Wine Cellar', mid: '5489-7821-0064', volume: '$19,200', split: '60/40', payout: '$192', status: 'Active', boarded: 'Feb 18, 2026', location: 'Los Gatos, CA', contact: 'Victor Stein', email: 'victor@winecellar.com', phone: '(408) 555-0131', industry: 'Retail', avgTicket: '$55.00', mcc: '5921', processor: 'TSYS', volumeTrend: makeTrend(19200), recentPayouts: makePayouts(192) },
  { id: 32, name: 'FitLife Studio', mid: '5489-7821-0065', volume: '$11,800', split: '50/50', payout: '$118', status: 'Boarding', boarded: 'Mar 2, 2026', location: 'Palo Alto, CA', contact: 'Kim Lee', email: 'kim@fitlife.com', phone: '(650) 555-0132', industry: 'Fitness', avgTicket: '$30.00', mcc: '7941', processor: 'First Data', volumeTrend: makeTrend(11800), recentPayouts: makePayouts(118) },
  { id: 33, name: 'Taqueria El Sol', mid: '5489-7821-0066', volume: '$14,800', split: '60/40', payout: '$148', status: 'Active', boarded: 'Mar 15, 2026', location: 'San Francisco, CA', contact: 'Miguel Santos', email: 'miguel@elsol.com', phone: '(415) 555-0133', industry: 'Restaurant', avgTicket: '$15.50', mcc: '5812', processor: 'TSYS', volumeTrend: makeTrend(14800), recentPayouts: makePayouts(148) },
  { id: 34, name: 'Cloud Nine Spa', mid: '5489-7821-0067', volume: '$20,400', split: '60/40', payout: '$204', status: 'Active', boarded: 'Mar 28, 2026', location: 'Saratoga, CA', contact: 'Lynn Wang', email: 'lynn@cloudnine.com', phone: '(408) 555-0134', industry: 'Wellness', avgTicket: '$120.00', mcc: '7298', processor: 'First Data', volumeTrend: makeTrend(20400), recentPayouts: makePayouts(204) },
]

const statusVariant: Record<string, 'emerald' | 'amber' | 'rose'> = {
  Active: 'emerald', Boarding: 'amber', 'At Risk': 'rose',
}

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function PartnerMerchants() {
  const [selectedId, setSelectedId] = useState(merchants[0].id)
  const [searchTerm, setSearchTerm] = useState('')
  const selected = merchants.find(m => m.id === selectedId) ?? merchants[0]

  const filtered = merchants.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.mid.includes(searchTerm)
  )

  const activeCt = merchants.filter(m => m.status === 'Active').length
  const boardingCt = merchants.filter(m => m.status === 'Boarding').length
  const atRiskCt = merchants.filter(m => m.status === 'At Risk').length

  return (
    <div style={{ display: 'flex', gap: 0, height: '100%', margin: '-16px -20px', overflow: 'hidden' }}>
      {/* Left Panel - Merchant List */}
      <div style={{
        width: 320, minWidth: 320, background: 'white',
        borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
        height: 'calc(100vh - 96px)',
      }}>
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>Merchants</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>{merchants.length} total</div>
            </div>
          </div>

          {/* Mini KPIs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 8, background: '#F0FDF4', textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#059669' }}>{activeCt}</div>
              <div style={{ fontSize: 9, color: '#6EE7B7', fontWeight: 600, textTransform: 'uppercase' as const }}>Active</div>
            </div>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 8, background: '#FFFBEB', textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#D97706' }}>{boardingCt}</div>
              <div style={{ fontSize: 9, color: '#FCD34D', fontWeight: 600, textTransform: 'uppercase' as const }}>Boarding</div>
            </div>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 8, background: '#FFF1F2', textAlign: 'center',
            }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#E11D48' }}>{atRiskCt}</div>
              <div style={{ fontSize: 9, color: '#FDA4AF', fontWeight: 600, textTransform: 'uppercase' as const }}>At Risk</div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 10, top: 9 }} />
            <input
              placeholder="Search merchants or MID..."
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
          {filtered.map(m => {
            const isActive = selectedId === m.id
            return (
              <div key={m.id} onClick={() => setSelectedId(m.id)} className="sidebar-item"
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
                    <Store size={16} color={isActive ? 'white' : '#94A3B8'} strokeWidth={1.8} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</span>
                      <span style={{
                        width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                        background: m.status === 'Active' ? '#10B981' : m.status === 'Boarding' ? '#F59E0B' : '#E11D48',
                      }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: '#64748B' }}>{m.volume}</span>
                      <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>{m.payout}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Detail */}
      <div style={{ flex: 1, overflowY: 'auto', height: 'calc(100vh - 96px)', padding: '16px 20px' }}>
        <div className="dashboard-grid">
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Store size={22} color="white" strokeWidth={1.8} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>{selected.name}</h2>
              <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>MID: {selected.mid}</p>
            </div>
            <StatusBadge variant={statusVariant[selected.status]} dot size="md">{selected.status}</StatusBadge>
          </div>

          {/* 4 KPIs */}
          <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            <KpiCard label="Monthly Volume" value={selected.volume} icon={CreditCard} color="emerald" />
            <KpiCard label="Residual Split" value={selected.split} icon={DollarSign} color="blue" />
            <KpiCard label="Monthly Payout" value={selected.payout} icon={TrendingUp} color="teal" />
            <KpiCard label="Avg Ticket" value={selected.avgTicket} icon={DollarSign} color="purple" />
          </div>

          {/* Volume Trend Chart */}
          <Card>
            <CardHeader title="Volume Trend" subtitle="Last 6 months" />
            <div style={{ height: 200, padding: '0 8px 8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selected.volumeTrend} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                  <Bar dataKey="volume" radius={[6, 6, 0, 0]} fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Merchant Info + Recent Payouts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <Card>
              <CardHeader title="Merchant Info" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
                <InfoRow icon={Store} label="MCC" value={selected.mcc} />
                <InfoRow icon={CreditCard} label="Processor" value={selected.processor} />
                <InfoRow icon={Calendar} label="Boarded" value={selected.boarded} />
                <InfoRow icon={Mail} label="Email" value={selected.email} />
                <InfoRow icon={Phone} label="Phone" value={selected.phone} />
                <InfoRow icon={MapPin} label="Location" value={selected.location} />
              </div>
            </Card>

            <Card>
              <CardHeader title="Recent Payouts" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
                {selected.recentPayouts.map((p, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: i < selected.recentPayouts.length - 1 ? '1px solid #F1F5F9' : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{p.month}</div>
                      <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                        <StatusBadge variant={p.status === 'Paid' ? 'emerald' : 'amber'} dot>{p.status}</StatusBadge>
                      </div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>{p.amount}</span>
                  </div>
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
