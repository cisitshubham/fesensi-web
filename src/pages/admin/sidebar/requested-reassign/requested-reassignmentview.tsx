import EscalatedTicketsComponent from "./requested-reassignment";
import { useEffect, useState } from "react";  
import { getEscalatedTicketsAdmin } from "@/api/api";
import { Tickettype } from "@/types";
import { NoTicketsPage } from '@/errors/no-ticketspage';

export default function RequestedReassignmentAdminPending() {
    const [tickets, setTickets] = useState<Tickettype[]>([]);


    useEffect(() => {
        getEscalatedTicketsAdmin().then((res) => {
            setTickets(res.data);
        })
    }, [])

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
    )
}
