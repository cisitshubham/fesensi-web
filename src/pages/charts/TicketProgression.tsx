import { Card } from '@/components/ui/card';
import { ChartsResponse } from '@/types';
import { GetStatusColor } from '@/pages/global-components/GetStatusColor';
import { TicketStatus } from '@/types';
import { memo } from 'react';

interface TicketProgressionProps {
  ticketStatusTotal: number;
  ticketStatusTotalPercentage: number;
  resolvedPercentage: number;
  inProgressPercentage: number;
  openPercentage: number;
  categories: ChartsResponse['data']['TicketsByCategory']['counts'];
  renderCategory: (category: ChartsResponse['data']['TicketsByCategory']['counts'][0], index: number) => JSX.Element;
}

const TicketProgression = memo(function TicketProgression({
  ticketStatusTotal,
  ticketStatusTotalPercentage,
  resolvedPercentage,
  inProgressPercentage,
  openPercentage,
  categories,
  renderCategory
}: TicketProgressionProps) {
  console.log(ticketStatusTotal, ticketStatusTotalPercentage, resolvedPercentage, inProgressPercentage, openPercentage, categories);
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
            className={`bg-${GetStatusColor(TicketStatus.Resolved)} h-2 rounded-md`}
            style={{ width: `${resolvedPercentage}%` }}
          ></div>
        )}
        {inProgressPercentage > 0 && (
          <div
            className={`bg-${GetStatusColor(TicketStatus.InProgress)} h-2 rounded-md`}
            style={{ width: `${inProgressPercentage}%` }}
          ></div>
        )}
        {openPercentage > 0 && (
          <div
            className={`bg-${GetStatusColor(TicketStatus.Open)} h-2 rounded-md`}
            style={{ width: `${openPercentage}%` }}
          ></div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-5 mb-2">
        {[
          { status: TicketStatus.Resolved, label: 'Resolved' },
          { status: TicketStatus.InProgress, label: 'In Progress' },
          { status: TicketStatus.Open, label: 'Open' }
        ].map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-1.5">
              <span className={`badge badge-dot size-2 bg-${GetStatusColor(item.status)}`}></span>
              <span className="text-sm font-normal text-gray-800">{item.label}</span>
            </div>
          );
        })}
      </div>

      <div className="border-b border-gray-300 my-4"></div>
      {categories.map(renderCategory)}
    </Card>
  );
});

export default TicketProgression; 