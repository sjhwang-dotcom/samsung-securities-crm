import { Card, CardHeader, StatusBadge, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import { Star, TrendingUp, Gift, Award } from 'lucide-react'

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
  { date: 'Mar 14, 2026', description: 'Card processing - $2,013.90', type: 'Earned', points: '+20' },
  { date: 'Mar 13, 2026', description: 'Card processing - $1,795.50', type: 'Earned', points: '+18' },
  { date: 'Mar 13, 2026', description: 'Payroll run completed', type: 'Earned', points: '+200' },
  { date: 'Mar 12, 2026', description: 'Card processing - $1,496.80', type: 'Earned', points: '+15' },
  { date: 'Mar 10, 2026', description: 'Statement credit - $50', type: 'Redeemed', points: '-5,000' },
  { date: 'Mar 1, 2026', description: 'On-time payback bonus', type: 'Earned', points: '+500' },
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

export default function Rewards() {
  return (
    <div className="dashboard-grid">
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Points Balance', value: '12,450', sub: 'Available to redeem' },
          { label: 'Earned This Month', value: '2,847', sub: '+12% vs last month' },
          { label: 'Lifetime Points', value: '34,220', sub: 'Since account opened' },
          { label: 'Redemptions', value: '3', sub: '$150 total value' },
        ].map(k => (
          <div key={k.label} className="kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 20 }}>{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Points Balance Visual */}
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
              <span>Next reward at 15,000 pts (Rate Reduction)</span>
              <span>25,000 pts</span>
            </div>
          </div>
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
