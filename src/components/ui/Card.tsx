import type { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'

interface CardProps {
  children: ReactNode
  className?: string
  noPadding?: boolean
  style?: React.CSSProperties
}

interface CardHeaderProps {
  title: string
  badge?: ReactNode
  action?: ReactNode
  subtitle?: string
  menu?: boolean
}

/** White panel card — the primary container component matching PPTX cards */
export function Card({ children, className = '', noPadding, style }: CardProps) {
  return (
    <div className={`harlow-card ${className}`} style={{ ...(noPadding ? { padding: 0 } : {}), ...style }}>
      {children}
    </div>
  )
}

/** Card header with title, optional badge, optional action/menu */
export function CardHeader({ title, badge, action, subtitle, menu }: CardHeaderProps) {
  return (
    <div className="card-header">
      <div className="card-header-left">
        <h3 className="card-title">{title}</h3>
        {badge}
        {subtitle && <span className="card-subtitle">{subtitle}</span>}
      </div>
      <div className="card-header-right">
        {action}
        {menu && (
          <button className="card-menu-btn">
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
