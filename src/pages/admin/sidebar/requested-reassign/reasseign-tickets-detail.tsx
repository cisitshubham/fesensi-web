'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Loader2, User } from 'lucide-react';
import { denyReassign, ReassignAgentList, reassignTicketAdmin, getReassignTicketDetail } from '@/api/admin';
import type { Tickettype } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, MenuItem } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { getStatusBadge, getPriorityBadge } from '@/pages/global-components/GetStatusColor';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ReassignTicketsDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentList, setAgentList] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [denyReason, setDenyReason] = useState('');
  const [isReassigning, setIsReassigning] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const [isDenyDialogOpen, setIsDenyDialogOpen] = useState(false);

  const approveTriggerRef = useRef<HTMLButtonElement | null>(null);
  const denyTriggerRef = useRef<HTMLButtonElement | null>(null);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      const response = await getReassignTicketDetail(id as string);
      setTicket(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load ticket details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAgentList = async () => {
      const response = await ReassignAgentList();
      setAgentList(response.data);
    };
    fetchAgentList();
    fetchTicket();
  }, [id]);

  const handleReassign = async () => {
    setIsReassigning(true);
    try {
      const formData = new FormData();
      formData.append('ticketId', id as string);
      formData.append('assigned_to', selectedAgent);
      const response = await reassignTicketAdmin(formData);
      if (response.success) {
        toast.success('Ticket reassigned successfully');
        navigate('/admin/requested-reassignment/pending');
      } else {
        toast.error('Failed to reassign ticket');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to reassign ticket');
    } finally {
      setIsReassigning(false);
    }
  };

  const handleDeny = async () => {
    setIsDenying(true);
    try {
      const formData = new FormData();
      formData.append('ticketId', id as string);
      formData.append('adminReAssignComment', denyReason);
      const response = await denyReassign(formData);
      if (response.success) {
        toast.success('Reassignment request denied successfully');
        navigate('/admin/requested-reassignment/pending');
      } else {
        toast.error('Failed to deny reassignment request');
      }
      fetchTicket();
      setDenyReason('');
      setIsDenyDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to deny reassignment request');
    } finally {
      setIsDenying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link to="/admin/reassign-tickets" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">Ticket #{ticket?.ticket_number}</h2>
            <Badge className={getStatusBadge(ticket?.status || '').color}>{ticket?.status}</Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 ">
        <Card className="md:w-2/3 w-full">
          <CardHeader>
            <CardTitle>{ticket?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p>{ticket?.category || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Priority</p>
                <Badge
                  variant="outline"
                  className={
                    ticket?.priority
                      ? getPriorityBadge(ticket.priority).color
                      : 'bg-gray-100 text-gray-600 border-gray-200'
                  }
                >
                  {ticket?.priority || 'N/A'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Created At</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <p>{ticket?.createdAt}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Agent</p>
                <p>{ticket?.assigned_to || 'Unassigned'}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reassignment Reason</p>
                <div className="mt-1.5 rounded-md border p-3 bg-muted/40">
                  <p>{ticket?.agent_reassign_reason || 'No reason provided'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Additional Comments</p>
                <div className="mt-1.5 rounded-md border p-3 bg-muted/40">
                  <p>{ticket?.agent_reassign_comment || 'No comments provided'}</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between gap-4">
            <Dialog onOpenChange={(open) => {
              if (!open) setTimeout(() => approveTriggerRef.current?.focus(), 50);
            }}>
              <DialogTrigger asChild>
                <Button variant="default" className="w-full" ref={approveTriggerRef}>
                  Approve Reassignment
                </Button>
              </DialogTrigger>
              <DialogContent className="p-4">
                <DialogHeader className='flex flex-col gap-2 text-left items-start'>
                  <DialogTitle>Reassign Ticket #{ticket?.ticket_number}</DialogTitle>
                  <DialogDescription>Select a new agent to handle this ticket.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Select Agent</p>
                    <Select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Select an agent
                      </MenuItem>
                      {agentList.map((agent: any) => (
                        <MenuItem key={agent._id} value={agent._id}>
                          <div className="flex flex-col">
                            <span className="font-medium text-md">{agent.first_name}</span>
                            <span className="text-xs text-muted-foreground">{agent.level}</span>
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleReassign} disabled={!selectedAgent || isReassigning}>
                    {isReassigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Reassignment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isDenyDialogOpen} onOpenChange={(open) => {
              setIsDenyDialogOpen(open);
              if (!open) setTimeout(() => denyTriggerRef.current?.focus(), 50);
            }}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full" ref={denyTriggerRef}>
                  Reject Request
                </Button>
              </DialogTrigger>
              <DialogContent className="p-4">
                <DialogHeader className='flex flex-col gap-2 text-left items-start'>
                  <DialogTitle>Deny Reassignment Request</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for denying this reassignment request.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reason for Denial</p>
                    <Textarea
                      placeholder="Explain why this reassignment request is being denied"
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeny}
                    disabled={!denyReason || isDenying}
                  >
                    {isDenying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm Denial
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="md:w-1/3">
          <CardHeader>
            <CardTitle>Activity log</CardTitle>
            <CardDescription>History of actions taken on this ticket</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] no-scrollbar">

            {ticket?.activity_logs?.length ? (
              <div className="space-y-4">
                {ticket.activity_logs.map((log, index) => (
                  <div key={index} className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{log.creator}</span>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {log.createdAt}
                      </div>
                    </div>
                    <div className="text-sm">{log.comment}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p>No activity logs available</p>
              </div>
            )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
