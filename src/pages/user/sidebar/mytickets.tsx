import Ticket from '@/pages/agent/sidebar/my-tickets/ticket-component'; 
import { Tickettype, TicketStatus, TicketPriority } from '@/types';
import { GetUserTickets } from '@/api/api';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import UserTicket from './ticket-component';
import { NoTicketsPage } from '@/errors/no-ticketspage'; // Import the NoTicketsPage component


export default function UserTickets() {

	const [tickets, setTickets] = useState<Tickettype[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string|null>(null)	
	
	useEffect(()=>{
		const fetchTickets = async ()=>{
			try{
				const response = await GetUserTickets()
				setTickets(response.data)				
				setLoading(false)
				
			} catch (error) {
				setError('Failed to load tickets.')
				setLoading(false)
			}
		}
		fetchTickets()
	},[])
 

  return (
    <div className="space-y-4 px-6">
      <Link to={"/user/create-ticket"}>
        <Button variant={'default'}>Create Ticket</Button>
      </Link>
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">Loading tickets...</div>
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
