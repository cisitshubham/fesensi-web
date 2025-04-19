import Ticket from './ticket-component';
import { Tickettype, TicketStatus, TicketPriority } from '@/types';

export default function AgentTickets() {
  // Dummy data for tickets
  const tickets: Tickettype[] = [
    {
      id: 1,
      status: TicketStatus.Open,
      deadline: '2025-04-20',
      title: 'Fix Login Issue',
      description: 'Users are unable to log in due to a server error.',
      priority: TicketPriority.High,
      createdAt: '2025-04-10',
      createdBy: 'John Doe',
      assignedTo: 'Jane Smith'
    },
    {
      id: 2,
      status: TicketStatus.InProgress,
      deadline: '2025-04-22',
      title: 'Update Dashboard UI',
      description: 'Redesign the dashboard for better user experience.',
      priority: TicketPriority.Medium,
      createdAt: '2025-04-12',
      createdBy: 'Alice Johnson',
      assignedTo: 'Bob Brown'
    },
    {
      id: 3,
      status: TicketStatus.Closed,
      deadline: '2025-04-15',
      title: 'Resolve Payment Bug',
      description: 'Fix the issue where payments are not being processed.',
      priority: TicketPriority.Critical,
      createdAt: '2025-04-05',
      createdBy: 'Charlie Davis',
      resolution: 'Fixed payment gateway configuration.',
      resolutionDate: '2025-04-14'
    },
    {
      id: 4,
      status: TicketStatus.Resolved,
      deadline: '2025-04-25',
      title: 'Add New Feature',
      description: 'Implement a new feature for exporting reports.',
      priority: TicketPriority.Low,
      createdAt: '2025-04-15',
      createdBy: 'Eve Wilson'
    }
  ];

  return (
    <div className="space-y-4 px-6">
      {tickets.map((ticket) => (
        <Ticket key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
