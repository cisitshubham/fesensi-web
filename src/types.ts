export type Tickettype = {
  isUserCommented: boolean;
  isAgentCommented: boolean;
  isResolved: boolean;
  category: string;
  IsCumstomerCommneted: boolean;
  creator: string | number | boolean;
  _id: string ;
  ticket_number: number;
  status: TicketStatus;
  due_date: string;
  title: string;
  description: string;
  priority: TicketPriority;
  createdAt: string;
  updatedAt?: string;
  attachments?: {
    _id: string;
    file_url: string;
    file_type: string;
  }[];
  assigned_to?: string;
  createdBy: string;
  resolution?: string;
  resolutionDate?: string;
  escalatedTo?: string;
  isCustomerTicketEdit?: boolean;
  comments?: string[];
  latest_agent_comment?: {
    _id: string;
    comment_text: string;
    createdAt: string;
    attachments?: string[];
    creator_name: string;
  };
  activity_log?: {
    action: string;
    createdAt: string;
    details: string;
  }[];
  agentComment?: {
    _id: string;
    comment_text: string;
    creator: string;
    role: string;
    createdAt: string;
  };
  isSelected?: boolean;
};


export enum TicketStatus {
  Open = 'OPEN',
  InProgress = 'IN-PROGRESS',
  Closed = 'CLOSED',
  Resolved = 'RESOLVED'
}

export enum TicketPriority {
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL',
  Low = 'LOW',
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

export type MasterDropdownDatatype = {
  status: {
    _id: string;
    name: string;
  }[];
  priorities: {
    _id: string;
    name: string;
  }[];
  categories: {
    _id: string;
    title: string;
  }[];
  resolvedPostList: {
    _id: string;
    title: string;
  }[];
  reassignOptions: {
    _id: string;
    title: string;
  }[];
  AdminUsers: {
    _id: string;
    first_name: string;
  }[];
};
