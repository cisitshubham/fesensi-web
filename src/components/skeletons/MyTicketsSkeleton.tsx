import { Skeleton } from "@/components/ui/skeleton";

export default function MyTicketsSkeleton() {
  return (
    <div className="space-y-4 px-6">
      {/* Search bar skeleton */}
      <div className="flex gap-2 items-center">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-10 w-[100px]" />
      </div>

      {/* Ticket list skeletons */}
      {[...Array(3)].map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
          <Skeleton className="h-4 w-[300px]" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[80px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 