import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {  Clock, User } from 'lucide-react';
import {  useEffect, useState } from 'react';
import { MyTicketDetails } from '@/api/api';
import { useParams } from 'react-router';
import { Tickettype, TicketPriority } from '@/types';
import { useLocation } from 'react-router';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import { MasterDropdownDatatype } from '@/types';
import { getPriorityColor } from '@/pages/global-components/GetStatusColor';

export default function ForceResolve() {
  const [ticketData, setTicketData] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const { dropdownData } = useMasterDropdown();
  const location = useLocation();
  const { id } = useParams();
  const ticketFromState: Tickettype | null = location.state?.ticket || null;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = ticketFromState ? { data: ticketFromState } : await MyTicketDetails(id);
        setTicketData(response.data);
        setStatus(response.data.status.toLowerCase());
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch ticket';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, ticketFromState]);

  useEffect(() => {
    console.log(dropdownData, 'Dropdown Data'); // Debugging dropdownData
  }, [dropdownData]);

  if (loading) {
    return <div className="text-center py-6">Loading ticket details...</div>;
  }

  if (error) {
    return <div className="text-center py-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="px-6">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Force Resolve the ticket #{ticketData?._id}</CardTitle>
          <CardDescription>Forcefully Resolve the ticket.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current ticket information */}  
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{ticketData?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ticketData?.description}</p>
              </div>
              <div className={`bg-${getPriorityColor(ticketData?.priority || TicketPriority.Low)} text-sm p-1 rounded-md`}>
                {ticketData?.priority}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm pt-2">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Currently assigned to: {ticketData?.assigned_to}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Created At: {ticketData?.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Reassignment form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <Select>
                  <label>Select Reason</label>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {dropdownData?.resolvedPostList?.length > 0 ? (
                      dropdownData.resolvedPostList.map((item: MasterDropdownDatatype['resolvedPostList'][0]) => (
                        <SelectItem key={item._id} value={String(item.title || '')}>
                          {item.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value={''}>No options available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label>Additional Notes</label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes here."
                rows={3}
              />
            </div>

          </form>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Reassign Ticket</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
