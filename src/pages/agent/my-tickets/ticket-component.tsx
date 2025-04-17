/**
 * Ticket Component
 * 
 * Input data must be of type TicketType:
 * refer to src/types.ts
 */

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Tickettype } from '@/types';
import { Bell } from 'lucide-react';

interface TicketProps {
  ticket: Tickettype; // Use the Tickettype type directly
}

export default function Ticket({ ticket }: TicketProps) {
  // Function to determine the badge color based on the ticket status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-600';
      case 'In Progress':
        return 'bg-purple-100 text-purple-600';
      case 'Closed':
        return 'bg-red-100 text-red-600';
      case 'Resolved':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Link
      to={{
        pathname: `/agent/ticket`,
      }}
      state={{ ticket }} // Pass the complete ticket data as state
      className="block"
    >
      <Card
        className={`relative border-[1px] overflow-hidden space-y-4 hover:shadow-md transition-shadow ${
          ticket.priority === 'High'
            ? ' border-orange-500 hover:shadow-orange-500'
            : ticket.priority === 'Medium'
            ? ' border-yellow-500 hover:shadow-yellow-500'
            : ticket.priority === 'Low'
            ? ' border-green-500 hover:shadow-green-500'
            : ticket.priority === 'Critical'
            ? ' border-red-500 hover:shadow-red-500'
            : ' border-gray-500 shadow-gray-500'
        }`}
      >
       <Badge className='absolute right-0  bg-blue-500/80 rounded-md p-1' > <Bell className=""/>
       </Badge>
        {/* Ticket Details */}
        <div className="p-6 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <Badge variant="outline" className="bg-gray-100 rounded-sm">
              #{ticket.id}
            </Badge>
            <Badge variant="outline" className={getStatusBadgeClass(ticket.status)}>
              {ticket.status}
            </Badge>
          </div>

          <div className="flex flex-col">
            <div className="text-red-400" id="deadline-date">{ticket.deadline}</div>
            <div className="font-bold flex text-black items-center gap-2" id="title">
              {ticket.title}
            </div>
            <div className="text-gray-500" id="description">{ticket.description}</div>
          </div>
        </div>
      </Card>
    </Link>
  );
}