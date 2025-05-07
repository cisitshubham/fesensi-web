import { getReassignList } from "@/api/api"
import { useEffect, useState } from "react"
import { Tickettype } from "@/types"
import Ticket from "../my-tickets/ticket-component"
import { map } from "leaflet"
export default function RequestedReassignment() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [tickets, setTickets] = useState<Tickettype[]>([])
const fetchTickets = async () => {
    try {
        const response = await getReassignList();
        if (response && Array.isArray(response.data)) {
            setLoading(false);
        }
        setTickets(response.data);
    } catch (error: any) {
        setError('Failed to fetch tickets. Please try again later.');
        setLoading(false);
    }
}

useEffect(() => {
    fetchTickets();
}
, []);
    
    return (
        <div className="px-6">
          
                {tickets.map((ticket) => (
                       <Ticket key={ticket._id} ticket={ticket} />
                     ))} 

           
        </div>  
    )}