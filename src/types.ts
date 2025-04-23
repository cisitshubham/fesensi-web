export type Tickettype = {
  isUserCommented: boolean;
  isAgentCommented: boolean;
  isResolved: boolean;
  category: string;
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
  attachments?: {
    _id: string;
    file_url: string;
    file_type: string;
  }[];
  assignedTo?: string;
  createdBy: string;
  resolution?: string;
  resolutionDate?: string;
  escalatedTo?: string;
  isCustomerTicketEdit?: boolean;
  comments ?: string[];
  latest_agent_comment?: {
    _id: string;
    comment_text: string;
    createdAt: string;
    attachments?: string[];
    creator_name: string;
  };
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
