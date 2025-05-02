import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { getDropdown, updateTicket, getTicketById ,removeAttachment } from '@/api/api';
import { Navbar } from '@/partials/navbar';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UpdateTicketForm = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticket, setTicket] = useState<any>(null);
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getDropdown();

      } catch (error: any) {
        toast.error(error || 'Failed to load categories and priorities. Please try again.', {
          position: 'top-center',
          cancel: true
        });
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        try {
          const response = await getTicketById(id);
          if (!response) {
            toast.error('Failed to load ticket.', { position: 'top-center', cancel: true });
          }
          if (response.data) {
            setTicket(response.data);
            setTitle(response.data.title || '');
            setDescription(response.data.description || '');
 
          }
        } catch {
          toast.error('Failed to load ticket.', {
            position: 'top-center',
            action: 'updateTicket',
            cancel: true
          });
        }
      };
      fetchTicket();
    }
  }, [id]);

const handleRemoveAttachment = async (attachmentId: string ,ticket_id:string) => {
    try {			
		const formData = new FormData();
		formData.append('ticket_id', ticket_id);
		formData.append('attachment_id', attachmentId);			 	
	   const response = await removeAttachment(formData);
	   
	   if (response.success) {
		toast.success('Attachment removed successfully', {
					  position: 'top-center',
					  action: 'updateTicket',
					  cancel: true
		});
	}	      
    } catch (error) {
      toast.error('Failed to remove attachment. Please try again.', {
        position: 'top-center',
        action: 'updateTicket',
        cancel: true
      });
    }
  };	  

	  	

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('description', description);

  
  

      if (ticket?._id && isValidObjectId(ticket._id)) {
        formData.append('ticket_id', ticket._id);
      }

  
      function isValidObjectId(value: any) {
        return /^[0-9a-fA-F]{24}$/.test(value);
      }

      if (files) {
        Array.from(files).forEach((file) => formData.append('file', file));
      }

      let result = await updateTicket(formData);
      if (!result || !result.data) {
        throw new Error('Invalid response from server.');
      }
      if (result.data.success) {
        toast.success('Ticket updated successfully', {
          position: "top-center",
          action: 'updateTicket',
          cancel: true
        });
      setTimeout(() => {
        navigate('/user/Mytickets'); // Redirect to the desired page after 3 seconds
      }, 1000);
      
      }

    } catch {
      toast.error('Failed to update ticket. Please try again.', {
        position: "top-center",
        action: 'updateTicket',
        cancel: true
      });
    } finally {
      setLoading(false);
      setError(null);
    }
  };

  return (
    <Container className="card p-3">
      {error && <Alert variant="danger">{error}</Alert>}
      <Navbar>
        <MenuLabel className="text-gray-700 mb-1">Update Ticket</MenuLabel>
        <Button
          type="button"
          onClick={() => {
            setTitle('');
            setDescription('');
        
          }}
          className="btn btn-sm ml-auto text-gray-500 mb-1 bg-gray-300 hover:bg-gray-200"
        >
          Reset
        </Button>
      </Navbar>
      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 w-4/12">
              <MenuLabel className="cursor-default">Ticket ID</MenuLabel>
              <Input
                type="text"
                value={ticket?.ticket_number || ''}
                readOnly
                className="bg-gray-300"
              />
            </div>
          </div>
          <div>
   
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
             
            </div>
            <div className="flex flex-col gap-2">
             
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">

            </div>
            <div className="flex flex-col gap-2">

            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <MenuLabel>Description</MenuLabel>
              <Textarea
                className="text-balance resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <MenuLabel>Upload Files</MenuLabel>
            <div className="flex flex-row justify-between items-start gap-4 border rounded-lg p-4 bg-light-light  ">
              {/* Existing Attachments with Remove Option */}
              <div className="flex flex-wrap gap-2">
                {(ticket as any)?.attachments?.length ? (
                  (ticket as any).attachments.map((file: any, index: number) => (
                    <div key={file._id} className="relative">
                      <a
                        href={file.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={file.file_url}
                          alt="Attachment"
                          className="w-16 h-16 object-cover rounded-lg border hover:opacity-80 transition"
                        />
                      </a>
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
						onClick={() => {
							handleRemoveAttachment(file._id, ticket._id);
							const updatedAttachments = (ticket as any).attachments.filter((_: any, i: number) => i !== index);
							setTicket({ ...ticket, attachments: updatedAttachments });
						}}
						>		
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No attachments available</p>
                )}
              </div>

              {/* Right: Upload Box */}
              <div
                className={`border-2 border-dashed p-2 flex flex-col items-center justify-center text-center rounded-lg transition-all duration-300 cursor-pointer ${dragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <KeenIcon icon="cloud-add" className="text-3xl" />
                <p className="text-gray-700 font-medium">Drag & drop files here</p>
                <p className="text-sm text-gray-500">or click to select files</p>
              </div>
            </div>

            {/* File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
                setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
              }}
              multiple
              className="hidden"
            />

            {/* Selected Files Preview */}
            {files.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                <h3 className="text-gray-500 text-xs mt-3">Selected Files</h3>
                <div className="flex flex-wrap gap-2">
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
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="ml-auto w-40 bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default UpdateTicketForm;
