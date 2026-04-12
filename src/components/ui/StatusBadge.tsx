type BadgeVariant = 'teal' | 'emerald' | 'amber' | 'rose' | 'blue' | 'indigo' | 'purple' | 'gray'
  | 'critical' | 'high' | 'moderate' | 'inactive' | 'live' | 'primary'

interface StatusBadgeProps {
  children?: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
  /** Convenience: pass a status string to auto-resolve variant & label */
  status?: string
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

/** Map status strings to variants */
const statusVariantMap: Record<string, BadgeVariant> = {
  // Severity
  'CRITICAL': 'critical',
  'WARNING': 'amber',
  'WATCH': 'moderate',
  'HIGH': 'high',
  'MEDIUM': 'amber',
  'LOW': 'teal',
  // Priority
  'URGENT': 'critical',
  'THIS_WEEK': 'amber',
  'THIS_MONTH': 'blue',
  'MONITOR': 'gray',
  // Status
  'Active': 'emerald',
  'Resolved': 'teal',
  'Acknowledged': 'blue',
  'Pending': 'amber',
  'In Progress': 'blue',
  'Completed': 'emerald',
  'Overdue': 'critical',
  'New': 'indigo',
  'Expired': 'gray',
  // Recommendation
  'BUY': 'emerald',
  'HOLD': 'amber',
  'SELL': 'rose',
  // Sentiment
  'Positive': 'emerald',
  'Neutral': 'gray',
  'Negative': 'rose',
  // Event status
  '예정': 'blue',
  '완료': 'emerald',
  '취소': 'gray',
  // Tier
  'Platinum': 'purple',
  'Gold': 'amber',
  'Silver': 'gray',
  'Bronze': 'moderate',
  // At Risk
  'At Risk': 'critical',
}

export default function StatusBadge({ children, variant, size = 'sm', dot, pulse, status }: StatusBadgeProps) {
  const resolvedVariant = variant || (status ? statusVariantMap[status] || 'gray' : 'teal')
  const label = children || status || ''
  const sizeClass = size === 'lg' ? 'badge--lg' : size === 'md' ? 'badge--md' : 'badge--sm'

  return (
    <span className={`harlow-badge ${variantMap[resolvedVariant]} ${sizeClass}`}>
      {dot && <span className={`badge-dot ${pulse ? 'badge-dot--pulse' : ''}`} />}
      {label}
    </span>
  )
}
