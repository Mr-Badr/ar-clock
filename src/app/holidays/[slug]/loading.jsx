import { Skeleton } from '@/components/ui/skeleton';

export function SlugLoading() {
  return (
    <div className="container container--narrow" style={{ paddingTop:'var(--space-8)', paddingBottom:'var(--space-20)' }} dir="rtl">
      {/* Breadcrumb */}
      <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-8)' }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} style={{ height:'13px', width: i%2===0?'8px':'64px', borderRadius:'var(--radius-sm)' }} />)}
      </div>

      {/* Badges */}
      <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-4)' }}>
        <Skeleton style={{ height:'24px', width:'56px', borderRadius:'var(--radius-full)' }} />
        <Skeleton style={{ height:'24px', width:'64px', borderRadius:'var(--radius-full)' }} />
      </div>

      {/* H1 */}
      <Skeleton style={{ height:'40px', width:'80%', borderRadius:'var(--radius-md)', marginBottom:'var(--space-2)' }} />
      <Skeleton style={{ height:'40px', width:'60%', borderRadius:'var(--radius-md)', marginBottom:'var(--space-6)' }} />

      {/* Date badges */}
      <div style={{ display:'flex', gap:'var(--space-3)', marginBottom:'var(--space-8)' }}>
        {[160,160,128].map((w,i) => <Skeleton key={i} style={{ height:'64px', width:w, borderRadius:'var(--radius-md)' }} />)}
      </div>

      {/* Countdown boxes */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'var(--space-3)', marginBottom:'var(--space-10)' }}>
        {[1,2,3,4].map(i => <Skeleton key={i} style={{ height:'96px', borderRadius:'var(--radius-lg)' }} />)}
      </div>

      {/* About section */}
      <Skeleton style={{ height:'160px', borderRadius:'var(--radius-2xl)', marginBottom:'var(--space-6)' }} />

      {/* FAQ */}
      <div style={{ display:'flex', flexDirection:'column', gap:'var(--space-3)' }}>
        {[1,2,3].map(i => <Skeleton key={i} style={{ height:'56px', borderRadius:'var(--radius-lg)' }} />)}
      </div>
    </div>
  );
}

export default SlugLoading;