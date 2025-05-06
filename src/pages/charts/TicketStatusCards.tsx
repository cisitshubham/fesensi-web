import { Card } from '@/components/ui/card';
import { KeenIcon } from '@/components';
import { TicketStatus } from '@/types';

interface TicketStatusCardsProps {
  ticketCounts: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

export default function TicketStatusCards({ ticketCounts }: TicketStatusCardsProps) {
  return (
    <>
      <Card className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <KeenIcon icon="arrows-circle" className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{TicketStatus.Open}</h3>
        </div>
        <p className="text-2xl font-bold">{ticketCounts.open}</p>
      </Card>
      <Card className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-info/20 rounded-lg">
            <KeenIcon icon="watch" className="text-info" />
          </div>
          <h3 className="text-lg font-semibold">{TicketStatus.InProgress}</h3>
        </div>
        <p className="text-2xl font-bold">{ticketCounts.inProgress}</p>
      </Card>
      <Card className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-success/20 rounded-lg">
            <KeenIcon icon="check-circle" className="text-success" />
          </div>
          <h3 className="text-lg font-semibold">{TicketStatus.Resolved}</h3>
        </div>
        <p className="text-2xl font-bold">{ticketCounts.resolved}</p>
      </Card>
      <Card className="p-4 flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-success/20 rounded-lg">
            <KeenIcon icon="like" className="text-success" />
          </div>
          <h3 className="text-lg font-semibold">{TicketStatus.Closed}</h3>
        </div>
        <p className="text-2xl font-bold">{ticketCounts.closed}</p>
      </Card>
    </>
  );
} 