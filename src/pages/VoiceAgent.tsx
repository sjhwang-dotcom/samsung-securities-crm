import { Zap, Phone, TrendingUp, Users, DollarSign, Clock } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Line, ComposedChart } from 'recharts'
import { KpiCard, Card, CardHeader, ActivityFeed } from '../components/ui'
import { voiceCalls, voiceHourlyData, callOutcomeData } from '../data/mockData'

const statusDot: Record<string, string> = {
  'In Progress': '#10B981',
  'Ringing': '#3B82F6',
  'Transferred': '#1578F7',
  'Completed': '#CBD5E1',
  'No Answer': '#E2E8F0',
}
const statusTextColor: Record<string, string> = {
  'In Progress': '#10B981',
  'Ringing': '#3B82F6',
  'Transferred': '#1578F7',
  'Completed': '#94A3B8',
  'No Answer': '#CBD5E1',
}
const sentimentStyle: Record<string, { color: string; bg: string }> = {
  'Positive': { color: '#059669', bg: '#D1FAE5' },
  'Neutral': { color: '#64748B', bg: '#F1F5F9' },
  'Skeptical': { color: '#D97706', bg: '#FEF3C7' },
}

const tooltipStyle = { borderRadius: 12, fontSize: 12, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.12)' }

export default function VoiceAgent() {
  return (
    <div className="dashboard-grid">
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <KpiCard icon={Users} label="Active Calls Now" value="47" color="teal" />
        <KpiCard icon={Phone} label="Calls Today" value="847" color="indigo" trend="12%" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingUp} label="Transfers Today" value="127" color="emerald" trend="8%" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingUp} label="Transfer Rate" value="15.1%" color="emerald" trend="0.3%" trendDirection="up" trendPositive />
        <KpiCard icon={Clock} label="Avg Call Duration" value="2m 34s" color="amber" />
        <KpiCard icon={DollarSign} label="Cost Today" value="$42.35" color="teal" />
      </div>

      {/* Live Feed + Daily Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Live Call Feed" />
          <div style={{ padding: '0 18px 18px', maxHeight: 360, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {voiceCalls.map((call, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 10, border: '1px solid #F1F5F9' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: statusDot[call.status] || '#CBD5E1' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{call.merchant}</span>
                      <span style={{ fontSize: 10, color: '#CBD5E1', fontFamily: 'monospace' }}>{call.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, marginTop: 4, fontWeight: 500 }}>
                      <span style={{ color: statusTextColor[call.status] || '#94A3B8' }}>{call.status}</span>
                      <span style={{ color: '#CBD5E1' }}>{call.duration}</span>
                      <span style={{ color: '#94A3B8' }}>{call.stage}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, ...(sentimentStyle[call.sentiment] || sentimentStyle.Neutral), background: (sentimentStyle[call.sentiment] || sentimentStyle.Neutral).bg, color: (sentimentStyle[call.sentiment] || sentimentStyle.Neutral).color }}>{call.sentiment}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Daily Performance" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={voiceHourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar yAxisId="left" dataKey="calls" fill="#0891B2" radius={[6, 6, 0, 0]} name="Calls" opacity={0.8} />
                <Line yAxisId="right" type="monotone" dataKey="transferRate" stroke="#10B981" strokeWidth={2.5} dot={false} name="Transfer Rate %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Self-Improvement + Outcome */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Self-Improvement Log" />
          <div style={{ padding: '0 18px 18px' }}>
            <ActivityFeed
              items={[
                { text: 'Opener v12 deployed -- added empathy phrase for restaurant owners', time: 'Today', dot: 'amber' },
                { text: 'Pricing objection handler refined -- success rate 34% -> 41%', time: 'Yesterday', dot: 'amber' },
                { text: "Gatekeeper bypass: 'calling about your account' outperforming by 12%", time: 'Mar 12', dot: 'amber' },
                { text: 'Morning calls to restaurants shifted to 2-3pm -- owner availability +28%', time: 'Mar 10', dot: 'amber' },
              ]}
            />
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Call Outcome Analysis" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={callOutcomeData} innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {callOutcomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v}%`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Cost Comparison */}
      <div className="grid-3">
        <Card>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#F43F5E', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>Human Openers</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>$500K<span style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700 }}>/mo</span></div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 500 }}>180 people &middot; $16.67/transfer</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: 500 }}>No learning capability</div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 12 }}>AI Voice Agent</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>$1,270<span style={{ fontSize: 16, color: '#94A3B8', fontWeight: 700 }}>/mo</span></div>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: 500 }}>1 agent &middot; $0.33/transfer</div>
            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 8, fontWeight: 500 }}>Improves daily, scales infinitely</div>
          </div>
        </Card>
        <div style={{ background: 'linear-gradient(135deg, #609FFF, #1578F7)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>Annual Savings</div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em' }}>$5.98M</div>
          <div style={{ fontSize: 13, marginTop: 4, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>$498,730/month saved</div>
        </div>
      </div>
    </div>
  )
}
