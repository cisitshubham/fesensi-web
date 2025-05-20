import Ticket from './ticket-component';
import { Tickettype } from '@/types';
import {MyTickets} from  '@/api/api'
import { useEffect, useState } from 'react'
import SearchbarFilters from '@/pages/global-components/searchbar_filters';
import { NoTicketsPage } from '@/errors/no-ticketspage';

export default function AgentTickets() {

	const [tickets, setTickets] = useState<Tickettype[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string|null>(null)	
	
	const handleFiltersChange = async (filters: any) => {
		try {
			setLoading(true);
			const response = await MyTickets(filters);
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
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">Loading tickets...</div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
          <span>{error}</span>
        </div>
      ) : tickets.length === 0 ? (
        <NoTicketsPage />
      ) : (
        tickets.map((ticket) => (
          <Ticket key={ticket._id} ticket={ticket} />
        ))
      )}
    </div>
  );
}
