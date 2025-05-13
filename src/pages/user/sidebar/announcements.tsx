import AnnouncementsViewUserAgent from '@/pages/global-components/announcementsView';
import { getAnnouncements } from '@/api/api';
import { Announcement } from '@/types';
import { useEffect } from 'react';
import { useState } from 'react';

export default function AnnouncementsAgent() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const data = await getAnnouncements();
                setAnnouncements(data.data);
            } catch (err) {
                setError('Failed to load announcements');
                setAnnouncements([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    return (
        <div className="flex flex-col w-full h-full p-4">
            <h1 className="text-2xl font-bold mb-6">Announcements</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <AnnouncementsViewUserAgent announcements={announcements} isLoading={isLoading} />
        </div>
    );
}