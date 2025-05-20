import { useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import { GetPushNotifications } from '@/api/api';
import { Notificationtype } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { KeenIcon } from '@/components';
import { deleteNotification } from '@/api/api';
import { toast } from 'sonner';

interface DropdownNotificationsAllProps {
  onRefresh: () => void;
}

const DropdownNotificationsAll = ({ onRefresh }: DropdownNotificationsAllProps) => {
  const [notifications, setNotifications] = useState<Notificationtype[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 300;

  // State to trigger re-render
  const [updateTrigger, setUpdateTrigger] = useState<number>(0);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await GetPushNotifications();

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
  }, [updateTrigger]);

  const handleDeleteNotification = async (notificationId: string, onSuccess?: () => void) => {
    try {
      const response = await deleteNotification(notificationId);
      if (response.success === true) {
        const updatedNotifications = notifications.filter(
          (notification) => notification._id !== notificationId
        );
        setNotifications(updatedNotifications);
        setUpdateTrigger((prev) => prev + 1); // Trigger re-render
        if (onSuccess) {
          onSuccess();
        }
        toast.success('Notification deleted successfully!', { position: 'top-center' }); // Show success toast
        onRefresh(); // Trigger parent refresh
      } else {
        toast.error('Error deleting notification. Please try again later.', { position: 'top-center' }); // Show error toast
      }
    } catch (error) {
      toast.error('Error deleting notification. Please try again later.', { position: 'top-center' }); // Show error toast
    }
  };

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
          <Card key={notification._id} className="p-2">
            <CardContent className='pb-1 flex flex-row justify-between items-center'>
              <div className=""> 
            <p className="notification-title">{notification.notificationMessage}</p>
            <span className="notification-time text-sm text-gray-400">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
            </div>
            <div className="cursor-pointer" onClick={() => handleDeleteNotification(notification._id)}>
              <KeenIcon icon='trash' className='text-red-500'/>
            </div>
            </CardContent>
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
