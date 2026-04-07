import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, ReferenceLine, PieChart, Pie,
} from 'recharts'
import {
  ShieldAlert, TrendingDown, Activity, Zap, CheckCircle2, Clock,
  AlertTriangle, Shield, Search, FileCheck, ArrowUpRight, ArrowDownRight,
  Users, Ban, Timer,
} from 'lucide-react'
import { KpiCard, Card, CardHeader, StatusBadge, DataTable } from '../components/ui'
import type { Column } from '../components/ui'
import { riskDistribution, riskByMCC, chargebackTrendData } from '../data/mockData'

/* ── Tooltip Style ── */
const tooltipStyle = {
  borderRadius: 10,
  fontSize: 11,
  border: '1px solid #E2E8F0',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}

/* ── Colors ── */
const BRAND = '#1578F7'
const SUCCESS = '#10B981'
const WARNING = '#F59E0B'
const DANGER = '#F43F5E'

/* ── Risk Distribution as counts (histogram) ── */
const riskHistogram = riskDistribution.map((d: any) => ({
  ...d,
  count: Math.round((d.pct / 100) * 1240),
}))

/* ── Risk Trend (12 months) ── */
const riskTrendData = [
  { month: 'May', score: 64 }, { month: 'Jun', score: 63 }, { month: 'Jul', score: 66 },
  { month: 'Aug', score: 68 }, { month: 'Sep', score: 65 }, { month: 'Oct', score: 67 },
  { month: 'Nov', score: 70 }, { month: 'Dec', score: 69 }, { month: 'Jan', score: 71 },
  { month: 'Feb', score: 73 }, { month: 'Mar', score: 72 }, { month: 'Apr', score: 72 },
]

/* ── Active Alerts ── */
type AlertRow = {
  merchant: string; alertType: string; riskScore: number; scoreChange: number;
  trigger: string; action: string; status: 'Critical' | 'High' | 'Moderate'
}
const alertData: AlertRow[] = [
  { merchant: 'Sunrise Deli', alertType: 'Velocity Spike', riskScore: 28, scoreChange: -37, trigger: 'Volume drop 42% + chargeback spike', action: 'Immediate review', status: 'Critical' },
  { merchant: 'Metro Tobacco', alertType: 'Compliance', riskScore: 35, scoreChange: -23, trigger: 'PCI non-compliant 90+ days', action: 'Compliance outreach', status: 'Critical' },
  { merchant: 'QuickLube Pro', alertType: 'Chargeback', riskScore: 41, scoreChange: -14, trigger: 'CB ratio 1.8% (3-month avg)', action: 'Chargeback program', status: 'High' },
  { merchant: 'GreenLeaf CBD', alertType: 'Sanctions', riskScore: 45, scoreChange: -8, trigger: 'Beneficial owner partial OFAC match', action: 'Enhanced due diligence', status: 'High' },
  { merchant: 'FastPay ATM', alertType: 'Volume Anomaly', riskScore: 52, scoreChange: -6, trigger: 'Weekend volume 3x weekday avg', action: 'Pattern analysis', status: 'Moderate' },
]

/* ── PCI Compliance ── */
const pciData = { compliant: 1084, nonCompliant: 47, pending: 68, expired: 41, total: 1240 }
const pciPct = Math.round((pciData.compliant / pciData.total) * 100)
const pciPieData = [
  { name: 'Compliant', value: pciData.compliant, color: SUCCESS },
  { name: 'Non-Compliant', value: pciData.nonCompliant, color: DANGER },
  { name: 'Pending', value: pciData.pending, color: WARNING },
  { name: 'Expired', value: pciData.expired, color: '#94A3B8' },
]
const nonCompliantMerchants = [
  { name: 'Metro Tobacco', daysPast: 94, lastScan: '2025-12-22' },
  { name: 'QuickLube Pro', daysPast: 61, lastScan: '2026-01-15' },
  { name: 'FastPay ATM', daysPast: 45, lastScan: '2026-02-01' },
  { name: 'NightOwl Vapes', daysPast: 38, lastScan: '2026-02-08' },
  { name: 'Cash4Gold LLC', daysPast: 32, lastScan: '2026-02-14' },
]

/* ── OFAC / Sanctions ── */
const ofacStats = {
  lastScan: '2026-04-07',
  merchantsScanned: 1240,
  matchesFound: 3,
  autoCleared: 1,
  pendingReview: 2,
  falsePositiveRate: '92%',
}

/* ── Underwriting Queue ── */
type UWRow = {
  merchant: string; mcc: string; estVolume: string; riskScore: number;
  submitted: string; slaHours: number; slaRemaining: number; assignee: string
}
const uwQueue: UWRow[] = [
  { merchant: 'BlueSky Supplements', mcc: '5499', estVolume: '$85K', riskScore: 38, submitted: '2026-04-07', slaHours: 24, slaRemaining: 6, assignee: 'Sarah M.' },
  { merchant: 'CryptoSwap Exchange', mcc: '6051', estVolume: '$420K', riskScore: 22, submitted: '2026-04-07', slaHours: 24, slaRemaining: 3, assignee: 'Sarah M.' },
  { merchant: 'VapeCentral Online', mcc: '5993', estVolume: '$65K', riskScore: 34, submitted: '2026-04-08', slaHours: 48, slaRemaining: 42, assignee: 'James L.' },
  { merchant: 'Lucky Dragon Casino', mcc: '7995', estVolume: '$310K', riskScore: 19, submitted: '2026-04-08', slaHours: 48, slaRemaining: 38, assignee: 'James L.' },
  { merchant: 'PetMeds Direct', mcc: '5912', estVolume: '$110K', riskScore: 61, submitted: '2026-04-08', slaHours: 48, slaRemaining: 46, assignee: 'Sarah M.' },
]

/* ── Column Definitions ── */
const alertColumns: Column<AlertRow>[] = [
  { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
  { key: 'alertType', header: 'Alert Type', render: (r) => (
    <StatusBadge variant={r.status === 'Critical' ? 'critical' : r.status === 'High' ? 'high' : 'moderate'}>
      {r.alertType}
    </StatusBadge>
  )},
  { key: 'riskScore', header: 'Risk Score', render: (r) => (
    <span style={{ fontWeight: 800, color: r.riskScore < 40 ? DANGER : r.riskScore < 55 ? WARNING : SUCCESS }}>{r.riskScore}</span>
  )},
  { key: 'scoreChange', header: 'Change', render: (r) => (
    <span style={{ color: DANGER, fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      <ArrowDownRight size={13} /> {r.scoreChange}
    </span>
  )},
  { key: 'trigger', header: 'Trigger', render: (r) => <span style={{ fontSize: 12, color: '#475569' }}>{r.trigger}</span> },
  { key: 'action', header: 'Recommended Action', render: (r) => <StatusBadge variant="rose">{r.action}</StatusBadge> },
  { key: 'status', header: 'Severity', render: (r) => (
    <StatusBadge variant={r.status === 'Critical' ? 'critical' : r.status === 'High' ? 'high' : 'moderate'} dot pulse={r.status === 'Critical'}>
      {r.status}
    </StatusBadge>
  )},
]

const uwColumns: Column<UWRow>[] = [
  { key: 'merchant', header: 'Merchant', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.merchant}</span> },
  { key: 'mcc', header: 'MCC', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>{r.mcc}</span> },
  { key: 'estVolume', header: 'Est. Volume' },
  { key: 'riskScore', header: 'Risk Score', render: (r) => (
    <span style={{ fontWeight: 800, color: r.riskScore < 40 ? DANGER : r.riskScore < 55 ? WARNING : SUCCESS }}>{r.riskScore}</span>
  )},
  { key: 'submitted', header: 'Submitted' },
  { key: 'slaRemaining', header: 'SLA Timer', render: (r) => {
    const urgent = r.slaRemaining <= 6
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: urgent ? DANGER : '#475569', fontWeight: urgent ? 700 : 500, fontSize: 13 }}>
        <Timer size={13} /> {r.slaRemaining}h / {r.slaHours}h
      </span>
    )
  }},
  { key: 'assignee', header: 'Assignee' },
]

/* ── Helper: Risk Score Ring ── */
function RiskScoreRing({ score, size = 120, label }: { score: number; size?: number; label: string }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const pct = score / 100
  const offset = circumference * (1 - pct)
  const color = score >= 70 ? SUCCESS : score >= 50 ? WARNING : DANGER

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={8} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div style={{ position: 'relative', marginTop: -size / 2 - 16, textAlign: 'center', marginBottom: size / 2 - 28 }}>
        <div style={{ fontSize: size / 3.5, fontWeight: 800, color }}>{score}</div>
        <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  )
}

export default function RiskUnderwriting() {
  return (
    <div className="dashboard-grid">

      {/* ════════════════ Risk Overview Banner ════════════════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
        borderRadius: 16, padding: '28px 32px', display: 'grid', gridTemplateColumns: '1fr auto',
        alignItems: 'center', gap: 32, color: '#F8FAFC',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <ShieldAlert size={28} color={BRAND} />
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>Agentic Risk Intelligence</span>
          </div>
          <p style={{ fontSize: 13, color: '#94A3B8', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
            Continuous portfolio monitoring powered by AI. Risk scores update in real-time
            across 1,240 active merchants with automated alert triage and resolution.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
            {[
              { label: 'Total Monitored', value: '1,240', icon: Users },
              { label: 'Alerts Active', value: '12', icon: AlertTriangle },
              { label: 'Auto-Resolved (30d)', value: '89', icon: Zap },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(21,120,247,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={17} color={BRAND} />
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <RiskScoreRing score={72} size={130} label="Portfolio Score" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: SUCCESS, fontWeight: 600 }}>
            <ArrowUpRight size={14} /> +3 pts vs last month
          </div>
        </div>
      </div>

      {/* ════════════════ KPI Row ════════════════ */}
      <div className="kpi-row">
        <KpiCard icon={Shield} label="Portfolio Risk Score" value="72 / 100" color="blue" trend="3 pts" trendDirection="up" trendPositive />
        <KpiCard icon={TrendingDown} label="Chargeback Rate" value="0.82%" color="emerald" trend="0.11%" trendDirection="down" trendPositive />
        <KpiCard icon={FileCheck} label="PCI Compliance" value={`${pciPct}%`} color="teal" trend="2.1%" trendDirection="up" trendPositive />
        <KpiCard icon={AlertTriangle} label="High Risk Merchants" value="7" color="rose" trend="2" trendDirection="down" trendPositive />
        <KpiCard icon={Zap} label="Auto-Resolved %" value="88.1%" color="purple" trend="4.2%" trendDirection="up" trendPositive />
        <KpiCard icon={Clock} label="Avg Risk Response" value="14 min" color="indigo" trend="vs 2.3h manual" trendDirection="down" trendPositive />
      </div>

      {/* ════════════════ Distribution + MCC ════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Risk Distribution Histogram */}
        <Card noPadding>
          <CardHeader title="Risk Score Distribution" subtitle="Merchant count by risk bucket" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskHistogram} barCategoryGap="18%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} merchants`, 'Count']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Merchants">
                  {riskHistogram.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 4 }}>
              {riskHistogram.map((d: any) => (
                <div key={d.range} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748B' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                  {d.label}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Risk by MCC */}
        <Card noPadding>
          <CardHeader title="Risk by MCC Category" subtitle="Average risk score per vertical" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={riskByMCC} layout="vertical" barCategoryGap="24%">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} width={90} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}`, 'Avg Score']} />
                <Bar dataKey="avgScore" radius={[0, 6, 6, 0]} name="Avg Score">
                  {riskByMCC.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ════════════════ Active Risk Alerts ════════════════ */}
      <Card noPadding>
        <CardHeader title="Active Risk Alerts" badge={<StatusBadge variant="rose" dot pulse>5 Active</StatusBadge>} />
        <DataTable columns={alertColumns} data={alertData} hoverable />
      </Card>

      {/* ════════════════ Chargeback Monitoring + Risk Trend ════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Chargeback Monitoring */}
        <Card noPadding>
          <CardHeader title="Chargeback Monitoring" subtitle="Portfolio rate vs network thresholds" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chargebackTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v: any) => `${v}%`} domain={[0, 2]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v}%`} />
                <ReferenceLine y={1.0} stroke={BRAND} strokeDasharray="6 3" strokeWidth={1.5}
                  label={{ value: 'Visa 1.0%', position: 'insideTopRight', fill: BRAND, fontSize: 10, fontWeight: 600 }} />
                <ReferenceLine y={1.5} stroke={DANGER} strokeDasharray="6 3" strokeWidth={1.5}
                  label={{ value: 'MC 1.5%', position: 'insideTopRight', fill: DANGER, fontSize: 10, fontWeight: 600 }} />
                <Line type="monotone" dataKey="portfolio" stroke={SUCCESS} strokeWidth={2.5} dot={false} name="Portfolio" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 4 }}>
              {[
                { label: 'Portfolio Rate', color: SUCCESS },
                { label: 'Visa Threshold', color: BRAND },
                { label: 'Mastercard Threshold', color: DANGER },
              ].map((l) => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#64748B' }}>
                  <div style={{ width: 14, height: 2, background: l.color, borderRadius: 1 }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 12-Month Risk Trend */}
        <Card noPadding>
          <CardHeader title="Portfolio Risk Trend" subtitle="12-month score evolution" />
          <div style={{ padding: '0 18px 18px' }}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={riskTrendData}>
                <defs>
                  <linearGradient id="riskTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} domain={[55, 80]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} / 100`, 'Risk Score']} />
                <Line type="monotone" dataKey="score" stroke={BRAND} strokeWidth={2.5}
                  dot={{ r: 3, fill: BRAND, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: BRAND }} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ════════════════ PCI Compliance + OFAC/Sanctions ════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* PCI Compliance Dashboard */}
        <Card noPadding>
          <CardHeader title="PCI Compliance Dashboard" badge={<StatusBadge variant={pciPct >= 85 ? 'emerald' : 'amber'}>{pciPct}% Compliant</StatusBadge>} />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'start' }}>
              {/* Pie ring */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pciPieData} cx="50%" cy="50%" innerRadius={42} outerRadius={62}
                      dataKey="value" strokeWidth={0} startAngle={90} endAngle={-270}>
                      {pciPieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `${v} merchants`} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 4 }}>
                  {pciPieData.map((d) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748B' }}>
                      <div style={{ width: 7, height: 7, borderRadius: 2, background: d.color }} />
                      {d.name}
                    </div>
                  ))}
                </div>
              </div>
              {/* Breakdown + non-compliant list */}
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Compliant', value: pciData.compliant, color: SUCCESS },
                    { label: 'Non-Compliant', value: pciData.nonCompliant, color: DANGER },
                    { label: 'Pending', value: pciData.pending, color: WARNING },
                    { label: 'Expired', value: pciData.expired, color: '#94A3B8' },
                  ].map((s) => (
                    <div key={s.label} style={{ padding: '8px 12px', background: '#FAFBFC', borderRadius: 8, borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', marginBottom: 6 }}>Non-Compliant Merchants</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {nonCompliantMerchants.slice(0, 4).map((m) => (
                    <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '4px 0', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ fontWeight: 500, color: '#0F172A' }}>{m.name}</span>
                      <span style={{ color: DANGER, fontWeight: 600, fontSize: 11 }}>{m.daysPast}d overdue</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* OFAC / Sanctions Screening */}
        <Card noPadding>
          <CardHeader title="OFAC / Sanctions Screening" badge={<StatusBadge variant="emerald" dot>Automated</StatusBadge>} />
          <div style={{ padding: '0 18px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Merchants Scanned', value: ofacStats.merchantsScanned.toLocaleString(), icon: Search, color: BRAND },
                { label: 'Matches Found', value: String(ofacStats.matchesFound), icon: AlertTriangle, color: WARNING },
                { label: 'Auto-Cleared', value: String(ofacStats.autoCleared), icon: CheckCircle2, color: SUCCESS },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center', padding: 16, background: '#FAFBFC', borderRadius: 10 }}>
                  <s.icon size={20} color={s.color} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Last Full Scan', value: ofacStats.lastScan },
                { label: 'Pending Review', value: `${ofacStats.pendingReview} matches`, highlight: true },
                { label: 'False Positive Rate', value: ofacStats.falsePositiveRate },
                { label: 'Scan Frequency', value: 'Daily (automated)' },
              ].map((row) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 12px', background: '#FAFBFC', borderRadius: 8, fontSize: 13,
                }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ fontWeight: 600, color: row.highlight ? WARNING : '#0F172A' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ════════════════ Underwriting Queue ════════════════ */}
      <Card noPadding>
        <CardHeader title="Underwriting Queue" badge={<StatusBadge variant="amber" dot pulse>{uwQueue.length} Pending</StatusBadge>}
          subtitle="Applications awaiting manual review" />
        <DataTable columns={uwColumns} data={uwQueue} hoverable />
      </Card>

      {/* ════════════════ Model Performance ════════════════ */}
      <Card noPadding>
        <CardHeader title="AI Risk Model Performance" subtitle="Model v4.2 -- trained on 120K+ merchant profiles, updated weekly" />
        <div style={{ padding: '0 18px 18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Precision', value: '94.2%', icon: Activity, color: SUCCESS },
              { label: 'Recall', value: '91.8%', icon: Activity, color: SUCCESS },
              { label: 'False Positive Rate', value: '2.1%', icon: Ban, color: WARNING },
              { label: 'False Negative Rate', value: '0.8%', icon: Ban, color: SUCCESS },
            ].map((m) => (
              <div key={m.label} style={{ textAlign: 'center', padding: 20, background: '#FAFBFC', borderRadius: 12, border: '1px solid #F1F5F9' }}>
                <m.icon size={18} color={m.color} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 26, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: 500 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
