/**
 * WaterfallChart - ApexCharts rangeBar waterfall
 * Ported from AIP/framework WaterfallChart.jsx
 */
import { useState, useEffect, useRef } from 'react'
import Chart from 'react-apexcharts'
import type { ApexOptions } from 'apexcharts'

interface WaterfallItem {
  category: string
  value: number
  type: 'total' | 'delta'
}

interface WaterfallChartProps {
  data: WaterfallItem[]
  height?: number
  formatValue?: (v: number) => string
}

export default function WaterfallChart({
  data = [],
  height = 220,
  formatValue = (v) => `$${Math.abs(v).toFixed(1)}M`,
}: WaterfallChartProps) {
  if (!data || data.length === 0) return null

  // Build waterfall series — calculate cumulative positions
  let cumulative = 0
  const seriesData = data.map((item) => {
    if (item.type === 'total') {
      cumulative = item.value
      return {
        x: item.category,
        y: [0, item.value],
        fillColor: '#1578F7',
      }
    } else {
      const start = cumulative
      const end = cumulative + item.value
      cumulative = end
      const fillColor = item.value > 0 ? '#10B981' : item.value < 0 ? '#EF4444' : '#94A3B8'
      return {
        x: item.category,
        y: item.value >= 0 ? [start, end] : [end, start],
        fillColor,
      }
    }
  })

  const options: ApexOptions = {
    chart: {
      type: 'rangeBar',
      toolbar: { show: false },
      fontFamily: "'Inter', system-ui, sans-serif",
      animations: { enabled: true, speed: 300 },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 4,
        rangeBarOverlap: true,
        rangeBarGroupRows: false,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (_val: any, opts: any) => {
        const item = data[opts.dataPointIndex]
        if (item.type === 'total') return formatValue(item.value)
        return item.value >= 0 ? `+${formatValue(item.value)}` : `-${formatValue(Math.abs(item.value))}`
      },
      style: { fontSize: '10px', fontWeight: '600', colors: ['#334155'] },
      offsetY: -4,
    },
    xaxis: {
      categories: data.map((d) => d.category),
      labels: {
        style: { fontSize: '10px', colors: '#94A3B8', fontWeight: '500' },
        rotate: 0,
      },
      axisBorder: { show: true, color: '#E2E8F0' },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: formatValue,
        style: { fontSize: '10px', colors: '#94A3B8' },
      },
    },
    grid: {
      borderColor: '#F1F5F9',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      custom: ({ dataPointIndex }: any) => {
        const item = data[dataPointIndex]
        const sign = item.value >= 0 ? '+' : ''
        return `<div style="padding:8px 12px;background:#0F172A;color:white;border-radius:8px;font-size:12px;box-shadow:0 4px 12px rgba(0,0,0,0.15)">
          <div style="font-weight:700;margin-bottom:2px">${item.category}</div>
          <div>${item.type === 'total' ? '' : sign}${formatValue(item.value)}</div>
        </div>`
      },
    },
    colors: data.map((d) => {
      if (d.type === 'total') return '#1578F7'
      if (d.value > 0) return '#10B981'
      if (d.value < 0) return '#EF4444'
      return '#94A3B8'
    }),
    legend: { show: false },
  }

  const series = [{ name: 'Value', data: seriesData }]

  const containerRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(300)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w > 20) setChartWidth(w)
      }
    })
    ro.observe(el)
    // Initial measurement
    const w = el.getBoundingClientRect().width
    if (w > 20) setChartWidth(w)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: 0 }}>
      <Chart options={options} series={series} type="rangeBar" height={height} width={chartWidth} />
    </div>
  )
}
