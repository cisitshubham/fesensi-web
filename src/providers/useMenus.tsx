// src/providers/useMenus.ts
import { getSidebarMenu } from '@/config/menu.config';

export const useMenus = () => {
	const getMenuConfig = (roles: string[]) => {
		return getSidebarMenu('primary', roles); 
	};

	return { getMenuConfig };
};
