/**
 * Ticket Component
 *
 * Input data must be of type TicketType:
 * refer to src/types.ts
 */

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { TicketStatus, Tickettype, TicketPriority } from '@/types';
import { Bell, Calendar, Clock, ArrowRight, Tag, User } from 'lucide-react';
import { getPriorityBadge, getStatusBadge } from '@/pages/global-components/GetStatusColor';
import clsx from 'clsx';
import Timer from '@/pages/global-components/timer';
import { useState } from 'react';

interface TicketProps {
  ticket: {
    _id: string;
    ticket_number: number;
    title: string;
    description?: string;
    status: string;
    priority: string;
    category: string;
    createdAt: string;
    assigned_to: string;
    escalation: Array<{
      _id: string;
      assigned_to: {
        _id: string;
        first_name: string;
      };
    }>;
    sla?: Array<any>;
    IsCumstomerCommneted?: boolean;
  };
}

// Map priority colors to Tailwind classes


export default function Ticket({ ticket }: TicketProps) {
  const statusBadge = getStatusBadge(ticket.status as TicketStatus);
  const priorityBadge = getPriorityBadge(ticket.priority as TicketPriority);
  const [remainingHours, setRemainingHours] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  // Get the latest escalation
  const latestEscalation = ticket.escalation[ticket.escalation.length - 1];
  
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
                  <span>Created: {ticket.createdAt}</span>
                </div>
                {ticket.status === TicketStatus.InProgress && (
                  <Timer hours={remainingHours} minutes={remainingMinutes} seconds={remainingSeconds} />
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={clsx("px-5 py-3 flex flex-col gap-2")}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>Escalation Count: {ticket.escalation.length}</span>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1.5" />
              <span>Current: {ticket.assigned_to}</span>
              <ArrowRight className="w-4 h-4 ml-2 text-gray-400 group-hover:text-primary transition-colors" />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="text-sm font-medium text-gray-700">Escalation History:</div>
            <div className="flex flex-col gap-1">
              {ticket.escalation.map((esc, index) => (
                <div key={esc._id} className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">#{index + 1}</span>
                  <User className="w-3.5 h-3.5 mr-1.5" />
                  <span>{esc.assigned_to.first_name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
