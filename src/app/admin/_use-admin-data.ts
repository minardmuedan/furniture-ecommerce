import { clientFetch } from '@/helpers/client-fetcher'
import { useDebounce } from '@/hooks/use-debounce'
import { QueryKey, InfiniteData as ReactInfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

type InfiniteData<TData> = { datas: TData[]; totalDatas: number; hasNextPage: boolean }

type Params<TData> = {
  query: { key: Extract<QueryKey[0], 'users' | 'products'>; initialData: InfiniteData<TData> }
  table: {
    columns: ColumnDef<TData>[]
    filterFnRows: (keyof TData)[]
    initialSortState?: { id: keyof TData; desc: boolean }
    initialVisibilityState: Partial<Record<keyof TData, boolean>>
  }
  select: (value: TData, index: number) => TData
}

export default function useAdminClientData<TData extends { id: string }>({
  query: { key, initialData },
  table: {
    columns,
    filterFnRows,
    initialSortState = { id: 'createdAt' as keyof TData, desc: true },
    initialVisibilityState = { id: false, emailVerified: false, updatedAt: false } as Record<keyof TData, boolean>,
  },
  select,
}: Params<TData>) {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const [sorting, setSorting] = useState([initialSortState] as SortingState)
  const [columnVisibility, setColumnVisibility] = useState(initialVisibilityState as VisibilityState)

  const [noMoreDataInDb, setNoMoreDataInDb] = useState(false)
  const [completedDataSearches, setCompletedDataSearches] = useState<string[]>([])

  const orderBy = `${sorting[0].id}.${sorting[0].desc ? 'desc' : 'asc'}`
  const queryKey = useMemo(() => [key, debouncedSearch, orderBy] satisfies QueryKey, [key, debouncedSearch, orderBy])
  const infiniteQuery = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    initialData: () => {
      const isInitialSorting = sorting[0].id === initialSortState.id && sorting[0].desc === initialSortState.desc
      if (!debouncedSearch && isInitialSorting) return { pageParams: [1], pages: [initialData] }
      return undefined
    },
    queryFn: async ({ queryKey, pageParam }) => {
      const orderBy = queryKey[2]

      if (completedDataSearches.includes(debouncedSearch)) {
        const cachedDatas = queryClient.getQueriesData<ReactInfiniteData<InfiniteData<TData>>>({ queryKey: [key, debouncedSearch] })
        const cachedData = cachedDatas[0][1]

        if (cachedData) {
          const pages = cachedData.pages
          const lastPageIndex = pages.length - 1
          return {
            datas: pages.flatMap(({ datas }) => datas),
            totalDatas: pages[lastPageIndex].totalDatas,
            hasNextPage: pages[lastPageIndex].hasNextPage,
          }
        }
      }

      return await clientFetch<InfiniteData<TData>>(`/${key}?search=${debouncedSearch}&page=${pageParam}&orderBy=${orderBy}`)
    },
    getNextPageParam: ({ hasNextPage }, _aP, lastPageParam) => (hasNextPage ? lastPageParam + 1 : null),
    placeholderData: prevData => prevData,
    enabled: noMoreDataInDb ? false : completedDataSearches.includes(debouncedSearch) ? false : true,
  })

  const { datas, totalDatas } = useMemo(() => {
    const pages = infiniteQuery.data?.pages ?? []
    const datas = pages.flatMap(({ datas }) => datas.map(select))
    const totalDatas = pages[0].totalDatas ?? 0
    return { datas, totalDatas }
  }, [infiniteQuery.data])

  useEffect(() => {
    if (!noMoreDataInDb && datas.length >= totalDatas) {
      if (debouncedSearch) return setCompletedDataSearches(prev => (prev.includes(debouncedSearch) ? prev : [...prev, debouncedSearch]))
      setNoMoreDataInDb(true)
      queryClient.removeQueries({ queryKey: [key] })
    }
  }, [datas, totalDatas])

  const reactTable = useReactTable({
    data: datas,
    columns,
    state: { globalFilter: search, sorting, columnVisibility },
    getRowId: row => row.id,
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: infiniteQuery.isEnabled ? undefined : getSortedRowModel(),

    manualFiltering: noMoreDataInDb ? false : true,
    onGlobalFilterChange: setSearch,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: row => {
      if (!search) return true
      const searchWords = search.toLowerCase().split(' ').filter(Boolean)
      const values = filterFnRows.map(rowKey => row.getValue<string>(rowKey as string).toLowerCase())
      return searchWords.every(word => values.some(v => v.includes(word)))
    },

    onColumnVisibilityChange: setColumnVisibility,
  })

  return { search, setSearch, infiniteQuery, reactTable, datas, totalDatas }
}
