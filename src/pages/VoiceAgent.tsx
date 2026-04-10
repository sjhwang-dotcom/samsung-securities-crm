import { useState } from 'react'
import {
  Phone, TrendingUp, Users, DollarSign, Clock,
  Radio, BarChart3, FileText, ScrollText, Settings,
  Mic, Shield, Timer, PhoneForwarded, Search,
  ChevronDown, ChevronRight, Sparkles, Brain,
  Target, ArrowUpRight, Award, Activity, Zap,
  AlertCircle, CheckCircle, XCircle, Layers,
  GitBranch, Gauge, CalendarClock, Hash,
  CalendarPlus, PlusCircle, Ban, PlayCircle,
} from 'lucide-react'
import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Line, ComposedChart, AreaChart, Area, BarChart,
} from 'recharts'
import { KpiCard, Card, CardHeader, StatusBadge, ActivityFeed } from '../components/ui'
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

const statusColor: Record<string, { bg: string; text: string; border: string }> = {
  'In Progress': { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
  'Ringing': { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' },
  'Transferred': { bg: '#EFF6FF', text: '#1578F7', border: '#93C5FD' },
  'Completed': { bg: '#F8FAFC', text: '#64748B', border: '#E2E8F0' },
  'No Answer': { bg: '#F8FAFC', text: '#94A3B8', border: '#E2E8F0' },
}
const sentimentStyle: Record<string, { color: string; bg: string }> = {
  'Positive': { color: '#059669', bg: '#D1FAE5' },
  'Neutral': { color: '#64748B', bg: '#F1F5F9' },
  'Skeptical': { color: '#D97706', bg: '#FEF3C7' },
}

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

/* ── call stage helpers ── */
const STAGES = ['Greeting', 'Pitch', 'Objection', 'Close', 'Transfer'] as const
function stageProgress(stage: string): number {
  const idx = STAGES.indexOf(stage as typeof STAGES[number])
  return idx < 0 ? 0 : ((idx + 1) / STAGES.length) * 100
}
const stageColor = (pct: number) => pct >= 80 ? '#10B981' : pct >= 60 ? '#1578F7' : pct >= 40 ? '#F59E0B' : '#94A3B8'

/* ── mock data for Performance tab ── */
const dailyVolumeData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  calls: Math.round(600 + Math.random() * 400 + (i > 15 ? 100 : 0)),
  transfers: Math.round(80 + Math.random() * 60 + (i > 15 ? 20 : 0)),
}))

const outcomeOverTimeData = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  transferred: Math.round(400 + Math.random() * 100),
  completed: Math.round(300 + Math.random() * 80),
  noAnswer: Math.round(150 + Math.random() * 60),
  voicemail: Math.round(100 + Math.random() * 40),
}))

const transferRateTrendData = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  rate: +(11.2 + i * 0.35 + (Math.random() - 0.3) * 0.8).toFixed(1),
}))

const costComparisonData = [
  { label: 'Human Team', monthly: 500000, perTransfer: 16.67 },
  { label: 'AI Voice Agent', monthly: 1270, perTransfer: 0.33 },
]

const mccPerformanceData = [
  { mcc: '5812 - Restaurants', calls: 8420, transferRate: 17.2, winRate: 41.2 },
  { mcc: '5999 - Gen. Retail', calls: 5890, transferRate: 14.8, winRate: 38.7 },
  { mcc: '5411 - Grocery', calls: 3850, transferRate: 13.1, winRate: 35.4 },
  { mcc: '7542 - Car Wash', calls: 2640, transferRate: 11.9, winRate: 31.8 },
  { mcc: '5541 - Gas Stations', calls: 2420, transferRate: 10.6, winRate: 27.3 },
]

const transferFunnelData = [
  { stage: 'Dialed', value: 24812, pct: 100, color: '#94A3B8' },
  { stage: 'Connected', value: 18240, pct: 73.5, color: '#1578F7' },
  { stage: 'Engaged', value: 9860, pct: 39.7, color: '#0891B2' },
  { stage: 'Qualified', value: 5420, pct: 21.8, color: '#F59E0B' },
  { stage: 'Transferred', value: 3747, pct: 15.1, color: '#10B981' },
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

/* ── Script win rate bar chart data ── */
const scriptBarData = scriptsData.map(s => ({
  name: s.name.length > 20 ? s.name.slice(0, 18) + '...' : s.name,
  winRate: s.winRate,
  fill: s.winRate >= 35 ? '#10B981' : s.winRate >= 28 ? '#F59E0B' : '#94A3B8',
})).sort((a, b) => b.winRate - a.winRate)

/* ── mock data for Call Log tab ── */
interface CallLogEntry {
  id: number; date: string; business: string; phone: string; duration: string; stage: string; outcome: string; sentiment: string; cost: string
  summary: string; keyMoments: { time: string; label: string }[]
}

const callSummaries: { summary: string; keyMoments: { time: string; label: string }[] }[] = [
  { summary: 'Connected with the owner who was receptive to a rate comparison. Presented savings of $280/mo based on their current volume. Owner requested a follow-up call next Tuesday with their business partner present.', keyMoments: [{ time: '0:08', label: 'Connected with owner' }, { time: '0:32', label: 'Presented savings offer of $280/mo' }, { time: '1:15', label: 'Owner expressed interest' }, { time: '1:48', label: 'Requested callback next Tuesday' }] },
  { summary: 'Reached the general manager who handles payment processing decisions. Discussed current PCI compliance costs and our included compliance program. Manager asked for a written proposal via email.', keyMoments: [{ time: '0:05', label: 'Reached general manager' }, { time: '0:28', label: 'Discussed PCI compliance costs' }, { time: '1:02', label: 'Presented free PCI compliance program' }, { time: '1:45', label: 'Manager requested email proposal' }] },
  { summary: 'Owner was initially skeptical but engaged after hearing about same-day deposits. Current processor holds funds for 3 days. Transferred to sales rep for detailed rate review.', keyMoments: [{ time: '0:10', label: 'Connected with owner' }, { time: '0:35', label: 'Owner expressed skepticism' }, { time: '1:12', label: 'Same-day deposit benefit resonated' }, { time: '2:05', label: 'Warm transfer to sales rep' }] },
  { summary: 'Spoke with assistant manager who confirmed they process $45K/mo in cards. Current rate is 3.1%. Offered 2.4% with free terminal upgrade. Call transferred to decision maker.', keyMoments: [{ time: '0:06', label: 'Reached assistant manager' }, { time: '0:40', label: 'Confirmed $45K monthly volume' }, { time: '1:18', label: 'Presented rate reduction offer' }, { time: '1:55', label: 'Transferred to decision maker' }] },
  { summary: 'No answer after multiple rings. Left a voicemail mentioning potential savings of 15-20% on processing fees and provided callback number.', keyMoments: [{ time: '0:05', label: 'Call initiated, ringing' }, { time: '0:25', label: 'No answer, went to voicemail' }, { time: '0:30', label: 'Left savings-focused voicemail' }] },
  { summary: 'Owner answered and was very interested in equipment upgrade program. Currently using outdated Verifone VX520. Discussed PAX A920 features. Scheduled in-person demo for Friday.', keyMoments: [{ time: '0:04', label: 'Owner answered directly' }, { time: '0:22', label: 'Discussed current equipment issues' }, { time: '1:05', label: 'Presented free PAX A920 upgrade' }, { time: '2:15', label: 'Scheduled Friday demo' }] },
  { summary: 'Reached bookkeeper who handles vendor payments. Not authorized to make processing decisions. Obtained owner name and best time to call back (mornings before 11 AM).', keyMoments: [{ time: '0:07', label: 'Connected with bookkeeper' }, { time: '0:20', label: 'Bookkeeper not authorized for decisions' }, { time: '0:45', label: 'Obtained owner contact info' }, { time: '1:02', label: 'Noted best callback time' }] },
  { summary: 'Owner recently switched processors and is locked into a 3-year contract. Not interested at this time but open to a review when contract expires in 18 months.', keyMoments: [{ time: '0:06', label: 'Connected with owner' }, { time: '0:18', label: 'Owner mentioned existing contract' }, { time: '0:42', label: 'Discussed contract buyout option' }, { time: '1:10', label: 'Noted 18-month follow-up date' }] },
]

let _callId = 0
const callLogData: CallLogEntry[] = voiceCalls.map((c, i) => ({
  id: ++_callId,
  date: `Apr ${7 - Math.floor(i / 4)}, ${['9:14 AM', '10:32 AM', '11:05 AM', '1:22 PM', '2:45 PM', '3:18 PM', '4:01 PM', '4:55 PM'][i % 8]}`,
  business: c.merchant,
  phone: c.phone,
  duration: c.duration,
  stage: c.stage,
  outcome: c.status,
  sentiment: c.sentiment,
  cost: `$${(0.02 + Math.random() * 0.08).toFixed(2)}`,
  ...callSummaries[i % callSummaries.length],
}))

const extendedCallLog: CallLogEntry[] = [
  ...callLogData,
  ...Array.from({ length: 40 }, (_, i) => ({
    id: ++_callId,
    date: `Apr ${3 - Math.floor(i / 8)}, ${['9:00 AM', '10:15 AM', '11:30 AM', '12:45 PM', '2:00 PM', '3:15 PM', '4:30 PM', '5:00 PM'][i % 8]}`,
    business: ['Bella Pizza', 'Metro Deli', 'Harbor Seafood', 'Summit Coffee', 'Valley Auto', 'Cedar Salon', 'Prime Fitness', 'Oak Dry Clean'][i % 8],
    phone: `(${212 + (i % 5)}) ${300 + i}-${1000 + i * 7}`,
    duration: `${Math.floor(Math.random() * 4)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    stage: ['Greeting', 'Pitch', 'Objection', 'Transfer', 'Voicemail'][i % 5],
    outcome: ['Completed', 'Transferred', 'No Answer', 'In Progress', 'Completed'][i % 5],
    sentiment: ['Positive', 'Neutral', 'Skeptical'][i % 3],
    cost: `$${(0.02 + Math.random() * 0.08).toFixed(2)}`,
    ...callSummaries[i % callSummaries.length],
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

/* ── CRM pipeline mapping for live calls ── */
const crmPipelineMap: Record<string, { stage: string; color: string }> = {
  'Queens Auto Repair': { stage: 'Lead', color: '#3B82F6' },
  'Fresh Bake Cafe': { stage: 'Lead', color: '#3B82F6' },
  'Downtown Barber': { stage: 'Lead', color: '#3B82F6' },
  'Park Slope Yoga': { stage: 'Proposal', color: '#4F46E5' },
  'Liberty Tax': { stage: 'Proposal', color: '#4F46E5' },
  'Chez Antoine': { stage: 'Application', color: '#8B5CF6' },
  'GreenLeaf Market': { stage: 'Application', color: '#8B5CF6' },
  'Brooklyn Dry Cleaners #2': { stage: 'Lead', color: '#3B82F6' },
  'Sunrise Pharmacy': { stage: 'Application', color: '#8B5CF6' },
  'Harlem Grocery #2': { stage: 'Approval', color: '#10B981' },
  "King's Crown Jewelry": { stage: 'Underwriting', color: '#F59E0B' },
  "Bella's Bistro LLC": { stage: 'Approval', color: '#10B981' },
  'Prestige Auto Wash': { stage: 'Boarding', color: '#0891B2' },
  'Metro Grill': { stage: 'Equipment', color: '#EC4899' },
  'Jade Spa': { stage: 'Lead', color: '#3B82F6' },
}

/* ── pulsing dot keyframe (injected once) ── */
const pulseCSS = `
@keyframes harlowPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.4); }
}
@keyframes harlowWave {
  0% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.4); }
}
`

/* ── main component ── */
export default function VoiceAgent() {
  const [activeNav, setActiveNav] = useState<SubNav>('live')

  return (
    <div className="dashboard-grid">
      <style>{pulseCSS}</style>

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
  const activeCalls = voiceCalls.filter(c => c.status === 'In Progress' || c.status === 'Ringing')
  const totalOutcomeValue = callOutcomeData.reduce((s, d) => s + d.value, 0)

  return (
    <>
      {/* Hero Banner */}
      <div className="harlow-card" style={{
        borderRadius: 14, padding: '24px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: '1px solid #E5E7EB',
        position: 'relative', overflow: 'hidden',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #10B981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16,185,129,0.4)',
            }}>
              <Radio size={20} color="white" strokeWidth={2.5} />
            </div>
            <div style={{
              position: 'absolute', top: -2, right: -2,
              width: 12, height: 12, borderRadius: '50%', background: '#10B981',
              animation: 'harlowPulse 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(16,185,129,0.6)',
              border: '2px solid white',
            }} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Voice Agent Command Center
            </div>
            <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={12} strokeWidth={2} />
              Real-time AI dialer operations
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Active Calls', val: String(activeCalls.length > 0 ? 47 : 0), color: '#10B981', icon: Phone },
            { label: 'Today Total', val: '847', color: '#1578F7', icon: Hash },
            { label: 'Transfer Rate', val: '15.1%', color: '#F59E0B', icon: PhoneForwarded },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', minWidth: 80 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
                <m.icon size={14} color={m.color} strokeWidth={2.5} />
                <span style={{ fontSize: 28, fontWeight: 900, color: m.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{m.val}</span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Row - 4 cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard icon={Clock} label="Avg Duration" value="2m 34s" color="indigo" trend="8s" trendDirection="down" trendPositive />
        <KpiCard icon={DollarSign} label="Cost Today" value="$27.41" color="teal" trend="$0.03/call" trendDirection="down" trendPositive />
        <KpiCard icon={Gauge} label="Sentiment Score" value="78.4" color="emerald" trend="3.1pt" trendDirection="up" trendPositive sub="out of 100" />
        <KpiCard icon={Layers} label="Queue Depth" value="124" color="amber" trend="18" trendDirection="down" trendPositive sub="merchants pending" />
      </div>

      {/* Live Feed + Hourly Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Live Call Feed" badge={
            <StatusBadge variant="live" dot pulse>LIVE</StatusBadge>
          } />
          <div style={{ padding: '0 18px 18px', maxHeight: 420, overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {voiceCalls.map((call, i) => {
                const sc = statusColor[call.status] || statusColor['Completed']
                const pct = stageProgress(call.stage)
                return (
                  <div key={i} style={{
                    padding: '10px 12px', borderRadius: 10,
                    border: call.status === 'In Progress' ? '1px solid #A7F3D0' : '1px solid #F1F5F9',
                    background: call.status === 'In Progress' ? '#FAFFFE' : 'white',
                    transition: 'all 0.15s', position: 'relative',
                  }}>
                    {/* Waveform hint for active calls */}
                    {call.status === 'In Progress' && (
                      <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
                        {[0, 0.15, 0.3, 0.45, 0.6].map((d, j) => (
                          <div key={j} style={{
                            width: 2, borderRadius: 1, background: '#10B981', opacity: 0.5,
                            animation: `harlowWave 0.8s ease-in-out ${d}s infinite`,
                            height: [6, 10, 14, 10, 6][j],
                          }} />
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>{call.merchant}</span>
                      <span style={{ fontSize: 9, color: '#CBD5E1', fontFamily: 'monospace' }}>{call.phone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 6,
                        background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                      }}>
                        {call.status}
                      </span>
                      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, fontFamily: 'monospace' }}>{call.duration}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4,
                        ...(sentimentStyle[call.sentiment] || sentimentStyle.Neutral),
                      }}>
                        {call.sentiment}
                      </span>
                    </div>

                    {/* Stage progress bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 2, background: stageColor(pct), width: `${pct}%`, transition: 'width 0.3s ease' }} />
                      </div>
                      <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, whiteSpace: 'nowrap' }}>{call.stage}</span>
                    </div>
                    {/* CRM Pipeline badge */}
                    {crmPipelineMap[call.merchant] && (
                      <div style={{ marginTop: 4 }}>
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4,
                          background: `${crmPipelineMap[call.merchant].color}15`,
                          color: crmPipelineMap[call.merchant].color,
                        }}>
                          Pipeline: {crmPipelineMap[call.merchant].stage}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Hourly Performance" subtitle="Calls volume vs transfer rate by hour" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart data={voiceHourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any, name: any) => [name === 'Transfer Rate' ? `${v}%` : v, name]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500, paddingTop: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="calls" stroke="#1578F7" strokeWidth={2} dot={{ r: 4, fill: '#1578F7', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Calls" />
                <Line yAxisId="right" type="monotone" dataKey="transferRate" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} name="Transfer Rate" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* AI Learning Feed + Call Outcome */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="AI Learning Feed" badge={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, color: '#7C3AED', background: '#EDE9FE', padding: '2px 7px', borderRadius: 5 }}>
              <Brain size={10} /> Auto-Evolving
            </span>
          } />
          <div style={{ padding: '0 18px 18px' }}>
            <ActivityFeed
              items={[
                { text: <span><strong>Opener v12</strong> deployed: empathy phrase added for restaurants. Transfer rate <span style={{ color: '#10B981', fontWeight: 700 }}>+3.2%</span></span>, time: '2h ago', dot: 'purple' },
                { text: <span><strong>Objection handler</strong> refined: pricing rebuttals improved. Win rate <span style={{ color: '#10B981', fontWeight: 700 }}>34% to 41%</span></span>, time: '5h ago', dot: 'green' },
                { text: <span><strong>Gatekeeper bypass</strong>: new phrase outperforming control by <span style={{ color: '#10B981', fontWeight: 700 }}>12%</span>. Deployed to all scripts.</span>, time: 'Yesterday', dot: 'blue' },
                { text: <span><strong>Time optimization</strong>: restaurant calls shifted to 2-3 PM. Owner pickup rate <span style={{ color: '#10B981', fontWeight: 700 }}>+28%</span></span>, time: 'Yesterday', dot: 'amber' },
              ]}
            />
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Call Outcome Analysis" subtitle={`${totalOutcomeValue > 0 ? totalOutcomeValue.toLocaleString() : '847'} calls today`} />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={callOutcomeData} innerRadius={65} outerRadius={95} paddingAngle={3} dataKey="value" strokeWidth={0}>
                  {callOutcomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => v} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
                {/* Center label */}
                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 24, fontWeight: 900, fill: '#0F172A' }}>
                  847
                </text>
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="central" style={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                  total calls
                </text>
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
        <KpiCard icon={PhoneForwarded} label="Transfer Rate" value="15.1%" color="emerald" trend="1.2%" trendDirection="up" trendPositive />
        <KpiCard icon={Phone} label="Callback Rate" value="8.3%" color="amber" trend="0.5%" trendDirection="down" trendPositive />
        <KpiCard icon={DollarSign} label="Cost / Transfer" value="$0.33" color="teal" trend="$0.02" trendDirection="down" trendPositive />
        <KpiCard icon={CalendarClock} label="Best Hour" value="2-3 PM" color="blue" sub="17.2% xfer rate" />
        <KpiCard icon={TrendingUp} label="Monthly Savings" value="$498K" color="emerald" trend="vs Human" trendDirection="up" trendPositive />
      </div>

      {/* Full-width daily volume */}
      <Card noPadding>
        <CardHeader title="Daily Call Volume" subtitle="30-day trend with calls and transfers overlaid" />
        <div style={{ padding: '0 18px 18px' }}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={dailyVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
              <Area type="monotone" dataKey="calls" stroke="#1578F7" fill="#1578F7" fillOpacity={0.08} strokeWidth={2} name="Total Calls" />
              <Area type="monotone" dataKey="transfers" stroke="#10B981" fill="#10B981" fillOpacity={0.06} strokeWidth={2} name="Transfers" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 3-column: Transfer Funnel | Cost Savings | MCC Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 16 }}>
        {/* Transfer Funnel (vertical) */}
        <Card noPadding>
          <CardHeader title="Transfer Funnel" subtitle="Drop-off at each stage" />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {transferFunnelData.map((step, i) => {
                const dropOff = i > 0 ? transferFunnelData[i - 1].value - step.value : 0
                const dropPct = i > 0 ? ((dropOff / transferFunnelData[i - 1].value) * 100).toFixed(0) : null
                return (
                  <div key={step.stage}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.color }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{step.stage}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{step.value.toLocaleString()}</span>
                        <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 4, fontWeight: 500 }}>{step.pct}%</span>
                      </div>
                    </div>
                    {/* Funnel bar */}
                    <div style={{ height: 6, borderRadius: 3, background: '#F1F5F9', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, background: step.color, width: `${step.pct}%`, transition: 'width 0.5s ease' }} />
                    </div>
                    {/* Connector line + drop-off label */}
                    {i < transferFunnelData.length - 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px 0', gap: 6 }}>
                        <div style={{ width: 1, height: 12, background: '#E2E8F0' }} />
                        {dropPct && (
                          <span style={{ fontSize: 9, color: '#F43F5E', fontWeight: 600 }}>-{dropPct}%</span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Cost Savings */}
        <Card noPadding>
          <CardHeader title="Cost Savings" subtitle="AI vs human team" />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {costComparisonData.map(item => (
                <div key={item.label} style={{ padding: 14, borderRadius: 10, border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {item.label === 'AI Voice Agent'
                        ? <Zap size={13} color="#10B981" strokeWidth={2.5} />
                        : <Users size={13} color="#F43F5E" strokeWidth={2} />}
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A' }}>{item.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.label === 'AI Voice Agent' ? '#10B981' : '#F43F5E' }}>
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
                  <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: 500 }}>
                    ${item.perTransfer}/transfer
                  </div>
                </div>
              ))}

              {/* Large savings callout */}
              <div style={{
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', borderRadius: 12,
                padding: '22px 16px', textAlign: 'center', color: 'white',
                boxShadow: '0 4px 16px rgba(16,185,129,0.25)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                  <ArrowUpRight size={14} strokeWidth={3} />
                  <span style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.8)' }}>Annual Savings</span>
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>$5.98M</div>
                <div style={{ fontSize: 11, marginTop: 8, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  99.7% cost reduction vs. human team
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* MCC Performance Table */}
        <Card noPadding>
          <CardHeader title="MCC Performance" subtitle="Transfer and win rates by industry" />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Table header */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1.5fr 0.7fr 0.8fr 0.8fr',
                gap: 8, padding: '8px 10px', borderBottom: '1px solid #E5E7EB',
                fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                <span>MCC</span>
                <span style={{ textAlign: 'right' }}>Calls</span>
                <span style={{ textAlign: 'right' }}>Xfer Rate</span>
                <span style={{ textAlign: 'right' }}>Win Rate</span>
              </div>
              {mccPerformanceData.map(row => (
                <div key={row.mcc} style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 0.7fr 0.8fr 0.8fr',
                  gap: 8, padding: '10px 10px', borderBottom: '1px solid #F8FAFC',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{row.mcc}</span>
                  <span style={{ fontSize: 12, color: '#64748B', textAlign: 'right', fontWeight: 500 }}>{row.calls.toLocaleString()}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#1578F7', textAlign: 'right' }}>{row.transferRate}%</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: row.winRate >= 35 ? '#10B981' : row.winRate >= 28 ? '#F59E0B' : '#94A3B8', textAlign: 'right' }}>
                    {row.winRate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 2-column: Outcome Over Time | Transfer Rate Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card noPadding>
          <CardHeader title="Outcome Over Time" subtitle="Weekly breakdown by result" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={outcomeOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 500 }} />
                <Bar dataKey="transferred" stackId="a" fill="#1578F7" name="Transferred" radius={[0, 0, 0, 0]} />
                <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                <Bar dataKey="noAnswer" stackId="a" fill="#F59E0B" name="No Answer" />
                <Bar dataKey="voicemail" stackId="a" fill="#94A3B8" name="Voicemail" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card noPadding>
          <CardHeader title="Transfer Rate Trend" subtitle="12-week trajectory" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={transferRateTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <Area type="monotone" dataKey="rate" stroke="#1578F7" fill="#1578F7" fillOpacity={0.08} strokeWidth={2.5} name="Transfer Rate" dot={{ r: 3, fill: '#1578F7', stroke: 'white', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Pipeline Impact */}
      <Card noPadding>
        <CardHeader title="Pipeline Impact" badge={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 9, fontWeight: 700, color: '#0891B2', background: '#CCFBF1', padding: '2px 7px', borderRadius: 5 }}>
            <GitBranch size={10} /> CRM Integration
          </span>
        } />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { label: 'Leads Advanced Today', value: '12', color: '#0891B2' },
              { label: 'Leads Advanced This Week', value: '47', color: '#1578F7' },
              { label: 'Direct-to-Close Rate', value: '8.2%', color: '#10B981', sub: 'calls to merchant boarding' },
              { label: 'Avg Calls to Convert', value: '3.4', color: '#F59E0B' },
              { label: 'Pipeline Value Generated', value: '$142K/mo', color: '#059669', sub: 'Voice Agent sourced leads' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', padding: '12px 8px', borderRadius: 10, background: '#FAFBFC' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: item.color, letterSpacing: '-0.02em', lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#64748B', marginTop: 4 }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{item.sub}</div>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  )
}

/* ══════════════════════════════════════════════
   SCRIPTS & OPENERS TAB
   ══════════════════════════════════════════════ */
function ScriptsView() {
  const [expandedScript, setExpandedScript] = useState<string | null>(null)

  const totalScripts = scriptsData.length
  const avgWinRate = (scriptsData.reduce((s, x) => s + x.winRate, 0) / totalScripts).toFixed(1)
  const bestScript = scriptsData.reduce((best, x) => x.winRate > best.winRate ? x : best, scriptsData[0])

  return (
    <>
      {/* Script KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <KpiCard icon={FileText} label="Total Scripts" value={String(totalScripts)} color="indigo" />
        <KpiCard icon={Target} label="Avg Win Rate" value={`${avgWinRate}%`} color="amber" trend="2.1%" trendDirection="up" trendPositive />
        <KpiCard icon={Award} label="Best Performer" value={bestScript.name.split(' ').slice(0, 2).join(' ')} color="emerald" sub={`${bestScript.winRate}% win rate`} />
      </div>

      {/* Win Rate Bar Chart */}
      <Card noPadding>
        <CardHeader title="Win Rate by Script" subtitle="Ranked by conversion performance" />
        <div style={{ padding: '0 18px 18px' }}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scriptBarData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: any) => `${v}%`} domain={[0, 50]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
              <Bar dataKey="winRate" radius={[0, 4, 4, 0]} name="Win Rate" barSize={14}>
                {scriptBarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Scripts Table */}
      <Card noPadding>
        <CardHeader title="Opening Scripts Library" subtitle={`${scriptsData.filter(s => s.recommended).length} AI-recommended scripts`} />
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
  const [selectedCallId, setSelectedCallId] = useState<number | null>(extendedCallLog[0]?.id ?? null)

  const filtered = extendedCallLog.filter(row => {
    const matchesSearch = !searchTerm ||
      row.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phone.includes(searchTerm)
    const matchesFilter = filterOutcome === 'all' || row.outcome === filterOutcome
    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const selectedCall = extendedCallLog.find(c => c.id === selectedCallId) ?? null

  // Summary stats
  const totalLogged = extendedCallLog.length
  const avgDurationMins = extendedCallLog.reduce((sum, r) => {
    const parts = r.duration.split(':')
    return sum + (parseInt(parts[0] || '0') * 60 + parseInt(parts[1] || '0'))
  }, 0) / totalLogged
  const avgDurationStr = `${Math.floor(avgDurationMins / 60)}:${String(Math.round(avgDurationMins % 60)).padStart(2, '0')}`
  const avgCost = (extendedCallLog.reduce((sum, r) => sum + parseFloat(r.cost.replace('$', '')), 0) / totalLogged).toFixed(2)

  const transferredCount = extendedCallLog.filter(r => r.outcome === 'Transferred').length
  const transferRate = ((transferredCount / totalLogged) * 100).toFixed(1)

  const outcomeVariant = (v: any) => v === 'Transferred' ? 'blue' as const : v === 'In Progress' ? 'emerald' as const : v === 'No Answer' ? 'gray' as const : 'teal' as const
  const sentimentBadge = (v: any) => {
    const s = sentimentStyle[v as string] || sentimentStyle.Neutral
    return <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: s.bg, color: s.color }}>{v}</span>
  }

  const columns: Column<CallLogEntry>[] = [
    { key: 'date', header: 'Time', width: '110px', render: (v: any) => <span style={{ fontSize: 11 }}>{v.date.split(', ')[1] || v.date}</span> },
    { key: 'business', header: 'Business', render: (v: any) => <span style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{v.business}</span> },
    { key: 'duration', header: 'Dur.', width: '55px' },
    {
      key: 'outcome', header: 'Outcome', width: '100px',
      render: (v: any) => <StatusBadge variant={outcomeVariant(v.outcome)}>{v.outcome}</StatusBadge>,
    },
    {
      key: 'sentiment', header: 'Sent.', width: '80px',
      render: (v: any) => sentimentBadge(v.sentiment),
    },
  ]

  const actionBtnStyle = (color: string, bg: string, border: string) => ({
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 12px', fontSize: 11, fontWeight: 600 as const, borderRadius: 8,
    border: `1px solid ${border}`, background: bg, color, cursor: 'pointer',
  })

  return (
    <>
      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KpiCard icon={ScrollText} label="Total Logged" value={String(totalLogged)} color="indigo" sub="all time records" />
        <KpiCard icon={Clock} label="Avg Duration" value={avgDurationStr} color="amber" trend="12s" trendDirection="down" trendPositive />
        <KpiCard icon={DollarSign} label="Avg Cost" value={`$${avgCost}`} color="teal" trend="$0.01" trendDirection="down" trendPositive />
        <KpiCard icon={PhoneForwarded} label="Transfer Rate" value={`${transferRate}%`} color="emerald" trend="0.8%" trendDirection="up" trendPositive />
      </div>

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
              fontSize: 13, outline: 'none', width: 240, color: '#334155',
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
          Showing {pageData.length} of {filtered.length} calls
        </span>
      </div>

      {/* Master-Detail layout */}
      <div style={{ display: 'flex', gap: 16, minHeight: 520 }}>
        {/* Left: Call log table */}
        <div style={{ flex: '0 0 56%', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Card noPadding>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {columns.map(col => (
                    <th key={col.key as string} style={{ padding: '10px 10px', textAlign: (col.align || 'left') as any, fontSize: 11, fontWeight: 600, color: '#94A3B8', width: col.width }}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.map(row => {
                  const isActive = row.id === selectedCallId
                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedCallId(row.id)}
                      style={{
                        cursor: 'pointer',
                        background: isActive ? '#EFF6FF' : undefined,
                        borderBottom: '1px solid #F8FAFC',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#FAFBFD' }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '' }}
                    >
                      {columns.map(col => (
                        <td key={col.key as string} style={{ padding: '8px 10px', fontSize: 12, color: '#334155', textAlign: (col.align || 'left') as any }}>
                          {col.render ? col.render(row, 0) : (row as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 8,
                border: '1px solid #E5E7EB', background: page === 0 ? '#F8FAFC' : 'white',
                color: page === 0 ? '#CBD5E1' : '#334155', cursor: page === 0 ? 'default' : 'pointer',
              }}
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    width: 28, height: 28, fontSize: 11, fontWeight: page === pageNum ? 700 : 500, borderRadius: 6,
                    border: page === pageNum ? '1px solid #1578F7' : '1px solid #E5E7EB',
                    background: page === pageNum ? '#EFF6FF' : 'white',
                    color: page === pageNum ? '#1578F7' : '#64748B', cursor: 'pointer',
                  }}
                >
                  {pageNum + 1}
                </button>
              )
            })}
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '5px 12px', fontSize: 11, fontWeight: 600, borderRadius: 8,
                border: '1px solid #E5E7EB', background: page >= totalPages - 1 ? '#F8FAFC' : 'white',
                color: page >= totalPages - 1 ? '#CBD5E1' : '#334155', cursor: page >= totalPages - 1 ? 'default' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Right: Call detail panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {selectedCall ? (
            <Card noPadding>
              {/* Call header */}
              <CardHeader title={selectedCall.business} badge={
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{selectedCall.phone}</span>
              } />
              <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* Date / Duration row */}
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CalendarClock size={13} color="#94A3B8" />
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{selectedCall.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Clock size={13} color="#94A3B8" />
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{selectedCall.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={13} color="#94A3B8" />
                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>{selectedCall.cost}</span>
                  </div>
                </div>

                {/* Outcome + Sentiment badges */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <StatusBadge variant={outcomeVariant(selectedCall.outcome)}>{selectedCall.outcome}</StatusBadge>
                  {sentimentBadge(selectedCall.sentiment)}
                  <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500, marginLeft: 4 }}>Stage: {selectedCall.stage}</span>
                </div>

                {/* AI Summary */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Sparkles size={13} color="#1578F7" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>AI Call Summary</span>
                  </div>
                  <div style={{
                    background: '#F8FAFC', borderRadius: 10, padding: '12px 14px',
                    fontSize: 12, lineHeight: 1.6, color: '#334155', border: '1px solid #F1F5F9',
                  }}>
                    {selectedCall.summary}
                  </div>
                </div>

                {/* Key Moments timeline */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                    <PlayCircle size={13} color="#1578F7" />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A' }}>Key Moments</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {selectedCall.keyMoments.map((m, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, position: 'relative', paddingBottom: idx < selectedCall.keyMoments.length - 1 ? 12 : 0, paddingLeft: 2 }}>
                        {/* Vertical line connector */}
                        {idx < selectedCall.keyMoments.length - 1 && (
                          <div style={{ position: 'absolute', left: 9, top: 14, width: 2, height: 'calc(100% - 6px)', background: '#E5E7EB', borderRadius: 1 }} />
                        )}
                        {/* Dot */}
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          background: idx === 0 ? '#DBEAFE' : idx === selectedCall.keyMoments.length - 1 ? '#D1FAE5' : '#F1F5F9',
                          border: `2px solid ${idx === 0 ? '#1578F7' : idx === selectedCall.keyMoments.length - 1 ? '#10B981' : '#CBD5E1'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: idx === 0 ? '#1578F7' : idx === selectedCall.keyMoments.length - 1 ? '#10B981' : '#94A3B8' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#1578F7', fontFamily: 'monospace', flexShrink: 0 }}>{m.time}</span>
                          <span style={{ fontSize: 12, color: '#334155', lineHeight: 1.4 }}>{m.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: 14 }}>
                  <button style={actionBtnStyle('#1578F7', '#EFF6FF', '#BFDBFE')}>
                    <CalendarPlus size={13} /> Schedule Follow-up
                  </button>
                  <button style={actionBtnStyle('#059669', '#ECFDF5', '#A7F3D0')}>
                    <PlusCircle size={13} /> Add to Pipeline
                  </button>
                  <button style={actionBtnStyle('#64748B', '#F8FAFC', '#E2E8F0')}>
                    <Ban size={13} /> Mark as Not Interested
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: '#94A3B8' }}>
                <ScrollText size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Select a call to view details</span>
              </div>
            </Card>
          )}
        </div>
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

  const renderRow = (label: string, value: string, icon?: typeof CheckCircle, iconColor?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F8FAFC' }}>
      <span style={cfgLabelStyle}>{label}</span>
      <span style={{ ...cfgValueStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon && (() => { const I = icon; return <I size={12} color={iconColor} strokeWidth={2.5} /> })()}
        {value}
      </span>
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
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={14} color="#1578F7" strokeWidth={2.5} />
              </div>
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
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Timer size={14} color="#D97706" strokeWidth={2.5} />
              </div>
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
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={14} color="#059669" strokeWidth={2.5} />
              </div>
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
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GitBranch size={14} color="#7C3AED" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Transfer Config</span>
            </div>
            {renderRow('Method', settingsConfig.transfer.method)}
            {renderRow('Target Number', settingsConfig.transfer.targetNumber)}
            {renderRow('Fallback', settingsConfig.transfer.fallback)}
            {renderRow('Min Qualification Score', String(settingsConfig.transfer.minQualScore))}
          </div>
        </div>
      </Card>

      {/* Compliance - full width */}
      <div style={{ gridColumn: 'span 2' }}>
        <Card noPadding>
          <CardHeader title="Compliance & Regulations" badge={
            <StatusBadge variant="emerald" dot>All Systems Active</StatusBadge>
          } />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={cfgCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #FFE4E6, #FECDD3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={14} color="#E11D48" strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>Compliance Settings</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  {renderRow('TCPA Compliant', settingsConfig.compliance.tcpa ? 'Active' : 'Inactive', settingsConfig.compliance.tcpa ? CheckCircle : XCircle, settingsConfig.compliance.tcpa ? '#10B981' : '#F43F5E')}
                  {renderRow('DNC List Active', settingsConfig.compliance.dncList ? 'Active' : 'Inactive', settingsConfig.compliance.dncList ? CheckCircle : AlertCircle, settingsConfig.compliance.dncList ? '#10B981' : '#F59E0B')}
                </div>
                <div>
                  {renderRow('DNC Last Sync', settingsConfig.compliance.dncLastSync)}
                  {renderRow('Call Recording', settingsConfig.compliance.callRecording ? 'Enabled' : 'Disabled', settingsConfig.compliance.callRecording ? CheckCircle : XCircle, settingsConfig.compliance.callRecording ? '#10B981' : '#F43F5E')}
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
