'use client';

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Calendar, Clock, Tag, AlertCircle, CheckCircle, XCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getTicketById, CloseTicketUser, addcomment } from '@/api/api';
import type { Tickettype } from '@/types';
import { Alert } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getStatusBadge,getPriorityBadge } from '@/pages/global-components/GetStatusColor';
import { Dialog, DialogContent,  } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

export default function UserTicketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [comment_text, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await getTicketById(id || '');
        setTicket(data.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch ticket:', err);
        setError('Failed to load ticket. Please try again.');
        toast.error('Failed to load ticket. Please try again.', {position :"top-center"});
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    } else {
      setError('Invalid ticket ID');
      setLoading(false);
    }
  }, [id]);

  const statusBadge = getStatusBadge(ticket?.status || "")
  if (loading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="w-full max-w-3xl mx-auto mt-8" variant="danger">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span>{error}</span>
      </Alert>
    );
  }

  if (!ticket) {
    return null;
  }

  const handleResolve = async () => {
    if (!ticket?._id) return;

    try {
      await CloseTicketUser({ ticket_id: ticket._id });
      toast.success("Ticket resolved successfully.", { position: "top-center" });
      setShowDialog(true);
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
      toast.error("Failed to resolve ticket. Please try again.", { position: "top-center" });
    }
  };

  const handleSubmitFeedback = async () => {
    if (!comment_text.trim() || !ticket?._id) return;

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("comment_text", comment_text);
      formData.append("ticket", String(ticket._id));
      await addcomment(formData);

      toast.success("Query submitted successfully.", { position: "top-center" });
      setShowFeedback(false);

      setTimeout(() => {
        navigate("/user/MyTickets");
      }, 1000);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to submit feedback. Please try again.", { position: "top-center" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="  mx-6 mt-8 ">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Ticket #{ticket.ticket_number}</CardTitle>
            <p className="text-sm text-muted-foreground">{ticket.title || 'Untitled Ticket'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
          <Badge className={`${getPriorityBadge(ticket.priority).color} flex items-center gap-1`}>
            {getPriorityBadge(ticket.priority).icon}
            {ticket.priority}
          </Badge>
            <Badge className={`${statusBadge.color} flex items-center gap-1`}>
                  {statusBadge.icon}
                  {ticket.status}
                </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Created:</span>
            <span className="text-sm">{ticket.createdAt}</span>
          </div>
          {ticket.category && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
              <span className="text-sm">{ticket.category}</span>
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-semibold mb-2">Description</h3>
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm whitespace-pre-wrap">
              {ticket.description || 'No description provided.'}
            </p>
          </div>
        </div>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div>
            <h3 className="text-md font-semibold mb-2">Attachments</h3>
            <div className="flex flex-wrap gap-4">
              {ticket.attachments.map((attachment: { _id?: string; file_url: any }, idx) => (
                <img
                  key={attachment._id || idx}
                  src={attachment.file_url }
                  alt={`attachment-${idx}`}
                  className="w-32 h-32 object-cover border rounded-md cursor-pointer group-hover:scale-105"
                  onClick={() => setSelectedImage(attachment.file_url)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>

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

      {ticket.latest_agent_comment?.comment_text && (
        <Card className='mx-6'>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-bold">Latest Agent Comment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-muted rounded-md">
            <p className="text-sm whitespace-pre-wrap">{ticket.latest_agent_comment.comment_text}</p>
<div className="flex flex-row gap-2">
            {ticket.latest_agent_comment.attachments?.map((attachment:any, idx) => (
                <img
                  key={idx}
                  src={attachment.file_url}
                  alt={`attachment-${idx}`}
                  className="w-32 h-32 object-cover border rounded-md"
                />
            ))}
            </div>
          </CardContent>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Updated:</span>
                <span className="text-sm">{ticket.latest_agent_comment.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last Comment:</span>
                <span className="text-sm">{ticket.latest_agent_comment.creator_name}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CardFooter className="flex flex-col items-start pt-4 border-t">
        <div className="w-full">
          <h3 className="text-md font-semibold mb-4">Is your problem solved?</h3>
          <div className="flex gap-4 mb-4">
            
          {ticket.isCustomerTicketEdit && (
            <Link to={`/user/ticket/update/${ticket._id}`} className="">
              <Button variant={'default'}>Edit Ticket</Button>
            </Link>
          )}
            
            {
              ticket.isAgentCommented && ticket.status === "IN-PROGRESS" &&
            <><Button variant="default" className="flex items-center gap-2" onClick={handleResolve}>
                <CheckCircle className="h-4 w-4" />
                Yes, mark as resolved
              </Button><Button
                variant="outline"
                className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setShowFeedback(true)}
              >
                  <XCircle className="h-4 w-4" />
                  No, I need more help
                </Button></>
            }
          </div>

          {showFeedback && (
            <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <Textarea
                placeholder="Please describe what's still not working or what additional help you need..."
                className="min-h-[120px] w-full"
                value={comment_text}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowFeedback(false)
                    setFeedback("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex items-center gap-2"
                  onClick={handleSubmitFeedback}
                  disabled={!comment_text.trim() || submitting}
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardFooter>

      {showDialog && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="">
            <Card className="p-6">
              <CardHeader>
                <CardTitle>Ticket Resolved</CardTitle>
              </CardHeader>
              <p>Your ticket has been successfully resolved. Thank you for your patience!</p>
              <p className="text-gray-500">Please rate your expierence</p>
              <CardFooter className="flex flex-row justify-between items-center mt-4">
                <Button onClick={() => navigate(`/user/feedback/${ticket._id}`)}>Rate our service</Button>
                <Button variant={"outline"} onClick={() => navigate(`/user/MyTickets/`)}>Go to My Tickets</Button>
              </CardFooter>
            </Card>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
