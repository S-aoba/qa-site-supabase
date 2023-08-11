import Link from 'next/link'
import type { ReactNode } from 'react'

export const Tab = ({
  href,
  name,
  pathname,
  icon,
}: {
  href: string
  name: string
  pathname: string
  icon: ReactNode
}) => {
  return (
    <Link
      href={href}
      className={`${
        href === pathname && 'bg-muted hover:text-primary'
      } hover:text-foreground' flex h-10 w-full items-center justify-start space-x-2 rounded px-3 text-muted-foreground transition-colors duration-200 hover:text-primary`}
    >
      {icon}
      <span>{name}</span>
    </Link>
  )
}
