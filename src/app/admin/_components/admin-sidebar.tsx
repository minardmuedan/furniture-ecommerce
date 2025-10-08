'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useIsActivePath } from '@/hooks/use-path'
import { Calendar, LayoutDashboard, Package, Search, Settings, User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminSidebar() {
  const { isActivePath } = useIsActivePath()

  const items = [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { title: 'Products', href: '/admin/products', icon: Package },
    { title: 'Users', href: '/admin/users', icon: User2 },
    { title: 'Search', href: '#', icon: Search },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="items-center py-4">
        <SidebarMenuButton asChild tooltip="Dashboard" className="w-fit">
          <Link href="/admin">
            <Image src="/plant-logo.svg" alt="plant logo" width={20} height={20} />
            <span className="sr-only">home</span>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} isActive={isActivePath(item.href)} asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>im a footer</SidebarFooter>
    </Sidebar>
  )
}
