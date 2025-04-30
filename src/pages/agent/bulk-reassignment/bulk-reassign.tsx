import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { MyTickets } from '@/api/api';
import BulkReassignCard from './ticket.card';
import { Tickettype } from '@/types';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import { Textarea } from '@/components/ui/textarea';
import { requestReassign } from '@/api/api';
import { toast, } from 'sonner';
import { useNavigate } from 'react-router';
import { getReassignListPending } from '@/api/api';
import { get } from 'http';

export default function BulkReassign() {
    const navigate = useNavigate()
    const [tickets, setTickets] = useState<Tickettype[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectAll, setSelectAll] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [description, setdescription] = useState<string>('');
    const masterDropdown = useMasterDropdown();
    const reassignReasons = masterDropdown.dropdownData?.reassignOptions || [];

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const responce = await getReassignListPending();
                if (responce && Array.isArray(responce.data)) {
                    setLoading(false);
                }
                setTickets(responce.data);
            } catch (error: any) {
                setError('Failed to fetch tickets. Please try again later.');
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setTickets((prevTickets) =>
            prevTickets.map((ticket) => ({ ...ticket, isSelected: checked }))
        );
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedReason('');
    };


    const handleSubmit = async () => {
        const selecteddTickets = tickets.filter((ticket) => ticket.isSelected).map((ticket) => ticket._id);

        const formData = new FormData();
        selecteddTickets.forEach((ticketId) => {
            formData.append('ticket_id[]', ticketId);
        });
        formData.append('AgentreAssign', selectedReason);
        formData.append('AgentreAssignComment', description);
        console.log(typeof (formData.get('ticket_id')));
        console.log(formData.get('AgentreAssign'));
        console.log(formData.get('AgentreAssignComment'));
        const response = await requestReassign(formData);
        if (response) {
            toast.success('Tickets reassigned successfully.', { position: "top-center" });
            setIsDialogOpen(false);
            setSelectedReason('');
            setdescription('');
            setTimeout(() => {
                navigate('/agent/mytickets');
            }, 2000);
        } else {
            toast.error('Failed to reassign tickets. Please try again.', { position: "top-center" });
        }
        setIsDialogOpen(false);
        setSelectedReason('');
        setdescription('');


    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Card>
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
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
                        <BulkReassignCard
                            key={ticket._id}
                            ticket={ticket}
                            onCheck={(id: string, isSelected: boolean) => {
                                setTickets((prevTickets) =>
                                    prevTickets.map((ticket) =>
                                        ticket._id === id ? { ...ticket, isSelected } : ticket
                                    )
                                );
                            }}
                        />
                    ))}
                </div>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Confirm Reassignment</DialogTitle>
                    </DialogHeader>

                    <div className="text-red-500">
                        Are you sure you want to reassign the selected tickets?
                    </div>

                    <div className="mt-4">
                        <label htmlFor="reassign-reason" className="block text-sm font-medium text-gray-700">
                            Select Reassignment Reason
                        </label>
                        <Select value={selectedReason} onValueChange={(value) => setSelectedReason(value)}>
                            <SelectTrigger className="w-full" aria-label="Select Reason">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {reassignReasons.map((reason: any) => (
                                    <SelectItem key={reason._id || reason.title} value={String(reason._id)}>
                                        {reason.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Textarea onChange={(e) => setdescription(e.target.value)} />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!selectedReason}
                            onClick={() => {
                                console.log("Reassigning tickets:", handleSubmit(), "Reason:", selectedReason);
                                handleDialogClose();
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
