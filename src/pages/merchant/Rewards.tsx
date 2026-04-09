import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { Star, TrendingUp, Gift, Award, Crown, Gem } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

const pointsTrend = [
  { month: 'Nov', earned: 2150, redeemed: 0, balance: 7450 },
  { month: 'Dec', earned: 2840, redeemed: 2500, balance: 7790 },
  { month: 'Jan', earned: 1980, redeemed: 0, balance: 9770 },
  { month: 'Feb', earned: 2320, redeemed: 0, balance: 12090 },
  { month: 'Mar', earned: 2847, redeemed: 5000, balance: 9937 },
  { month: 'Apr', earned: 2513, redeemed: 0, balance: 12450 },
]

type EarningRow = { activity: string; points: string; frequency: string; description: string }

const earningRules: EarningRow[] = [
  { activity: 'Card Processing', points: '1 pt / $100 processed', frequency: 'Daily', description: 'Earn points on every dollar you process through card payments' },
  { activity: 'On-time Funding Payback', points: '500 pts / month', frequency: 'Monthly', description: 'Stay on track with your funding payback to earn bonus points' },
  { activity: 'Payroll Runs', points: '200 pts / run', frequency: 'Per payroll', description: 'Run payroll through Harlow to earn points each cycle' },
  { activity: 'Referral Bonus', points: '5,000 pts', frequency: 'One-time', description: 'Refer another business to Harlow and earn when they sign up' },
  { activity: 'Account Anniversary', points: '2,500 pts', frequency: 'Yearly', description: 'Loyalty bonus on each anniversary of your Harlow account' },
]

const earningCols: Column<EarningRow>[] = [
  { key: 'activity', header: 'Activity', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.activity}</span> },
  { key: 'points', header: 'Points Earned', render: (r) => <span style={{ fontWeight: 600, color: '#1578F7' }}>{r.points}</span> },
  { key: 'frequency', header: 'Frequency', render: (r) => <StatusBadge variant="blue">{r.frequency}</StatusBadge> },
  { key: 'description', header: 'Details', render: (r) => <span style={{ fontSize: 12, color: '#64748B' }}>{r.description}</span> },
]

type ActivityRow = { date: string; description: string; type: string; points: string }

const recentActivity: ActivityRow[] = [
  { date: 'Apr 8, 2026', description: 'Card processing - $2,413.60', type: 'Earned', points: '+24' },
  { date: 'Apr 7, 2026', description: 'Card processing - $1,985.30', type: 'Earned', points: '+20' },
  { date: 'Apr 6, 2026', description: 'Payroll run completed', type: 'Earned', points: '+200' },
  { date: 'Apr 5, 2026', description: 'Card processing - $2,751.20', type: 'Earned', points: '+28' },
  { date: 'Apr 1, 2026', description: 'On-time payback bonus', type: 'Earned', points: '+500' },
  { date: 'Mar 22, 2026', description: 'Statement credit - $50', type: 'Redeemed', points: '-5,000' },
]

const activityCols: Column<ActivityRow>[] = [
  { key: 'date', header: 'Date', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.date}</span> },
  { key: 'description', header: 'Description' },
  { key: 'type', header: 'Type', render: (r) => {
    const variant = r.type === 'Earned' ? 'emerald' : 'purple'
    return <StatusBadge variant={variant}>{r.type}</StatusBadge>
  }},
  { key: 'points', header: 'Points', align: 'right', render: (r) => (
    <span style={{ fontWeight: 700, color: r.points.startsWith('+') ? '#059669' : '#7C3AED' }}>{r.points}</span>
  )},
]

const redemptionOptions = [
  { icon: Star, name: 'Equipment Upgrade', points: '25,000 pts', desc: 'Apply toward a new terminal or POS system', value: '$250 value' },
  { icon: TrendingUp, name: 'Rate Reduction', points: '15,000 pts', desc: 'Get a lower processing rate for 3 months', value: 'Save ~$150' },
  { icon: Gift, name: 'Statement Credit', points: '5,000 pts', desc: 'Get $50 credited to your account', value: '$50 credit' },
  { icon: Award, name: 'Gift Cards', points: '2,500 pts', desc: 'Choose from popular retailers', value: '$25 value' },
]

const tiers = [
  { name: 'Silver', min: '0', max: '9,999', color: '#94A3B8', icon: Award, benefits: ['1x points multiplier', 'Basic rewards access', 'Monthly statements'] },
  { name: 'Gold', min: '10,000', max: '24,999', color: '#EAB308', icon: Crown, benefits: ['1.5x points multiplier', 'Priority support', 'Rate reduction unlock', 'Quarterly bonus'], current: true },
  { name: 'Platinum', min: '25,000+', max: '', color: '#4F46E5', icon: Gem, benefits: ['2x points multiplier', 'Dedicated account manager', 'Exclusive rewards', 'Annual appreciation gift'] },
]

export default function Rewards() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Points Balance', value: '12,450', sub: 'Available to redeem' },
          { label: 'Earned This Month', value: '2,513', sub: '+8% vs last month' },
          { label: 'Lifetime Points', value: '37,220', sub: 'Since account opened' },
          { label: 'Redemptions', value: '4', sub: '$200 total value' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Points Balance + Tier Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Rewards Balance</div>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#1578F7', margin: '8px 0' }}>12,450</div>
            <div style={{ fontSize: 14, color: '#64748B' }}>points available</div>
            <div style={{ marginTop: 16 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '49.8%' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: '#94A3B8' }}>
                <span>0 pts</span>
                <span>Next: Rate Reduction (15,000)</span>
                <span>25,000 pts</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEFCE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={22} color="#EAB308" />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Gold Tier</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>1.5x points multiplier active</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {tiers.map(t => (
                <div key={t.name} style={{ flex: 1, padding: '8px 0', textAlign: 'center', borderRadius: 6, background: t.current ? '#FEFCE8' : '#F8FAFC', border: t.current ? '2px solid #EAB308' : '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.color, textTransform: 'uppercase' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>{t.min}{t.max ? ` - ${t.max}` : ''}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
              Earn <strong>12,550 more points</strong> to reach Platinum tier and unlock 2x multiplier, a dedicated account manager, and exclusive rewards.
            </div>
          </div>
        </Card>
      </div>

      {/* Points Trend Chart */}
      <Card>
        <CardHeader title="Points Trend" subtitle="Monthly earned vs balance over 6 months" />
        <div style={{ padding: '0 20px 20px', height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pointsTrend}>
              <defs>
                <linearGradient id="earnedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1578F7" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1578F7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [v.toLocaleString(), '']} />
              <Area type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={2} fill="url(#balanceGrad)" name="Balance" />
              <Area type="monotone" dataKey="earned" stroke="#1578F7" strokeWidth={2} fill="url(#earnedGrad)" name="Earned" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Redemption Options */}
      <Card>
        <CardHeader title="Redeem Your Points" subtitle="Choose how to use your rewards" />
        <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {redemptionOptions.map(r => {
            const canRedeem = parseInt(r.points.replace(/[^0-9]/g, '')) <= 12450
            return (
              <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: '#F8FAFC', borderRadius: 10, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: canRedeem ? '#F0FDFA' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <r.icon size={22} color={canRedeem ? '#1578F7' : '#94A3B8'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{r.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#1578F7' }}>{r.value}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>{r.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>{r.points}</span>
                    {canRedeem ? (
                      <button style={{ padding: '4px 12px', background: '#1578F7', color: 'white', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 11, cursor: 'pointer' }}>Redeem</button>
                    ) : (
                      <span style={{ fontSize: 11, color: '#94A3B8', fontStyle: 'italic' }}>Need more points</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Earning Rules */}
      <Card noPadding>
        <CardHeader title="How to Earn Points" subtitle="Points are automatically added to your balance" />
        <DataTable columns={earningCols} data={earningRules} hoverable />
      </Card>

      {/* Recent Activity */}
      <Card noPadding>
        <CardHeader title="Recent Activity" subtitle="Points earned and redeemed" />
        <DataTable columns={activityCols} data={recentActivity} hoverable />
      </Card>
    </div>
  )
}
