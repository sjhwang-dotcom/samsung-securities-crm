import { FileText, Download } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui'

const statements = [
  { month: 'February 2026', date: 'Mar 5, 2026', volume: '$47,230', fees: '$3,124.80', net: '$44,105.20', pages: 4 },
  { month: 'January 2026', date: 'Feb 5, 2026', volume: '$43,610', fees: '$2,891.40', net: '$40,718.60', pages: 4 },
  { month: 'December 2025', date: 'Jan 5, 2026', volume: '$51,890', fees: '$3,442.10', net: '$48,447.90', pages: 4 },
  { month: 'November 2025', date: 'Dec 5, 2025', volume: '$39,220', fees: '$2,598.70', net: '$36,621.30', pages: 3 },
  { month: 'October 2025', date: 'Nov 5, 2025', volume: '$41,340', fees: '$2,740.50', net: '$38,599.50', pages: 3 },
  { month: 'September 2025', date: 'Oct 5, 2025', volume: '$38,770', fees: '$2,570.90', net: '$36,199.10', pages: 3 },
]

export default function Statements() {
  return (
    <div className="dashboard-grid">
      <Card noPadding>
        <CardHeader title="Monthly Statements" subtitle="Processing statements with fee breakdown" />
        <div style={{ padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {statements.map(s => (
            <div key={s.month} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              border: '1px solid #E5E7EB', borderRadius: 10, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = '#CBD5E1'; (e.currentTarget as HTMLElement).style.background = '#FAFBFC' }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB'; (e.currentTarget as HTMLElement).style.background = 'white' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={18} color="#3B82F6" strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{s.month}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2, fontWeight: 500 }}>Generated {s.date} &middot; {s.pages} pages</div>
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: 12, fontWeight: 500, color: '#64748B' }}>
                <div><span style={{ color: '#94A3B8', marginRight: 4 }}>Volume:</span><span style={{ fontWeight: 600, color: '#0F172A' }}>{s.volume}</span></div>
                <div><span style={{ color: '#94A3B8', marginRight: 4 }}>Fees:</span><span style={{ fontWeight: 600, color: '#EF4444' }}>{s.fees}</span></div>
                <div><span style={{ color: '#94A3B8', marginRight: 4 }}>Net:</span><span style={{ fontWeight: 700, color: '#059669' }}>{s.net}</span></div>
              </div>
              <button style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', flexShrink: 0 }}>
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
