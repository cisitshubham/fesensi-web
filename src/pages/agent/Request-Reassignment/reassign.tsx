import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MyTicketDetails } from '@/api/api';
import { useParams } from 'react-router';
import { Tickettype } from '@/types';
import { useLocation } from 'react-router';
import { useMasterDropdown } from '@/pages/global-components/master-dropdown-context';
import { MasterDropdownDatatype } from '@/types';
import { requestReassign } from '@/api/api';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function ReassignTicket() {
    
  const { dropdownData } = useMasterDropdown();
  const [dragging, setDragging] = useState(false);
  const [ticketData, setTicketData] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [selectedResolution, setSelectedResolution] = useState('');
  const location = useLocation();
  const { id } = useParams();
  const [desc, setDesc] = useState('');
  const ticketFromState: Tickettype | null = location.state?.ticket || null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const response = ticketFromState ? { data: ticketFromState } : await MyTicketDetails(id);
		if(!response) {
			toast.error('Ticket data is not available.');
			
		}
        setTicketData(response.data);
        setStatus(response.data.status.toLowerCase());
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch ticket';
		toast.error('Failed to fetch ticket');
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id, ticketFromState]);

  
const handkeSelectChange = (value: string) => {
    setSelectedResolution(value);
  }

const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(e.target.value);
  }


  const handleReassign = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!ticketData) {
      setError('Ticket data is not available.');
	  toast.error('Ticket data is not available.');
      return;
    }

    const formData = new FormData();
    formData.append('AgentreAssign', selectedResolution);
    formData.append('AgentreAssignComment', desc);
    formData.append('ticket_id', ticketData?._id as any);


    try {
      setLoading(true);
      await requestReassign(formData);
    //   navigate('/'); // Redirect to a success page or another route
	  toast.success('Ticket reassigned successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reassign ticket';
	  toast.error('Failed to reassign ticket');
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container px-6 ">

      <Card className=" mx-auto">
        <CardHeader>
          <CardTitle>Reassign Ticket {ticketData?.ticket_number}</CardTitle>
          <CardDescription>Transfer this ticket to another team member</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current ticket information */}
          <div className="bg-muted p-4 rounded-md space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{ticketData?.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{ticketData?.description}</p>
              </div>
              <div className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-md">
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
          <form className="space-y-4" onSubmit={handleReassign}>
            <div className="space-y-2">
              <div className="space-y-2">
                  <Select onValueChange={handkeSelectChange}>
                    <label>Select Reason</label>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownData?.reassignOptions?.length > 0 ? (
                        dropdownData.reassignOptions.map((item: MasterDropdownDatatype['reassignOptions'][0]) => (
                          <SelectItem key={item._id} value={String(item._id || '')}>
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
                placeholder="Explain the reason for reassignment"
                rows={3}
                onChange={handleDescChange} 
              />
            </div>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit">Reassign Ticket</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
