import { getFilteredTickets } from "@/api/admin";   
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Ticket from "./ticket-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function FilteredTicketsAdmin() {
    const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
    const location = useLocation();
    const status = location.state?.status 

    useEffect(() => {
        const fetchFilteredTickets = async (status:string) => {

            const response = await getFilteredTickets(status);
            setFilteredTickets(response.data.ticketCounts);
        }
        fetchFilteredTickets(status);
    }, []);

   return (
        <Card className="mx-8">
            <CardHeader>
                <h1>Filtered Tickets</h1>
            </CardHeader>
            <CardContent>
            {/* <h1>{filteredTickets.length}</h1> */}
            <div className="flex flex-col space-y-4 ">
            {filteredTickets.map((ticket) => (
                <Ticket key={ticket._id} ticket={ticket} />
            ))}
            </div>
            </CardContent>
        </Card>
    )
}


