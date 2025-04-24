'use client';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Tickettype, TicketStatus } from '@/types';
import { AlertCircle, Clock, FileText,  User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ActivityLogAndComments from './activity-log-and-comments';
import { useEffect, useState } from 'react';
import { MyTicketDetails } from '@/api/api';
import { getPriorityColor,GetStatusColor } from '@/pages/global-components/GetStatusColor';

export default function Tickets() {
  const location = useLocation();
  const ticket: Tickettype = location.state.ticket; // Retrieve the ticket data from state
  const { id } = useParams(); 

  const [ticketData, setTicketData] = useState(ticket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        const response = await MyTicketDetails(id);
        console.log(response.data);

        setTicketData(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  

  // Function to get initials from name


  const activityLog = ticketData.activity_log || []; // Replace with actual activity log data
  const agentComments = ticketData.agentComment ? [ticketData.agentComment] : []; // Replace with actual comments data

  return (
    <div className="container mx-auto px-6 ">
      <div className="flex flex-col  md:flex-row gap-6">
        <div className="flex flex-col  gap-6">
          {/* Main ticket info */}
          <div className="flex-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Ticket #{ticketData.ticket_number}
                    </div>
                    <CardTitle className="text-2xl mt-1">{ticketData.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={'bg-slate-500'}>{ticketData.category}</Badge>
                    <Badge className={`bg-${GetStatusColor(ticket.status)}`}>{ticket.status}</Badge>
                    <Badge className={`bg-${getPriorityColor(ticket.priority)}`}>{ticket.priority}</Badge>
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
                  {ticketData.attachments && ticketData.attachments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        Attachments
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ticketData.attachments.map((attachment, index) => (
                          <img
                            key={index}
                            src={(attachment as any).file_url}
                            alt={`Ticket attachment ${index + 1}`}
                            width={300}
                            height={200}
                            className="rounded-md object-cover aspect-video"
                          />
                        ))}
                      </div>
                    </div>
                  )}
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
                  <div className="font-medium mt-1">{ticket.due_date}</div>
                </div>

                <Separator orientation="vertical" />

                <div className="flex flex-col items-center text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Created By</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
          
                    <span className="font-medium">{(ticketData as any).assigned_to}</span>
                  </div>
                </div>

                {ticket.assigned_to && (
                  <>
                    <Separator orientation="vertical" />
                    <div className="flex flex-col items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Assigned To</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
       
                        <span className="font-medium">{(ticketData as any).assigned_to}</span>
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
                  {/* {ticket.escalatedTo ? ( */}
                  <div className="flex items-center gap-2 mt-2">
                    {/* <Avatar>
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(ticket.escalatedTo)}&background=random`}
                        />
					  <AvatarFallback>{getInitials((ticketData as any).assigned_to)}</AvatarFallback>
                      </Avatar> */}
                    <span className="font-medium">{(ticketData as any).assigned_to}</span>
                  </div>
                  {/* ) : (
                    // <span className="mt-2 text-gray-500">N/A</span>
                  )} */}
                </div>

                <Separator orientation="vertical" />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-2/3 md:h-full w-full md:w-1/3">
          <ActivityLogAndComments activityLog={activityLog} agentComments={agentComments} />
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-5">


{/* buttons  */}


        {/* update resolution  */}
        {ticketData.status === TicketStatus.InProgress && (
          <Link
            to={{
              pathname: `/agent/ticket/resolve/${ticket._id}`
            }}
            className="block"
          >
            <Button className="mt-6">Update Resoulation</Button>
          </Link>
        )}

        {/* force resolve */}
        {ticketData.status === TicketStatus.InProgress && (
          <Link
            to={{
              pathname: `/agent/Force-resolve/${ticket._id}`
            }}
            className="block"
          >
            <Button className="mt-6">Force Resolve</Button>
          </Link>
        )}

        {/* close ticket  */}
        {ticketData.status === TicketStatus.Resolved && (
          <Link
            to={{
              pathname: `/agent/Close/resolve/${ticket._id}`
            }}
            className="block"
          >
            <Button className="mt-6">Close Ticket</Button>
          </Link>
        )}
        {/* incomplete Ticket */}
        {ticketData.status === TicketStatus.Open && (
          <Link
            to={{
              pathname: '/agent/incomplete-ticket'
            }}
            state={{ ticket }} // Pass the complete ticket data as state
            className="block"
          >
            <Button variant={'destructive'} className="mt-6 ">
              Incomplete Ticket
            </Button>
          </Link>
        )}
        {/* Suggest Resolution  */}
        {!ticketData.isResolved && (
          <Link
            to={{
              pathname: `/agent/ticket/resolve/${ticket._id}`
            }}
            className="block"
          >
            <Button className="mt-6">Suggest Resolution</Button>
          </Link>
        )}
        {/* Request Reassignment */}
        {(ticketData.status === TicketStatus.Open ||
          ticketData.status === TicketStatus.InProgress) && (
          <Link
            to={{
              pathname: `/agent/reassign-ticket/${ticket._id}`
            }}
            className="block"
          >
            <Button className="mt-6">Request Reassignment</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
