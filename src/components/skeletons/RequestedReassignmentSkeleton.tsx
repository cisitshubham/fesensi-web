import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TicketCardSkeleton() {
  return (
    <Card className="relative border-[1px] overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex flex-col gap-2 items-end min-w-[120px]">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-col space-y-2 items-center gap-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-5 py-3 flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </CardFooter>
    </Card>
  );
}

export function TicketListSkeleton() {
  return (
    <div className="flex flex-col gap-4 mx-8 space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <TicketCardSkeleton key={index} />
      ))}
    </div>
  );
} 