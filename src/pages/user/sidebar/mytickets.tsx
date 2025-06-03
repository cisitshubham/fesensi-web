import { Tickettype } from '@/types';
import { GetUserTickets } from '@/api/api';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import UserTicket from './ticket-component';
import { NoTicketsPage } from '@/errors/no-ticketspage'; // Import the NoTicketsPage component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicketSkeleton } from '@/components/skeletons';
import { Loader2 } from "lucide-react";

export default function UserTickets() {
	const [tickets, setTickets] = useState<Tickettype[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string|null>(null)
	const [status, setStatus] = useState<string>('ALL')
	
	useEffect(()=>{
		const fetchTickets = async ()=>{
			try{
				const response = await GetUserTickets(status === 'ALL' ? '' : status)
				setTickets(response.data)				
				setLoading(false)
				
			} catch (error) {
				setError('Failed to load tickets.')
				setLoading(false)
			}
		}
		fetchTickets()
	},[status])
 
  return (
    <div className="space-y-4 px-6">
      <div className="flex justify-between items-center">
        <Link to={"/user/create-ticket"}>
          <Button variant={'default'}>Create Ticket</Button>
        </Link>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN-PROGRESS">In Progress</SelectItem>
            <SelectItem value="RESOLVED">Resolved</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {loading ? (
        <TicketSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">{error}</div>
      ) : tickets.length === 0 ? (
        <NoTicketsPage />
      ) : (
        tickets.map((ticket) => (
          <UserTicket key={ticket._id} ticket={ticket} />
        ))
      )}
    </div>
  );
}
