import type { ReactNode } from 'react'

/* ── Column definition for DataTable ── */
export interface Column<T> {
  key: string
  header: string
  render?: (row: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  compact?: boolean
  striped?: boolean
  hoverable?: boolean
  onRowClick?: (row: T, index: number) => void
}

/** Reusable data table matching PPTX table style — gray header, clean rows, proper alignment */
export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  compact,
  striped,
  hoverable = true,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="harlow-table-wrapper">
      <table className={`harlow-table ${compact ? 'harlow-table--compact' : ''}`}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: col.align || 'left', width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={`
                ${striped && i % 2 === 1 ? 'row--striped' : ''}
                ${hoverable ? 'row--hoverable' : ''}
                ${onRowClick ? 'row--clickable' : ''}
              `}
              onClick={() => onRowClick?.(row, i)}
            >
              {columns.map(col => (
                <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row, i) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
