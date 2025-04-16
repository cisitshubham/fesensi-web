import { toAbsoluteUrl } from '@/utils/Assets';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownCard2 } from '../dropdowns/general';
import { Link } from 'react-router-dom';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';


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
  category: string;
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
  category,
}: IProjectProps) => {
  return (
    <div className="card  rounded-xl p-5 border border-gray-200">
      {/* Header: Date & Menu */}
		  <div className="flex items-center justify-between mb-4">
			  <span className="badge badge-md text-inherit bg-inherit backdrop-brightness-200 text-start w-auto font-normal">
				  Due Date:&nbsp;{startDate}
			  </span>

			  <TooltipProvider>
				  <Tooltip>
					  <TooltipTrigger asChild>
						  <div className="inline-flex">
							  <Menu>
								  <MenuItem
									  toggle="dropdown"
									  trigger="click"
									  dropdownProps={{
										  placement: 'bottom-end',
										  modifiers: [{ name: 'offset', options: { offset: [0, 10] } }],
									  }}
								  >
									  <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
										  <KeenIcon icon="dots-vertical" />
									  </MenuToggle>
									  {DropdownCard2(ticket_id)}
								  </MenuItem>
							  </Menu>
						  </div>
					  </TooltipTrigger>
					  <TooltipContent side="top">
						  <p>More options</p>
					  </TooltipContent>
				  </Tooltip>
			  </TooltipProvider>


		  </div>

      {/* Logo & Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100">
          <img src={toAbsoluteUrl(logo)} alt={name} className="w-10 h-10 object-contain" />
        </div>
			  <TooltipProvider>
				  <Tooltip>
					  <TooltipTrigger asChild>
						  <span className={`badge badge-md ${status.variant} `}>{status.label}</span>
					  </TooltipTrigger>
					  <TooltipContent side="top">
						  <p>Ticket status</p>
					  </TooltipContent>
				  </Tooltip>
			  </TooltipProvider>
        
      </div>

      {/* Ticket Info */}
      <div className="mb-4">
			  <TooltipProvider>
				  <Tooltip>
					  <TooltipTrigger asChild>
						  <Link
							  to={`/public-profile/projects/UpdateTicketForm/${ticket_id}`}
							  className="text-base font-semibold text-gray-900 hover:text-primary transition"
						  >
							  {ticket_no}: {name}
						  </Link>
					  </TooltipTrigger>
					  <TooltipContent side="top">
						  <p>Click to update ticket</p>
					  </TooltipContent>
				  </Tooltip>
			  </TooltipProvider>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </div>

      {/* Assigned & Category */}
		  <TooltipProvider>
			  <div className="flex justify-between gap-1">
				  {/* Category Badge */}
				  <Tooltip>
					  <TooltipTrigger asChild>
						  <span className="badge badge-md text-inherit bg-inherit backdrop-brightness-200 badge-outline w-1/2 font-normal cursor-default">
							  {category}
						  </span>
					  </TooltipTrigger>
					  <TooltipContent side="top">
						  <p>Ticket Category</p>
					  </TooltipContent>
				  </Tooltip>

				  {/* Assigned To Badge */}
				  <Tooltip>
					  <TooltipTrigger asChild>
						  <span className="badge badge-md text-inherit bg-inherit backdrop-brightness-200 badge-outline w-1/2 font-normal cursor-default">
							  {assigned_to}
						  </span>
					  </TooltipTrigger>
					  <TooltipContent side="top">
						  <p>Assigned User</p>
					  </TooltipContent>
				  </Tooltip>
			  </div>
		  </TooltipProvider>

    </div>
  );
};

export { CardProject, type IProjectProps };
