import UserTicket from './sidebar/ticket-component';
import { Tickettype } from '@/types';
import { useEffect, useState } from 'react'
import { NoTicketsPage } from '@/errors/no-ticketspage';
import { useLocation } from 'react-router';
import { getFilterredTickets } from '@/api/user';
export default function FilteredTicketsUser(){
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
                const response = await getFilterredTickets(status,dateRange.fromDate, dateRange.todate);
                setTickets(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load tickets.');
                setLoading(false);
            }
        };
        fetchTickets();
    }, [status]);

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
                    <UserTicket key={ticket._id} ticket={ticket} />
                ))
            )}
        </div>
    )
}