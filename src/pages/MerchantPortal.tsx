import { useNavigate } from 'react-router-dom'
import {
  DollarSign, TrendingUp, ChevronRight, Download,
  CheckCircle, Landmark, AlertTriangle, FileText, Monitor, ShieldCheck,
  CreditCard, Percent, ArrowUpRight, Gift, Calculator, Users, Heart, Bitcoin,
  Building, Shield, Clock, Zap, Star, Bell, ArrowRight,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'

const dailySalesData = [
  { day: 'Mon', sales: 4210 }, { day: 'Tue', sales: 3890 }, { day: 'Wed', sales: 4520 },
  { day: 'Thu', sales: 3150 }, { day: 'Fri', sales: 5340 }, { day: 'Sat', sales: 6120 }, { day: 'Sun', sales: 2980 },
]
const cardBrandData = [
  { name: 'Visa', value: 52, color: '#1A1F71' },
  { name: 'Mastercard', value: 28, color: '#EB001B' },
  { name: 'Amex', value: 14, color: '#006FCF' },
  { name: 'Discover', value: 6, color: '#FF6600' },
]
const monthlyTrend = [
  { month: 'Oct', volume: 38200 }, { month: 'Nov', volume: 41100 }, { month: 'Dec', volume: 44800 },
  { month: 'Jan', volume: 43500 }, { month: 'Feb', volume: 45100 }, { month: 'Mar', volume: 47230 },
]
const hourlyData = [
  { hour: '8am', txns: 12 }, { hour: '9am', txns: 28 }, { hour: '10am', txns: 34 }, { hour: '11am', txns: 52 },
  { hour: '12pm', txns: 78 }, { hour: '1pm', txns: 65 }, { hour: '2pm', txns: 42 }, { hour: '3pm', txns: 38 },
  { hour: '4pm', txns: 29 }, { hour: '5pm', txns: 55 }, { hour: '6pm', txns: 72 }, { hour: '7pm', txns: 68 },
  { hour: '8pm', txns: 45 }, { hour: '9pm', txns: 22 },
]
const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

type DepositRow = { date: string; settled: string; txns: number; amount: string }
type TxRow = { time: string; card: string; type: string; amount: string; status: string }

const productCards = [
  { name: 'Business Funding', desc: 'Pre-approved up to $25,000', icon: DollarSign, color: '#1578F7', status: 'Pre-Approved', tab: 'funding', detail: 'Balance: $3,167.40 remaining' },
  { name: 'Business Checking', desc: 'Earn 1.5% APY on deposits', icon: Building, color: '#10B981', status: 'Active', tab: 'checking', detail: 'Balance: $14,847.32' },
  { name: 'Rewards Program', desc: '12,450 points available', icon: Gift, color: '#8B5CF6', status: 'Active', tab: 'rewards', detail: 'Earned 2,847 pts this month' },
  { name: 'Payroll', desc: 'Automated payroll for 4 employees', icon: Users, color: '#0891B2', status: 'Active', tab: 'payroll', detail: 'Next run: Mar 28' },
  { name: 'Accounting', desc: 'Auto-sync with QuickBooks', icon: Calculator, color: '#F59E0B', status: 'Available', tab: 'accounting', detail: 'Simplify tax season' },
  { name: 'Health Insurance', desc: 'Small business group plans', icon: Heart, color: '#F43F5E', status: 'Available', tab: 'insurance', detail: 'Plans from $320/employee/mo' },
  { name: 'Business Insurance', desc: 'Liability & property coverage', icon: Shield, color: '#6366F1', status: 'Available', tab: 'biz-insurance', detail: 'From $47/mo' },
  { name: 'Crypto Payments', desc: 'Accept Bitcoin & stablecoins', icon: Bitcoin, color: '#F97316', status: 'Available', tab: 'crypto', detail: '1% flat processing fee' },
]

export default function MerchantPortal() {
  const navigate = useNavigate()

  const deposits: DepositRow[] = [
    { date: 'Mar 14', settled: 'Same-day', txns: 134, amount: '$2,013.90' },
    { date: 'Mar 13', settled: 'Same-day', txns: 121, amount: '$1,795.50' },
    { date: 'Mar 12', settled: 'Same-day', txns: 98, amount: '$1,496.80' },
    { date: 'Mar 11', settled: 'Same-day', txns: 142, amount: '$2,155.80' },
    { date: 'Mar 10', settled: 'Same-day', txns: 116, amount: '$1,887.30' },
  ]
  const depCols: Column<DepositRow>[] = [
    { key: 'date', header: 'Date' },
    { key: 'settled', header: 'Settlement', render: (r) => <StatusBadge variant="emerald">{r.settled}</StatusBadge> },
    { key: 'txns', header: 'Txns' },
    { key: 'amount', header: 'Amount', render: (r) => <span style={{ fontWeight: 700, color: '#0F172A' }}>{r.amount}</span> },
  ]

  const recentTxns: TxRow[] = [
    { time: '3:42 PM', card: 'Visa ****4821', type: 'Sale', amount: '$47.80', status: 'Approved' },
    { time: '3:38 PM', card: 'MC ****9012', type: 'Sale', amount: '$32.50', status: 'Approved' },
    { time: '3:31 PM', card: 'Amex ****3344', type: 'Sale', amount: '$89.00', status: 'Approved' },
    { time: '3:24 PM', card: 'Visa ****7710', type: 'Refund', amount: '-$15.00', status: 'Completed' },
    { time: '3:18 PM', card: 'Discover ****6655', type: 'Sale', amount: '$24.75', status: 'Approved' },
  ]
  const txCols: Column<TxRow>[] = [
    { key: 'time', header: 'Time', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.time}</span> },
    { key: 'card', header: 'Card', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.card}</span> },
    { key: 'type', header: 'Type', render: (r) => {
      const variant = r.type === 'Sale' ? 'emerald' : 'amber'
      return <StatusBadge variant={variant}>{r.type}</StatusBadge>
    }},
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => (
      <span style={{ fontWeight: 600, color: r.amount.startsWith('-') ? '#EF4444' : '#059669' }}>{r.amount}</span>
    )},
    { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="blue">{r.status}</StatusBadge> },
  ]

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
          Mario's Italian Kitchen &middot; MID 4400-1892-7731 &middot; MCC 5812
        </div>
        <StatusBadge variant="live" dot pulse>Active</StatusBadge>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {[
          { label: 'This Month', value: '$47,230', sub: '\u25B2 8.2% vs Feb', subColor: '#059669', icon: TrendingUp, color: '#1578F7' },
          { label: 'Last Deposit', value: '$2,013.90', sub: 'Today \u00B7 Chase ****8834', subColor: '#94A3B8', icon: Landmark, color: '#3B82F6' },
          { label: 'Transactions', value: '1,342', sub: '134 today', subColor: '#94A3B8', icon: CreditCard, color: '#4F46E5' },
          { label: 'Avg Ticket', value: '$35.19', sub: '\u25B2 $1.20 vs Feb', subColor: '#059669', icon: ArrowUpRight, color: '#0891B2' },
          { label: 'Chargebacks', value: '1', sub: '$487.50 \u00B7 Due Mar 26', subColor: '#EF4444', icon: AlertTriangle, color: '#EF4444' },
          { label: 'Effective Rate', value: '2.69%', sub: 'Interchange Plus', subColor: '#94A3B8', icon: Percent, color: '#10B981' },
        ].map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${kpi.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={12} color={kpi.color} strokeWidth={2} />
              </div>
              <div className="kpi-label" style={{ margin: 0 }}>{kpi.label}</div>
            </div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{kpi.value}</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: kpi.subColor, marginTop: 2 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Funding Offer */}
      <div style={{ background: 'linear-gradient(135deg, #121212, #1578F7)', borderRadius: 10, padding: '16px 22px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>You're pre-approved for up to $25,000</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 3, fontWeight: 500 }}>Based on your processing volume &middot; Funds in 24-48 hours &middot; Rate as low as 1.15 factor</div>
        </div>
        <button
          onClick={() => navigate('/portal/products?tab=funding')}
          style={{ background: 'white', color: '#121212', fontWeight: 700, padding: '9px 18px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12, flexShrink: 0 }}
        >
          See My Offer
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { icon: ArrowRight, label: 'Send Invoice', color: '#1578F7', bg: '#E8F0FE', to: '/portal/transactions' },
          { icon: Download, label: 'Download Statement', color: '#10B981', bg: '#D1FAE5', to: '/portal/statements' },
          { icon: AlertTriangle, label: 'Respond to CB', color: '#EF4444', bg: '#FEE2E2', to: '/portal/transactions' },
          { icon: Star, label: 'Redeem Points', color: '#8B5CF6', bg: '#EDE9FE', to: '/portal/products?tab=rewards' },
          { icon: Bell, label: 'Manage Alerts', color: '#F59E0B', bg: '#FEF3C7', to: '/portal/support' },
        ].map(action => (
          <button key={action.label} onClick={() => navigate(action.to)} className="harlow-card" style={{ padding: '14px 12px', cursor: 'pointer', border: 'none', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: action.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <action.icon size={16} color={action.color} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Charts Row: Monthly Trend + Hourly Transactions + Card Brands */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Monthly Volume Trend" />
          <div style={{ padding: '0 16px 16px', height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Volume']} />
                <defs>
                  <linearGradient id="mpVolGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1578F7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1578F7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="volume" stroke="#1578F7" fill="url(#mpVolGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Today's Transaction Flow" />
          <div style={{ padding: '0 16px 16px', height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} txns`, 'Transactions']} />
                <defs>
                  <linearGradient id="mpHourGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="txns" stroke="#10B981" fill="url(#mpHourGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Card Brand Mix" />
          <div style={{ padding: '0 16px 12px' }}>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={cardBrandData} innerRadius={32} outerRadius={48} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {cardBrandData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
              {cardBrandData.map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#64748B', fontWeight: 500 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: b.color }} />{b.name} {b.value}%
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Sales Bar + Live Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Daily Sales — This Week" />
          <div style={{ padding: '0 16px 16px', height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(1)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#1578F7" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Recent Transactions" badge={<StatusBadge variant="live" dot pulse>Live</StatusBadge>} action={<button className="card-view-all" onClick={() => navigate('/portal/transactions')}>See all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>} />
          <DataTable columns={txCols} data={recentTxns} hoverable compact />
        </Card>
      </div>

      {/* Products & Services */}
      <Card noPadding>
        <CardHeader
          title="Your Products & Services"
          subtitle={`${productCards.filter(p => p.status === 'Active' || p.status === 'Pre-Approved').length} active · ${productCards.filter(p => p.status === 'Available').length} available`}
          action={<button className="card-view-all" onClick={() => navigate('/portal/products')}>Manage all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>}
        />
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {productCards.map(p => {
              const statusBg = p.status === 'Active' ? '#D1FAE5' : p.status === 'Pre-Approved' ? '#E8F0FE' : '#F1F5F9'
              const statusFg = p.status === 'Active' ? '#059669' : p.status === 'Pre-Approved' ? '#1578F7' : '#94A3B8'
              return (
                <div
                  key={p.name}
                  className="harlow-card"
                  style={{ padding: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 8 }}
                  onClick={() => navigate(`/portal/products?tab=${p.tab}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${p.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <p.icon size={15} color={p.color} strokeWidth={2} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{p.name}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 1 }}>{p.desc}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: '#64748B', fontWeight: 500 }}>{p.detail}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: statusBg, color: statusFg }}>
                      {p.status}
                    </span>
                    <ChevronRight size={12} color="#CBD5E1" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Activity + Sidebar Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Recent Activity" />
          <div style={{ padding: '0 16px 16px' }}>
            <div className="activity-feed">
              {[
                { icon: Landmark, color: '#10B981', text: 'Deposit: $2,013.90', detail: 'Settlement \u2192 Chase ****8834', time: 'Today' },
                { icon: Landmark, color: '#10B981', text: 'Deposit: $1,795.50', detail: 'Settlement \u2192 Chase ****8834', time: 'Yesterday' },
                { icon: AlertTriangle, color: '#EF4444', text: 'Chargeback: $487.50', detail: 'Visa ****4821 \u00B7 Merchandise Not Received', time: 'Mar 12' },
                { icon: Users, color: '#0891B2', text: 'Payroll Processed', detail: '4 employees \u00B7 $5,307.06 total', time: 'Mar 13' },
                { icon: FileText, color: '#3B82F6', text: 'Statement Ready', detail: 'February 2026 available for download', time: 'Mar 5' },
                { icon: DollarSign, color: '#1578F7', text: 'Funding Repayment', detail: '$95.83/day \u00B7 Balance: $3,167.40', time: 'Daily' },
                { icon: Gift, color: '#8B5CF6', text: 'Rewards: +200 pts', detail: 'Payroll run bonus credited', time: 'Mar 13' },
                { icon: ShieldCheck, color: '#059669', text: 'PCI Scan Passed', detail: 'Quarterly vulnerability scan \u00B7 No issues', time: 'Mar 1' },
              ].map((item, i) => (
                <div key={i} className="activity-item" style={{ gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${item.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <item.icon size={12} color={item.color} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.text}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>{item.detail}</div>
                  </div>
                  <span className="activity-time">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="dashboard-grid" style={{ gap: 10 }}>
          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <ShieldCheck size={14} color="#10B981" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>PCI Compliance</span>
              </div>
              <StatusBadge variant="emerald" size="md">Compliant</StatusBadge>
              <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 6, fontWeight: 500 }}>Valid through Dec 2026<br />SAQ-A &middot; DSS Level 1</div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Monitor size={14} color="#3B82F6" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Equipment</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>PAX A920</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>Serial: A920-7821-0034<br />Firmware v4.2.1 &middot; Online</div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <CheckCircle size={14} color="#059669" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Approval Rate</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>98.7%</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>\u25B2 0.3% vs last month</div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Gift size={14} color="#8B5CF6" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Rewards Points</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#8B5CF6' }}>12,450</div>
              <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500, marginTop: 2 }}>+2,847 this month</div>
            </div>
          </Card>
          <Card>
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Clock size={14} color="#F59E0B" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Upcoming</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, color: '#0F172A' }}><span style={{ fontWeight: 600 }}>Mar 26</span> — CB Response Due</div>
                <div style={{ fontSize: 11, color: '#0F172A' }}><span style={{ fontWeight: 600 }}>Mar 28</span> — Next Payroll</div>
                <div style={{ fontSize: 11, color: '#0F172A' }}><span style={{ fontWeight: 600 }}>Apr 15</span> — Q1 Tax Filing</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Deposits + Statements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card noPadding>
          <CardHeader title="Recent Deposits" action={<button className="card-view-all" onClick={() => navigate('/portal/deposits')}>See all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>} />
          <DataTable columns={depCols} data={deposits} hoverable compact />
        </Card>
        <Card noPadding>
          <CardHeader title="Statements" action={<button className="card-view-all" onClick={() => navigate('/portal/statements')}>See all <ChevronRight size={12} style={{ verticalAlign: 'middle' }} /></button>} />
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['February 2026', 'January 2026', 'December 2025'].map(mo => (
              <div key={mo} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={14} color="#3B82F6" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{mo}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>PDF</div>
                </div>
                <Download size={12} color="#94A3B8" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Business Insights */}
      <Card noPadding>
        <CardHeader title="Business Insights" subtitle="Powered by Lumina AI" badge={<StatusBadge variant="indigo"><Zap size={10} style={{ marginRight: 3 }} />AI</StatusBadge>} />
        <div style={{ padding: '0 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { title: 'Peak Hours Shifting', body: 'Your dinner rush is starting 30 min earlier this month (5:00 PM vs 5:30 PM). Consider staffing adjustments.', color: '#1578F7' },
            { title: 'Weekend Growth', body: 'Saturday sales are up 14% month-over-month. Your weekend specials campaign appears to be working.', color: '#10B981' },
            { title: 'Chargeback Alert', body: 'You have 1 open chargeback due Mar 26. Respond soon to avoid auto-debit. Evidence upload recommended.', color: '#EF4444' },
          ].map(insight => (
            <div key={insight.title} style={{ padding: 14, background: '#F8FAFC', borderRadius: 10, borderLeft: `3px solid ${insight.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{insight.title}</div>
              <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.6 }}>{insight.body}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
