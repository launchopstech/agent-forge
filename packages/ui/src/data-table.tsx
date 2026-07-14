'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type TableOptions,
  type Table as TanstackTable,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { cn } from './utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

// ─── Types ───────────────────────────────────────────────────────────────────

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Optional header rendered above the table (e.g. title row) */
  header?: React.ReactNode
  /** Optional footer rendered below the table (e.g. pagination) */
  footer?: React.ReactNode
  /** Render a custom mobile card for each row (CSS hidden/shown) */
  mobileCard?: (row: TData) => React.ReactNode
  /** Message shown when the table is empty */
  emptyMessage?: string
  /** Additional table options forwarded to useReactTable */
  tableOptions?: Partial<Omit<TableOptions<TData>, 'data' | 'columns' | 'getCoreRowModel'>>
  /** Called when a row is clicked */
  onRowClick?: (row: TData) => void
  /** Exposes the table instance for external control */
  tableRef?: React.Ref<TanstackTable<TData>>
  className?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

function DataTableInner<TData, TValue>(
  {
    columns,
    data,
    header,
    footer,
    mobileCard,
    emptyMessage = 'No results.',
    tableOptions,
    onRowClick,
    tableRef,
    className,
  }: DataTableProps<TData, TValue>,
  _ref: React.Ref<HTMLDivElement>
) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...tableOptions,
  })

  // Expose table instance
  React.useImperativeHandle(tableRef, () => table, [table])

  return (
    <div
      ref={_ref}
      className={cn(
        'rounded-xl border flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden',
        className
      )}
    >
      {header}

      {/* ── Desktop table ── */}
      <div className="hidden sm:flex sm:flex-col lg:flex-1 lg:min-h-0 overflow-x-auto lg:overflow-y-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((headerCell) => (
                  <TableHead key={headerCell.id} className="px-3">
                    {headerCell.isPlaceholder
                      ? null
                      : flexRender(headerCell.column.columnDef.header, headerCell.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'hover:bg-muted/50 transition-colors',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2.5 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Mobile card view ── */}
      {mobileCard && (
        <div className="sm:hidden flex-1 min-h-0 overflow-y-auto">
          <div className="divide-y">
            {data.length > 0 ? (
              data.map((row, i) => <React.Fragment key={i}>{mobileCard(row)}</React.Fragment>)
            ) : (
              <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* If no mobileCard, show the table on mobile too */}
      {!mobileCard && (
        <div className="sm:hidden flex-1 min-h-0 overflow-x-auto overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((headerCell) => (
                    <TableHead key={headerCell.id} className="px-3">
                      {headerCell.isPlaceholder
                        ? null
                        : flexRender(headerCell.column.columnDef.header, headerCell.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'hover:bg-muted/50 transition-colors',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-3 py-2.5 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {footer}
    </div>
  )
}

// Forward ref while keeping generics
const DataTable = React.forwardRef(DataTableInner) as <TData, TValue>(
  props: DataTableProps<TData, TValue> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement

export { DataTable, type DataTableProps }
export { type ColumnDef } from '@tanstack/react-table'
