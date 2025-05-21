import axiosInstance from '../api/axiosInstance';

// Chart data for agent dashboard
export const ChartDataAgent = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/myTickets/Dashboard/charts', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
};

// Get agent's tickets
export const MyTickets = async (filters: any) => {
  try {
    const response = await axiosInstance.post('/agent/myTickets', filters);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('🚨 Server Error Response:', error.response.data);
    } else {
      console.error('🚨 No Response from Server:', error.message);
    }
    throw new Error('Failed to fetch tickets. Please try again later.');
  }
};
export const FilteredMyTickets = async (status:string) => {
  try {
    const response = await axiosInstance.get(`/agent/dashboard/${status}`);
    
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error(' Server Error Response:', error.response.data);
    } else {
      console.error(' No Response from Server:', error.message);
    }
    throw new Error('Failed to fetch tickets. Please try again later.');
  }
};

// Get ticket details
export const MyTicketDetails = async (TicketId: string) => {
  try {
    const response = await axiosInstance.get(`/agent/myTicket/details/${TicketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

// Get escalated tickets
export const getEscalatedTickets = async () => {
  try {
    const response = await axiosInstance.get('/agent/myTicket/escalated');
    return response.data;
  } catch (error) {
    console.error('Error fetching escalated tickets:', error);
  }
};

// Force resolve ticket
export const forceResolve = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/AddResovedPost', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

// Request ticket reassignment
export const requestReassign = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/myTicket/requestReassign', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

// Mark ticket as incomplete
export const ticketIncomplete = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/ticketIncomplete', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

// Close ticket
export const closeTicket = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/closed/ticket', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

// Update resolution
export const updateResolution = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/resolution', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

// Get reassign list
export const getReassignList = async () => {
  try {
    const response = await axiosInstance.get('/agent/myTicket/RequestReassign/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign list:', error);
  }
};

// Get pending reassign list
export const getReassignListPending = async () => {
  try {
    const response = await axiosInstance.get('/agent/myTicket/RequestReassign/');
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign list:', error);
  }
};



export const CreateSupport = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/contact/support/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
  }
  return null;
}


export const getSLA = async () => {
  try {
    const response = await axiosInstance.get('/agent/sla');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact support data:', error);
  }
  return null;
}



export const getTrustlevel = async () => {
  try {
    const response = await axiosInstance.get('/agent/trustLevel');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact support data:', error);
  }
  return null;
}