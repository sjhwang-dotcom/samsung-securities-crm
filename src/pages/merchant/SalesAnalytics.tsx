import { useState } from 'react'
import {
  BarChart3, ShoppingCart, DollarSign, TrendingUp,
  CreditCard, Percent, ChevronDown, ChevronUp, Tag,
} from 'lucide-react'
import { Card, CardHeader, KpiCard, DataTable } from '../../components/ui'
import type { Column } from '../../components/ui'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import portalData from '../../data/db/merchant_portal.json'

const tooltipStyle = { borderRadius: 10, fontSize: 11, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }

const COLORS = ['#3B82F6', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6']

/* ═══ Computed KPIs ═══ */
const totalItemsSold = portalData.topItems.reduce((s, i) => s + i.qtySold, 0)
const totalRevenue = portalData.dailyItemSales.reduce((s, d) => s + d.revenue, 0)
const totalOrders = portalData.hourlySales.reduce((s, h) => s + h.orders, 0)
const avgBasket = totalRevenue / totalOrders
const topCategory = portalData.categorySales.reduce((a, b) => a.revenue > b.revenue ? a : b)
const cardPay = portalData.paymentMethods.find(p => p.method === 'Card')
const cashPay = portalData.paymentMethods.find(p => p.method === 'Cash')
const totalPayCount = (cardPay?.count ?? 0) + (cashPay?.count ?? 0)
const cardPct = totalPayCount > 0 ? ((cardPay?.count ?? 0) / totalPayCount * 100).toFixed(0) : '0'
const cashPct = totalPayCount > 0 ? ((cashPay?.count ?? 0) / totalPayCount * 100).toFixed(0) : '0'
const totalProfit = portalData.topItems.reduce((s, i) => s + i.profit, 0)
const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue * 100).toFixed(1) : '0'

/* ═══ Chart Data ═══ */
const dailyData = portalData.dailyItemSales.map(d => ({
  date: d.date.slice(5),
  revenue: d.revenue,
  items: d.items,
}))

const hourlyData = portalData.hourlySales.map(h => ({
  hour: h.hour <= 12 ? `${h.hour}am` : `${h.hour - 12}pm`,
  orders: h.orders,
  revenue: h.revenue,
}))

/* fix 12pm label */
hourlyData.forEach(h => {
  if (h.hour === '0pm') h.hour = '12pm'
  if (h.hour === '0am') h.hour = '12am'
})

const categoryData = [...portalData.categorySales].sort((a, b) => b.revenue - a.revenue)

/* ═══ Table Types ═══ */
type TopItemRow = { name: string; category: string; price: number; qtySold: number; revenue: number; profit: number; margin: string }
type CatalogRow = { id: number; name: string; category: string; price: number; cost: number; sku: string; margin: string }

const topItemRows: TopItemRow[] = portalData.topItems.map(i => ({
  ...i,
  margin: ((i.profit / i.revenue) * 100).toFixed(1) + '%',
}))

const catalogRows: CatalogRow[] = portalData.catalog.map(c => ({
  ...c,
  margin: (((c.price - c.cost) / c.price) * 100).toFixed(1) + '%',
}))

export default function SalesAnalytics() {
  const [catalogOpen, setCatalogOpen] = useState(false)

  const topItemCols: Column<TopItemRow>[] = [
    { key: 'name', header: 'Item Name', render: (r) => <span style={{ fontWeight: 600, color: '#1E293B' }}>{r.name}</span> },
    { key: 'category', header: 'Category', render: (r) => <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569', fontWeight: 500 }}>{r.category}</span> },
    { key: 'price', header: 'Price', render: (r) => `$${r.price.toFixed(2)}` },
    { key: 'qtySold', header: 'Qty Sold', render: (r) => r.qtySold.toLocaleString() },
    { key: 'revenue', header: 'Revenue', render: (r) => <span style={{ fontWeight: 600 }}>${r.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> },
    { key: 'profit', header: 'Profit', render: (r) => <span style={{ color: '#059669', fontWeight: 600 }}>${r.profit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> },
    { key: 'margin', header: 'Margin %', render: (r) => <span style={{ fontWeight: 600 }}>{r.margin}</span> },
  ]

  const catalogCols: Column<CatalogRow>[] = [
    { key: 'sku', header: 'SKU', render: (r) => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#64748B' }}>{r.sku}</span> },
    { key: 'name', header: 'Item Name', render: (r) => <span style={{ fontWeight: 600, color: '#1E293B' }}>{r.name}</span> },
    { key: 'category', header: 'Category', render: (r) => <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#F1F5F9', color: '#475569', fontWeight: 500 }}>{r.category}</span> },
    { key: 'price', header: 'Price', render: (r) => `$${r.price.toFixed(2)}` },
    { key: 'cost', header: 'Cost', render: (r) => `$${r.cost.toFixed(2)}` },
    { key: 'margin', header: 'Margin %', render: (r) => <span style={{ fontWeight: 600, color: parseFloat(r.margin) > 50 ? '#059669' : '#D97706' }}>{r.margin}</span> },
  ]

  return (
    <div className="dashboard-grid">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <BarChart3 size={20} strokeWidth={2} color="#3B82F6" />
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', margin: 0 }}>POS Sales Analytics</h2>
          <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>PAX A920 Terminal -- 30-day item-level performance</p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 12 }}>
        <KpiCard label="Items Sold (30d)" value={totalItemsSold.toLocaleString()} icon={ShoppingCart} color="blue" sub="across all categories" />
        <KpiCard label="Total Revenue" value={`$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={DollarSign} color="emerald" sub="30-day period" />
        <KpiCard label="Avg Basket Size" value={`$${avgBasket.toFixed(2)}`} icon={TrendingUp} color="indigo" sub={`${totalOrders.toLocaleString()} orders`} />
        <KpiCard label="Top Category" value={topCategory.category} icon={Tag} color="amber" sub={`$${topCategory.revenue.toLocaleString()} rev`} />
        <KpiCard label="Card vs Cash" value={`${cardPct}% / ${cashPct}%`} icon={CreditCard} color="purple" sub={`${totalPayCount.toLocaleString()} transactions`} />
        <KpiCard label="Profit Margin" value={`${profitMargin}%`} icon={Percent} color="teal" sub={`$${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })} profit`} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {/* Daily Revenue Trend */}
        <Card>
          <CardHeader title="Daily Revenue Trend" subtitle="30-day item sales revenue" />
          <div style={{ padding: '0 16px 16px', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} tickFormatter={(v: any) => `$${v}`} width={50} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${Number(v).toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Revenue */}
        <Card>
          <CardHeader title="Category Revenue" subtitle="Revenue by product category" />
          <div style={{ padding: '0 16px 16px', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="revenue"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ category, percent }: any) => `${category} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#CBD5E1', strokeWidth: 1 }}
                  style={{ fontSize: 9 }}
                >
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Hourly Sales Pattern */}
        <Card>
          <CardHeader title="Hourly Sales Pattern" subtitle="Orders by hour of day" />
          <div style={{ padding: '0 16px 16px', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="hour" tick={{ fontSize: 9, fill: '#94A3B8' }} interval={1} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} width={35} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: any, name: any) => [name === 'revenue' ? `$${Number(v).toFixed(2)}` : v, name === 'revenue' ? 'Revenue' : 'Orders']} />
                <Bar dataKey="orders" fill="#6366F1" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Selling Items */}
      <Card>
        <CardHeader title="Top Selling Items" subtitle="Top 15 items by revenue -- last 30 days" />
        <DataTable columns={topItemCols} data={topItemRows} />
      </Card>

      {/* Product Catalog (expandable) */}
      <Card>
        <div
          onClick={() => setCatalogOpen(!catalogOpen)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', margin: 0 }}>Product Catalog</h3>
            <p style={{ fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>Full {portalData.catalog.length}-item catalog with pricing and margins</p>
          </div>
          {catalogOpen ? <ChevronUp size={16} color="#94A3B8" /> : <ChevronDown size={16} color="#94A3B8" />}
        </div>
        {catalogOpen && <DataTable columns={catalogCols} data={catalogRows} />}
      </Card>
    </div>
  )
}
