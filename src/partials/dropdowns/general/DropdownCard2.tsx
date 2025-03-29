/* eslint-disable prettier/prettier */
import { KeenIcon, MenuIcon, MenuItem, MenuLink, MenuSub, MenuTitle } from '@/components';
import { Link } from 'react-router-dom'; // Assuming Link is from react-router-dom
import { toAbsoluteUrl } from '@/utils/Assets';

const DropdownCard2 = (ticketId?:string) => {
	return (
		<MenuSub className="menu-default" rootClassName="w-full max-w-[200px]">
			<MenuItem path="/account/home/settings-enterprise">
				<MenuLink>
					<MenuIcon>
						<KeenIcon icon="file-deleted" />
					</MenuIcon>
					<MenuTitle>Delete</MenuTitle>
				</MenuLink>
			</MenuItem>
			<Link to={`/public-profile/projects/ticket/view/${ticketId}`} className='text-lg font-media/brand text-gray-700 hover:text-primary-active mb-px'>
				<MenuLink>
					<MenuIcon>
						<KeenIcon icon="arrow-up-right" />
					</MenuIcon>
					<MenuTitle>View</MenuTitle>
				</MenuLink>
			</Link>
			
		</MenuSub>
	);
};
export { DropdownCard2 };
