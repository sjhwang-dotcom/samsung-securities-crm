import type { LucideIcon } from 'lucide-react'

type KpiColor = 'teal' | 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple'

export interface KpiCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  color?: string
  trend?: string
  trendDirection?: 'up' | 'down'
  trendPositive?: boolean
}

const iconColors: Record<KpiColor, { bg: string; icon: string; shadow: string }> = {
  teal:    { bg: 'linear-gradient(135deg, #E8F0FE, #99F6E4)', icon: '#1578F7', shadow: '0 2px 6px rgba(13,148,136,0.12)' },
  blue:    { bg: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', icon: '#2563EB', shadow: '0 2px 6px rgba(37,99,235,0.12)' },
  indigo:  { bg: 'linear-gradient(135deg, #E0E7FF, #C7D2FE)', icon: '#4F46E5', shadow: '0 2px 6px rgba(79,70,229,0.12)' },
  emerald: { bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', icon: '#059669', shadow: '0 2px 6px rgba(5,150,105,0.12)' },
  amber:   { bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', icon: '#D97706', shadow: '0 2px 6px rgba(217,119,6,0.12)' },
  rose:    { bg: 'linear-gradient(135deg, #FFE4E6, #FECDD3)', icon: '#E11D48', shadow: '0 2px 6px rgba(225,29,72,0.12)' },
  purple:  { bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', icon: '#7C3AED', shadow: '0 2px 6px rgba(124,58,237,0.12)' },
}

export default function KpiCard({ label, value, sub, icon: Icon, color = 'teal', trend, trendDirection, trendPositive }: KpiCardProps) {
  const scheme = iconColors[color as KpiColor] || iconColors['teal']
  const trendColor = trendPositive ? '#059669' : '#E11D48'
  const arrow = trendDirection === 'up' ? '▲' : '▼'

  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: scheme.bg, boxShadow: scheme.shadow }}>
        <Icon size={14} strokeWidth={2} color={scheme.icon} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="kpi-label">{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <div className="kpi-value">{value}</div>
          {trend && (
            <span className="kpi-trend" style={{ color: trendColor, fontSize: 10, fontWeight: 600 }}>
              {arrow} {trend}
            </span>
          )}
        </div>
        {sub && <span className="kpi-sub" style={{ fontSize: 10, color: '#94A3B8' }}>{sub}</span>}
      </div>
    </div>
  )
}
