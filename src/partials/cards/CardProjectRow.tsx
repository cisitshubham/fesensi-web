/* eslint-disable prettier/prettier */
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useLanguage } from '@/i18n';
import { DropdownCard2 } from '../dropdowns/general';

interface IProjectRowProps {
	ticket_no: string;
	assigned_to: string;
	assigned?: boolean;
	ticketId: string;
	logo: string;
	name: string;
	description: string;
	closedDate: string | null;
	endDate: string;
	priority: string;
	category: string;
	status: {
		variant: string;
		label: string;
	} | null;
}

const CardProjectRow = ({ ticketId, assigned_to, ticket_no, logo, name, description, status, closedDate, category }: IProjectRowProps) => {
	const { isRTL } = useLanguage();

	// Ensure status is always valid
	const statusVariant = status?.variant || 'badge-neutral';
	const statusLabel = status?.label || 'Unknown';

	return (
		<div className="card p-7">
			<div className="flex items-center flex-wrap justify-between gap-5">
				<div className="flex items-center gap-3.5">
					<div className="flex items-center justify-center size-14 shrink-0 rounded-lg">
						<img src={toAbsoluteUrl(`${logo}`)} className="" alt="" />
					</div>

					<div className="flex flex-col">
						<a href={toAbsoluteUrl(`/public-profile/projects/UpdateTicketForm/${ticketId}`)}
							className="text-lg text-gray-900 hover:text-primary-active mb-px gap-3">
							<span className="text-gray-900 break-words whitespace-normal font-sans">{ticket_no}</span>:&nbsp;{name}
						</a>
						<span className="text-sm text-gray-700 break-words whitespace-normal font-sans">{description}</span>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex justify-start">
								<span className="text-sm text-gray-800 py-2">Category: &nbsp;</span>
								<span className="badge badge-md text-inherit bg-inherit badge-pill badge-outline text-end w-2/2 font-normal">{category}</span>
							</div>
							<div className="flex justify-start">
								<span className="text-sm text-gray-800 py-2">Assigned To: &nbsp;</span>
								<span className="badge badge-md text-inherit bg-inherit badge-pill badge-outline text-end w-2/2 font-normal">{assigned_to}</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center flex-wrap gap-5 lg:gap-20">
					<div className="flex items-center gap-5 lg:gap-14">
						<span className={`badge badge-md ${statusVariant} badge-outline`}>
							{statusLabel}
						</span>

						{/* Fixed width to prevent movement */}
						<span className="text-sm text-gray-600 w-[200px] text-right">
							Due Date:&nbsp;
							<span className={`text-sm font-medium text-gray-800 ${closedDate ? '' : 'invisible'}`}>
								{closedDate || 'N/A'}
							</span>
						</span>
					</div>

					<div className="flex items-center gap-5 lg:gap-14">
						<Menu className="items-stretch">
							<MenuItem
								toggle="dropdown"
								trigger="click"
								dropdownProps={{
									placement: isRTL() ? 'bottom-start' : 'bottom-end',
									modifiers: [
										{
											name: 'offset',
											options: {
												offset: isRTL() ? [0, -10] : [0, 10]
											}
										}
									]
								}}
							>
								<MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
									<KeenIcon icon="dots-vertical" />
								</MenuToggle>
								{DropdownCard2(ticketId)}
							</MenuItem>
						</Menu>
					</div>
				</div>
			</div>
		</div>
	);
};

export { CardProjectRow, type IProjectRowProps };
