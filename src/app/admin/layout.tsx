import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { getCookie } from '@/lib/headers'
import AdminSidebar from './_components/admin-sidebar'
import { ThemeProvider } from 'next-themes'
import ToggleTheme from './_components/toggle-theme'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = (await getCookie('sidebar_state')) === 'true'

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />

        <SidebarInset className="overflow-x-hidden p-4 pt-2">
          <header className="mb-4 flex h-10 items-center justify-between border-b px-2">
            <SidebarTrigger />
            <ToggleTheme />
          </header>

          {children}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}
