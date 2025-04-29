import { useEffect, useRef, useState } from 'react';
import { getHeight } from '@/utils';
import { useViewport } from '@/hooks';
import {
  DropdownNotificationsItem1,
  DropdownNotificationsItem2,
  DropdownNotificationsItem3,
  DropdownNotificationsItem4,
  DropdownNotificationsItem5,
  DropdownNotificationsItem6
} from './items';
import { GetPushNotifications } from '@/api/api';
import { Notificationtype } from '@/types';
const DropdownNotificationsAll = () => {


  const [notifications, setNotifications] = useState<Notificationtype[]>([]);
  const footerRef = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [viewportHeight] = useViewport();
  const offset = 300;


  const fetchNotifications = async () => {
    try {
      const response = await GetPushNotifications();
      if (response && Array.isArray(response.data)) {
        setNotifications(response.data);
        console.log(notifications)
      } else {
        console.error('Invalid response format:', response);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (footerRef.current) {
      const footerHeight = getHeight(footerRef.current);
      const availableHeight = viewportHeight - footerHeight - offset;
      setListHeight(availableHeight);
    }
  }, [viewportHeight]);

  const buildList = () => {
    if (notifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center pt-3 pb-4">
          <p className="text-gray-500">No notifications available</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <p className="notification-title">{notification.title}</p>
            <p className="notification-message">{notification.message}</p>
            <span className={`notification-type ${notification.type}`}>{notification.type}</span>
            <span className="notification-time">{notification.createdAt}</span>
          </div>
        ))}
      </div>
    );
  };



  return (
    <div className="grow">
      <div className="scrollable-y-auto" style={{ maxHeight: `${listHeight}px` }}>
        {buildList()}
      </div>
    </div>
  );
};

export { DropdownNotificationsAll };
