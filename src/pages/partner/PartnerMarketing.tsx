import {
  FileText, Download, Link2,
  MousePointerClick, ClipboardCheck, Copy, CheckCircle,
} from 'lucide-react'
import { Card, CardHeader, StatusBadge, KpiCard, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'

interface Asset {
  id: number
  name: string
  type: string
  format: string
  updated: string
  downloads: number
}

const assets: Asset[] = [
  { id: 1, name: 'Harlow Rate Sheet — Retail', type: 'Rate Sheet', format: 'PDF', updated: 'Mar 2026', downloads: 128 },
  { id: 2, name: 'Harlow Rate Sheet — Restaurant', type: 'Rate Sheet', format: 'PDF', updated: 'Mar 2026', downloads: 94 },
  { id: 3, name: 'Harlow Rate Sheet — E-Commerce', type: 'Rate Sheet', format: 'PDF', updated: 'Mar 2026', downloads: 67 },
  { id: 4, name: 'Harlow One-Pager — General', type: 'One-Pager', format: 'PDF', updated: 'Feb 2026', downloads: 212 },
  { id: 5, name: 'Harlow vs. Square Comparison', type: 'Comparison Card', format: 'PDF', updated: 'Feb 2026', downloads: 156 },
  { id: 6, name: 'Harlow vs. Clover Comparison', type: 'Comparison Card', format: 'PDF', updated: 'Feb 2026', downloads: 134 },
  { id: 7, name: 'Harlow vs. Toast Comparison', type: 'Comparison Card', format: 'PDF', updated: 'Jan 2026', downloads: 89 },
  { id: 8, name: 'Partner Referral Brochure', type: 'Brochure', format: 'PDF', updated: 'Jan 2026', downloads: 78 },
]

const assetCols: Column<Asset>[] = [
  { key: 'name', header: 'Asset', render: (r) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: '#F0FDF4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <FileText size={14} color="#10B981" strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: 12 }}>{r.name}</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>{r.format}</div>
      </div>
    </div>
  )},
  { key: 'type', header: 'Type', render: (r) => <StatusBadge variant="blue">{r.type}</StatusBadge> },
  { key: 'updated', header: 'Updated', render: (r) => <span style={{ fontSize: 11, color: '#64748B' }}>{r.updated}</span> },
  { key: 'downloads', header: 'Downloads', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.downloads}</span> },
  { key: 'action', header: '', width: '80px', render: () => (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
      background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: 6,
      fontSize: 11, fontWeight: 600, color: '#059669', cursor: 'pointer',
    }}>
      <Download size={12} /> Download
    </button>
  )},
]

interface CobrandRow { name: string; type: string; status: string }
const cobrandAssets: CobrandRow[] = [
  { name: 'Co-branded Rate Sheet — Acme Financial', type: 'Rate Sheet', status: 'Ready' },
  { name: 'Co-branded One-Pager — Acme Financial', type: 'One-Pager', status: 'Ready' },
  { name: 'Co-branded Application — Acme Financial', type: 'Application', status: 'Ready' },
  { name: 'Custom Landing Page — Acme Financial', type: 'Web Page', status: 'Live' },
]

const cobrandCols: Column<CobrandRow>[] = [
  { key: 'name', header: 'Asset', render: (r) => <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.name}</span> },
  { key: 'type', header: 'Type', render: (r) => <StatusBadge variant="indigo">{r.type}</StatusBadge> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge variant={r.status === 'Live' ? 'emerald' : 'blue'} dot>{r.status}</StatusBadge> },
  { key: 'action', header: '', width: '80px', render: () => (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px',
      background: '#F0FDF4', border: '1px solid #D1FAE5', borderRadius: 6,
      fontSize: 11, fontWeight: 600, color: '#059669', cursor: 'pointer',
    }}>
      <Download size={12} /> Get
    </button>
  )},
]

export default function PartnerMarketing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Shareable Link */}
      <Card>
        <CardHeader title="Merchant Application Link" subtitle="Share this link with prospects for attributed referrals" />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 8,
          padding: '12px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #D1FAE5',
        }}>
          <Link2 size={16} color="#10B981" />
          <code style={{ flex: 1, fontSize: 13, color: '#059669', fontWeight: 600, fontFamily: 'monospace' }}>
            https://apply.harlowpayments.com/partner/jw-2849
          </code>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px',
            background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white',
            border: 'none', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}>
            <Copy size={12} /> Copy Link
          </button>
        </div>
      </Card>

      {/* Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <KpiCard label="Link Clicks" value="284" icon={MousePointerClick} color="emerald" trend="+18%" trendDirection="up" trendPositive sub="this month" />
        <KpiCard label="Form Starts" value="42" icon={ClipboardCheck} color="blue" trend="+12%" trendDirection="up" trendPositive sub="from clicks" />
        <KpiCard label="Form Completions" value="18" icon={CheckCircle} color="teal" trend="+8%" trendDirection="up" trendPositive sub="conversion: 6.3%" />
        <KpiCard label="Asset Downloads" value="156" icon={Download} color="purple" sub="this month" />
      </div>

      {/* Assets Table */}
      <Card noPadding>
        <div style={{ padding: '16px 16px 0' }}>
          <CardHeader title="Marketing Assets" subtitle="Download and share with prospects" />
        </div>
        <DataTable columns={assetCols} data={assets} />
      </Card>

      {/* Co-branded */}
      <Card noPadding>
        <div style={{ padding: '16px 16px 0' }}>
          <CardHeader title="Co-Branded Materials" subtitle="Customized for Acme Financial Partners" />
        </div>
        <DataTable columns={cobrandCols} data={cobrandAssets} />
      </Card>
    </div>
  )
}
