import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/** @param {{ href: string, children: React.ReactNode }} props */
export default function CtaLink({ href, children }) {
  return (
    <>
      <style>{`
        .hol-cta{background:var(--accent-gradient);color:var(--text-on-accent);box-shadow:var(--shadow-accent);transition:box-shadow .2s,transform .15s,opacity .15s;}
        .hol-cta:hover{box-shadow:var(--shadow-accent-strong);transform:translateY(-1px);opacity:.92;}
        .hol-cta:active{transform:translateY(0);}
        .hol-cta:focus-visible{outline:2px solid var(--accent-alt);outline-offset:3px;}
        .hol-cta .hol-arrow{transition:transform .2s;}
        .hol-cta:hover .hol-arrow{transform:translateX(-3px);}
      `}</style>
      <Link href={href} className="hol-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
        {children}
        <ArrowLeft size={16} className="hol-arrow" aria-hidden="true" />
      </Link>
    </>
  )
}
