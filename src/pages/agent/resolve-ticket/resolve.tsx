import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuLabel } from '@/components';
import { KeenIcon } from '@/components';
import { MyTicketDetails } from '@/api/api';
import { Tickettype } from '@/types';

export default function ResolveTicket() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [ticketData, setTicketData] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const ticketFromState: Tickettype | null = location.state?.ticket || null;

  const STATUS_OPTIONS = ['in-progress', 'Resolved by Agent', 'closed'] as const;
  const isClosed = status === 'closed';

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

  const handleBadgeClick = async (newStatus: string) => {
    if (isClosed || newStatus === status) return;
    try {
      setLoading(true);
      setStatus(newStatus);
      // API call can be added here
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolvedDropdownChange = (value: string) => {
    switch (value) {
      case 'reopen':
        console.log('Ticket will be reopened');
        break;
      case 'confirm-closure':
        console.log('Ticket will be marked as closed');
        break;
      case 'reassign':
        console.log('Reassignment process initiated');
        break;
      default:
        console.warn('Unknown action selected from resolved dropdown');
    }
  };

  const getBadgeClass = (badgeStatus: string) => {
    const selected = badgeStatus === status;
    return `cursor-pointer text-sm px-3 py-1 rounded-full transition-colors duration-200 ${
      selected
        ? badgeStatus === 'in-progress'
          ? 'bg-blue-500 text-white'
          : badgeStatus === 'resolved'
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
        : badgeStatus === 'in-progress'
        ? 'bg-blue-100 text-blue-700'
        : badgeStatus === 'resolved'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700'
    }`;
  };

  if (loading) return <p>Loading...</p>;

  if (error)
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  if (!ticketData)
    return (
      <div className="text-gray-500">
        <p>No ticket data available.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );

  return (
    <Card className="mx-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Resolve Ticket</h3>
            <p className="text-gray-500">#{ticketData._id}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <MenuLabel>Ticket Status</MenuLabel>
          {isClosed ? (
            <Badge className="bg-red-500 text-white capitalize">{status}</Badge>
          ) : (
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex gap-3 flex-wrap">
                {STATUS_OPTIONS.filter((s) => s !== 'closed').map((option) => (
                  <Badge
                    key={option}
                    className={getBadgeClass(option)}
                    onClick={() => handleBadgeClick(option)}
                  >
                    {option.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                ))}
              </div>

              {status === 'Resolved by Agent' && (
                <select
                  className="px-3 py-2 rounded-md border border-gray-300 text-sm capitalize bg-white dark:bg-gray-800 dark:border-gray-600"
                  onChange={(e) => handleResolvedDropdownChange(e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select next action
                  </option>
                  <option value="reopen">Reopen Ticket</option>
                  <option value="confirm-closure">Confirm Closure</option>
                  <option value="reassign">Reassign</option>
                </select>
              )}
            </div>
          )}
        </div>




        <Separator className="mb-6" />

        <Textarea placeholder="Enter the resolution" className="mb-4" />

        {/* File Upload */}
        <div className="flex flex-col gap-2 mb-4">
          <MenuLabel>Upload Files</MenuLabel>
          <div
            className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${
              dragging ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) {
                const dropped = Array.from(e.dataTransfer.files);
                setFiles((prev) => [...prev, ...dropped]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <KeenIcon icon="cloud-add" className="text-3xl mb-2" />
            <p className="font-medium text-gray-700">Drag & drop files here</p>
            <p className="text-sm text-gray-500">or click to select files</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                const selected = Array.from(e.target.files);
                setFiles((prev) => [...prev, ...selected]);
              }
            }}
          />

          {files.length > 0 ? (
            <div className="mt-2 text-sm text-gray-600">
              {files.map((file, i) => (
                <p key={i}>{file.name}</p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No files selected</p>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button>Send Resolution</Button>
      </CardFooter>
    </Card>
  );
}
