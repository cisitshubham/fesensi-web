import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { getDropdown, updateTicket, getTicketById } from '@/api/api';
import { showToast } from '@/components/toast';
import { Navbar } from '@/partials/navbar';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { KeenIcon } from '@/components'

const UpdateTicketForm = () => {
	const { id } = useParams<{ id: string }>();
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [category, setCategory] = useState('');
	const [priority, setPriority] = useState('');
	const [status, setStatus] = useState<{ name: string }[]>([]);
	const [files, setFiles] = useState<File[]>([]);
	const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]);
	const [priorities, setPriorities] = useState<{ _id: string; name: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [adminUsers, setAdminUsers] = useState<{ _id: string; first_name: string }[]>([]);
	const [ticket, setTicket] = useState<any>(null);
	const [agentUser, setAgentUser] = useState<string>('');
	const [assigned_to, setAssignedTo] = useState<string>('');
	const [pStatus, setpStatus] = useState<string>('');


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

				setStatus(response.data.status || [])
				setPriorities(response.data.priorities || []);
				setCategories(response.data.categories || []);
				if (Array.isArray(response.data.AdminUsers)) {
					setAdminUsers(response.data.AdminUsers);
				}

			} catch {
				setError('Failed to load categories and priorities.');
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		if (id) {
			const fetchTicket = async () => {
				try {
					const response = await getTicketById(id);
					if (response.data) {
						setTicket(response.data);
						setTitle(response.data.title || '');
						setDescription(response.data.description || '');
						setCategory(response.data.category || '');
						setPriority(response.data.priority || '');
						setAssignedTo(response.data.assigned_to || '');
						setpStatus(response.data.status || '');

					}
				} catch {
					setError('Failed to load ticket.');
				}
			};
			fetchTicket();
		}
	}, [id]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const formData = new FormData();


			formData.append('title', title);
			formData.append('description', description);

			if (priority && isValidObjectId(priority)) {
				formData.append('priority', priority);
			}

			if (category && isValidObjectId(category)) {
				formData.append('category', category);
			}

			if (ticket?._id && isValidObjectId(ticket._id)) {
				formData.append('ticketId', ticket._id);
			}

			if (pStatus) {
				formData.append('status', pStatus);
			}
			if (agentUser && isValidObjectId(agentUser)) {
				formData.append('assigned_to', agentUser);
			}


			function isValidObjectId(value: any) {
				return /^[0-9a-fA-F]{24}$/.test(value);
			}



			if (files) {
				Array.from(files).forEach((file) => formData.append('images', file));
			}


			await updateTicket(formData);
			alert('Ticket updated successfully.');
			showToast('Ticket updated successfully.', 'success');
		} catch {
			setError('Failed to update ticket.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container className='card p-3'>
			{error && <Alert variant='danger'>{error}</Alert>}
			<Navbar>
				<MenuLabel className='text-gray-700 mb-1'>Update Ticket</MenuLabel>
				<Button
					type='button'
					onClick={() => { setTitle(''); setDescription(''); setCategory(''); setPriority(''); }}
					className='btn btn-sm ml-auto text-gray-500 mb-1 bg-gray-300 hover:bg-gray-200'>
					Reset
				</Button>
			</Navbar>
			<div className="p-3">
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2 w-4/12">
							<MenuLabel className='cursor-default'>Ticket ID</MenuLabel>
							<Input type='text' value={ticket?.ticket_number || ''} readOnly className='bg-gray-300' />
						</div>
					</div>
					<div>
						<div className="flex flex-col gap-2 w-full">
							<MenuLabel className='cursor-default'>Title</MenuLabel>
							<Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<MenuLabel>Priority</MenuLabel>
							<select value={priority || ''} onChange={(e) => setPriority(e.target.value)} className="select">
								<option value=''>{priority || 'Select Priority'}</option>
								{priorities.map((pri) => (
									<option key={pri._id} value={pri._id}>{pri.name}</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-2">
							<MenuLabel>Category</MenuLabel>
							<select value={category || ''} onChange={(e) => setCategory(e.target.value)} className="select">
								<option value=''>{category || 'Select Category'}</option>
								{categories.map((cat) => (
									<option key={cat._id} value={cat._id}>{cat.title}</option>
								))}
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<MenuLabel className='cursor-default'>Status</MenuLabel>
							<select value={pStatus || ''} onChange={(e) => setpStatus(e.target.value)} className="select">
								<option value=''>{pStatus || 'Select Status'}</option>
								{status.map((st) => (
									<option key={st.name} value={st.name}>{st.name}</option>
								))}
							</select>
						</div>
						<div className="flex flex-col gap-2">
							<MenuLabel>Assign To</MenuLabel>
							<select value={agentUser} onChange={(e) => setAgentUser(e.target.value)} className="select">
								<option value=''>{assigned_to || 'Select Assign To'}</option>
								{adminUsers.length > 0 ? (
									adminUsers.map((user) => (
										<option key={user._id} value={user._id}>{user.first_name}</option>
									))
								) : (
									<option disabled>Loading agents...</option>
								)}
							</select>
						</div>
					</div>
					<div>
						<div className="flex flex-col gap-2">
							<MenuLabel>Description</MenuLabel>
							<Textarea className='text-balance resize-none' value={description} onChange={(e) => setDescription(e.target.value)} />
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<MenuLabel>Upload Files</MenuLabel>
						<div className="flex flex-row justify-between items-start gap-4 border rounded-lg bg-gray-50 p-4">
							{/* Left: Existing Attachments */}
							<div className="flex flex-wrap gap-2">
								{(ticket as any)?.attachments?.length ? (
									(ticket as any).attachments.map((file: any) => (
										<a key={file._id} href={file.file_url} target="_blank" rel="noopener noreferrer">
											<img src={file.file_url} alt="Attachment" className="w-16 h-16 object-cover rounded-lg border hover:opacity-80 transition" />
										</a>
									))
								) : (
									<p className="text-gray-500 text-sm">No attachments available</p>
								)}
							</div>

							{/* Right: Upload Box */}
							<div
								className={`border-2 border-dashed p-2 flex flex-col items-center justify-center text-center rounded-lg transition-all duration-300 cursor-pointer ${dragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50"}`}
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
											<img src={URL.createObjectURL(file)} alt="Selected File" className="w-full h-full object-cover rounded-lg border" />
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
							disabled={loading}>
							{loading ? "Updating..." : "Update Ticket"}
						</Button>
					</div>
				</form>
			</div>
		</Container>

	);
};

export default UpdateTicketForm;
