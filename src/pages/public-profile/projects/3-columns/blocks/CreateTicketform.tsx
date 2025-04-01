import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { useState, useEffect } from 'react';
import { getDropdown, createTicket } from '@/api/api';
import { showToast } from '@/components/toast';
import { Navbar, NavbarActions, NavbarDropdown } from '@/partials/navbar';


const CreateTicketForm = () => {
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
					showToast('Ticket created successfully.', 'success');
					alert(`Ticket created successfully : Ticket ID: ${result.data}`);
					setTitle('');
					setDescription('');
					setCategory('');
					setPriority('');
					setFiles(null);
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
		<Container>
				{error && <Alert variant='danger'>{error}</Alert>}
			<Navbar>
			<MenuLabel className=' text-gray-700'>Create Ticket</MenuLabel>
			</Navbar>	
			<div className='p-3'>
				<form onSubmit={handleSubmit}>
					<MenuLabel>Title</MenuLabel>
					<div className='flex flex-col gap-2'>
						<Input type='text' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Ticket Title' />
						{validationErrors.title && <Alert variant='danger'>{validationErrors.title}</Alert>}
					</div>
					<div className='flex flex-col gap-2'>
						<MenuLabel>Description</MenuLabel>
						<Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Ticket Description' />
						{validationErrors.description && <Alert variant='danger'>{validationErrors.description}</Alert>}
					</div>
					<div className='flex flex-col gap-2'>
						<MenuLabel>Category</MenuLabel>
						<select value={category} onChange={(e) => setCategory(e.target.value)} className='select'>
							<option value=''>Select Category</option>
							{categories.map((cat: any) => (
								<option key={cat._id} value={cat._id}>{cat.title}</option>
							))}
						</select>
						{validationErrors.category && <Alert variant='danger'>{validationErrors.category}</Alert>}
					</div>
					<div className='flex flex-col gap-2'>
						<MenuLabel>Priority</MenuLabel>
						<select value={priority} onChange={(e) => setPriority(e.target.value)} className='select'>
							<option value=''>Select Priority</option>
							{priorities.map((pri: any) => (
								<option key={pri._id} value={pri._id}>{pri.name}</option>
							))}
						</select>
						{validationErrors.priority && <Alert variant='danger'>{validationErrors.priority}</Alert>}
					</div>
					<div className='flex flex-col gap-2'>
						<MenuLabel>Upload Files</MenuLabel>
						<Input type='file' onChange={(e) => setFiles(e.target.files)} multiple />
						{validationErrors.files && <Alert variant='danger'>{validationErrors.files}</Alert>}
					</div>
					<div className='flex gap-2 mt-4'>
						<Button type='button' onClick={() => { setTitle(''); setDescription(''); setCategory(''); setPriority(''); setFiles(null); }}>Reset</Button>
						<Button type='submit' disabled={loading}>{loading ? 'Creating...' : 'Create Ticket'}</Button>
					</div>
				</form>
			</div>
		</Container>
	);
};

export default CreateTicketForm;
