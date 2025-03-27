/* eslint-disable prettier/prettier */
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { toAbsoluteUrl } from '@/utils/Assets';
import { useLanguage } from '@/i18n';
import { DropdownCard2 } from '../dropdowns/general';

interface IProjectRowProps {
  ticketId: string;		
  logo: string;
  name: string;
  description: string;
  closedDate: string;
  endDate: string;
  priority: string;
  category: string;		
  status: {
    variant: string;
    label: string;
  };
 
  
}

const CardProjectRow = ({ ticketId, logo, name, description, status, closedDate, category }: IProjectRowProps) => {
  const { isRTL } = useLanguage();
  return (
    <div className="card p-7">
      <div className="flex items-center flex-wrap justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="flex items-center justify-center size-14 shrink-0 rounded-lg">
            <img src={toAbsoluteUrl(`${logo}`)} className="" alt="" />
          </div>

          <div className="flex flex-col">
			<a href={toAbsoluteUrl(`/public-profile/projects/UpdateTicketForm/${ticketId}`)} className="text-lg text-gray-900 hover:text-primary-active mb-px">
			Ticket No:&nbsp;{ticketId}  
            </a>
			<span className="text-sm text-gray-700"> {name}</span>
            <span className="text-sm text-gray-700">{description}</span>
			<span className="text-sm text-gray-800">{category}</span>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-5 lg:gap-20">
          <div className="flex items-center flex-wrap gap-5 lg:gap-14">
            <span className={`badge badge-md ${status.variant} badge-outline`}>{status.label}</span>
			<span className="text-sm text-gray-600">
			Due Date:&nbsp;<span className="text-sm font-medium text-gray-800">{closedDate}</span>
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
