import { Skeleton } from "@/components/ui/skeleton";

export default function RaffleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero skeleton */}
      <div className="h-[600px] bg-gradient-to-b from-sky-100/50 to-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-8 w-1/2 mx-auto mb-8" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>

      {/* Countdown skeleton */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      </div>

      {/* Prize showcase skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>

      {/* Live feed skeleton */}
      <div className="py-20 px-4 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-10 w-48 mx-auto mb-8" />
          <Skeleton className="h-24 w-full mb-4 rounded-xl" />
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-16 w-full mb-4 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Form skeleton */}
      <div className="py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-12 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}