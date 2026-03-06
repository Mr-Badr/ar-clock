
import { Skeleton } from '@/components/ui/skeleton'; // shadcn

export function HolidaysLoading() {
  return (
    <div className="container" style={{ paddingTop:'var(--space-8)', paddingBottom:'var(--space-20)' }} dir="rtl">
      {/* Breadcrumb */}
      <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-8)' }}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Hero */}
      <Skeleton className="h-12 w-64 mb-3" style={{ borderRadius:'var(--radius-md)' }} />
      <Skeleton className="h-5 w-96 mb-2" style={{ borderRadius:'var(--radius-sm)' }} />
      <Skeleton className="h-5 w-72 mb-8" style={{ borderRadius:'var(--radius-sm)' }} />

      {/* Upcoming 3 cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'var(--space-4)', marginBottom:'var(--space-12)' }}>
        {[1,2,3].map(i => <Skeleton key={i} style={{ height:'120px', borderRadius:'var(--radius-xl)' }} />)}
      </div>

      {/* Category tabs */}
      <Skeleton style={{ height:'52px', borderRadius:'var(--radius-xl)', marginBottom:'var(--space-5)' }} />

      {/* Country chips */}
      <div style={{ display:'flex', gap:'var(--space-2)', marginBottom:'var(--space-5)' }}>
        {[1,2,3,4,5].map(i => <Skeleton key={i} style={{ height:'32px', width:'80px', borderRadius:'var(--radius-full)', flexShrink:0 }} />)}
      </div>

      {/* Search */}
      <Skeleton style={{ height:'48px', borderRadius:'var(--radius-md)', marginBottom:'var(--space-6)' }} />

      {/* Event grid */}
      <div className="grid-auto">
        {Array.from({length:12}).map((_,i) => (
          <div key={i} className="card" style={{ minHeight:'200px', display:'flex', flexDirection:'column', gap:'var(--space-4)' }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <Skeleton style={{ height:'20px', width:'72px', borderRadius:'var(--radius-full)' }} />
              <Skeleton style={{ height:'16px', width:'40px', borderRadius:'var(--radius-full)' }} />
            </div>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'var(--space-2)' }}>
              <Skeleton style={{ height:'18px', width:'75%', borderRadius:'var(--radius-sm)' }} />
              <Skeleton style={{ height:'13px', width:'100%', borderRadius:'var(--radius-sm)' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <Skeleton style={{ height:'36px', width:'56px', borderRadius:'var(--radius-md)' }} />
              <Skeleton style={{ height:'13px', width:'96px', borderRadius:'var(--radius-sm)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HolidaysLoading;