// src/providers/useMenus.ts
import { getSidebarMenu } from '@/config/menu.config';
import { useRole } from '@/pages/global-components/role-context';
export const useMenus = () => {

  const { selectedRoles } = useRole();
  const getMenuConfig = (roles: string[]) => {
    console.log('Selected Roles:', selectedRoles); // Log the selected roles to check if they are being passed correctly
    return getSidebarMenu('primary', selectedRoles);

  };

  return { getMenuConfig };
};
