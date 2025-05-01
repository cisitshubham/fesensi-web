// src/providers/useMenus.ts
import { getSidebarMenu } from '@/config/menu.config';
import { useRole } from '@/pages/global-components/role-context';
export const useMenus = () => {

  const { selectedRoles } = useRole();
  const getMenuConfig = (roles: string[]) => {
    return getSidebarMenu('primary', selectedRoles);

  };

  return { getMenuConfig };
};

 