import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin">
      <header className="flex h-14 w-full items-center justify-between border-b px-5">
        <Link href="/dashboard">Dashboard</Link>

        <p className="text-muted-foreground text-sm">This is admin navbar</p>
      </header>

      {children}
    </div>
  )
}
