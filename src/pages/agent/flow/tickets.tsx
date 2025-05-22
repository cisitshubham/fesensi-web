'use client';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Tickettype, TicketStatus } from '@/types';
import { AlertCircle, Clock, FileText, User, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import ActivityLogAndComments from './activity-log-and-comments';
import { useEffect, useState } from 'react';
import { MyTicketDetails } from '@/api/api';
import { getPriorityBadge, getStatusBadge } from '@/pages/global-components/GetStatusColor';
import { closeTicket } from '@/api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Timer from '@/pages/global-components/timer';
import { getTicketComments } from '@/api/api';

export default function Tickets() {
  const location = useLocation();
  const ticket: Tickettype = location.state.ticket; // Retrieve the ticket data from state
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useState<Tickettype>(ticket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingHours, setRemainingHours] = useState(ticketData.remainingHours);
  const [remainingMinutes, setRemainingMinutes] = useState(ticketData.remainingMinutes);
  const [remainingSeconds, setRemainingSeconds] = useState(ticketData.remainingSeconds);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('Ticket ID is not available.');
        }
        const response = await MyTicketDetails(id);
        const commentsResponse = await getTicketComments(id);
        // Map agentComment and customerComment to a flat array for ActivityLogAndComments
        let mappedComments: any[] = [];
        if (commentsResponse.data) {
          const { agentComment, customerComment } = commentsResponse.data;
          if (agentComment) mappedComments.push({ ...agentComment, role: 'agent', comment_text: agentComment.comment_text });
          if (customerComment) mappedComments.push({ ...customerComment, role: 'customer', comment_text: customerComment.comment_text });
        }
        setComments(mappedComments);
        setTicketData(response.data);
        setRemainingHours(response.data.remainingHours); // Ensure default value
        setRemainingMinutes(response.data.remainingMinutes); // Ensure default value
        setRemainingSeconds(response.data.remainingSeconds); // Ensure default value
        setActivityLog(response.data.activity_log);
        setLoading(false);
      } catch (error: any) {
        setError(error);
        setLoading(false);
      }
    };

    fetchTicketData();
  }, []);

  const handlecloseTicket = async () => {
    try {
      const formData = new FormData();
      formData.append('ticket_id', ticketData._id as any);
      await closeTicket(formData); // Assuming this function is defined elsewhere
      toast.success('Ticket closed successfully!', { position: 'top-center' });
      setTimeout(() => {
        navigate('/agent/mytickets'); // Redirect to the desired page after 3 seconds
      }, 1000);
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error('Failed to close ticket!', { position: 'top-center' });
      setLoading(false);
    }
  };
  // Ensure default values for remainingHours, remainingMinutes, and remainingSeconds

  // Function to get initials from name


  const statusBadge = getStatusBadge(ticket?.status || '');
  const priorityBadge = getPriorityBadge(ticket.priority);
  if (loading) {
    return <div>Loading...</div>;
  }

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
                    <div className="text-sm text-muted-foreground">Ticket #{ticketData.ticket_number}</div>
                    <CardTitle className="text-2xl mt-1">{ticketData.title}</CardTitle>

                  </div>
                  <div className="flex gap-2">
                    <Badge className={'bg-slate-500'}>{ticketData.category}</Badge>
                    <Badge className={`${statusBadge.color} flex items-center gap-1`}>
                      {statusBadge.icon}
                      {ticket.status}
                    </Badge>
                    <Badge className={`${priorityBadge.color} flex items-center gap-1`}>
                      {priorityBadge.icon}
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
                {ticket.status === TicketStatus.InProgress && (
                  <Timer hours={remainingHours ?? 0} minutes={remainingMinutes ?? 0} seconds={remainingSeconds ?? 0} />
                )}
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
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Attachments</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {ticketData.attachments.map((attachment, index) => (
                          <img
                            key={index}
                            src={(attachment as any).file_url}
                            alt={`Ticket attachment ${index + 1}`}
                            width={300}
                            height={200}
                            className="rounded-md object-cover aspect-video cursor-pointer"
                            onClick={() => setSelectedImage((attachment as any).file_url)}
                          />
                        ))}
                        {selectedImage && (
                          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                            <img
                              src={selectedImage}
                              alt="Selected attachment"
                              className="max-w-full max-h-full"
                            />
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="absolute top-4 right-4 text-white text-2xl"
                            >
                              &times;
                            </button>
                          </div>
                        )}
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
                    <span className="font-medium">{ticketData.creator}</span>
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
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="h-2/3 md:h-full w-full md:w-1/3">
          <ActivityLogAndComments activityLog={activityLog} agentComments={comments} />
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-5">
        {/* buttons  */}

        {/* update resolution  */}
        {/* isAgentViewButtonShow==true pe dikhega  */}
        {ticketData.status === TicketStatus.InProgress && ticketData.isAgentViewButtonShow == true && (
          <Link
            to={{
              pathname: `/agent/ticket/resolve/${ticket._id}`,
            }}
            className="block"
          >
            <Button className="mt-6">Update Resoulation</Button>
          </Link>
        )}

        {/* force resolve */}
        {ticketData.status === TicketStatus.InProgress && ticketData.isAgenForceResolve == true && (
          <Link
            to={{
              pathname: `/agent/Force-resolve/${ticket._id}`,
            }}
            className="block"
          >
            <Button className="mt-6">Force Resolve</Button>
          </Link>
        )}

        {/* close ticket  */}
        {ticketData.isTicketClosed == true && (
          <Button onClick={handlecloseTicket} className="mt-6">
            Close Ticket
          </Button>
        )}
        {/* incomplete Ticket */}
        {ticketData.status === TicketStatus.Open && ticketData.isAgentResolvedButtonShow == false && (
          <Link
            to={{
              pathname: '/agent/incomplete-ticket',
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
        {/* isAgentViewButtonShow==true pe dikhega  */}
        {ticketData.status == TicketStatus.Open && ticketData.isAgentResolvedButtonShow == false && (
          <Link
            to={{
              pathname: `/agent/ticket/resolve/${ticket._id}`,
            }}
            className="block"
          >
            <Button className="mt-6">Suggest Resolution</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
