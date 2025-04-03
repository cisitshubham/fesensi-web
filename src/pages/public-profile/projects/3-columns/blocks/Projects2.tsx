/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { KeenIcon } from '@/components';
import { getAllTicket } from '@/api/api';
import { CardProject, CardProjectRow } from '@/partials/cards';
import { ModalTicketFilter } from '@/partials/modals/search/ModalTicketFileter';
import { Link } from 'react-router-dom'


interface IProjects2Item {
	ticket_id: string;
	ticket_no: string;
	assigned: boolean;
	assigned_to: string;
	logo: string;
	name: string;
	description: string;
	startDate?: string;
	endDate?: string;
	status: {
		variant: string;
		label: string;
	};
	category: string
}

const Projects2 = () => {	
	const handleShow = () => {window.dispatchEvent(new Event('resize'))};
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const handleOpen = () => setSearchModalOpen(true);
	const handleClose = () => {setSearchModalOpen(false);};
	const [activeView, setActiveView] = useState('cards');
	const [projects, setProjects] = useState<IProjects2Item[]>([]);
	const [loading, setLoading] = useState(true);
	const [filteredData, setFilteredData] = useState(null);
	

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				setLoading(true);
				if(filteredData) {
					setProjects(filteredData);
                }
				const response = await getAllTicket();				
				const formattedProjects = response.data.map((ticket: any) => ({
					
					ticket_no: ticket.ticket_number,
					ticket_id: ticket._id,
					assigned: ticket.assigned,
					assigned_to: ticket.assigned_to,
					logo: ticket.icon || 'default.svg', 
					name: ticket.title,
					description: ticket.description,
					startDate: ticket.due_date||'N/A',
					status: {
						label: ticket.status,
						variant: mapStatusVariant(ticket.status), 
					},
					category: ticket.category,
				
				}));
				setProjects(formattedProjects); 
			} catch (error) {
				alert(`Error fetching projects:${error}`);
			} finally {
				setLoading(false);
			}
		};

		fetchProjects();		
	}, []);

	const renderProject = (project: IProjects2Item, index: number) => (
		<CardProject
			ticket_no={project.ticket_no}
			ticket_id={project.ticket_id}
			logo={(project as any).logo}
			assigned_to={project.assigned_to}
			name={(project as any).name}
			description={project.description}
			startDate={(project as any).startDate}
			status={project.status}
			category={project.category}
			key={index}
		/>
	);

	const renderItem = (item: IProjects2Item, index: number) => (
		<CardProjectRow
			ticket_no={item.ticket_no}
			assigned_to={item.assigned_to}
			ticketId={item.ticket_id}
			category={item.category}
			logo={item.logo}
			name={item.name}
			description={item.description}
			closedDate={item.startDate ?? ''}
			endDate={item.endDate ?? ''}
			status={item.status}
			key={index} priority={''} 
		/>
	);

	return (
		<div className="flex flex-col items-stretch gap-5 lg:gap-7.5">
			<div className="flex flex-wrap items-center gap-5 justify-between">
				<h3 className="text-lg text-gray-900 font-semibold">
					{loading ? 'Loading...' : `HelpDesk Inbox: ${projects.length} `}
				</h3>
				<div className="btn-tabs" data-tabs="true">
					<Link to="/TicketFilter/" className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500">
						<KeenIcon icon="filter" />
					</Link>
					<a href="#"
						className={`btn btn-icon btn-sm ${activeView === 'cards' ? 'active' : ''}`}
						onClick={() => setActiveView('cards')}>
						<KeenIcon icon="category" />
					</a>
					<a
						href="#"
						className={`btn btn-icon btn-sm ${activeView === 'list' ? 'active' : ''}`}
						onClick={() => setActiveView('list')}>
						<KeenIcon icon="row-horizontal" />
					</a>
				</div>
			</div>

			{loading ? (
				<p>Loading tickets...</p>
			) : (
				<>
					{activeView === 'cards' && (
						<div id="projects_cards" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
							{projects.map(renderProject)}
						</div>
					)}

					{activeView === 'list' && (
						<div id="projects_list" className="flex flex-col gap-5 lg:gap-7.5">
							{projects.map(renderItem)}
						</div>
					)}
				</>
			)}
		</div>
	);
};

function mapStatusVariant(status: string): string {
	switch (status) {
		case 'OPEN':
			return 'badge-primary';
		case 'IN-PROGRESS':
			return 'badge-info';
		case 'RESOLVED':
			return 'badge-warning';
		case 'CLOSED':
			return 'badge-success';
		default:
			return 'badge-primary';
	}
}

export { Projects2, type IProjects2Item };

