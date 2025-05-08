import { forwardRef } from 'react';
import { Accordion, AccordionItem } from '@/components/accordion';
import { Card } from '@/components/ui/card';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AnnouncementsViewRef {
  fetchAnnouncements: () => void;
}

interface AnnouncementsViewProps {
  announcements: Announcement[];
  isLoading: boolean;
}

const AnnouncementsView = forwardRef<AnnouncementsViewRef, AnnouncementsViewProps>(({ announcements, isLoading }, ref) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48  rounded-lg shadow-sm border">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <Card className="p-6  rounded-lg shadow-sm border">
        <div className="text-center text-gray-500 py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new announcement.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6  rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Announcements</h2>
        <span className="text-sm text-gray-500">{announcements.length} total</span>
      </div>
      <Accordion className="space-y-4">
        {announcements.map((announcement) => (
          <AccordionItem
            key={announcement._id}
            title={announcement.title}
          >
            <div className="space-y-3 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200">
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Posted on {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
});

export default AnnouncementsView;

