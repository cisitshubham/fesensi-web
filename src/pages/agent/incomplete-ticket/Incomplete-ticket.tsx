'use client';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { Tickettype } from '@/types';

export default function IncompleteTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Tickettype | null>(location.state?.ticket || null);
  const [reason, setReason] = useState<string>('');
  const [reasonType, setReasonType] = useState<string>('missing-information');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Function to get appropriate color for status badge
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

  // Function to get appropriate color for priority badge
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-slate-500 hover:bg-slate-600';
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!reasonType) {
      setError(true);
      return;
    }

    setIsSubmitting(true);

    // Prepare the data to be submitted
    const incompleteData = {
      ticketId: ticket?._id,
      reasonType,
      reason,
      timestamp: new Date().toISOString()
    };

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, you would send this data to your API
      console.log('Submitting incomplete ticket data:', incompleteData);

      // Navigate back to tickets list or dashboard
      navigate('/agent/tickets', {
        state: {
          notification: {
            type: 'success',
            message: `Ticket #${ticket?.ticket_number} marked as incomplete successfully.`
          }
        }
      });
    } catch (error) {
      console.error('Error marking ticket as incomplete:', error);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!ticket) {
    return (
      <div className="p-6">
        <Button variant="outline" className="mt-4" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6">
      <Button variant="outline" className="mb-4" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Ticket
      </Button>

      <div className="flex flex-col gap-6">
        {/* Ticket Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted-foreground">Ticket #{ticket.ticket_number}</div>
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

        {/* Mark as Incomplete Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Mark Ticket as Incomplete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base font-medium">Reason for marking as incomplete</h3>
            </div>

            <Separator />

            <div className="space-y-2">
              <Textarea
                id="details"
                placeholder="Provide additional details about why this ticket is incomplete..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting || !reason}>
              {isSubmitting ? 'Submitting...' : 'Mark as Incomplete'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
