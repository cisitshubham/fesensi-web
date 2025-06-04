import { getReassignList } from "@/api/api"
import { useEffect, useState } from "react"
import { Tickettype } from "@/types"
import Ticket from "./Ticket"
import { NoTicketsPage } from '@/errors/no-ticketspage';
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
            {loading ? (
                <div className="flex justify-center items-center min-h-[200px] text-muted-foreground">Loading tickets...</div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">{error}</div>            ) : tickets.length === 0 ? (
                <NoTicketsPage />
            ) : (
                <div className="flex flex-col space-y-4">
                    {tickets.map((ticket) => (
                        <Ticket key={ticket._id} ticket={ticket} />
                    ))}
                </div>
            )}
        </div>
    )}