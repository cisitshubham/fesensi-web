import { useState } from 'react';
import { useLanguage } from '@/i18n';
import { KeenIcon } from '@/components';
import {  MenuSub } from '@/components/menu';

import { DropdownNotificationsAll } from './DropdownNotificationsAll';

interface IDropdownNotificationProps {
  menuTtemRef: any;
}

const DropdownNotifications = ({ menuTtemRef }: IDropdownNotificationProps) => {
  const { isRTL } = useLanguage();

  // State to trigger re-render
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleClose = () => {
    if (menuTtemRef.current) {
      menuTtemRef.current.hide(); // Call the closeMenu method to hide the submenu
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const buildHeader = () => {
    return (
      <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5 border-b border-b-gray-200">
        Notifications
        <button className="btn btn-sm btn-icon btn-light btn-clear shrink-0" onClick={handleClose}>
          <KeenIcon icon="cross" />
        </button>
      </div>
    );
  };

  const buildTabs = () => {
    return (
      <div>
        <DropdownNotificationsAll key={refreshKey} onRefresh={handleRefresh} />
      </div>
    );
  };

  return (
    <MenuSub rootClassName="w-full max-w-[460px]" className="light:border-gray-300">
      {buildHeader()}
      {buildTabs()}
    </MenuSub>
  );
};

export { DropdownNotifications };
