import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, MenuLabel } from "@/components";
import { ModalTicketFilter } from "@/partials/modals/search/ModalTicketFileter";
import { KeenIcon, Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownCard2 } from "@/partials/dropdowns/general";
import { Navbar, NavbarActions } from "@/partials/navbar";
import { getTicketFromStatus } from "@/api/api";

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
				<MenuLabel className="text-2xl font-bold text-gray-900 mb-4">Filter Tickets</MenuLabel>
				<NavbarActions>
					<Link
						to="/public-profile/projects/createTickets"
						className="btn btn-primary text-white  rounded-lg  hover:bg-blue-700"
					>
						 Create Ticket
					</Link>
				</NavbarActions>
			</Navbar>

			<div className="flex flex-col gap-6 mb-6">
				<div className="flex flex-wrap items-center justify-between gap-4">
					<h3 className="text-lg font-semibold text-gray-700">
						HelpDesk: {filteredData.length || 0} 
					</h3>
					<button
						onClick={() => setSearchModalOpen(true)}
						className="btn btn-outline-primary px-4 py-2 rounded-lg flex items-center gap-2 text-blue-600 hover:text-blue-800 border border-blue-500"
					>
						<KeenIcon icon="filter" /> Apply Filter
					</button>
				</div>
			</div>

			<ModalTicketFilter
				open={searchModalOpen}
				onOpenChange={() => setSearchModalOpen(false)}
				onFilterApply={(data) => setFilteredData(data.data)}
			/>

			{loading ? (
				<p className="text-gray-500 text-center mt-5">Loading tickets...</p>
			) : error ? (
				<p className="text-red-500 text-center mt-5">Error: {error}</p>
			) : filteredData.length > 0 ? (
				<div className="space-y-6">
					{filteredData.map((ticket) => (
						<div className="card p-7 rounded-xl border border-gray-200  transition-all" key={ticket._id}>
							<div className="flex items-center flex-wrap justify-between gap-6">
								<div className="flex items-center gap-4">
									<div className="size-14 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
										<img src={ticket.icon} className="h-full w-full object-cover" alt="Profile" />
									</div>
									<div className="flex flex-col">
										<Link
											to={`/public-profile/projects/UpdateTicketForm/${ticket._id}`}
											className="text-lg font-semibold text-gray-900 hover:text-primary transition"
										>
											<span className="text-gray-900 font-medium">{ticket.ticket_number}</span>: {ticket.title}
										</Link>
										<span className="text-sm text-gray-600 mt-1">{ticket.description}</span>
										<div className="grid grid-cols-2 gap-4 mt-2">
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-700">Category:</span>
												<span className="badge badge-md bg-gray-100 text-gray-800 px-2 py-1 rounded-md">{ticket.category}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium text-gray-700">Assigned To:</span>
												<span className="badge badge-md bg-gray-100 text-gray-800 px-2 py-1 rounded-md">{ticket.assigned_to}</span>
											</div>
										</div>
									</div>
								</div>
								<div className="flex items-center flex-wrap gap-6 lg:gap-14">
									<div className="flex items-center gap-5 lg:gap-14">
										<span className={`badge badge-md ${mapStatusVariant(ticket.status)} border border-gray-300 px-3 py-1 rounded-md font-medium`}>
											{ticket.status}
										</span>
										<span className="text-sm text-gray-600 w-[200px] text-right">
											Due Date: <span className={`font-medium text-gray-800 ${ticket.due_date ? '' : 'invisible'}`}>{ticket.due_date || 'N/A'}</span>
										</span>
									</div>
									<div className="relative">
										<Menu className="items-stretch">
											<MenuItem>
												<MenuToggle className="btn btn-sm btn-icon btn-light btn-clear rounded-full border border-gray-300">
													<KeenIcon icon="dots-vertical" className="text-gray-600" />
												</MenuToggle>
												{DropdownCard2(ticket._id)}
											</MenuItem>
										</Menu>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col items-center justify-center mt-10">
					<KeenIcon icon="shield-cross" className="text-red-500 text-4xl mb-3" />
					<p className="text-gray-500 text-lg font-semibold">No tickets available</p>
					<p className="text-gray-400 text-sm">Try adjusting your filters or create a new ticket.</p>
				</div>
			)}
		</Container>
	);
};

export { Filter };
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