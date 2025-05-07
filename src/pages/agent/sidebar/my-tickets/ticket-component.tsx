/**
 * Ticket Component
 *
 * Input data must be of type TicketType:
 * refer to src/types.ts
 */

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { TicketStatus, Tickettype } from '@/types';
import { Bell, Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';
import { getPriorityBadge, getStatusBadge } from '@/pages/global-components/GetStatusColor';
import clsx from 'clsx';
import Timer from '@/pages/global-components/timer';
import { useState } from 'react';

interface TicketProps {
  ticket: Tickettype; // Use the Tickettype type directly
}

// Map priority colors to Tailwind classes


export default function Ticket({ ticket }: TicketProps) {
  const statusBadge = getStatusBadge(ticket.status);
  const priorityBadge = getPriorityBadge(ticket.priority);
  const [remainingHours, setRemainingHours] = useState(ticket.remainingHours);
  const [remainingMinutes, setRemainingMinutes] = useState(ticket.remainingMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(ticket.remainingSeconds);
  return (
    <Link
      to={{
        pathname: `/agent/ticket/${ticket._id}`,
      }}
      state={{ ticket }}
      className="block w-full"
    >
      <Card
        className={clsx(
          'relative border-[1px] overflow-hidden transition-all duration-200 hover:shadow-md group',
         priorityBadge.border

        )}
      >
        {ticket.IsCumstomerCommneted === true && (
          <Badge className="absolute right-0 top-0 bg-red-700/80 rounded-full p-1">
            <Bell className="h-4 w-4" />
          </Badge>
        )}

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="bg-gray-100 rounded-sm">
                  #{ticket.ticket_number}
                </Badge>
                <Badge className={`${statusBadge.color} flex items-center gap-1`}>
                  {statusBadge.icon}
                  {ticket.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg text-gray-900">{ticket.title}</h3>
              <p className="text-gray-600 line-clamp-2 text-sm">{ticket.description}</p>
            </div>

            <div className="flex flex-col gap-2 items-end min-w-[120px]">
              <Badge className={`${priorityBadge.color} flex items-center gap-1`}>
                {priorityBadge.icon}
                {ticket.priority}
              </Badge>

              <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{ticket.category}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>created at: {ticket.createdAt}</span>
                </div>
                {ticket.status === TicketStatus.InProgress  && (
                  <Timer hours={remainingHours ?? 0} minutes={remainingMinutes ?? 0} seconds={0} />
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={clsx("px-5 py-3  flex justify-between items-center")}>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1.5" />
            <span>Due: {ticket.due_date}</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1.5" />
            <span>{ticket.assigned_to}</span>
            <ArrowRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-primary transition-colors" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
