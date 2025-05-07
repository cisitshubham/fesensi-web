import { Card } from '@/components/ui/card';
import { KeenIcon } from '@/components';
import { TicketStatus } from '@/types';
import clsx from 'clsx';
import { getStatusBadge } from '@/pages/global-components/GetStatusColor';

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
    label: TicketStatus.Open,
    icon: 'arrows-circle',
    status: TicketStatus.Open,
  },
  {
    key: 'inProgress',
    label: TicketStatus.InProgress,
    icon: 'watch',
    status: TicketStatus.InProgress,
  },
  {
    key: 'resolved',
    label: TicketStatus.Resolved,
    icon: 'check-circle',
    status: TicketStatus.Resolved,
  },
  {
    key: 'closed',
    label: TicketStatus.Closed,
    icon: 'like',
    status: TicketStatus.Closed,
  },
] as const;

export default function TicketStatusCards({ ticketCounts }: TicketStatusCardsProps) {
  return (
    <>
      {statusConfig.map(({ key, label, icon, status }) => {
        const badge = getStatusBadge(status);
        return (
          <Card key={key} className="p-2 flex flex-col justify-between aspect-square h-auto w-auto">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={clsx(
                  'p-2  rounded-lg flex items-center justify-center aspect-square',
                  badge.color
                )}
              >
                <KeenIcon icon={icon} className=""/>
              </div>
              <h3 className="text-sm font-semibold">{label}</h3>
            </div>
            <p className="text-2xl font-bold text-center">{ticketCounts[key]}</p>
          </Card>
        );
      })}
    </>
  );
}
