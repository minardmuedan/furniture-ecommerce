'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Fragment } from 'react'

type Data = { id: number; name: string; status: string; payment: number }

const datas = [
  { id: 1, name: 'aminard', email: 'someemail12asd325@example.com', createdAt: new Date().toString(), status: 'pending', payment: 350.0 },
  { id: 2, name: 'bjohn', email: 'someemail12asd325@example.com', createdAt: new Date().toString(), status: 'success', payment: 910.0 },
  { id: 3, name: 'cmatthew', email: 'someemail12asd325@example.com', createdAt: new Date().toString(), status: 'pending', payment: 295.0 },
  { id: 5, name: 'emark', email: 'someemail12asd325@example.com', createdAt: new Date().toString(), status: 'pending', payment: 295.0 },
  { id: 4, name: 'dluke', email: 'someemail12asd325@example.com', createdAt: new Date().toString(), status: 'pending', payment: 295.0 },
]

const defaultColumns: ColumnDef<Data>[] = [
  { accessorKey: 'id', minSize: 10, header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'payment', header: 'Payment' },
  { accessorKey: 'createdAt', header: 'Created At' },
]

export default function ProductTable() {
  const table = useReactTable({
    data: datas,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  })

  const headerGroup = table.getHeaderGroups()
  const rowModel = table.getRowModel().rows

  return (
    <div className="rounded-md border">
      <Table style={{ width: table.getTotalSize() }} className="table-fixed">
        <TableHeader>
          {headerGroup.map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} style={{ width: `${header.getSize()}px` }} className="relative">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    className="absolute top-0 -right-1 h-full w-2.5 cursor-col-resize touch-none border-r select-none"
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                  ></div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rowModel.length ? (
            rowModel.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <NoResult />
          )}
        </TableBody>
      </Table>
    </div>
  )
}

const NoResult = () => (
  <TableRow>
    <TableCell colSpan={defaultColumns.length} className="h-24 text-center">
      No results.
    </TableCell>
  </TableRow>
)
