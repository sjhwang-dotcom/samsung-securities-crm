import { useState } from 'react'
import {
  Phone, TrendingUp, Users, DollarSign, Clock, Activity,
  Radio, BarChart3, FileText, ScrollText, Settings,
  Mic, Shield, Timer, PhoneForwarded, Search,
  ChevronDown, ChevronRight, Sparkles,
} from 'lucide-react'
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Line, ComposedChart, AreaChart, Area, BarChart,
} from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable, ActivityFeed } from '../components/ui'
import type { Column } from '../components/ui'
import { voiceCalls, voiceHourlyData, callOutcomeData } from '../data/mockData'

/* ── constants ── */
type SubNav = 'live' | 'performance' | 'scripts' | 'calllog' | 'settings'

const subNavItems: { id: SubNav; label: string; icon: typeof Radio }[] = [
  { id: 'live', label: 'Live Calls', icon: Radio },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'scripts', label: 'Scripts & Openers', icon: FileText },
  { id: 'calllog', label: 'Call Log', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

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

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

/* ── mock data for Performance tab ── */
const dailyVolumeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  calls: Math.round(600 + Math.random() * 400 + (i > 15 ? 100 : 0)),
  transfers: Math.round(80 + Math.random() * 60 + (i > 15 ? 20 : 0)),
}))

const transferTrendData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  rate: +(12 + Math.random() * 6 + i * 0.1).toFixed(1),
}))

const outcomeOverTimeData = [
  { week: 'W1', transferred: 28, callback: 18, voicemail: 22, noAnswer: 20, declined: 12 },
  { week: 'W2', transferred: 31, callback: 16, voicemail: 20, noAnswer: 19, declined: 14 },
  { week: 'W3', transferred: 34, callback: 17, voicemail: 19, noAnswer: 18, declined: 12 },
  { week: 'W4', transferred: 37, callback: 19, voicemail: 17, noAnswer: 16, declined: 11 },
]

const costComparisonData = [
  { label: 'Human Team', monthly: 500000, perTransfer: 16.67 },
  { label: 'AI Voice Agent', monthly: 1270, perTransfer: 0.33 },
]

/* ── mock data for Scripts tab ── */
interface ScriptEntry {
  name: string; industry: string; winRate: number; callsUsed: number; avgDuration: string; lastUpdated: string; recommended: boolean; script: string
}
const scriptsData: ScriptEntry[] = [
  { name: 'Restaurant Savings Hook', industry: '5812 - Restaurants', winRate: 41.2, callsUsed: 3420, avgDuration: '2m 48s', lastUpdated: 'Apr 5', recommended: true, script: 'Hi, this is Sarah from Harlow Processing. I noticed your restaurant is currently paying around 2.9% on card transactions. We\'ve been helping similar restaurants in your area save 15-20% on processing fees. Do you have 30 seconds to hear how?' },
  { name: 'Rate Comparison Direct', industry: '5999 - General Retail', winRate: 38.7, callsUsed: 2890, avgDuration: '2m 12s', lastUpdated: 'Apr 4', recommended: true, script: 'Good afternoon, I\'m calling because we ran a quick comparison on your current processing rates and found you may be overpaying by $200-400 per month. Can I share what we found?' },
  { name: 'PCI Compliance Angle', industry: '5411 - Grocery', winRate: 35.4, callsUsed: 1850, avgDuration: '3m 05s', lastUpdated: 'Apr 3', recommended: true, script: 'Hi, I\'m reaching out because your PCI compliance deadline is coming up and many businesses in your industry are switching to us for free PCI compliance included with processing. Would you like to learn more?' },
  { name: 'Equipment Upgrade Offer', industry: '5812 - Restaurants', winRate: 33.1, callsUsed: 2100, avgDuration: '2m 34s', lastUpdated: 'Apr 2', recommended: false, script: 'I\'m calling about a free equipment upgrade program we\'re running for restaurants in your area. You\'d get a brand new PAX A920 terminal at no cost when you switch your processing. Can I give you the details?' },
  { name: 'Same-Day Deposits Hook', industry: '7542 - Car Wash', winRate: 31.8, callsUsed: 1640, avgDuration: '2m 20s', lastUpdated: 'Apr 1', recommended: false, script: 'Hi there, I work with car washes in your area and wanted to let you know we offer same-day deposits on all card transactions. Most processors hold funds for 2-3 days. Interested in hearing more?' },
  { name: 'Chargeback Protection Pitch', industry: '5944 - Jewelry', winRate: 29.5, callsUsed: 980, avgDuration: '3m 15s', lastUpdated: 'Mar 30', recommended: false, script: 'I\'m calling because jewelry businesses face high chargeback rates and we\'ve developed a protection program that reduces chargebacks by up to 60%. Do you have a moment to discuss?' },
  { name: 'Volume Discount Opener', industry: '5541 - Gas Stations', winRate: 27.3, callsUsed: 1420, avgDuration: '1m 58s', lastUpdated: 'Mar 28', recommended: false, script: 'Good morning, we offer volume-based pricing for gas stations processing over $50K monthly. Based on your location, you could qualify for our lowest tier. Want me to run a quick savings analysis?' },
  { name: 'Referral Incentive Intro', industry: '7941 - Recreation', winRate: 25.9, callsUsed: 760, avgDuration: '2m 42s', lastUpdated: 'Mar 25', recommended: false, script: 'Hi, I was referred to you by another business owner in your area who saved over $300/month by switching to us. They suggested you might benefit too. Can I do a free rate review?' },
  { name: 'Seasonal Rate Lock', industry: '5813 - Bars/Nightclubs', winRate: 24.1, callsUsed: 580, avgDuration: '2m 15s', lastUpdated: 'Mar 22', recommended: false, script: 'With the busy season coming up, we\'re offering a rate lock guarantee so your processing costs stay flat even as volume increases. Most processors raise rates with volume. Interested?' },
]

/* ── mock data for Call Log tab ── */
interface CallLogEntry {
  date: string; business: string; phone: string; duration: string; stage: string; outcome: string; sentiment: string; cost: string
}
const callLogData: CallLogEntry[] = voiceCalls.map((c, i) => ({
  date: `Apr ${7 - Math.floor(i / 4)}, ${['9:14 AM', '10:32 AM', '11:05 AM', '1:22 PM', '2:45 PM', '3:18 PM', '4:01 PM', '4:55 PM'][i % 8]}`,
  business: c.merchant,
  phone: c.phone,
  duration: c.duration,
  stage: c.stage,
  outcome: c.status,
  sentiment: c.sentiment,
  cost: `$${(0.02 + Math.random() * 0.08).toFixed(2)}`,
}))

// pad call log to have enough for pagination demo
const extendedCallLog: CallLogEntry[] = [
  ...callLogData,
  ...Array.from({ length: 40 }, (_, i) => ({
    date: `Apr ${3 - Math.floor(i / 8)}, ${['9:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '2:00 PM', '3:15 PM', '4:30 PM', '5:00 PM'][i % 8]}`,
    business: ['Bella Pizza', 'Metro Deli', 'Harbor Seafood', 'Summit Coffee', 'Valley Auto', 'Cedar Salon', 'Prime Fitness', 'Oak Dry Clean'][i % 8],
    phone: `(${212 + (i % 5)}) ${300 + i}-${1000 + i * 7}`,
    duration: `${Math.floor(Math.random() * 4)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    stage: ['Greeting', 'Pitch', 'Objection', 'Transfer', 'Voicemail'][i % 5],
    outcome: ['Completed', 'Transferred', 'No Answer', 'In Progress', 'Completed'][i % 5],
    sentiment: ['Positive', 'Neutral', 'Skeptical'][i % 3],
    cost: `$${(0.02 + Math.random() * 0.08).toFixed(2)}`,
  })),
]

/* ── Settings mock data ── */
const settingsConfig = {
  voice: { model: 'ElevenLabs Turbo v2.5', voiceId: 'Sarah - Professional', speed: 1.05, language: 'English (US)', pitch: 'Natural' },
  hours: { timezone: 'America/New_York', weekday: '9:00 AM - 6:00 PM', saturday: '10:00 AM - 2:00 PM', sunday: 'Off' },
  limits: { maxConcurrent: 50, dailyCap: 1200, maxDuration: '5 min', cooldown: '30 min between retries' },
  transfer: { method: 'Warm Transfer', targetNumber: '+1 (800) 555-0199', fallback: 'Voicemail', minQualScore: 65 },
  compliance: { tcpa: true, dncList: true, dncLastSync: 'Apr 6, 2026', callRecording: true, consentMessage: 'Enabled', stateRestrictions: 'Auto-enforced (47 states)' },
}

/* ── main component ── */
export default function VoiceAgent() {
  const [activeNav, setActiveNav] = useState<SubNav>('live')

  return (
    <div className="dashboard-grid">
      {/* Sub-Navigation */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #E5E7EB', overflowX: 'auto', flexShrink: 0 }}>
        {subNavItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
              padding: '10px 14px', fontSize: 12,
              fontWeight: activeNav === item.id ? 700 : 500,
              color: activeNav === item.id ? '#1578F7' : '#64748B',
              background: 'none', border: 'none',
              borderBottom: activeNav === item.id ? '2px solid #1578F7' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <item.icon size={16} strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </div>

      {activeNav === 'live' && <LiveCallsView />}
      {activeNav === 'performance' && <PerformanceView />}
      {activeNav === 'scripts' && <ScriptsView />}
      {activeNav === 'calllog' && <CallLogView />}
      {activeNav === 'settings' && <SettingsView />}
    </div>
  )
}

/* ══════════════════════════════════════════════
   LIVE CALLS TAB
   ══════════════════════════════════════════════ */
function LiveCallsView() {
  return (
    <>
      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <KpiCard icon={Users} label="Active Calls" value="47" color="teal" />
        <KpiCard icon={Phone} label="Calls Today" value="847" color="indigo" trend="12%" trendDirection="up" trendPositive />
        <KpiCard icon={PhoneForwarded} label="Transfer Rate" value="15.1%" color="emerald" trend="0.3%" trendDirection="up" trendPositive />
        <KpiCard icon={Clock} label="Avg Duration" value="2m 34s" color="amber" />
        <KpiCard icon={DollarSign} label="Cost Today" value="$42.35" color="teal" />
        <KpiCard icon={Activity} label="AI Sentiment" value="74.2" color="indigo" trend="2.1" trendDirection="up" trendPositive />
      </div>

      {/* Live Feed + Hourly Performance */}
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
          <CardHeader title="Hourly Performance" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={360}>
              <ComposedChart data={voiceHourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
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
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   PERFORMANCE TAB
   ══════════════════════════════════════════════ */
function PerformanceView() {
  return (
    <>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        <KpiCard icon={Phone} label="Total Calls (Month)" value="24,812" color="indigo" trend="8.4%" trendDirection="up" trendPositive />
        <KpiCard icon={PhoneForwarded} label="Transfer Success" value="15.1%" color="emerald" trend="1.2%" trendDirection="up" trendPositive />
        <KpiCard icon={Phone} label="Callback Rate" value="8.3%" color="amber" trend="0.5%" trendDirection="up" trendPositive />
        <KpiCard icon={DollarSign} label="Avg Cost/Transfer" value="$0.33" color="teal" trend="$0.02" trendDirection="down" trendPositive />
        <KpiCard icon={Clock} label="Best Hour" value="2-3 PM" color="indigo" />
        <KpiCard icon={TrendingUp} label="Total Savings" value="$498K" color="emerald" trend="vs Human" trendDirection="up" trendPositive />
      </div>

      {/* Daily Volume + Transfer Rate Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Daily Call Volume (30 Days)" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="calls" stroke="#1578F7" fill="#1578F7" fillOpacity={0.1} strokeWidth={2} name="Calls" />
                <Area type="monotone" dataKey="transfers" stroke="#10B981" fill="#10B981" fillOpacity={0.08} strokeWidth={2} name="Transfers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Transfer Rate Trend" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={transferTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <Area type="monotone" dataKey="rate" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2.5} name="Transfer Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Outcome Over Time + Cost Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Outcome Distribution Over Time" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={outcomeOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="transferred" stackId="a" fill="#10B981" name="Transferred" radius={[0, 0, 0, 0]} />
                <Bar dataKey="callback" stackId="a" fill="#1578F7" name="Callback" />
                <Bar dataKey="voicemail" stackId="a" fill="#F59E0B" name="Voicemail" />
                <Bar dataKey="noAnswer" stackId="a" fill="#CBD5E1" name="No Answer" />
                <Bar dataKey="declined" stackId="a" fill="#F43F5E" name="Declined" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Agent vs Human Cost Comparison" />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              {costComparisonData.map(item => (
                <div key={item.label} style={{ padding: 16, borderRadius: 10, border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{item.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: item.label === 'AI Voice Agent' ? '#10B981' : '#F43F5E' }}>
                      ${item.monthly.toLocaleString()}/mo
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#F1F5F9', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      width: `${(item.monthly / 500000) * 100}%`,
                      background: item.label === 'AI Voice Agent' ? '#10B981' : '#F43F5E',
                      minWidth: 4,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6, fontWeight: 500 }}>
                    ${item.perTransfer}/transfer
                  </div>
                </div>
              ))}
              <div style={{
                background: 'linear-gradient(135deg, #609FFF, #1578F7)', borderRadius: 10,
                padding: 20, textAlign: 'center', color: 'white',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>Annual Savings</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>$5.98M</div>
                <div style={{ fontSize: 12, marginTop: 2, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>$498,730/month saved</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   SCRIPTS & OPENERS TAB
   ══════════════════════════════════════════════ */
function ScriptsView() {
  const [expandedScript, setExpandedScript] = useState<string | null>(null)

  return (
    <>
      <Card noPadding>
        <CardHeader title="Opening Scripts Library" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 28px',
              gap: 12, padding: '10px 14px', borderBottom: '1px solid #E5E7EB',
              fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              <span>Script Name</span>
              <span>Industry / MCC</span>
              <span style={{ textAlign: 'right' }}>Win Rate</span>
              <span style={{ textAlign: 'right' }}>Calls Used</span>
              <span style={{ textAlign: 'right' }}>Avg Duration</span>
              <span style={{ textAlign: 'right' }}>Last Updated</span>
              <span />
            </div>
            {/* Rows */}
            {scriptsData.map(script => {
              const isExpanded = expandedScript === script.name
              return (
                <div key={script.name}>
                  <div
                    onClick={() => setExpandedScript(isExpanded ? null : script.name)}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 28px',
                      gap: 12, padding: '12px 14px', alignItems: 'center',
                      borderBottom: '1px solid #F8FAFC', cursor: 'pointer',
                      background: isExpanded ? '#F8FAFC' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>{script.name}</span>
                      {script.recommended && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 3,
                          fontSize: 9, fontWeight: 700, color: '#1578F7', background: '#EFF6FF',
                          padding: '2px 6px', borderRadius: 4,
                        }}>
                          <Sparkles size={10} /> AI Recommended
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{script.industry}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: script.winRate >= 35 ? '#10B981' : script.winRate >= 28 ? '#F59E0B' : '#94A3B8', textAlign: 'right' }}>
                      {script.winRate}%
                    </span>
                    <span style={{ fontSize: 12, color: '#64748B', textAlign: 'right', fontWeight: 500 }}>{script.callsUsed.toLocaleString()}</span>
                    <span style={{ fontSize: 12, color: '#64748B', textAlign: 'right', fontWeight: 500 }}>{script.avgDuration}</span>
                    <span style={{ fontSize: 12, color: '#94A3B8', textAlign: 'right', fontWeight: 500 }}>{script.lastUpdated}</span>
                    <span style={{ display: 'flex', justifyContent: 'center' }}>
                      {isExpanded ? <ChevronDown size={14} color="#94A3B8" /> : <ChevronRight size={14} color="#94A3B8" />}
                    </span>
                  </div>
                  {isExpanded && (
                    <div style={{ padding: '12px 14px 16px 14px', background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Script Text</div>
                      <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, fontStyle: 'italic', padding: '10px 14px', background: 'white', borderRadius: 8, border: '1px solid #E5E7EB' }}>
                        {script.script}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </>
  )
}

/* ══════════════════════════════════════════════
   CALL LOG TAB
   ══════════════════════════════════════════════ */
const PAGE_SIZE = 15

function CallLogView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOutcome, setFilterOutcome] = useState<string>('all')
  const [page, setPage] = useState(0)

  const filtered = extendedCallLog.filter(row => {
    const matchesSearch = !searchTerm ||
      row.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phone.includes(searchTerm)
    const matchesFilter = filterOutcome === 'all' || row.outcome === filterOutcome
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns: Column<CallLogEntry>[] = [
    { key: 'date', header: 'Date/Time', width: '140px' },
    { key: 'business', header: 'Business', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.business}</span> },
    { key: 'phone', header: 'Phone', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{r.phone}</span> },
    { key: 'duration', header: 'Duration', width: '80px' },
    { key: 'stage', header: 'Stage', width: '100px' },
    {
      key: 'outcome', header: 'Outcome', width: '110px',
      render: (r) => {
        const variant = r.outcome === 'Transferred' ? 'blue' : r.outcome === 'In Progress' ? 'emerald' : r.outcome === 'No Answer' ? 'gray' : 'teal'
        return <StatusBadge variant={variant}>{r.outcome}</StatusBadge>
      },
    },
    {
      key: 'sentiment', header: 'Sentiment', width: '90px',
      render: (r) => {
        const s = sentimentStyle[r.sentiment] || sentimentStyle.Neutral
        return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: s.bg, color: s.color }}>{r.sentiment}</span>
      },
    },
    { key: 'cost', header: 'Cost', width: '70px', align: 'right' },
  ]

  return (
    <>
      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
          <input
            placeholder="Search business or phone..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0) }}
            style={{
              background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
              paddingLeft: 34, paddingRight: 16, paddingTop: 9, paddingBottom: 9,
              fontSize: 13, outline: 'none', width: 260, color: '#334155',
            }}
          />
        </div>
        <select
          value={filterOutcome}
          onChange={e => { setFilterOutcome(e.target.value); setPage(0) }}
          style={{
            background: 'white', border: '1px solid #E5E7EB', borderRadius: 10,
            padding: '9px 14px', fontSize: 13, color: '#334155', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="all">All Outcomes</option>
          <option value="Completed">Completed</option>
          <option value="Transferred">Transferred</option>
          <option value="In Progress">In Progress</option>
          <option value="No Answer">No Answer</option>
        </select>
        <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginLeft: 'auto' }}>
          {filtered.length} calls
        </span>
      </div>

      <Card noPadding>
        <DataTable columns={columns} data={pageData} compact striped />
      </Card>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
        <button
          disabled={page === 0}
          onClick={() => setPage(p => p - 1)}
          style={{
            padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8,
            border: '1px solid #E5E7EB', background: page === 0 ? '#F8FAFC' : 'white',
            color: page === 0 ? '#CBD5E1' : '#334155', cursor: page === 0 ? 'default' : 'pointer',
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage(p => p + 1)}
          style={{
            padding: '6px 14px', fontSize: 12, fontWeight: 600, borderRadius: 8,
            border: '1px solid #E5E7EB', background: page >= totalPages - 1 ? '#F8FAFC' : 'white',
            color: page >= totalPages - 1 ? '#CBD5E1' : '#334155', cursor: page >= totalPages - 1 ? 'default' : 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════
   SETTINGS TAB
   ══════════════════════════════════════════════ */
function SettingsView() {
  const cfgCardStyle = { padding: 20, borderRadius: 12, border: '1px solid #F1F5F9', background: 'white' } as const
  const cfgLabelStyle = { fontSize: 12, color: '#94A3B8', fontWeight: 500 as const, marginBottom: 2 }
  const cfgValueStyle = { fontSize: 13, color: '#0F172A', fontWeight: 600 as const }

  const renderRow = (label: string, value: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
      <span style={cfgLabelStyle}>{label}</span>
      <span style={cfgValueStyle}>{value}</span>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {/* Voice Settings */}
      <Card noPadding>
        <CardHeader title="Voice Settings" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={cfgCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Mic size={16} color="#1578F7" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Voice Configuration</span>
            </div>
            {renderRow('Voice Model', settingsConfig.voice.model)}
            {renderRow('Voice ID', settingsConfig.voice.voiceId)}
            {renderRow('Speed', `${settingsConfig.voice.speed}x`)}
            {renderRow('Language', settingsConfig.voice.language)}
            {renderRow('Pitch', settingsConfig.voice.pitch)}
          </div>
        </div>
      </Card>

      {/* Operating Hours */}
      <Card noPadding>
        <CardHeader title="Operating Hours" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={cfgCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Timer size={16} color="#F59E0B" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Schedule</span>
            </div>
            {renderRow('Timezone', settingsConfig.hours.timezone)}
            {renderRow('Weekdays', settingsConfig.hours.weekday)}
            {renderRow('Saturday', settingsConfig.hours.saturday)}
            {renderRow('Sunday', settingsConfig.hours.sunday)}
          </div>
        </div>
      </Card>

      {/* Call Limits */}
      <Card noPadding>
        <CardHeader title="Call Limits" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={cfgCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Phone size={16} color="#10B981" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Limits</span>
            </div>
            {renderRow('Max Concurrent', String(settingsConfig.limits.maxConcurrent))}
            {renderRow('Daily Cap', String(settingsConfig.limits.dailyCap))}
            {renderRow('Max Duration', settingsConfig.limits.maxDuration)}
            {renderRow('Cooldown', settingsConfig.limits.cooldown)}
          </div>
        </div>
      </Card>

      {/* Transfer Rules */}
      <Card noPadding>
        <CardHeader title="Transfer Rules" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={cfgCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <PhoneForwarded size={16} color="#1578F7" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Transfer Config</span>
            </div>
            {renderRow('Method', settingsConfig.transfer.method)}
            {renderRow('Target Number', settingsConfig.transfer.targetNumber)}
            {renderRow('Fallback', settingsConfig.transfer.fallback)}
            {renderRow('Min Qualification Score', String(settingsConfig.transfer.minQualScore))}
          </div>
        </div>
      </Card>

      {/* Compliance */}
      <div style={{ gridColumn: 'span 2' }}>
        <Card noPadding>
          <CardHeader title="Compliance & Regulations" />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={cfgCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Shield size={16} color="#F43F5E" />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Compliance Settings</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  {renderRow('TCPA Compliant', settingsConfig.compliance.tcpa ? 'Yes' : 'No')}
                  {renderRow('DNC List Active', settingsConfig.compliance.dncList ? 'Yes' : 'No')}
                </div>
                <div>
                  {renderRow('DNC Last Sync', settingsConfig.compliance.dncLastSync)}
                  {renderRow('Call Recording', settingsConfig.compliance.callRecording ? 'Enabled' : 'Disabled')}
                </div>
                <div>
                  {renderRow('Consent Message', settingsConfig.compliance.consentMessage)}
                  {renderRow('State Restrictions', settingsConfig.compliance.stateRestrictions)}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
