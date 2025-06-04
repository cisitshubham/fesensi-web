import EscalatedTicketsComponent from "./requested-reassignment";
import { useEffect, useState } from "react";  
import { getEscalatedTicketsAdmin } from "@/api/api";
import { Tickettype } from "@/types";
import { NoTicketsPage } from '@/errors/no-ticketspage';
import { TicketListSkeleton } from '@/components/skeletons';

export default function RequestedReassignmentAdminPending() {
    const [tickets, setTickets] = useState<Tickettype[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getEscalatedTicketsAdmin()
            .then((res) => {
                setTickets(res.data);
            })
            .catch((error) => {
                console.error('Error fetching tickets:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <TicketListSkeleton />;
    }

    return (
        <div className="px-8 space-y-4">
            {tickets.length === 0 ? (
                <NoTicketsPage />
            ) : (
                tickets.map((ticket) => (
                    <EscalatedTicketsComponent key={ticket._id} ticket={ticket} />
                ))
            )}
        </div>
    );
}
