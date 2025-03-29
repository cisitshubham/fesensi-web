/* eslint-disable prettier/prettier */
import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownCard2 } from '../dropdowns/general';
import { Link } from 'react-router-dom';

interface IProjectProps {
	ticket_no: string; 
	ticket_id: string;
	assigned_to: string;
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
	ticket_no,
	ticket_id,
	logo,
	name,
	assigned_to,
	description,
	startDate,
	status,
	category
}: IProjectProps) => {
	return (
		<div className="card p-7.5">

			<div className="flex items-center justify-between mb-3 lg:mb-6">
				<div className="flex items-center justify-center size-[50px] rounded-lg ">
					<img src={toAbsoluteUrl(`${logo}`)} className="" alt="" />
				</div>
				<span className={`badge badge-md ${status.variant} badge-outline`}>{status.label}</span>
			</div>

			<div className="flex flex-col mb-3 lg:mb-6">
				<Link to={`/public-profile/projects/UpdateTicketForm/${ticket_id}`} className='text-lg font-media/brand text-gray-900 hover:text-primary-active mb-px'><span>{ticket_no}</span>:&nbsp;{name}</Link>
				<span className="text-sm text-gray-700 break-words whitespace-normal"> {description} </span>
				
			</div>
			<div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-800 py-2">Category:&nbsp;</span>
				<span className={`badge badge-md text-inherit bg-inherit badge-pill badge-outline text-end w-1/2 font-normal`}>{category}</span>
			</div>
			<div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-800 py-2">Assigned To:&nbsp;</span>
				<span className={`badge badge-md text-inherit bg-inherit badge-pill badge-outline text-end w-1/2 font-normal`}>{assigned_to}</span>
			</div>

			<div className="flex justify-between items-start">
				<span className="text-sm font-medium text-gray-800 py-2">Due Date:&nbsp;{startDate}</span>
				<Menu className="flex items-end">
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
