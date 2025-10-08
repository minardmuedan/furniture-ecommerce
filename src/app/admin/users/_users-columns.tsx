import { ColumnDef } from '@tanstack/react-table'
import { AdminUserType } from './_users-type'
import { Checkbox } from '@/components/ui/checkbox'

export const defaultUserColumns: ColumnDef<AdminUserType>[] = [
  {
    accessorKey: 'select',
    size: 32,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={value => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableResizing: false,
  },
  { accessorKey: 'id', minSize: 31.63, header: 'id' },
  { accessorKey: 'username', header: 'username' },
  { accessorKey: 'email', header: 'email' },
  {
    accessorKey: 'emailVerified',
    header: 'verified',
    cell: ({ row }) =>
      row.getValue('emailVerified') ? row.getValue<Date>('emailVerified').toLocaleString() : <span className="text-muted-foreground">false</span>,
  },
  {
    accessorKey: 'avatarSrc',
    header: 'avatar',
    cell: ({ cell }) => cell.getValue() ?? <span className="text-muted-foreground">undefined</span>,
  },
  {
    accessorKey: 'updatedAt',
    header: 'updated at',
    size: 180,
    cell: ({ row }) => row.original.updatedAt.toLocaleString('fil-US', { hour12: false }),
  },
  {
    accessorKey: 'createdAt',
    header: 'created at',
    size: 180,
    cell: ({ row }) => row.original.createdAt.toLocaleString('fil-US', { hour12: false }),
  },
]
