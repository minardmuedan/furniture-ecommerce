'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useIsActivePath } from '@/hooks/use-path'
import categories from '@/lib/categories'
import Image from 'next/image'
import Link from 'next/link'

export default function NavbarMenu() {
  const isActive = useIsActivePath()

  const navlinks = [
    { title: 'home', href: '/' },
    { title: 'categories', sublinks: categories },
    { title: 'products', href: '/products' },
    { title: 'about', href: '/about' },
    { title: 'contact us', href: '/contacts' },
  ]

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {navlinks.map((link, i) => (
          <NavigationMenuItem key={i}>
            {!!link.sublinks ? (
              <>
                <NavigationMenuTrigger className={categories.some(c => isActive(`/${c.slug}`)) ? 'text-foreground' : 'text-muted-foreground'}>
                  {link.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] grid-cols-2">
                    {categories.map(category => (
                      <li key={category.slug}>
                        <NavigationMenuLink className="h-full" asChild>
                          <Link href={`/${category.slug}`}>
                            <div className="flex items-end gap-1 text-sm leading-none font-medium">
                              {category.title}
                              {isActive(`/${category.slug}`) && <Image src="/plant-logo.svg" alt="plant icon" width={16} height={16} />}
                            </div>
                            <ul>
                              {category.subcategories.map((subcategory, i3) => (
                                <li key={i3} className="text-muted-foreground">
                                  {subcategory.title}
                                </li>
                              ))}
                            </ul>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink
                className={navigationMenuTriggerStyle({
                  className: isActive(link.href) ? 'text-foreground' : 'text-muted-foreground',
                })}
                asChild
              >
                <Link href={link.href}>{link.title}</Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
