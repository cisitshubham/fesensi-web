'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Calendar, Clock, Tag, AlertCircle } from 'lucide-react';

import { getTicketById } from '@/api/api';
import type { Tickettype } from '@/types';
import { Alert } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import {toast} from 'sonner';

export default function UserTicketDetails() {
  const { id } = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
		toast.error('Failed to load ticket. Please try again.');
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
  console.log(ticket, 'ticket');
  const getStatusColor = (status?: string) => {
    const map: Record<string, string> = {
      open: 'bg-green-500 hover:bg-green-600',
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      closed: 'bg-gray-500 hover:bg-gray-600',
      resolved: 'bg-blue-500 hover:bg-blue-600'
    };
    return map[status?.toLowerCase() ?? ''] || 'bg-gray-500 hover:bg-gray-600';
  };

  const getPriorityColor = (priority?: string) => {
    const map: Record<string, string> = {
      low: 'bg-blue-500 hover:bg-blue-600',
      medium: 'bg-yellow-500 hover:bg-yellow-600',
      high: 'bg-orange-500 hover:bg-orange-600',
      critical: 'bg-red-500 hover:bg-red-600'
    };
    return map[priority?.toLowerCase() ?? ''] || 'bg-gray-500 hover:bg-gray-600';
  };

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

  return (
    <Card className="  mx-6 mt-8 ">
      <CardHeader className="border-b">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold">Ticket #{ticket.ticket_number}</CardTitle>
            <p className="text-sm text-muted-foreground">{ticket.title || 'Untitled Ticket'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(ticket.status)}>{ticket.status || 'Unknown'}</Badge>
            <Badge className={getPriorityColor(ticket.priority)}>
              {ticket.priority || 'No Priority'}
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
              {ticket.attachments.map((attachment, idx) => (
                <img
                  key={attachment._id || idx}
                  src={attachment.file_url}
                  alt={`attachment-${idx}`}
                  className="w-32 h-32 object-cover border rounded-md"
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {ticket.latest_agent_comment?.comment_text && (
      <Card className='mx-6'>
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-bold">Latest Agent Comment</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-muted rounded-md">
          <p className="text-sm whitespace-pre-wrap">{ticket.latest_agent_comment.comment_text}</p>
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

      <CardFooter className="flex pt-4">
        <div className="flex flex-row">
        {ticket.isCustomerTicketEdit && (
          <Link to={`/user/ticket/update/${ticket._id}`} className="">
            <Button variant={'destructive'}>Update Ticket</Button>
          </Link>
        )}
        {ticket.isAgentCommented && ticket.status === "IN-PROGRESS" && (
          <Link to={`/user/ticket/resolution/${ticket._id}`} className="">
            <Button variant={'default'}>Check Resolution</Button>
          </Link>
        )}
        </div>
      </CardFooter>
    </Card>
  );
}
