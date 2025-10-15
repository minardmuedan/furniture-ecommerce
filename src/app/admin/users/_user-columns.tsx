import { type ColumnDef } from '@tanstack/react-table'
import { User } from './_user-type'
import { SortableButton } from '@/components/custom-table'

export const userColumns: ColumnDef<User>[] = [
  { accessorKey: 'id', header: 'id' },
  { accessorKey: 'username', header: ({ column }) => <SortableButton label="username" column={column} /> },
  { accessorKey: 'email', header: 'email' },
  {
    meta: { label: 'img' },
    accessorKey: 'avatarSrc',
    header: () => <div className="text-center">img</div>,
    cell: ({ getValue }) => {
      const src = getValue<string>()
      return (
        <div className="flex h-full items-center justify-center">
          {src ? (
            <img src={src} alt="user image" width={40} height={40} loading="lazy" className="bg-accent rounded" />
          ) : (
            <span className="text-muted-foreground text-sm">undefined</span>
          )}
        </div>
      )
    },
  },
  {
    meta: { label: 'verified' },
    accessorKey: 'emailVerified',
    header: ({ column }) => <SortableButton label="verified" column={column} />,
    cell: ({ cell }) => {
      const emailVerified = cell.getValue<Date | null>()
      if (!emailVerified) return <span className="text-muted-foreground text-sm">unverified</span>
      return <div>{emailVerified.toLocaleDateString('en-US', { hour12: false })}</div>
    },
    sortingFn: (a, b, id) => {
      const va = a.getValue(id),
        vb = b.getValue(id)
      if (va == null) return 1
      if (vb == null) return -1
      return va > vb ? 1 : va < vb ? -1 : 0
    },
  },
  {
    meta: { label: 'created at' },
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableButton label="created at" column={column} />,
    cell: ({ cell }) => <div>{cell.getValue<Date>().toLocaleDateString('en-US', { hour12: false })}</div>,
  },
  {
    meta: { label: 'updated at' },
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableButton label="updated at" column={column} />,
    cell: ({ cell }) => <div>{cell.getValue<Date>().toLocaleDateString('en-US', { hour12: false })}</div>,
  },
]
