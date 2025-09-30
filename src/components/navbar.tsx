import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import categories from '@/lib/categories'
import Link from 'next/link'

export default function Navbar() {
  const navlinks = [
    { title: 'home', href: '/' },
    { title: 'categories', sublinks: categories },
    { title: 'products', href: '/products' },
    { title: 'about', href: '/about' },
    { title: 'contact us', href: '/contacts' },
  ]

  return (
    <header className="flex h-14 w-full items-center justify-between border-b">
      <Link href="/">minard</Link>

      <NavigationMenu>
        <NavigationMenuList>
          {navlinks.map((link, i) => (
            <NavigationMenuItem key={i}>
              {!!link.sublinks ? (
                <>
                  <NavigationMenuTrigger className="text-muted-foreground">{link.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] grid-cols-2">
                      {Object.entries(link.sublinks).map(([category, data], i2) => (
                        <li key={i2}>
                          <NavigationMenuLink asChild>
                            <Link href={`/${category}`}>
                              <div className="text-sm leading-none font-medium">{data.title}</div>
                              <ul>
                                {Object.keys(data.subcategories).map((subcategory, i3) => (
                                  <li key={i3} className="text-muted-foreground">
                                    {subcategory}
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
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle({ className: 'text-muted-foreground' })}>
                  <Link href={link.href}>{link.title}</Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  )
}
