type BadgeVariant = 'teal' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'purple' | 'gray'
  | 'critical' | 'high' | 'moderate' | 'inactive' | 'live' | 'primary'

interface StatusBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
}

const variantMap: Record<BadgeVariant, string> = {
  teal:     'badge--teal',
  emerald:  'badge--emerald',
  amber:    'badge--amber',
  rose:     'badge--rose',
  blue:     'badge--blue',
  indigo:   'badge--indigo',
  purple:   'badge--purple',
  gray:     'badge--gray',
  critical: 'badge--critical',
  high:     'badge--high',
  moderate: 'badge--moderate',
  inactive: 'badge--inactive',
  live:     'badge--live',
  primary:  'badge--primary',
}

/** Reusable status badge — for CRITICAL/HIGH/MODERATE/INACTIVE, Active/Primary, Live, etc. */
export default function StatusBadge({ children, variant = 'teal', size = 'sm', dot, pulse }: StatusBadgeProps) {
  const sizeClass = size === 'lg' ? 'badge--lg' : size === 'md' ? 'badge--md' : 'badge--sm'

  return (
    <span className={`harlow-badge ${variantMap[variant]} ${sizeClass}`}>
      {dot && <span className={`badge-dot ${pulse ? 'badge-dot--pulse' : ''}`} />}
      {children}
    </span>
  )
}
