import Ticket from './ticket-component';
import { Tickettype, TicketStatus, TicketPriority } from '@/types';
import {MyTickets} from  '@/api/api'
import { useEffect, useState } from 'react'
import SearchbarFilters from '@/pages/global-components/searchbar_filters';

export default function AgentTickets() {

	const [tickets, setTickets] = useState<Tickettype[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string|null>(null)	
	
	const handleFiltersChange = async (filters: any) => {
		try {
			setLoading(true);
			const response = await MyTickets(filters);
			console.log(filters)
			setTickets(Array.isArray(response.data) ? response.data : []); // Extract the data property
			setLoading(false);
		} catch (error) {
			setError('Failed to fetch tickets. Please try again later.');
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const response = await MyTickets({});
				setTickets(Array.isArray(response.data) ? response.data : []); // Extract the data property
				setLoading(false);
			} catch (error: any) {
				setError('Failed to load tickets.');
				console.error(error);
				setTickets([]); // Set tickets to an empty array on error
				setLoading(false);
			}
		};
		fetchTickets();
	}, []);
 

  return (
    <div className="space-y-4 px-6">
		<SearchbarFilters onFiltersChange={handleFiltersChange} />
		
      {tickets.map((ticket) => (
        <Ticket key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
}
