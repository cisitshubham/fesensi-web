/* eslint-disable prettier/prettier */
import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownCard2 } from '../dropdowns/general';
import { Link } from 'react-router-dom';

interface IProjectProps {
	ticket_id: string;
	logo: string;
	name: string;
	description: string;
	startDate?: string;
	status: {
		variant: string;
		label: string;
	};
	category: String


}

const CardProject = ({
	ticket_id,
	logo,
	name,
	description,
	startDate,
	status,
	category
}: IProjectProps) => {
	return (
		<div className="card p-7.5">
			<div className='flex items-center gap-5 mb-2'>
				<h3 className='text-m  text-gray-700 '>Ticket No:&nbsp;{ticket_id}</h3>
			</div>
			<div className="flex items-center justify-between mb-3 lg:mb-6">
				
				<div className="flex items-center justify-center size-[50px] rounded-lg ">
					<img src={toAbsoluteUrl(`${logo}`)} className="" alt="" />
				</div>
				<span className={`badge badge-md ${status.variant} badge-outline`}>{status.label}</span>
			</div>

			<div className="flex flex-col mb-3 lg:mb-6">
				<Link to={`/public-profile/projects/UpdateTicketForm/${ticket_id}`} className='text-lg font-media/brand text-gray-900 hover:text-primary-active mb-px'>{name}</Link>
				<span className="text-sm text-gray-700">{description}</span>
				<span className="text-sm text-gray-800">{category}</span>
			</div>

			<div className="flex items-center gap-5 ">
				<span className="text-sm text-gray-600">
					Due Date:&nbsp;
					<span className="text-sm font-medium text-gray-800">{startDate}</span>
				</span>
			</div>


			<div className="flex items-end justify-end gap-5">
					<Menu className="items-end">
						<MenuItem
							toggle="dropdown"
							trigger="click"
							dropdownProps={{
								placement: 'bottom-end',
								modifiers: [
									{
										name: 'offset',
										options: {
											offset: [0, 10]
										}
									}
								]
							}}
						>
							<MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
								<KeenIcon icon="dots-vertical" />
							</MenuToggle>
							{DropdownCard2(ticket_id)}
						</MenuItem>
					</Menu>
				</div>
			</div>



	);
};

export { CardProject, type IProjectProps };
