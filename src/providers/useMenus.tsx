// src/providers/useMenus.ts
import { getSidebarMenu } from '@/config/menu.config';
import { useRole } from '@/pages/global-components/role-context';
export const useMenus = () => {

  const { selectedRoles } = useRole();
  const getMenuConfig = (roles: string[]) => {
    // Use the first role from the array, or fallback to an empty string if none
    const selectedRole = roles[0] || '';
    return getSidebarMenu('primary', selectedRole);
  };

  return { getMenuConfig };
};

 