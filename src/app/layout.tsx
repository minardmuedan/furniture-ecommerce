import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { TanstackQueryProvider } from '@/lib/providers'
import { Toaster } from '@/components/ui/sonner'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] })

export const metadata: Metadata = {
  title: 'Furniture Ecommerce',
  description: 'Fullstack Ecommerce website made by Minard Parilla',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <TanstackQueryProvider>
          <Toaster position="top-right" richColors theme="light" />
          <Navbar />
          <main>{children}</main>
        </TanstackQueryProvider>
      </body>
    </html>
  )
}
