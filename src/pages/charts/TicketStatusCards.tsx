import { Card } from '@/components/ui/card';
import { KeenIcon } from '@/components';
import { TicketStatus } from '@/types';
import clsx from 'clsx';
import { getStatusBadge } from '@/pages/global-components/GetStatusColor';
import { Link } from 'react-router-dom';
interface TicketStatusCardsProps {
  ticketCounts: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

const statusConfig = [
  {
    key: 'open',
    icon: 'arrows-circle',
    status: TicketStatus.Open,
    link: 'Mytickets(category{"OPEN"})'
  },
  {
    key: 'inProgress',
    icon: 'watch',
    status: TicketStatus.InProgress,
    link: 'Mytickets(category{"IN-PROGRESS})'
  },
  {
    key: 'resolved',
    icon: 'check-circle',
    status: TicketStatus.Resolved,
    link: 'Mytickets(category{"RESOLVED"})'
  },
  {
    key: 'closed',
    icon: 'like',
    status: TicketStatus.Closed,
  },
] as const;
const selectedrole = sessionStorage.getItem('selectedRole');

export default function TicketStatusCards({ ticketCounts }: TicketStatusCardsProps) {
  return (
    <>
      {statusConfig.map(({ key, icon, status }) => {
        const badge = getStatusBadge(status);
        const linkTo = selectedrole === 'AGENT'
          ? '/agent/tickets/filtered'
          : '/user/tickets/filtered';
        return (
          <Link
            key={key}
            to={linkTo}
            state={{ status }}
          >
            <Card onClick={() => console.log(sessionStorage)} className={clsx("p-2 flex flex-col justify-between aspect-square h-full  overflow-auto", badge.color, badge.border)}>
              <div className="flex items-center gap-2 mb-2 ">
                <div
                  className={clsx(
                    'p-2  rounded-lg flex items-center justify-center aspect-square '
                  )}
                >
                  <KeenIcon icon={icon} className="" />
                </div>
                <h3 className="text-sm font-semibold">{status}</h3>
              </div>
              <Card className={clsx("text-2xl font-bold text-white text-center", badge.darkbg)}>{ticketCounts[key]}</Card>
            </Card>
          </Link>
        );
      })}
    </>
  );
}
