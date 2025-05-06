import Ticket from '@/pages/agent/sidebar/my-tickets/ticket-component'; 
import { Tickettype, TicketStatus, TicketPriority } from '@/types';
import { GetUserTickets } from '@/api/api';

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';


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
		<Button variant={'default'}>Create Ticket</Button></Link>
      {tickets.map((ticket) => (
        <Ticket key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
}
