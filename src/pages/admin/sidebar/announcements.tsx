import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { createAnnouncement, getAnnouncementsAdmin } from '@/api/api';
import AnnouncementsView, { AnnouncementsViewRef } from '@/pages/global-components/announcementsViewAdmin';

// Define the schema for validation
const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required')
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

interface Announcement {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AnnouncementsAdmin() {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState<Partial<AnnouncementFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const announcementsViewRef = useRef<AnnouncementsViewRef>(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const response = await getAnnouncementsAdmin();
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof AnnouncementFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      announcementSchema.parse(formData);
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.description);
      const response = await createAnnouncement(submitData);
      
      toast.success('Announcement created successfully');
      setFormData({ title: '', description: '' });
      setErrors({});
      
      // Refresh the announcements list
      fetchAnnouncements();
     
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<AnnouncementFormData> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof AnnouncementFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error('Failed to create announcement');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.title.trim() !== '' && formData.description.trim() !== '';

  return (
    <div className="flex flex-row gap-8 p-6 max-w-7xl mx-auto">
      <div className="w-3/5  rounded-lg shadow-sm border p-6 max-h-fit">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Create Announcement</h1>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-fit">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className={`${errors.title ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter announcement title"
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleChange}
                className={`${errors.description ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-blue-500 min-h-[120px]`}
                placeholder="Enter announcement description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Announcement'}
          </Button>
        </form>
      </div>
      
      <div className="w-2/5">
        <AnnouncementsView 
          ref={announcementsViewRef}
          announcements={announcements}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
