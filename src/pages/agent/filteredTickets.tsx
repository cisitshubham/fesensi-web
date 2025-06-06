import Ticket from './sidebar/my-tickets/ticket-component';
import { Tickettype } from '@/types';
import { useEffect, useState } from 'react'
import { FilteredMyTickets } from '@/api/agent';
import { NoTicketsPage } from '@/errors/no-ticketspage';
import { useLocation } from 'react-router';

interface FilteredTicketsProps {
    fromDate?: string;
    toDate?: string;
}

export default function FilteredTickets({ fromDate, toDate }: FilteredTicketsProps){
    const [tickets, setTickets] = useState<Tickettype[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string|null>(null)
    // You may want to get status from props, context, or route. For now, use a hardcoded example:
    const location = useLocation();
    const status = location.state?.status 
    const dateRange = location.state?.dateRange;

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await FilteredMyTickets(status, dateRange.fromDate, dateRange.todate);
                setTickets(response.data.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load tickets.');
                setLoading(false);
            }
        };
        fetchTickets();
    }, [status, fromDate, toDate]);

    if (loading) {
        return <div>Loading tickets...</div>;
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return(
        <div className="mx-8 space-y-4">
            {tickets.length === 0 ? (
                <div><NoTicketsPage /></div>
            ) : (
                tickets.map(ticket => (
                    <Ticket key={ticket._id} ticket={ticket} />
                ))
            )}
        </div>
    )
}