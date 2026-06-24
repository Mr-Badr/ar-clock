import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 pt-10 pb-12" dir="rtl">
      <Skeleton className="h-4 w-48 mb-4" />
      <Skeleton className="h-9 w-80 mb-3" />
      <Skeleton className="h-5 w-64 mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
