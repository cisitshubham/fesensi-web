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
import { z } from 'zod';

const FileUpload = ({ files, setFiles }: { files: File[]; setFiles: React.Dispatch<React.SetStateAction<File[]>> }) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <MenuLabel>Upload Files</MenuLabel>
      <div
        className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer flex flex-col items-center justify-center transition-all duration-300 ${dragging ? 'bg-blue-100 border-blue-500' : 'border-gray-300'
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
                {files.map((file, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Selected File"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    </div>
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const ticketFromState: Tickettype | null = location.state?.ticket || null;

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        if (!id) {
          throw new Error('Ticket ID is not available.');
        }
        const response = await MyTicketDetails(id);
        setTicketData(response.data);
        console.log(response.data, 'ticketData');
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

  // Define Zod schema for validation
  const resolutionSchema = z.object({
    resolution: z.string().min(1, 'Resolution is required'),
    files: z.array(z.instanceof(File)).optional(),
  });

  // Update handleSubmit to include validation
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!ticketData) {
      setError('Ticket data is not available.');
      return;
    }

    try {
      // Validate inputs
      const validationResult = resolutionSchema.safeParse({ resolution, files });
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setFieldErrors(fieldErrors);
        return;
      }

      setLoading(true);

      const formData = new FormData(event.currentTarget);
      formData.append('ticket_id', ticketData._id);

      files.forEach((file) => {
        console.log(file);
        formData.append('image', file);
      });

      const response = await updateResolution(formData);

      if (response.success) {
        toast.success('Reason saved successfully', { position: "top-center" });
        setTimeout(() => {
          navigate('/agent/mytickets'); // Redirect to the desired page after 3 seconds
        }, 3000);
      } else {
        toast.error('Failed to resolve ticket.', { position: "top-center" });
      }
    } catch (error) {
      console.error('Error resolving ticket:', error);
      toast.error('Failed to resolve ticket.', { position: "top-center" });
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
  

        <Separator className="mb-6" />

        <div className="flex flex-col gap-2">
          <label htmlFor="resolution" className="text-sm font-medium">
            Resolution <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="resolution"
            placeholder="Enter the resolution"
            className="mb-4"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            required
          />
          {fieldErrors.resolution && <p className="text-red-500 text-sm">{fieldErrors.resolution}</p>}
        </div>

        <FileUpload files={files} setFiles={setFiles} />
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>)}
          disabled={!resolution.trim()}
        >
          Send Resolution
        </Button>
      </CardFooter>
    </Card>
  );
}
