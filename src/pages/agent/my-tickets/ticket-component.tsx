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
import { getPriorityColor,getStatusBadge  } from '@/pages/global-components/GetStatusColor';

interface TicketProps {
  ticket: Tickettype; // Use the Tickettype type directly
}

export default function Ticket({ ticket }: TicketProps) {	
    const statusBadge = getStatusBadge(ticket.status)	
  return (
    <Link
      to={{
        pathname: `/agent/ticket/${ticket._id}`
      }}
      state={{ ticket }} 
      className="block"
    >
      <Card
        className={`relative border-[1px] overflow-hidden space-y-4 hover:shadow-md hover:shadow-${getPriorityColor(ticket.priority)} transition-shadow border-${getPriorityColor(ticket.priority)}`} >
		{ticket.IsCumstomerCommneted === true && (
		<Badge className="absolute right-0  bg-red-700/80 rounded-md p-1">
		<Bell className="" />
		</Badge>
		)}
        {/* Ticket Details */}
        <div className="p-6 space-y-4">
          <div className="flex flex-row justify-between items-center">
            <Badge variant="outline" className="bg-gray-100 rounded-sm">
			#{ticket.ticket_number}
            </Badge>
            <Badge className={`${statusBadge.color} flex items-center`}>
                  {statusBadge.icon}
                  {ticket.status}
                </Badge>
          </div>

          <div className="flex flex-col">
            <div className="text-red-400" id="deadline-date">
              {ticket.due_date}
            </div>
            <div className="font-bold flex text-black items-center gap-2" id="title">
              {ticket.title}
            </div>
            <div className="text-gray-500" id="description">
              {ticket.description}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
