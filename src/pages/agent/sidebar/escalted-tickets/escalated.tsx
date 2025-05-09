import { getEscalatedTickets } from '@/api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Ticket from './ecalatedTicket';

export default function EscalatedAgent() {
    const [escalatedTickets, setEscalatedTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEscalatedTickets = async () => {
            try {
                const response = await getEscalatedTickets();
                console.log(response);
                setEscalatedTickets(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching escalated tickets:', error);
                setIsLoading(false);
            }
        };
        fetchEscalatedTickets();
    }, []);
    console.log('escalatedTickets', escalatedTickets);

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center h-48 mx-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </Card>
        );
    }

    if (escalatedTickets.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-[calc(100vh-200px)] mx-8">
                <div className="text-gray-400 text-xl font-medium">No escalated tickets found</div>
                <p className="text-gray-500 mt-2">There are currently no escalated tickets to display</p>
            </Card>
        );
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