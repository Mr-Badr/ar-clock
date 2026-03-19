import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CtaLink({ href, children }) {
  return (
    <>
      <style>{`
        .td-cta{background:var(--accent-gradient);color:var(--text-on-accent);box-shadow:var(--shadow-accent);transition:box-shadow .2s,transform .15s,opacity .15s;}
        .td-cta:hover{box-shadow:var(--shadow-accent-strong);transform:translateY(-1px);opacity:.92;}
        .td-cta:active{transform:translateY(0);}
        .td-cta:focus-visible{outline:2px solid var(--accent-alt);outline-offset:3px;}
        .td-cta .td-arrow{transition:transform .2s;}
        .td-cta:hover .td-arrow{transform:translateX(-3px);}
      `}</style>
      <Link href={href} className="td-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold">
        {children}
        <ArrowLeft size={16} className="td-arrow" aria-hidden="true" />
      </Link>
    </>
  )
}
