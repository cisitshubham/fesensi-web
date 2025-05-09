import EscalatedTicketsComponent from "./requested-reassignment";
import { useEffect, useState } from "react";  
import { getEscalatedTicketsAdmin } from "@/api/api";
import { Tickettype } from "@/types";
export default function RequestedReassignmentAdmin() {
    const [tickets, setTickets] = useState<Tickettype[]>([]);


    useEffect(() => {
        getEscalatedTicketsAdmin().then((res) => {
            setTickets(res.data);
        })
    }, [])

    return (


        <div className="px-8 space-y-4">
            {tickets.map((ticket) => (
                <EscalatedTicketsComponent key={ticket._id} ticket={ticket} />
            ))}
        </div>
    )
}
