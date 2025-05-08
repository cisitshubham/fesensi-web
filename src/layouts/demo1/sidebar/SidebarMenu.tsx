// src/components/SidebarMenu.tsx
import clsx from 'clsx';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { KeenIcon } from '@/components/keenicons';
import {
  IMenuItemConfig,
  Menu,
  MenuArrow,
  MenuBadge,
  MenuBullet,
  TMenuConfig,
  MenuHeading,
  MenuIcon,
  MenuItem,
  MenuLabel,
  MenuLink,
  MenuSub,
  MenuTitle
} from '@/components/menu';
import { useMenus } from '@/providers/useMenus';
import { verifyRole } from '@/api/api';
import { useRole } from '@/pages/global-components/role-context';

// Constants moved outside component to prevent recreation
const LINK_PL = 'ps-[10px]';
const LINK_PR = 'pe-[10px]';
const LINK_PY = 'py-[6px]';
const ITEMS_GAP = 'gap-0.5';
const SUB_LINK_PY = 'py-[8px]';
const RIGHT_OFFSET = 'me-[-10px]';
const ICON_WIDTH = 'w-[20px]';
const ICON_SIZE = 'text-lg';
const ACCORDION_LINK_PL = 'ps-[10px]';
const ACCORDION_LINK_GAP = ['gap-[10px]'];
const ACCORDION_PL = ['ps-[10px]'];
const ACCORDION_BORDER_LEFT = ['before:start-[20px]'];

const SidebarMenu = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [menuConfig, setMenuConfig] = useState<TMenuConfig>([]);
  const { getMenuConfig } = useMenus();
  const { selectedRoles } = useRole();

  // Memoize the getMenuConfig function to prevent it from changing on every render
  const memoizedGetMenuConfig = useCallback((roleNames: string[]) => {
    return getMenuConfig(roleNames);
  }, [getMenuConfig]);

  useEffect(() => {
    let isMounted = true;

    const fetchRoles = async () => {
      try {
        const res = await verifyRole();
        const roleNames = res.data.role.map((r: { role_name: string }) => r.role_name);
        
        if (isMounted) {
          setRoles(roleNames);
          const config = memoizedGetMenuConfig(roleNames);
          setMenuConfig(config);
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    };

    fetchRoles();

    // Cleanup function to prevent setting state after component unmounts
    return () => {
      isMounted = false;
    };
  }, [selectedRoles, memoizedGetMenuConfig]); // Only depend on selectedRoles and memoized function

  const buildMenuArrow = useCallback(() => (
    <MenuArrow className={clsx('text-gray-400 w-[20px]', RIGHT_OFFSET)}>
      <KeenIcon icon="plus" className="text-2xs menu-item-show:hidden" />
      <KeenIcon icon="minus" className="text-2xs hidden menu-item-show:inline-flex" />
    </MenuArrow>
  ), []);

  const buildMenuBullet = useCallback(() => (
    <MenuBullet className="flex w-[6px] relative before:absolute before:top-0 before:size-[6px] before:rounded-full before:-translate-y-1/2 menu-item-active:before:bg-primary menu-item-hover:before:bg-primary" />
  ), []);

  const buildMenuSoon = useCallback(() => (
    <MenuBadge className={RIGHT_OFFSET}>
      <span className="badge badge-xs">Soon</span>
    </MenuBadge>
  ), []);

  const buildMenuHeading = useCallback((item: IMenuItemConfig, index: number) => (
    <MenuItem key={index} className="pt-2.25 pb-px">
      <MenuHeading className={clsx('uppercase text-2sm font-medium text-gray-500', LINK_PL, LINK_PR)}>
        {item.heading}
      </MenuHeading>
    </MenuItem>
  ), []);

  const buildMenuItemChild = useCallback((item: IMenuItemConfig, index: number, level: number) => {
    if (item.children) {
      return (
        <MenuItem key={index}>
          <MenuLink
            className={clsx(
              'cursor-pointer',
              ACCORDION_LINK_GAP[level],
              ACCORDION_LINK_PL,
              LINK_PR,
              SUB_LINK_PY
            )}
          >
            {buildMenuBullet()}
            <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
            {buildMenuArrow()}
          </MenuLink>
          <MenuSub className={clsx(ITEMS_GAP, ACCORDION_BORDER_LEFT[level], ACCORDION_PL[level])}>
            {buildMenuItemChildren(item.children, index, level + 1)}
          </MenuSub>
        </MenuItem>
      );
    }

    return (
      <MenuItem key={index}>
        <MenuLink
          path={item.path}
          className={clsx(
            'menu-item-active:bg-secondary-active',
            ACCORDION_LINK_GAP[level],
            ACCORDION_LINK_PL,
            LINK_PR,
            SUB_LINK_PY
          )}
        >
          {buildMenuBullet()}
          <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
        </MenuLink>
      </MenuItem>
    );
  }, [buildMenuArrow, buildMenuBullet]);

  const buildMenuItemChildren = useCallback((items: TMenuConfig, index: number, level: number) =>
    items.map((item, idx) =>
      item.disabled
        ? buildMenuItemChildDisabled(item, idx, level)
        : buildMenuItemChild(item, idx, level)
    ), [buildMenuItemChild]);

  const buildMenuItemRoot = useCallback((item: IMenuItemConfig, index: number) => {
    if (item.children) {
      return (
        <MenuItem key={index}>
          <MenuLink
            className={clsx(
              'flex items-center grow cursor-pointer',
              ACCORDION_LINK_GAP[0],
              LINK_PL,
              LINK_PR,
              LINK_PY
            )}
          >
            <MenuIcon className={clsx('items-start text-gray-500', ICON_WIDTH)}>
              {item.icon && <KeenIcon icon={item.icon} className={ICON_SIZE} />}
            </MenuIcon>
            <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
            {buildMenuArrow()}
          </MenuLink>
          <MenuSub className={clsx('relative', ITEMS_GAP, ACCORDION_BORDER_LEFT[0], ACCORDION_PL[0])}>
            {buildMenuItemChildren(item.children, index, 1)}
          </MenuSub>
        </MenuItem>
      );
    }

    return (
      <MenuItem key={index}>
        <MenuLink
          path={item.path}
          className={clsx(
            'menu-item-active:bg-secondary-active',
            ACCORDION_LINK_GAP[0],
            LINK_PY,
            LINK_PL,
            LINK_PR
          )}
        >
          <MenuIcon className={clsx('items-start text-gray-600', ICON_WIDTH)}>
            {item.icon && <KeenIcon icon={item.icon} className={ICON_SIZE} />}
          </MenuIcon>
          <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
        </MenuLink>
      </MenuItem>
    );
  }, [buildMenuArrow, buildMenuItemChildren]);

  const buildMenuItemRootDisabled = useCallback((item: IMenuItemConfig, index: number) => (
    <MenuItem key={index}>
      <MenuLabel className={clsx(ACCORDION_LINK_GAP[0], LINK_PY, LINK_PL, LINK_PR)}>
        <MenuIcon className={clsx('items-start text-gray-500', ICON_WIDTH)}>
          {item.icon && <KeenIcon icon={item.icon} className={ICON_SIZE} />}
        </MenuIcon>
        <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
        {buildMenuSoon()}
      </MenuLabel>
    </MenuItem>
  ), [buildMenuSoon]);

  const buildMenuItemChildDisabled = useCallback((item: IMenuItemConfig, index: number, level: number) => (
    <MenuItem key={index}>
      <MenuLabel className={clsx(ACCORDION_LINK_GAP[level], ACCORDION_LINK_PL, LINK_PR, SUB_LINK_PY)}>
        {buildMenuBullet()}
        <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
        {buildMenuSoon()}
      </MenuLabel>
    </MenuItem>
  ), [buildMenuBullet, buildMenuSoon]);

  const buildMenu = useCallback((items: TMenuConfig) =>
    items.map((item, index) => {
      if (item.heading) return buildMenuHeading(item, index);
      if (item.disabled) return buildMenuItemRootDisabled(item, index);
      return buildMenuItemRoot(item, index);
    }), [buildMenuHeading, buildMenuItemRoot, buildMenuItemRootDisabled]);

  const menuItems = useMemo(() => 
    menuConfig && buildMenu(menuConfig)
  , [menuConfig, buildMenu]);

  return (
    <Menu highlight={true} multipleExpand={false} className={clsx('flex flex-col grow', ITEMS_GAP)}>
      {menuItems}
    </Menu>
  );
};

export { SidebarMenu };
