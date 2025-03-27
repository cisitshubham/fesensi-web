import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Container, MenuLabel } from '@/components';
import { useState } from 'react';
import { Link } from 'react-router-dom';


const CreateTicketForm = () => {
	const [searchInput, setSearchInput] = useState('');
	const [category, setCategory] = useState('');
	const [priority, setPriority] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [files, setFiles] = useState('');

	function handleResetForm(): void {
		setSearchInput('');
		setCategory('');
		setPriority('');
		setTitle('');
		setDescription('');
		setFiles('');
	}
	return (
		<Container>
			<MenuLabel className="mb-3.5">Create Ticket</MenuLabel>
			<div className="card max-w-full w-full">
				<form className="card-body gap-5 p-10">
					<div className="flex flex-row gap-2">
						<div className="flex flex-col gap-1 w-full mb-3">
						<MenuLabel className="mb-1">Titile</MenuLabel>
							<Input
								placeholder="Title"
								name="title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<div className="flex flex-col gap-1 w-full mb-3">
							<MenuLabel className="mb-1">Description</MenuLabel>

							<Textarea
								className="outline-none resize-none"
								name="description"
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>
					</div>
					<div className="flex flex-row gap-2 w-full">
						<div className="flex flex-col gap-1 w-full mb-3">
							<MenuLabel className="mb-1">Category</MenuLabel>
							<select
								name="category"
								autoComplete="off"
								className="select"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								<option value="">Select Category</option>
								<option value="new">New Value</option>
								<option value="value">Value</option>
							</select>
						</div>		
					</div>


					<div className="flex flex-row gap-2">
						<div className="flex flex-col gap-1 w-full mb-3">
							<MenuLabel className="mb-1">Priority</MenuLabel>
							<select
								name="priority"
								autoComplete="off"
								className="select"
								value={priority}
								onChange={(e) => setPriority(e.target.value)}
							>
								<option value="">Select Priority</option>
								<option value="high">High</option>
								<option value="low">Low</option>
							</select>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<div className="flex flex-col gap-1 w-full mb-3">
							<MenuLabel className="mb-1">SLA</MenuLabel>
							<select
								name="priority"
								autoComplete="off"
								className="select"
								value={priority}
								onChange={(e) => setPriority(e.target.value)}
							>
								<option value="">Assign user</option>
								<option value="high">High</option>
								<option value="low">Low</option>
							</select>
						</div>
					</div>
					<div className="flex flex-row gap-2">
						<div className="flex flex-col gap-1 w-full mb-3">
							<MenuLabel className="mb-1">Attachments</MenuLabel>
							<Input className="input" name="files" type="file" multiple />
						</div>
					</div>
					<div className="flex flex-row gap-2 mt-5 max-w-72">
						<Button
							type="button"
							className="btn btn-danger flex justify-center grow w-4/5"
							onClick={handleResetForm}
						>
							Reset
						</Button>
						<Button type="submit" className="btn btn-primary flex justify-center grow w-4/5">
							Create Ticket
						</Button>
					</div>
				</form>
			</div>
		</Container>
	);
};

export default CreateTicketForm;
