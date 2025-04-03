import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, MenuLabel } from '@/components';
import { ModalTicketFilter } from '@/partials/modals/search/ModalTicketFileter';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownCard2 } from '@/partials/dropdowns/general';
import { Navbar, NavbarActions } from '@/partials/navbar';
import { getTicketFromStatus } from '@/api/api';

const Filter = () => {
	const { id } = useParams();
	const [filteredData, setFilteredData] = useState<any[]>([]); 
	const [searchModalOpen, setSearchModalOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (id) {
					setLoading(true);
					const response = await getTicketFromStatus(id);
					setFilteredData(response?.data || []);
				}
			} catch (error: any) {
				console.error("Error fetching tickets:", error);
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]); 

	return (
		<Container>
			<Navbar>
				<MenuLabel className="cursor-default mb-5">Filter Tickets</MenuLabel>
				<NavbarActions>
					<Link to="/public-profile/projects/createTickets" className="btn btn-sm btn-primary btn-outline text-blue-800">
						Create New Ticket
					</Link>
				</NavbarActions>
			</Navbar>

			{/* Filter & Header */}
			<div className="flex flex-col items-stretch gap-5 lg:gap-7.5 mb-3">
				<div className="flex flex-wrap items-center gap-3 justify-between">
					<h3 className="text-lg text-gray-900 font-semibold">
						HelpDesk: {filteredData.length || 0}
					</h3>
					<div className="btn-tabs w-36 flex justify-center" data-tabs="true">
						<Menu>
							<MenuItem>
								<MenuToggle>
									<button
										onClick={() => setSearchModalOpen(true)}
										className="btn btn-icon px-4 py-2 rounded-full text-gray-500 w-full flex items-center justify-center gap-2 whitespace-nowrap"
									>
										<KeenIcon icon="filter" />
										<span>Apply Filter</span>
									</button>
								</MenuToggle>
							</MenuItem>
						</Menu>
						{/* Filter Modal */}
						<ModalTicketFilter
							open={searchModalOpen}
							onOpenChange={() => setSearchModalOpen(false)}
							onFilterApply={(data) => {setFilteredData(data.data); }}
						/>
					</div>
				</div>
			</div>

			{loading ? (
				<p className="text-gray-500 text-center mt-5">Loading tickets...</p>
			) : error ? (
				<p className="text-red-500 text-center mt-5">Error: {error}</p>
			) : filteredData.length > 0 ? (
				filteredData.map((ticket) => (
					<div className="card p-7" key={ticket._id}>
						<div className="flex items-center flex-wrap justify-between gap-5">
							<div className="flex items-center gap-3.5">
								<div className="flex items-center justify-center size-14 shrink-0 rounded-lg">
									<img src={ticket.icon} alt="Profile" />
								</div>
								<div className="flex flex-col">
									<Link to={`/public-profile/projects/UpdateTicketForm/${ticket._id}`} className="text-lg text-gray-900 hover:text-primary-active mb-px gap-3">
										<span className="text-gray-900 font-sans">{ticket.ticket_number}</span>:&nbsp;{ticket.title}
									</Link>
									<span className="text-sm text-gray-700 font-sans">{ticket.description}</span>

									<div className="grid grid-cols-2 gap-4 mt-2">
										<div className="flex">
											<span className="text-sm text-gray-800">Category: &nbsp;</span>
											<span className="badge badge-md text-inherit bg-inherit badge-outline">
												{ticket.category}
											</span>
										</div>
										<div className="flex">
											<span className="text-sm text-gray-800">Assigned To: &nbsp;</span>
											<span className="badge badge-md text-inherit bg-inherit badge-outline">
												{ticket.assigned_to}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center flex-wrap gap-5 lg:gap-20">
								<div className="flex items-center gap-5 lg:gap-14">
									<span className={`badge badge-md ${mapStatusVariant(ticket.status)} badge-outline`}>
										{ticket.status}
									</span>
									<span className="text-sm text-gray-600">
										Due Date:&nbsp;
										<span className="text-sm font-medium text-gray-800">{ticket.due_date}</span>
									</span>
								</div>
								<div className="flex items-center gap-5 lg:gap-14">
									<Menu>
										<MenuItem>
											<MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
												<KeenIcon icon="dots-vertical" />
											</MenuToggle>
											{DropdownCard2(ticket._id)}
										</MenuItem>
									</Menu>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				/* Empty State */
				<div className="flex flex-col items-center justify-center mt-10">
					<KeenIcon icon="shield-cross" className="text-red-500 text-3xl mb-2" />
					<p className="text-gray-500 text-lg font-semibold text-center">
						Oops! No tickets available.
					</p>
					<p className="text-gray-400 text-sm text-center">
						Try adjusting your filters or create a new ticket.
					</p>
				</div>
			)}
		</Container>
	);
};

// Status Color Mapping
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

export { Filter };
