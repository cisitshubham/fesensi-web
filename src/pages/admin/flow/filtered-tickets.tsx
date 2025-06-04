import { getFilteredTickets } from "@/api/admin";   
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Ticket from "./ticket-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalTickets: number;
    ticketsPerPage: number;
}

export default function FilteredTicketsAdmin() {
    const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const status = location.state?.status;
    const dateRange = location.state?.dateRange;
    const [pagination, setPagination] = useState<PaginationInfo>({
        currentPage: 1,
        totalPages: 1,
        totalTickets: 0,
        ticketsPerPage: 10,
    });

    useEffect(() => {
        const fetchFilteredTickets = async (status: string, page = 1, perPage = 10) => {
            setLoading(true);
            
            try {
                const response = await getFilteredTickets(
                    status, 
                    { page, limit: perPage },
                    dateRange
                );
                const tickets = response.data.ticketCounts;

                setFilteredTickets(tickets);
                setPagination({
                    currentPage: response.data.pagination.currentPage,
                    totalPages: response.data.pagination.totalPages,
                    totalTickets: response.data.pagination.totalItems,
                    ticketsPerPage: response.data.pagination.limit,
                });
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilteredTickets(status, pagination.currentPage, pagination.ticketsPerPage);
    }, [status, pagination.currentPage, pagination.ticketsPerPage, dateRange]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handlePerPageChange = (newPerPage: string) => {
        const perPage = Number.parseInt(newPerPage);
        setPagination(prev => ({ ...prev, ticketsPerPage: perPage, currentPage: 1 }));
    };

    // Calculate pagination slice
    const startIndex = (pagination.currentPage - 1) * pagination.ticketsPerPage;
    const endIndex = startIndex + pagination.ticketsPerPage;
    const currentTickets = filteredTickets;

    return (
        <Card className="mx-8">
            <CardHeader className="flex flex-row justify-between items-center">
                <h1>Filtered Tickets</h1>
                <Select value={String(pagination.ticketsPerPage || 10)} onValueChange={handlePerPageChange}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 per page</SelectItem>
                        <SelectItem value="10">10 per page</SelectItem>
                        <SelectItem value="25">25 per page</SelectItem>
                        <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    {loading ? (
                        <div className="text-center py-4">Loading tickets...</div>
                    ) : currentTickets.length > 0 ? (
                        <>
                            {currentTickets.map((ticket) => (
                                <Ticket key={ticket._id} ticket={ticket} />
                            ))}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(endIndex, pagination.totalTickets)} of {pagination.totalTickets} tickets
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage <= 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </Button>
                                    <span className="text-sm">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage >= pagination.totalPages}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4 text-muted-foreground">No tickets available</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


