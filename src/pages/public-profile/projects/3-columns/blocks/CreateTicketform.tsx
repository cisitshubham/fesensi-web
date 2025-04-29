import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { useState, useEffect, useRef } from 'react';
import { getDropdown, createTicket } from '@/api/api';
import { showToast } from '@/components/toast';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { KeenIcon } from '@/components';
import { toast } from 'sonner';

const CreateTicketForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
        setPriorities(response.data.priorities);
        setCategories(response.data.categories);
      } catch (error: any) {
        setError('Failed to load categories and priorities. Please try again.');
      }
    };
    fetchCategories();
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'Title is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!category) errors.category = 'Please select a category';
    if (!priority) errors.priority = 'Please select a priority';

    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (!files[i].type.startsWith('image/')) {
          errors.files = 'Only image files are allowed';
        } else if (files[i].size > 5 * 1024 * 1024) {
          errors.files = 'File size should be under 5MB';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', title || '');
      formData.append('description', description || '');
      formData.append('priority', priority || '');
      formData.append('category', category || '');

      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('file', files[i]);
        }
      }
      try {
        const result = await createTicket(formData);

        if (!result || !result.data) {
          throw new Error('Invalid response from server.');
        }

        if (result.data.success) {
          toast.success('Ticket created successfully', { position: "top-center" });
          setTitle('');
          setDescription('');
          setCategory('');
          setPriority('');
          // setFiles();
          setValidationErrors({});
        } else {
          throw new Error(result.data.message || 'Failed to create ticket');
        }
      } catch (error: any) {
        setError(error.message || 'An unexpected error occurred.');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="card p-3 ">
      {error && <Alert variant="danger">{error}</Alert>}
      <Navbar>
        <MenuLabel className=" text-gray-700 mb-3">Create Ticket</MenuLabel>
        <Button
          type="button"
          onClick={() => {
            setTitle('');
            setDescription('');
            setCategory('');
            setPriority('');
          }}
          className="btn btn-sm ml-auto text-gray-500 mb-1 bg-gray-300 hover:bg-gray-200"
        >
          Reset
        </Button>
      </Navbar>
      <div className="p-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <MenuLabel className="cursor-default">Ticket Title</MenuLabel>
              {validationErrors.title && <Alert variant="danger">{validationErrors.title}</Alert>}
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ticket Title"
              />
            </div>
            <div className="flex flex-col gap-2">
              <MenuLabel>Description</MenuLabel>
              {validationErrors.description && (
                <Alert variant="danger">{validationErrors.description}</Alert>
              )}
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ticket Description"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <MenuLabel>Category</MenuLabel>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="">Select Category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <Alert variant="danger">{validationErrors.category}</Alert>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <MenuLabel>Priority</MenuLabel>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="select"
              >
                <option value="">Select Priority</option>
                {priorities.map((pri: any) => (
                  <option key={pri._id} value={pri._id}>
                    {pri.name}
                  </option>
                ))}
              </select>
              {validationErrors.priority && (
                <Alert variant="danger">{validationErrors.priority}</Alert>
              )}
            </div>
          </div>

          {/* Third Row - Upload Files (Full Width) */}
          <div className="flex flex-col gap-2">
            <MenuLabel>Upload Files</MenuLabel>
            <div
              className={`border-2 border-dashed p-6 flex flex-col items-center justify-center text-center rounded-lg transition-all duration-300 cursor-pointer ${dragging ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <KeenIcon icon="cloud-add" className="text-3xl" />
              <p className="text-gray-700 font-medium">Drag & drop files here</p>
              <p className="text-sm text-gray-500">or click to select files</p>
            </div>
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
            {validationErrors.files && <Alert variant="danger">{validationErrors.files}</Alert>}
          </div>
          {/* Show selected files */}
          <div className="mt-2 text-sm text-gray-600">
            {files.length > 0 ? (
              files.map((file, index) => <p key={index}>{file.name}</p>)
            ) : (
              <p>No files selected</p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="ml-auto w-40 bg-gradient-to-r from-blue-700 to-blue-500 text-white  py-2 px-4 rounded-lg shadow-md hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default CreateTicketForm;
