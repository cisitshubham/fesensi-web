import { useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { GetPushNotifications } from '@/api/api';
import { Notificationtype } from '@/types';
import { Card } from '@/components/ui/card';

const DropdownNotificationsAll = () => {
  const [notifications, setNotifications] = useState<Notificationtype[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 300;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await GetPushNotifications();

        // ✅ Ensure the correct structure
        if (Array.isArray(response.data)) {
          setNotifications(response.data);
        } else {
          console.warn('Unexpected response shape:', response);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Adjust list height
  useEffect(() => {
    if (footerRef.current) {
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - footerHeight - offset;
      setListHeight(availableHeight);
    }
  }, [viewportHeight]);

  const buildList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-6">
          <span className="text-gray-400">Loading notifications...</span>
        </div>
      );
    }

    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center pt-3 pb-4">
          <p className="text-gray-500">No notifications available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 p-2 divide-y divide-gray-200">
        {notifications.map((notification) => (
          <Card key={notification._id} className="p-4">
            <p className="notification-title">{notification.notificationMessage}</p>
            <span className="notification-time text-sm text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="grow">
      <div className="overflow-y-auto" style={{ maxHeight: `${listHeight}px` }}>
        {buildList()}
      </div>
      <div ref={footerRef} className="hidden"></div>
    </div>
  );
};

export { DropdownNotificationsAll };
