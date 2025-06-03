// src/components/SidebarMenu.tsx
import clsx from 'clsx';
import { useEffect, useState } from 'react';
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
import { useRole } from '@/pages/global-components/role-context';

const SidebarMenu = () => {
  const linkPl = 'ps-[10px]';
  const linkPr = 'pe-[10px]';
  const linkPy = 'py-[6px]';
  const itemsGap = 'gap-0.5';
  const subLinkPy = 'py-[8px]';
  const rightOffset = 'me-[-10px]';
  const iconWidth = 'w-[20px]';
  const iconSize = 'text-lg';
  const accordionLinkPl = 'ps-[10px]';
  const accordionLinkGap = ['gap-[10px]'];
  const accordionPl = ['ps-[10px]'];
  const accordionBorderLeft = ['before:start-[20px]'];
  const [roles, setRoles] = useState<string[]>([]);
  const [menuConfig, setMenuConfig] = useState<TMenuConfig>([]);
  const { getMenuConfig } = useMenus();
  const { selectedRoles } = useRole();

  useEffect(() => {
    const config = getMenuConfig(selectedRoles || []);
    setMenuConfig(config);
  }, [selectedRoles]); 

  

  const buildMenu = (items: TMenuConfig) =>
    items.map((item, index) => {
      if (item.heading) return buildMenuHeading(item, index);
      if (item.disabled) return buildMenuItemRootDisabled(item, index);
      return buildMenuItemRoot(item, index);
    });

  const buildMenuItemRoot = (item: IMenuItemConfig, index: number) => {
    if (item.children) {
      return (
        <MenuItem key={index}>
          <MenuLink
            className={clsx(
              'flex items-center grow cursor-pointer',
              accordionLinkGap[0],
              linkPl,
              linkPr,
              linkPy
            )}
          >
            <MenuIcon className={clsx('items-start text-gray-500', iconWidth)}>
              {item.icon && <KeenIcon icon={item.icon} className={iconSize} />}
            </MenuIcon>
            <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
            {buildMenuArrow()}
          </MenuLink>
          <MenuSub className={clsx('relative ', itemsGap, accordionBorderLeft[0], accordionPl[0])}>
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
            accordionLinkGap[0],
            linkPy,
            linkPl,
            linkPr
          )}
        >
          <MenuIcon className={clsx('items-start text-gray-600', iconWidth)}>
            {item.icon && <KeenIcon icon={item.icon} className={iconSize} />}
          </MenuIcon>
          <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
        </MenuLink>
      </MenuItem>
    );
  };

  const buildMenuItemChildren = (items: TMenuConfig, index: number, level: number) =>
    items.map((item, idx) =>
      item.disabled
        ? buildMenuItemChildDisabled(item, idx, level)
        : buildMenuItemChild(item, idx, level)
    );

  const buildMenuItemChild = (item: IMenuItemConfig, index: number, level: number) => {
    if (item.children) {
      return (
        <MenuItem key={index}>
          <MenuLink
            className={clsx(
              'cursor-pointer',
              accordionLinkGap[level],
              accordionLinkPl,
              linkPr,
              subLinkPy
            )}
          >
            {buildMenuBullet()}
            <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
            {buildMenuArrow()}
          </MenuLink>
          <MenuSub className={clsx(itemsGap, accordionBorderLeft[level], accordionPl[level])}>
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
            accordionLinkGap[level],
            accordionLinkPl,
            linkPr,
            subLinkPy
          )}
        >
          {buildMenuBullet()}
          <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
        </MenuLink>
      </MenuItem>
    );
  };

  const buildMenuItemRootDisabled = (item: IMenuItemConfig, index: number) => (
    <MenuItem key={index}>
      <MenuLabel className={clsx(accordionLinkGap[0], linkPy, linkPl, linkPr)}>
        <MenuIcon className={clsx('items-start text-gray-500', iconWidth)}>
          {item.icon && <KeenIcon icon={item.icon} className={iconSize} />}
        </MenuIcon>
        <MenuTitle className="text-sm font-medium text-gray-800">{item.title}</MenuTitle>
        {buildMenuSoon()}
      </MenuLabel>
    </MenuItem>
  );

  const buildMenuItemChildDisabled = (item: IMenuItemConfig, index: number, level: number) => (
    <MenuItem key={index}>
      <MenuLabel className={clsx(accordionLinkGap[level], accordionLinkPl, linkPr, subLinkPy)}>
        {buildMenuBullet()}
        <MenuTitle className="text-2sm font-normal text-gray-800">{item.title}</MenuTitle>
        {buildMenuSoon()}
      </MenuLabel>
    </MenuItem>
  );

  const buildMenuHeading = (item: IMenuItemConfig, index: number) => (
    <MenuItem key={index} className="pt-2.25 pb-px">
      <MenuHeading className={clsx('uppercase text-2sm font-medium text-gray-500', linkPl, linkPr)}>
        {item.heading}
      </MenuHeading>
    </MenuItem>
  );

  const buildMenuArrow = () => (
    <MenuArrow className={clsx('text-gray-400 w-[20px]', rightOffset)}>
      <KeenIcon icon="plus" className="text-2xs menu-item-show:hidden" />
      <KeenIcon icon="minus" className="text-2xs hidden menu-item-show:inline-flex" />
    </MenuArrow>
  );

  const buildMenuBullet = () => (
    <MenuBullet className="flex w-[6px] relative before:absolute before:top-0 before:size-[6px] before:rounded-full before:-translate-y-1/2 menu-item-active:before:bg-primary menu-item-hover:before:bg-primary" />
  );

  const buildMenuSoon = () => (
    <MenuBadge className={rightOffset}>
      <span className="badge badge-xs">Soon</span>
    </MenuBadge>
  );

  return (
    <Menu highlight={true} multipleExpand={false} className={clsx('flex flex-col grow', itemsGap)}>
      {menuConfig && buildMenu(menuConfig)}
    </Menu>
  );
};

export { SidebarMenu };