import { Card } from '@/components/ui/card';
import { ChartsResponse } from '@/types';
import { getStatusBadge, GetStatusColor } from '@/pages/global-components/GetStatusColor';
import { TicketStatus } from '@/types';
import { memo } from 'react';
import { clsx } from 'clsx';

interface TicketProgressionProps {
  ticketStatusTotal: number;
  ticketStatusTotalPercentage: number;
  resolvedPercentage: number;
  inProgressPercentage: number;
  openPercentage: number;
  categories: ChartsResponse['data']['TicketsByCategory']['counts'];
  renderCategory: (category: ChartsResponse['data']['TicketsByCategory']['counts'][0], index: number) => JSX.Element;
  isLoading?: boolean;
}

const TicketProgression = memo(function TicketProgression({
  ticketStatusTotal,
  ticketStatusTotalPercentage,
  resolvedPercentage,
  inProgressPercentage,
  openPercentage,
  categories,
  renderCategory,
  isLoading
}: TicketProgressionProps) {
  return (
    <Card className={clsx(
      "card-body flex flex-col gap-1 p-6 lg:p-8 lg:pt-5",
      isLoading && "relative"
    )}>
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-600">Ticket Progression</span>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">
            Total: {ticketStatusTotal || 0}
          </span>
          <span className={`badge badge-outline ${ticketStatusTotalPercentage>0?"badge-success":"badge-danger"} badge-sm`}>
            {ticketStatusTotalPercentage || 0}%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-2">
        {resolvedPercentage > 0 && (
          <div
            className={`${getStatusBadge(TicketStatus.Resolved).darkbg} h-2 rounded-md`}
            style={{ width: `${resolvedPercentage}%` }}
          ></div>
        )}
        {inProgressPercentage > 0 && (
          <div
            className={`${getStatusBadge(TicketStatus.InProgress).darkbg} h-2 rounded-md`}
            style={{ width: `${inProgressPercentage}%` }}
          ></div>
        )}
        {openPercentage > 0 && (
          <div
            className={`${getStatusBadge(TicketStatus.Open).darkbg} h-2 rounded-md`}
            style={{ width: `${openPercentage}%` }}
          ></div>
        )}
      </div>

      <div className="flex items-center flex-wrap gap-5 mb-2">
        {[
          { status: TicketStatus.Resolved, label: 'Resolved' },
          { status: TicketStatus.InProgress, label: 'In-Progress' },
          { status: TicketStatus.Open, label: 'Open' }
        ].map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-1.5">
              <span className={`badge badge-dot size-2 ${getStatusBadge(item.status).darkbg}`}></span>
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