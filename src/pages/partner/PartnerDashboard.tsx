import {
  Store, DollarSign, TrendingUp, Percent, CreditCard, Calendar,
  ArrowUpRight, ChevronRight, Clock, CheckCircle2, FileText,
  ArrowDownRight, UserPlus, Zap,
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, StatusBadge, KpiCard, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

const residualTrend = [
  { month: 'Nov', amount: 2810 }, { month: 'Dec', amount: 3120 },
  { month: 'Jan', amount: 3480 }, { month: 'Feb', amount: 3785 },
  { month: 'Mar', amount: 3985 }, { month: 'Apr', amount: 4218 },
]

const pipelineStages = [
  { stage: 'Live', count: 6, color: '#10B981' },
  { stage: 'Boarding', count: 3, color: '#3B82F6' },
  { stage: 'Application', count: 5, color: '#8B5CF6' },
  { stage: 'Proposal', count: 8, color: '#F59E0B' },
  { stage: 'Lead', count: 12, color: '#94A3B8' },
]

const funnelData = [
  { stage: 'Lead', count: 50, pct: '100%' },
  { stage: 'Proposal', count: 32, pct: '64%' },
  { stage: 'Application', count: 22, pct: '44%' },
  { stage: 'Boarding', count: 16, pct: '32%' },
  { stage: 'Live', count: 14, pct: '28%' },
]

const funnelColors = ['#94A3B8', '#F59E0B', '#3B82F6', '#6366F1', '#10B981']

const activityItems = [
  { text: 'Mountain View Deli moved to Boarding stage', time: '2 hours ago', icon: ArrowUpRight, iconBg: '#F0FDF4', iconColor: '#10B981' },
  { text: 'Residual payment of $3,985 deposited', time: '1 day ago', icon: DollarSign, iconBg: '#ECFDF5', iconColor: '#059669' },
  { text: 'New lead submitted: Fresh Bakes Co.', time: '2 days ago', icon: UserPlus, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  { text: 'Sunset Grill application approved', time: '3 days ago', icon: CheckCircle2, iconBg: '#F0FDF4', iconColor: '#10B981' },
  { text: 'Monthly partner report available', time: '5 days ago', icon: FileText, iconBg: '#F5F3FF', iconColor: '#7C3AED' },
]

const notifications = [
  { text: 'Sunset Grill application approved', time: '3h ago', type: 'success' as const, icon: CheckCircle2 },
  { text: 'Residual of $3,985 deposited to account', time: '1 day ago', type: 'success' as const, icon: DollarSign },
  { text: 'Bay Area HVAC requires additional documentation', time: '2 days ago', type: 'warning' as const, icon: FileText },
  { text: 'New training module available: Advanced Pricing', time: '3 days ago', type: 'info' as const, icon: Zap },
]

const notifColors = {
  success: { bg: '#F0FDF4', icon: '#10B981', dot: '#10B981' },
  warning: { bg: '#FFFBEB', icon: '#F59E0B', dot: '#F59E0B' },
  info: { bg: '#EFF6FF', icon: '#3B82F6', dot: '#3B82F6' },
}

type MerchantRow = { name: string; volume: string; residual: string; status: string }
const topMerchants: MerchantRow[] = [
  { name: 'Coastal Cafe', volume: '$28,400', residual: '$284', status: 'Active' },
  { name: 'Metro Fitness', volume: '$24,100', residual: '$241', status: 'Active' },
  { name: 'Urban Bites', volume: '$21,800', residual: '$218', status: 'Active' },
  { name: 'Summit Auto', volume: '$19,500', residual: '$195', status: 'Active' },
  { name: 'Harbor Books', volume: '$16,200', residual: '$162', status: 'Active' },
]
const merchantCols: Column<MerchantRow>[] = [
  { key: 'name', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
  { key: 'volume', header: 'Monthly Volume', render: (r) => <span style={{ fontWeight: 600 }}>{r.volume}</span> },
  { key: 'residual', header: 'Residual', render: (r) => <span style={{ fontWeight: 600, color: '#059669' }}>{r.residual}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant="emerald" dot>{r.status}</StatusBadge> },
]

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

export default function PartnerDashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI Row */}
      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        <KpiCard label="Active Merchants" value="34" icon={Store} color="emerald" trend="+3" trendDirection="up" trendPositive sub="this quarter" />
        <KpiCard label="Monthly Residuals" value="$4,218" icon={DollarSign} color="teal" trend="+5.8%" trendDirection="up" trendPositive sub="vs last month" />
        <KpiCard label="Pipeline Value" value="$125K/mo" icon={TrendingUp} color="blue" trend="+12%" trendDirection="up" trendPositive sub="est. volume" />
        <KpiCard label="Conversion Rate" value="28%" icon={Percent} color="purple" trend="+2.1%" trendDirection="up" trendPositive sub="lead to live" />
        <KpiCard label="Avg Merchant Volume" value="$18.2K" icon={CreditCard} color="indigo" trend="+4.3%" trendDirection="up" trendPositive sub="per merchant" />
        <KpiCard label="YTD Earnings" value="$38,420" icon={Calendar} color="amber" trend="+22%" trendDirection="up" trendPositive sub="vs last year" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardHeader title="Residual Trend" subtitle="Last 6 months" />
          <div style={{ height: 240, padding: '0 8px 8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={residualTrend}>
                <defs>
                  <linearGradient id="residualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `$${(v / 1000).toFixed(1)}K`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, 'Residuals']} />
                <Area type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} fill="url(#residualGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader title="Pipeline by Stage" subtitle="34 total leads" />
          <div style={{ height: 240, padding: '0 8px 8px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineStages} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [v, 'Leads']} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} fill="#10B981">
                  {pipelineStages.map((entry, index) => (
                    <rect key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Conversion Funnel + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Conversion Funnel */}
        <Card>
          <CardHeader title="Conversion Funnel" subtitle="All-time lead-to-live conversion" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 8 }}>
            {funnelData.map((item, i) => {
              const widthPct = (item.count / funnelData[0].count) * 100
              const dropOff = i > 0 ? Math.round(((funnelData[i - 1].count - item.count) / funnelData[i - 1].count) * 100) : 0
              return (
                <div key={item.stage}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', width: 80 }}>{item.stage}</span>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <div style={{
                        width: `${widthPct}%`, height: 26, borderRadius: 6,
                        background: funnelColors[i],
                        display: 'flex', alignItems: 'center', paddingLeft: 10,
                        transition: 'width 0.5s ease',
                        minWidth: 60,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{item.count}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A', width: 36, textAlign: 'right' }}>{item.pct}</span>
                    {i > 0 && (
                      <span style={{ fontSize: 10, color: '#E11D48', fontWeight: 600, width: 40, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ArrowDownRight size={10} /> {dropOff}%
                      </span>
                    )}
                    {i === 0 && <span style={{ width: 40 }} />}
                  </div>
                  {i < funnelData.length - 1 && (
                    <div style={{ height: 6 }} />
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader title="Recent Notifications" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {notifications.map((n, i) => {
              const colors = notifColors[n.type]
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                  borderBottom: i < notifications.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <n.icon size={14} color={colors.icon} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} /> {n.time}
                    </div>
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: colors.dot, flexShrink: 0 }} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Activity Feed */}
        <Card>
          <CardHeader title="Recent Activity" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {activityItems.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                borderBottom: i < activityItems.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: item.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <item.icon size={14} color={item.iconColor} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', lineHeight: 1.4 }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> {item.time}
                  </div>
                </div>
                <ChevronRight size={14} color="#CBD5E1" />
              </div>
            ))}
          </div>
        </Card>

        {/* Top Merchants */}
        <Card noPadding>
          <div style={{ padding: '16px 16px 0' }}>
            <CardHeader title="Top Performing Merchants" subtitle="By monthly volume" />
          </div>
          <DataTable columns={merchantCols} data={topMerchants} compact />
        </Card>
      </div>
    </div>
  )
}
