import { useEffect, useState } from 'react';
import { MyTickets } from '@/api/api';
import BulkReassignCard from './ticket.card';
import { Tickettype } from '@/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
export default function BulkReassign() {
    const [tickets, setTickets] = useState<Tickettype[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const masterDropdown = useMasterDropdown();
    const reassignReasons = masterDropdown.dropdownData || [];
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const filters = { status: ['IN-PROGRESS', 'OPEN'] };
                const response = await MyTickets(filters);
                setTickets(response.data);
                setLoading(false);
            } catch (error: any) {
                setError('Failed to fetch tickets. Please try again later.');
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    useEffect(() => {
        console.log(getSelectedTicketIds());
    }, [tickets]);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setTickets((prevTickets) =>
            prevTickets.map((ticket) => ({ ...ticket, isSelected: checked }))
        );
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const getSelectedTicketIds = () => {
        return tickets.filter((ticket) => ticket.isSelected).map((ticket) => ticket._id);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Card>
                <div className="flex items-center justify-between p-4">
                    <div className="">
                        <Checkbox
                            checked={selectAll}
                            onCheckedChange={(checked) => handleSelectAll(checked === true)}
                            className="h-5 w-5"
                            id="select-all"
                        />
                        <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-700">
                            Select All
                        </label>
                    </div>

                    <Button onClick={handleDialogOpen}>Request Reassignment</Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-6">
                    {tickets.map((ticket) => (
                        <BulkReassignCard key={ticket._id} ticket={ticket} onCheck={function (id: string, isSelected: boolean): void {
                            throw new Error('Function not implemented.');
                        }} />
                    ))}
                </div>
            </Card>

            <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='p-6'>
                    <DialogHeader>
                        <DialogTitle>Confirm Reassignment</DialogTitle>
                    </DialogHeader>
                    <div className='text-red-500'>Are you sure you want to reassign the selected tickets?</div>
                    <div className="mt-4">
                        <label htmlFor="reassign-reason" className="block text-sm font-medium text-gray-700">
                            Select Reassignment Reason
                        </label>
                        <select
                            id="reassign-reason"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {reassignReasons.map((reason:any) => (
                                <option key={reason.id} value={reason.id}>
                                    {reason.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <DialogFooter>
                        <Select>
                            <SelectTrigger className="w-full" aria-label="Select Agent">
                                <SelectValue placeholder="Select Agent" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="agent1">Agent 1</SelectItem>
                                <SelectItem value="agent2">Agent 2</SelectItem>
                                <SelectItem value="agent3">Agent 3</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            console.log("Reassigning tickets:", getSelectedTicketIds());
                            handleDialogClose();
                        }}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}