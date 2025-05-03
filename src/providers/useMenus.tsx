// src/providers/useMenus.ts
import { getSidebarMenu } from '@/config/menu.config';
import { useRole } from '@/pages/global-components/role-context';
export const useMenus = () => {

  const { selectedRoles } = useRole();
  console.log('Selected Roles:', selectedRoles); // Debugging line to check selected roles
  const getMenuConfig = (roles: string[]) => {
    return getSidebarMenu('primary', selectedRoles);

  };

  return { getMenuConfig };
};

 