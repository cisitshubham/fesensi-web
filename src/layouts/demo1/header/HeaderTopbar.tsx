import { useEffect, useRef, useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { useLanguage } from '@/i18n';
import { fetchUser } from '../../../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const itemChatRef = useRef<any>(null);
  const itemAppsRef = useRef<any>(null);
  const itemUserRef = useRef<any>(null);
  const itemNotificationsRef = useRef<any>(null);

  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Update navigation state when location changes
  useEffect(() => {
    const handlePopState = () => {
      setCanGoBack(window.history.state?.idx > 0);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial check

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location]);

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    getUser();
  }, []);

  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      <Button
        onClick={handleGoBack}
        disabled={!canGoBack}
        variant="ghost"
        title="Back"
      >
        <KeenIcon icon="arrow-left" />
        Back
      </Button>

      <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onOpenChange={handleClose} />

      <Menu>
        <MenuItem
          ref={itemChatRef}
          onShow={handleShow}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-170, 10] : [170, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({ menuTtemRef: itemChatRef })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemAppsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-10, 10] : [10, 10]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>
          {DropdownApps()}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({ menuTtemRef: itemNotificationsRef })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? 'bottom-start' : 'bottom-end',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
                }
              }
            ]
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full border-2 border-success shrink-0"
              src={toAbsoluteUrl(user?.data?.profile_img || '/media/avatars/300-2.png')}
              alt="User Avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = toAbsoluteUrl('/media/avatars/300-2.png');
              }}
            />
          </MenuToggle>
          {DropdownUser({ menuItemRef: itemUserRef }, user)}
        </MenuItem>
      </Menu>
    </div>
  );
};

export { HeaderTopbar };
