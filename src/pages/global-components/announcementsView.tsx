import { KeenIcon } from '@/components';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Announcement } from '@/types';
import { Calendar } from 'lucide-react';
import { AnnouncementSkeleton } from '@/components/skeletons';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  isLoading: boolean;
}

export default function AnnouncementsViewUserAgent({
  announcements,
  isLoading
}: AnnouncementsViewProps) {
  // Ensure announcements is always an array
  const safeAnnouncements = Array.isArray(announcements) ? announcements : [];

  if (isLoading) {
    return <AnnouncementSkeleton />;
  }

  return (
    <div className="space-y-4">
      {safeAnnouncements.length === 0 ? (
        <div>No announcements available.</div>
      ) : (
        safeAnnouncements.map((announcement) => (
          <Card key={announcement._id} className="">
            <CardHeader className='w-full flex flex-row justify-between'>
              <h3 className="font-semibold">{announcement.title}</h3>
              <div className="flex flex-row justify-between gap-4 items-center text-muted-foreground">
                <KeenIcon icon={'calendar'} />
                <span>{announcement.createdAt}</span>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="">
                <p className="text-gray-600">{announcement.content}</p>
              </CardDescription>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}