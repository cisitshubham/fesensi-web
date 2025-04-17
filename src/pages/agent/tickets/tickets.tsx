'use client';

import { useLocation } from 'react-router-dom';
import type { Tickettype } from '@/types';
import { AlertCircle, Clock, FileText, Flag, User, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ActivityLogAndComments from './activity-log-and-comments';
export default function Tickets() {
  const location = useLocation();
  const ticket: Tickettype = location.state.ticket; // Retrieve the ticket data from state

  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'in progress':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'resolved':
        return 'bg-green-500 hover:bg-green-600';
      case 'closed':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Function to determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
    }
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to handle resolution submission
  const handleResolve = () => {
    // Placeholder logic for sending resolution
    alert('Resolution sent to the user!');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
     
      <div className="flex flex-col  md:flex-row gap-6">
      <div className="flex flex-col  gap-6">
        {/* Main ticket info */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-muted-foreground">Ticket #{ticket.id}</div>
                  <CardTitle className="text-2xl mt-1">{ticket.title}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority} Priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <Separator className="mb-4" />

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Description
                  </h3>
                  <p className="mt-1 text-base">{ticket.description}</p>
                </div>

                {/* Ticket images */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <img
                      src=""
                      alt="Ticket attachment 1"
                      width={300}
                      height={200}
                      className="rounded-md object-cover aspect-video"
                    />
                    <img
                      src=""
                      alt="Ticket attachment 2"
                      width={300}
                      height={200}
                      className="rounded-md object-cover aspect-video"
                    />
                    <img
                      src=""
                      alt="Ticket attachment 3"
                      width={300}
                      height={200}
                      className="rounded-md object-cover aspect-video"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meta information */}
        <div className="flex justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row items-center justify-between gap-x-6">
              <div className="flex flex-col justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Deadline</span>
                </div>
                <div className="font-medium mt-1">{ticket.deadline}</div>
              </div>

              <Separator orientation="vertical" />

              <div className="flex flex-col items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Created By</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.createdBy)}&background=random`}
                    />
                    <AvatarFallback>{getInitials(ticket.createdBy)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{ticket.createdBy}</span>
                </div>
              </div>

              {ticket.assignedTo && (
                <>
                  <Separator orientation="vertical" />
                  <div className="flex flex-col items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Assigned To</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.assignedTo)}&background=random`}
                        />
                        <AvatarFallback>{getInitials(ticket.assignedTo)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{ticket.assignedTo}</span>
                    </div>
                  </div>
                </>
              )}

              <Separator orientation="vertical" />

              <div className="flex flex-col items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Escalated To</span>
                </div>
                {ticket.escalatedTo ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.escalatedTo)}&background=random`}
                      />
                      <AvatarFallback>{getInitials(ticket.escalatedTo)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{ticket.escalatedTo}</span>
                  </div>
                ) : (
                  <span className="mt-2 text-gray-500">N/A</span>
                )}
              </div>

              <Separator orientation="vertical" />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="h-2/3 md:h-full w-full md:w-1/3">
      <ActivityLogAndComments/>
      </div>
      </div>
      <div className="flex justify-center mt-6">
        <Button onClick={handleResolve} className="mt-6">
          Resolve
        </Button>
      </div>
    </div>
  );
}
