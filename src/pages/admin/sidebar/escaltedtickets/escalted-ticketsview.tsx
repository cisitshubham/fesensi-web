import EscalatedTicketsComponent from "./escalted-ticket";
import { useEffect, useState } from "react";  
import { getEscalatedTicketsAdmin } from "@/api/api";
import { Tickettype } from "@/types";
export default function EscalatedTicketsView() {
    const [tickets, setTickets] = useState<Tickettype[]>([]);


    useEffect(() => {
        getEscalatedTicketsAdmin().then((res) => {
            setTickets(res.data);
            console.log(res.data);
        })
    }, [])

    return (


        <div className="px-8">
            {tickets.map((ticket) => (
                <EscalatedTicketsComponent key={ticket._id} ticket={ticket} />
            ))}
        </div>
    )
}
