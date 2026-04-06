import { Skeleton } from '@/components/ui/skeleton';

export default function PrayerRouteLoading() {
  return (
    <div className="min-h-screen bg-base text-primary" dir="rtl">
      <main className="content-col pt-24 pb-32">
        <div className="mb-6 hidden sm:flex items-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-28" />
        </div>

        <header className="text-center mb-8">
          <Skeleton className="h-11 w-72 mx-auto mb-3" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </header>

        <div className="mb-8">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-3 w-36 mt-3 mr-1" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-72 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </main>
    </div>
  );
}
