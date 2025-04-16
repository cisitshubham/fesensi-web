/* eslint-disable prettier/prettier */
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useLanguage } from '@/i18n';
import { DropdownCard2 } from '../dropdowns/general';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';



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

const CardProjectRow = ({
	ticketId,
	assigned_to,
	ticket_no,
	logo,
	name,
	description,
	status,
	closedDate,
	category,
}: IProjectRowProps) => {
	const { isRTL } = useLanguage();

	const statusVariant = status?.variant || 'badge-neutral';
	const statusLabel = status?.label || 'Unknown';

	return (
		<div className="card p-7 rounded-xl border border-gray-200 transition-all">
			<div className="flex items-center flex-wrap justify-between gap-6">
				<div className="flex items-center gap-4">
					<div className="size-14 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
						<img src={toAbsoluteUrl(`${logo}`)} className="h-full w-full object-cover" alt="" />
					</div>

					<div className="flex flex-col">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<a
										href={toAbsoluteUrl(`/public-profile/projects/UpdateTicketForm/${ticketId}`)}
										className="text-lg font-semibold text-gray-900 hover:text-primary transition"
									>
										<span className="text-gray-900 font-medium">{ticket_no}</span>: {name}
									</a>
								</TooltipTrigger>
								<TooltipContent side="top">
									<p>Update this ticket</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<span className="text-sm text-gray-600 mt-1">{description}</span>

						<div className="grid grid-cols-2 gap-4 mt-2">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-700">Category:</span>
								<span className="badge badge-md bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
									{category}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-700">Assigned To:</span>
								<span className="badge badge-md bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
									{assigned_to}
								</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center flex-wrap gap-6 lg:gap-14">
					<div className="flex items-center gap-5 lg:gap-14">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className={`badge badge-md ${statusVariant} border border-gray-300 px-3 py-1 rounded-md font-medium`}>
										{statusLabel}
									</span>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={5}>
									<p>Ticket Status</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<span className="text-sm text-gray-600 w-[200px] text-right">
							Due Date: <span className={`font-medium text-gray-800 ${closedDate ? '' : 'invisible'}`}>{closedDate || 'N/A'}</span>
						</span>
					</div>

					<div className="relative">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<div className="inline-flex">
										<Menu className="items-stretch">
											<MenuItem
												toggle="dropdown"
												trigger="click"
												dropdownProps={{
													placement: isRTL() ? 'bottom-start' : 'bottom-end',
													modifiers: [
														{
															name: 'offset',
															options: { offset: isRTL() ? [0, -10] : [0, 10] },
														},
													],
												}}
											>
												<MenuToggle className="btn btn-sm btn-icon btn-light btn-clear rounded-full border border-gray-300">
													<KeenIcon icon="dots-vertical" className="text-gray-600" />
												</MenuToggle>
												{DropdownCard2(ticketId)}
											</MenuItem>
										</Menu>
									</div>
								</TooltipTrigger>
								<TooltipContent side="top" sideOffset={5}>
									<p>More options</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

				</div>
			</div>
		</div>
	);
};

export { CardProjectRow, type IProjectRowProps };
