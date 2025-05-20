import { getEscalatedTickets } from '@/api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Ticket from './ecalatedTicket';
import { NoTicketsPage } from '@/errors/no-ticketspage';

export default function EscalatedAgent() {
    const [escalatedTickets, setEscalatedTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEscalatedTickets = async () => {
            try {
                const response = await getEscalatedTickets();
                setEscalatedTickets(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching escalated tickets:', error);
                setIsLoading(false);
            }
        };
        fetchEscalatedTickets();
    }, []);

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center h-48 mx-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </Card>
        );
    }

    if (escalatedTickets.length === 0) {
        return <NoTicketsPage />;
    }

    return (
        <Card className="flex flex-col h-full p-4 mx-8 gap-4" >
            <h1 className="text-2xl font-bold">Escalated Tickets </h1>
            {escalatedTickets.map((ticket: any) => (
                <Ticket key={ticket._id} ticket={ticket} />
            ))}

        </Card>
    );
}