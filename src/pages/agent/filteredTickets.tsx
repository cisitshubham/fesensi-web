import Ticket from './sidebar/my-tickets/ticket-component';
import { Tickettype } from '@/types';
import { MyTickets } from '@/api/api';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FilteredMyTickets } from '@/api/agent';


export default function FilteredTickets() {
    const location = useLocation();
    const { status, ticketCounts } = location.state || {}; // Extract state from location
    const [tickets, setTickets] = useState<Tickettype[]>([])
    useEffect(() => {
        const fetchFilteredTickets = async () => {
            console.log(`Filtering tickets with status: ${status}`);
            if (status) {
                const responce = await FilteredMyTickets(status)
                console.log(responce)
                setTickets(responce.data.data)

            }
        };
        fetchFilteredTickets();
    }, []);

    return (
        <div className="mx-8 space-y-4">
            <h1 className="text-xl font-bold">Filtered Tickets</h1>
            {status && (
                <p className="text-sm text-gray-600">Showing tickets with status: {status}</p>
            )}

            {tickets.map((ticket) => (
                <Ticket key={ticket._id} ticket={ticket} />
            ))}

        </div>
    );
}