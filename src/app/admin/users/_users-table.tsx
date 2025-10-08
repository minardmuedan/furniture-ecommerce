'use client'

import { buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableNoResult, TableRow } from '@/components/ui/table'
import { flexRender, getCoreRowModel, useReactTable, VisibilityColumn, VisibilityState } from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import ResizeHandler from '../_components/resize-handler'
import { defaultUserColumns } from './_users-columns'
import { AdminUserType } from './_users-type'
import { Checkbox } from '@/components/ui/checkbox'

export default function AdminUsersTable({ initialUser }: { initialUser: AdminUserType[] }) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ id: false, updatedAt: false })
  const table = useReactTable({
    data: initialUser,
    columns: defaultUserColumns,
    getCoreRowModel: getCoreRowModel(),

    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: 'onChange',
  })

  const hideableColumn = table.getAllColumns().filter(column => column.getCanHide())

  return (
    <>
      <div className="flex items-center justify-between pb-2">
        search here..
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'self-end' })}>
            Columns <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {hideableColumn.map(column => (
              <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={value => column.toggleVisibility(!!value)}>
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table style={{ width: table.getTotalSize() }} className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} style={{ width: header.getSize() }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanResize() && <ResizeHandler onResize={header.getResizeHandler()} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableNoResult columnLength={defaultUserColumns.length} />
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
