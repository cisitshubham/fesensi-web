import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { getDropdown, updateTicket ,getTicketById} from '@/api/api';
import { showToast } from '@/components/toast';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";



const UpdateTicketForm = () => {
	const { id } = useParams<{ id: string }>();
	const [ticket, setTicket] = useState<{ id: string; title: string; description: string; category: string; priority: string; files: FileList | null }>({ id: '', title: '', description: '', category: '', priority: '', files: null });
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [priority, setPriority] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);
	const [categories, setCategories] = useState([]);
	const [priorities, setPriorities] = useState<{ id: string; name: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
	useEffect(() => {
		if (id) {
            const fetchTicket = async () => {
                try {
                    const response = await getTicketById(id);
                    setTicket(response.data);
                    setTitle(response.data.title);
                    setDescription(response.data.description);
                    setCategory(response.data.categoryId);
                    setPriority(response.data.priorityId);
                } catch (error: any) {
                    setError('Failed to load ticket. Please try again.');
                }
            };
            fetchTicket();
        }
    }, [id]);

	const validateForm = () => {
		const errors: Record<string, string> = {};
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
			formData.append('ticketId', (ticket as any)._id || '');

			if (files) {
				for (let i = 0; i < files.length; i++) {
					formData.append('file', files[i]);
				}
			}
			try {
				const result = await updateTicket(formData);

				// if (!result || !result.data) {
				// 	throw new Error('Invalid response from server.');
				// }

				// if (result.data.success) {
				// 	showToast('Ticket created successfully.', 'success');
				// 	alert(`Ticket updated successfully : Ticket ID: ${result.data}`);
				// 	setTitle('');
				// 	setDescription('');
				// 	setCategory('');
				// 	setPriority('');
				// 	setFiles(null);
				// 	setValidationErrors({});
				// } else {
				// 	throw new Error(result.data.message || 'Failed to update ticket');
				// }
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
		<Container>
				{error && <Alert variant='danger'>{error}</Alert>}
			<Navbar>
				<MenuLabel className=' text-gray-700'>Update Ticket</MenuLabel>
				
			</Navbar>	
			<div className='p-3 '>
				<form onSubmit={handleSubmit}>
					<div className='flex flex-col gap-2 mb-3'>
						<MenuLabel className='cursor-default'>Ticket ID</MenuLabel>
						<Input type='text' value={(ticket as any)?.ticket_number} onChange={(e) => setTitle(e.target.value)} readOnly className='cursor-default bg-gray-300 outline-none border-none'  />
					</div>
					<div className='flex flex-col gap-2 mb-3'>
                    <MenuLabel className='cursor-default'>Title</MenuLabel>
                    <Input 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                    />
                </div>
                <div className='flex flex-col gap-2 mb-3'>
                    <MenuLabel className='cursor-default'>Description</MenuLabel>
                    <Textarea 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>
					<div className='flex flex-col gap-2 mb-3'>
						<MenuLabel className='cursor-default'>Category</MenuLabel>
						<select value={category || (ticket as any)?.category || ''} onChange={(e) => setCategory(e.target.value)} className='select outline-none border-none'>
							<option value=''>{(ticket as any)?.category}</option>
							{categories.map((cat: any) => (
								<option key={cat._id} value={cat._id}>{cat.title}</option>
							))}
						</select>
					</div>
					<div className='flex flex-col gap-2 mb-3'>
						<MenuLabel className='cursor-default'>Priority</MenuLabel>
						<select value={priority || (ticket as any)?.priority || ''} onChange={(e) => setPriority(e.target.value)} className='select outline-none border-none'>
							<option value=''>{(ticket as any)?.priority}</option>

							{priorities.map((pri: any) => (
								<option key={pri._id} value={pri._id}>{pri.name}</option>
							))}
						</select>
					</div>
					<div className='flex flex-col gap-2 mb-3'>
						<MenuLabel className='cursor-default'>Upload Files</MenuLabel>
						<Input type='file' onChange={(e) => setFiles(e.target.files)} multiple />
						
					</div>
					<div>
						<div className="flex gap-4 flex-wrap mt-5">
							{(ticket as any)?.attachments?.length ? (
								(ticket as any).attachments.map((file: any) => (
									<a key={file._id} href={file.file_url} target="_blank" rel="noopener noreferrer" className="block">
										<img src={file.file_url} alt="Attachment" className="w-16 h-16 object-cover rounded-lg border hover:opacity-80 transition" />
									</a>
								))
							) : (
								<p className="text-gray-500 text-sm">No attachments available</p>
							)}
						</div>
					</div>
					<div className='flex gap-2 mt-4'>
						<Button type='submit' disabled={loading}>{loading ? 'Updating..' : 'Update Ticket'}</Button>
					</div>
				</form>
			</div>
		</Container>
	);
};

export default UpdateTicketForm;
