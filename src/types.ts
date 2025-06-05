export type Tickettype = {
  agent_reassign_reason?: string;
  agent_reassign_comment?: string;
  resolutionTime?: number,
  isTicketClosed?: boolean,
  remainingHours?: number,
  remainingMinutes?: number,
  remainingSeconds?: number,
  isUserCommented: boolean;
  isAgentCommented: boolean;
  isAgentReAssign: boolean;

  isAgenForceResolve: boolean;
  isAgentViewButtonShow: boolean;

  isAgentResolvedButtonShow: boolean;
  isResolved: boolean;
  
  category: string;
  IsCumstomerCommneted: boolean;
  creator: string | number | boolean;
  _id: string;
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
  activity_logs?: {
    creator: string;
    comment: string;
    createdAt: string;
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
  levelList: [
    {
        _id: string;
        name: string;
    },
  ],
  feedbackOptions: {
    _id: string;
    title: string;
  }[];
  status: {
    _id: string;
    name: string;
  }[];
  priorities: {
    _id: string;
    name: string;
    esclationHrs: number;
    responseHrs: number;
  }[];
  roles: {
    _id: string;
    role_name: string;
    permissions: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
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
    email: string;
    first_name: string;
    status: boolean;
    profile_img: string | null;
    role: {
      _id: string;
      role_name: string;
    }[];

    categories: {
      _id: string;
      title: string;
    }[];
    level: string | null;

  }[];
};



export type Notificationtype = {
  createdAt: string;
  _id: string;
  notificationMessage: string;
  notificationType: string;
  updatedAt: string
  read: boolean;
};






export type AdminUserState = {
  _id: string;
  name: string;
  email: string;
  level: string;
  role: string[];
  categories: string[];
  profile_img: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}



export type ChartsResponse = {
  success: boolean;
  message: string;
  data: {
    statusCharts: {
      RESOLVED: number;
      CLOSED: number;
      OPEN: number;
      'IN-PROGRESS': number;
    };
    categoryCharts: {
      Hardware: number;
      'Internet/Network': number;
      'Cloud Technologies': number;
      Others: number;
      Software: number;
    };
    priorityCharts: {
      CRITICAL: number;
      HIGH: number;
      MEDIUM: number;
      LOW: number;
    };
    ticketsbyVolume: {
      [date: string]: number; // Example: "2025-05-01": 0
    };
    TicketsByCategory: {
      overallPercentageChange: string;
      totalTicketCount: number;
      totalLastMonthCount: number;
      counts: Array<{
        category: 'Hardware' | 'Internet/Network' | 'Cloud Technologies' | 'Others' | 'Software';
        ticketCount: number;
        lastMonthCount: number;
        percentageChange: string;
      }>;
    };
  };
};

export type Permission = {
  _id: string;
  name: string;
  method: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export type Announcement = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

// Types
export type Category= {
  _id: string;
  title: string;
}
export type Role= {
  _id: string;
  role_name: string;
  permissions: string[];
  status: string;
  createdAt: string;
}
export type Level= {
  _id: string;
  name: string;
}

export type ExtendedUser= {
  _id: string;
  email: string;
  first_name: string;
  level: string | Level;
  categories: Category[];
  status: boolean;
  profile_img: string;
  role: Role | Role[];
  createdAt?: string;
  updatedAt?: string;
}

export type  SLAStatustype= {
  priority: TicketPriority;
  response_time: number;
  createdAt: string;
}

export type FeedbackData = {
  _id: string;
  ticket_number: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  category: string;
  assigned_to: string;
}

export type EscalatedTicketData = {
  _id: string;
  ticket_number: number;
  created_by: string;
  title: string;
  priority: TicketPriority;
  category: string;
  assigned_to: string;
  status: string;
  createdAt: string;
  description: string;
  escalation: {
    assigned_to: string;
    escalation_time: string;
    escalation_reason: string | null;
    level_of_user: string;
  }[];
  activity_log: {
    action: string;
    creator: string;
    createdAt: string;
  }[];
};
