'use client';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Clock, FileText } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { GetStatusColor, getPriorityColor } from '@/pages/global-components/GetStatusColor';
import type { Tickettype } from '@/types';
import { ticketIncomplete } from '@/api/api';
import { toast } from 'sonner';

export default function IncompleteTicket() {
  const location = useLocation();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Tickettype | null>(location.state?.ticket || null);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!reason) {
      setError(true);
      return;
    }

    setIsSubmitting(true);


    // Prepare the data to be submitted
    const reasonType = 'defaultReasonType'; // Replace 'defaultReasonType' with the appropriate value
    const incompleteData = {
      ticketId: ticket?._id,
      reasonType,
      reason,
      timestamp: new Date().toISOString()
    };

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('ticket_id', ticket?._id || '');
      formData.append('comment_text', reason);
      await ticketIncomplete(formData);
      toast.success('Ticket marked as incomplete successfully.', { position: 'top-center' });
      setTimeout(() => {

        navigate('/agent/mytickets');
      }, 3000);
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
                <div className="text-sm text-muted-foreground">Ticket #{ticket._id}</div>
                <CardTitle className="text-2xl mt-1">{ticket.title}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge className={`bg-${GetStatusColor(ticket.status)}`}>{ticket.status}</Badge>
                <Badge className={`bg-${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
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
