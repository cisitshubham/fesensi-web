export type Tickettype = {
  id: number;
  status: TicketStatus;
  deadline: string;
  title: string;
  description: string;
  priority: TicketPriority;
  createdAt: string;
  updatedAt?: string;
  attachments?: string[];
  assignedTo?: string;
  createdBy: string;
  resolution?: string;
  resolutionDate?: string;
  escalatedTo?: string;
};

export enum TicketStatus {
  Open = 'Open',
  InProgress = 'In Progress',
  Closed = 'Closed',
  Resolved = 'Resolved'
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}
