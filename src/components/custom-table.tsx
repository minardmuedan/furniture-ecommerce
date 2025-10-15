import ColumnDropdown from '@/components/column-dropdown'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableNoResult, TableRow } from '@/components/ui/table'
import { Column, flexRender, Table as ReactTable } from '@tanstack/react-table'
import { ArrowUpDown, MoveDown, MoveUp, Search } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'
import { InView } from 'react-intersection-observer'
import { Button } from './ui/button'

type InfiniteQueryProps = { dataLength: number; maxDataLength: number; hasNextPage: boolean; isFetchingNextPage: boolean; fetchNextPage: () => void }
type ProductsTableProps<TData> = { table: ReactTable<TData>; disabled: boolean; infiniteQuery?: InfiniteQueryProps }

export default function CustomReactTable<TData>({ table, disabled, infiniteQuery }: ProductsTableProps<TData>) {
  const visibleFlatColumn = table.getVisibleFlatColumns()

  return (
    <Table disabled={disabled}>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className="text-muted-foreground">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          <>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}

            {infiniteQuery && (
              <InView
                rootMargin="100px 0px"
                onChange={inView => {
                  if (inView && !infiniteQuery.isFetchingNextPage) infiniteQuery.fetchNextPage()
                }}
              >
                {({ ref }) =>
                  [...Array(Math.min(infiniteQuery.maxDataLength - infiniteQuery.dataLength, 5))].map((_, i) => (
                    <TableRow ref={i === 0 ? ref : null} key={`${infiniteQuery.dataLength}-${i}`} className="pointer-events-none opacity-50">
                      {visibleFlatColumn.map(column => (
                        <TableCell key={column.id}>
                          <Skeleton className="h-6" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                }
              </InView>
            )}
          </>
        ) : (
          <TableNoResult />
        )}
      </TableBody>
    </Table>
  )
}

type NavbarProps<TData> = {
  search: string
  placeholder: string
  columns: Column<TData>[]
  setSearch: Dispatch<SetStateAction<string>>
}

export function CustomReactTableNavbar<TData>({ columns, placeholder, search, setSearch }: NavbarProps<TData>) {
  return (
    <nav className="mb-2 flex items-center justify-between gap-2">
      <InputGroup className="max-w-sm">
        <InputGroupInput placeholder={placeholder} value={search} onChange={e => setSearch(e.target.value)} />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <ColumnDropdown columns={columns} />
    </nav>
  )
}

export function SortableButton<TData>({ label, column }: { label: string; column: Column<TData> }) {
  const isSorted = column.getIsSorted()
  return (
    <Button variant="ghost" onClick={() => column.toggleSorting(isSorted === 'asc')} className={`${isSorted ? 'text-foreground' : ''}`}>
      {label}
      {isSorted ? isSorted === 'asc' ? <MoveUp /> : <MoveDown /> : <ArrowUpDown />}
    </Button>
  )
}
