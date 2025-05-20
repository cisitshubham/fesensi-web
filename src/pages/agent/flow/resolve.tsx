import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      formData.append('resolution', resolution);

      files.forEach((file) => {
        formData.append('image', file);
      });

      const response = await updateResolution(formData);

      if (response.success) {
        toast.success('Resolution was sent successfully', { position: "top-center" });
        setTimeout(() => {
          navigate('/agent/mytickets'); // Redirect to the desired page after 3 seconds
        }, 1000);
      } else {
        toast.error('Failed to send resolution.', { position: "top-center" });
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

        {/* Display selected files with remove option */}
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Files</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {files.map((file, index) => (
                <div key={index} className="relative w-fit">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected file ${index + 1}`}
                    className="w-16 h-16 object-cover rounded-lg border hover:scale-105 transition-transform duration-200 cursor-pointer "
                    onClick={() => setSelectedImage(URL.createObjectURL(file))}
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={() => {
                      const updatedFiles = files.filter((_, i) => i !== index);
                      setFiles(updatedFiles);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                  <img
                    src={selectedImage}
                    alt="Selected attachment"
                    className="max-w-full max-h-full"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-4 right-4 text-white text-2xl"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            disabled={!resolution.trim() || loading}
          >
            Send Resolution
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
