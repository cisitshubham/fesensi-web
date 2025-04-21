import Ticket from './ticket-component';
import { Tickettype, TicketStatus, TicketPriority } from '@/types';
import {MyTickets} from  '@/api/api'
import { useEffect, useState } from 'react'


export default function AgentTickets() {

	const [tickets, setTickets] = useState<Tickettype[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string|null>(null)	
	
	useEffect(()=>{
		const fetchTickets = async ()=>{
			try{
				const response = await MyTickets()
				setTickets(response.data)				
				setLoading(false)
				
			} catch (error:any) {
				setError('Failed to load tickets.')
				console.log(error);
				setLoading(false)
			}
		}
		fetchTickets()
	},[])
 

  return (
    <div className="space-y-4 px-6">
      {tickets.map((ticket) => (
        <Ticket key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
}
