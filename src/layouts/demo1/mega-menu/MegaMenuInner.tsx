import { Fragment, useEffect, useState } from 'react';
import { useResponsive } from '@/hooks';
import { KeenIcon } from '@/components';
import {
	TMenuConfig,
	MenuItem,
	MenuLink,
	MenuTitle,
	MenuArrow,
	Menu
} from '@/components/menu';
import { useDemo1Layout } from '../Demo1LayoutProvider';
import { useLanguage } from '@/i18n';
import { verifyRole } from '../../../api/api';
import { getMegaMenu } from '@/config/menu.config'; // <- dynamic import

const MegaMenuInner = () => {
	const desktopMode = useResponsive('up', 'lg');
	const { isRTL } = useLanguage();
	const [disabled, setDisabled] = useState(true);
	const { layout, sidebarMouseLeave, setMegaMenuEnabled } = useDemo1Layout();
	const [menuItems, setMenuItems] = useState<TMenuConfig>([]);

	useEffect(() => {
		setDisabled(true);
		const timer = setTimeout(() => setDisabled(false), 1000);
		return () => clearTimeout(timer);
	}, [layout.options.sidebar.collapse, sidebarMouseLeave]);

	useEffect(() => {
		setMegaMenuEnabled(true);
	}, []);

	useEffect(() => {
		const loadUser = async () => {
			try {
				const res = await verifyRole();				
				const roles = res?.data?.role?.map((r: any) => r.role_name) || [];
				const config = getMegaMenu(roles);
				setMenuItems(config);
			} catch (error) {
				console.error('Error fetching user roles:', error);
			}
		};

		loadUser();
	}, []);

	const build = (items: TMenuConfig) => {
		return items.map((item, idx) => (
			<MenuItem key={idx}>
				<MenuLink
					path={item.path}
					className="menu-link text-sm text-gray-700 font-medium menu-link-hover:text-primary menu-item-active:text-gray-900 menu-item-show:text-primary menu-item-here:text-gray-900"
				>
					<MenuTitle className="text-nowrap">{item.title}</MenuTitle>
				</MenuLink>
			</MenuItem>
		));
	};

	const buildArrow = () => (
		<MenuArrow className="flex lg:hidden text-gray-400">
			<KeenIcon icon="plus" className="text-2xs menu-item-show:hidden" />
			<KeenIcon icon="minus" className="text-2xs hidden menu-item-show:inline-flex" />
		</MenuArrow>
	);

	return (
		<Menu
			multipleExpand
			disabled={disabled}
			highlight
			className="flex-col lg:flex-row gap-5 lg:gap-7.5 p-5 lg:p-0"
		>
			{build(menuItems)}
		</Menu>
	);
};

export { MegaMenuInner };
