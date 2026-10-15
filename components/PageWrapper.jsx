'use client'

import { usePathname } from 'next/navigation'

export default function PageWrapper({ children }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="flex-1 animate-page">
      {children}
    </div>
  )
}