export type Tickettype = {
  IsCumstomerCommneted: boolean;
  creator: string | number | boolean;
  _id: string | number | null | undefined;
  ticket_number: number;
  status: TicketStatus;
  due_date: string;
  title: string;
  description: string;
  priority: string;
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
