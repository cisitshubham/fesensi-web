import { Card } from '@/components/ui/card';
import { ChartsResponse } from '@/types';

interface TicketProgressionProps {
  ticketStatusTotal: number;
  ticketStatusTotalPercentage: number;
  resolvedPercentage: number;
  inProgressPercentage: number;
  openPercentage: number;
  categories: ChartsResponse['data']['ticketsbyCategory']['counts'];
  renderCategory: (category: ChartsResponse['data']['ticketsbyCategory']['counts'][0], index: number) => JSX.Element;
}

export default function TicketProgression({
  ticketStatusTotal,
  ticketStatusTotalPercentage,
  resolvedPercentage,
  inProgressPercentage,
  openPercentage,
  categories,
  renderCategory
}: TicketProgressionProps) {
  return (
    <Card className="card-body flex flex-col gap-1 p-6 lg:p-8 lg:pt-5">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-600">Ticket Progression</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            Total: {ticketStatusTotal || 0}
          </span>
          <span className="badge badge-outline badge-success badge-sm">
            {ticketStatusTotalPercentage || 0}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {resolvedPercentage > 0 && (
          <div
            className="bg-success h-2 rounded-md"
            style={{ width: `${resolvedPercentage}%` }}
          ></div>
        )}
        {inProgressPercentage > 0 && (
          <div
            className="bg-info h-2 rounded-md"
            style={{ width: `${inProgressPercentage}%` }}
          ></div>
        )}
        {openPercentage > 0 && (
          <div
            className="bg-primary h-2 rounded-md"
            style={{ width: `${openPercentage}%` }}
          ></div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-5 mb-2">
        {[
          { badgeColor: 'bg-success', label: 'Resolved' },
          { badgeColor: 'bg-info', label: 'In Progress' },
          { badgeColor: 'bg-primary', label: 'Open' }
        ].map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-1.5">
              <span className={`badge badge-dot size-2 ${item.badgeColor}`}></span>
              <span className="text-sm font-normal text-gray-800">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="border-b border-gray-300 my-4"></div>
      {categories.map(renderCategory)}
    </Card>
  );
} 