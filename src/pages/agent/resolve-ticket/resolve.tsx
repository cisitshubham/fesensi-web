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
import { updateResolution } from '@/api/api';
import { toast } from 'sonner';


const STATUS_OPTIONS = ['in-progress', 'Resolved', 'closed'] as const;

const BadgeDisplay = ({ status, isClosed }: { status: string; isClosed: boolean }) => (
  isClosed ? (
    <Badge className="bg-red-500 text-white capitalize">{status}</Badge>
  ) : (
    <div className="flex flex-wrap items-center gap-4 mt-2">
      <div className="flex gap-3 flex-wrap">
        {STATUS_OPTIONS.filter((s) => s !== 'closed').map((option) => (
          <Badge
            key={option}
            className={getBadgeClass(option, status)}
          >
            {option.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </Badge>
        ))}
      </div>
    </div>
  )
);

const getBadgeClass = (badgeStatus: string, currentStatus: string) => {
  const selected = badgeStatus === currentStatus;
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

const FileUpload = ({ files, setFiles }: { files: File[]; setFiles: React.Dispatch<React.SetStateAction<File[]>> }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
  );
};

export default function ResolveTicket() {
  const [files, setFiles] = useState<File[]>([]);
  const [ticketData, setTicketData] = useState<Tickettype | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [resolution, setResolution] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!ticketData) {
      setError('Ticket data is not available.');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resolution', resolution); // Assuming `resolution` is a state variable for the textarea input
      formData.append('ticket_id', ticketData._id);

      files.forEach((file) => {
		console.log(file);		
        formData.append('image', file);
      });

      const response = await updateResolution(formData);

      if (response.success) {
        // navigate('/'); // Redirect after successful resolution
		  toast.success('Reason saved successfully');
      } else {
		toast.error('Failed to resolve ticket.');
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
		toast.error('Failed to resolve ticket.');
	} finally {
      setLoading(false);
    }
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
            <p className="text-gray-500">#{ticketData.ticket_number}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div>
          <MenuLabel>Ticket Status</MenuLabel>
          <BadgeDisplay status={status} isClosed={status === 'closed'} />
        </div>

        <Separator className="mb-6" />

        <Textarea 
          placeholder="Enter the resolution" 
          className="mb-4" 
          value={resolution} 
          onChange={(e) => setResolution(e.target.value)} 
        />

        <FileUpload files={files} setFiles={setFiles} />
      </CardContent>

      <CardFooter>
        <Button onClick={handleSubmit}>Send Resolution</Button>
      </CardFooter>
    </Card>
  );
}
