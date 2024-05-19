import { ReactNode } from 'react'
import { AI } from './actions'
export const maxDuration = 300
export const dynamic = 'force-dynamic';
import './globals.css'

export default function RootLayout({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <AI>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </AI>
  )
}