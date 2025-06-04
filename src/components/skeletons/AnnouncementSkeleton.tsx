import { Fragment } from 'react';
import { Container } from '@/components/container';
import { Toolbar, ToolbarActions, ToolbarHeading } from '@/layouts/demo1/toolbar';
import { Skeleton } from '@/components/ui/skeleton';

export const AnnouncementSkeleton = () => {
  return (
    <Fragment>
      <Container>
        <Toolbar>
          <ToolbarHeading title="Announcements" description="Stay Updated with Latest News" />
          <ToolbarActions>
            <Skeleton className="h-10 w-[200px]" />
          </ToolbarActions>
        </Toolbar>
      </Container>

      <Container>
        {/* Announcement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-6 rounded-lg border">
              {/* Title and Date */}
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              {/* Description */}
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>

              {/* Footer with Author and Actions */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Fragment>
  );
}; 