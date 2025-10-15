import { SortableButton } from '@/components/custom-table'
import { type ColumnDef } from '@tanstack/react-table'
import { Product } from './_product-type'

export const productColumns: ColumnDef<Product>[] = [
  { accessorKey: 'id', header: 'id' },

  {
    accessorKey: 'title',
    header: ({ column }) => <SortableButton label="title" column={column} />,
  },

  {
    meta: { label: 'img' },
    accessorKey: 'imgSrc',
    header: () => <div className="text-center">img</div>,
    cell: ({ getValue }) => {
      const src = getValue<string>()
      return (
        <div className="flex h-full items-center justify-center">
          <img src={src} alt="product image" width={40} height={40} loading="lazy" className="bg-accent rounded" />
        </div>
      )
    },
  },

  {
    accessorKey: 'price',
    header: ({ column }) => <SortableButton label="price" column={column} />,
    cell: ({ getValue }) => {
      const formatted = Number(getValue<string>()).toLocaleString('en-PH', {
        style: 'currency',
        currency: 'PHP',
      })
      return <div className="text-center">{formatted}</div>
    },
  },

  {
    accessorKey: 'stocks',
    header: ({ column }) => (
      <div className="flex justify-center">
        <SortableButton label="stocks" column={column} />
      </div>
    ),
    cell: ({ getValue }) => <div className="text-center">{getValue<number>()}</div>,
  },

  {
    accessorKey: 'category',
    header: 'category',
  },

  {
    meta: { label: 'sub category' },
    accessorKey: 'subCategory',
    header: 'sub category',
  },

  {
    meta: { label: 'created at' },
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableButton label="created at" column={column} />,
    cell: ({ getValue }) => getValue<Date>().toLocaleString('en-US', { hour12: false }),
  },

  {
    meta: { label: 'updated at' },
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableButton label="updated at" column={column} />,
    cell: ({ getValue }) => getValue<Date>().toLocaleString('en-US', { hour12: false }),
  },
]
