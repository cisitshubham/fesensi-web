import { Fragment } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Dashboard" description="Central Hub for Comprehensive View" />
          <ToolbarActions>
            <Skeleton className="h-10 w-[200px]" />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        {/* Date Range Selector Skeleton */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Status Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full lg:w-5/12 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Ticket Progression Skeleton */}
          <div className="w-full">
            <div className="p-6 rounded-lg border">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full h-[350px] p-6 rounded-lg border">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-[250px] w-full" />
            </div>
          ))}
        </div>
      </Container>
    </Fragment>
  );
}; 