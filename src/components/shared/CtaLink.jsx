import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/** @param {{ href: string, children: React.ReactNode }} props */
export default function CtaLink({ href, children }) {
  return (
    <Link href={href} className="btn btn-primary btn-lg">
      {children}
      <ArrowLeft size={16} aria-hidden="true" />
    </Link>
  )
}
