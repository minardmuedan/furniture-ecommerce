import { TableCell, TableRow } from '@/components/ui/table'

export default function TableNoResult({ columnLength }: { columnLength: number }) {
  return (
    <TableRow>
      <TableCell colSpan={columnLength} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  )
}
