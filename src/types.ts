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

export type User = {
  _id: string; 
  name: string;
  email: string;
  role?: string[] | null;
  first_name?: string;
  level?: string | null;
  categories?: string[] | null;
  status?: boolean;
  profile_img?: string;
  createdAt?: String;
  updatedAt?: string;
};
