import type { ReactNode } from 'react'

interface ActivityFeedProps {
  items: { text: string | ReactNode; time: string; dot?: string }[]
  maxItems?: number
}

const dotColors: Record<string, string> = {
  green: '#10B981',
  blue: '#3B82F6',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
}

/** Activity/event feed matching PPTX "Recent Activity" pattern */
export default function ActivityFeed({ items, maxItems }: ActivityFeedProps) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items

  return (
    <div className="activity-feed">
      {displayItems.map((item, i) => (
        <div key={i} className="activity-item">
          <span
            className="activity-dot"
            style={{ background: dotColors[item.dot || 'green'] }}
          />
          <span className="activity-text">{item.text}</span>
          <span className="activity-time">{item.time}</span>
        </div>
      ))}
    </div>
  )
}
