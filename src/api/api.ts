/* eslint-disable prettier/prettier */
import axiosInstance from '../api/axiosInstance';

// Add request cache


export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const verifyRole = async () => {
  try {
    const response = await axiosInstance.get('/users/veryfiy/role');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user role:', error?.response?.data || error.message);
  }
};

export const updateProfile = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axiosInstance.post('/users/update-profile', formData);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

export const updatepassword = async (formData:any) => {
  try {
    const response = await axiosInstance.post('/users/forget-password', formData);
    return response.data;
  }
  catch (error) {
    console.error('Error updating password:', error);
  }
  return null;
};



export const Resetpassword = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/users/reset-password', formData);
    return response.data;
  }
  catch (error) {
    console.error('Error updating password:', error);
  }
  return null;
};


export const dashaboardTicket = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-status');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard ticket:', error);
  }
};

export const getTicketFromStatus = async (categoryId: any) => {
  try {
    const response = await axiosInstance.get(`/tickets/ticket-status/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets by status:', error);
    return null; // Handle errors properly
  }
};

export const getAllTicket = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
  }
};

// user masterdropdown context instead
export const getDropdown = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-dropdowns');
    return response.data;
  } catch (error) {
    console.error('Error fetching dropdown:', error);
  }
};

export const getTicketByStatus = async () => {
  try {
    const response = await axiosInstance.post('/admin/tickets/dashboard/tickets/progression');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by status:', error);
  }
};

export const getTicketByCategory = async () => {
  try {
    const response = await axiosInstance.post('/admin/tickets/dashboard/tickets/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by category:', error);
  }
};

export const ChartDataAdmin = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/Dashboard/charts/', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin chart data:', error);
    return null;
  }
};

export const createTicket = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/raise-ticket', formData);
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error('🚨 Server Error Response:', error.response.data);
    } else {
      console.error('🚨 No Response from Server');
    }
  }
};

export const updateTicket = async (formData: FormData) => {
  let ticketID = formData.get('ticketId');
  try {
    const response = await axiosInstance.post(`/tickets/ticket/update`, formData);
    return response;
  } catch (error: any) {
    if (error.response) {
      console.error('🚨 Server Error Response:', error.response.data);
    } else {
      console.error('🚨 No Response from Server');
    }
  }
};

export const removeAttachment = async (data: any) => {
  try {
    const response = await axiosInstance.post(`/tickets/ticket/deleteAttachements`, data);
    return response.data;
  } catch (error) {
    console.error('Error removing attachment:', error);
  }
};

export const getTicketById = async (ticketId: any) => {
  try {
    const response = await axiosInstance.get(`/tickets/ticket/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

export const TicketFilter = async (formData: any) => {
  try {
    const cleanData = {
      ...formData,
      priority: formData.priority || null,
      status: formData.status || null
    };
    const response = await axiosInstance.post('/admin/tickets/filter', cleanData);
    let responseData = response as any;
    if (responseData?.success == false) {
      throw new Error(responseData?.message);
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
  }
};

export const updateUser = async (userId: string, formData: FormData) => {
 
  try {
    const response = await axiosInstance.post(`/admin/users/update/${userId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

export const CreateForceCloseReason = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/resolved/post/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign options:', error);
  }
};

export const CreateReassignOptions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/reassignement/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign options:', error);
  }
};

export const CreateFeedbackOptions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/feedback/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback options:', error);
  }
};


export const getEscalatedTicketsAdmin = async () => {
  try {
    const response = await axiosInstance.get('/admin/request/reassign/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback options:', error);
  }
};


export const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/admin/roles/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

export const createCategories = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/categories/create',formData );
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
  }
  return null;
};




export const createRoles = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/roles/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
  }
  return null;
};


export const createAnnouncement = async (formData: FormData) => {

  try {
    const response = await axiosInstance.post('/admin/announcements/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
  }
};


export const updateAnnouncement = async (formData: FormData, id: string) => {
  try {
    const response = await axiosInstance.post(`/admin/announcements/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
  }
};




export const getAnnouncementsAdmin = async () => {
  try {
    const response = await axiosInstance.get('/admin/announcements/getAllAnnouncements');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};


export const getAnnouncements = async () => {
  try {
    const response = await axiosInstance.get('/tickets/announcements');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};


export const GetPermissionsList = async () => {
  try {
    const response = await axiosInstance.get('/admin/assigned/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions list:', error);
  }
};

export const UpdatePermissions = async (formData: FormData) => {
  try {
  
    const response = await axiosInstance.post('/admin/assign/permissions', formData);
    return response.data;
  } catch (error) {
    console.error('Error updating permissions:', error);
  }
};


export const deletePermissions = async (formData: FormData) => {

  try {
    const response = await axiosInstance.post('/admin/delete/permissions', formData);
    return response.data;
  } catch (error) {
    console.error('Error deleting permissions:', error);
  }
};
export const GetUserTickets = async (Status: any) => {
  try {
    const response = await axiosInstance.get(`/tickets/ticket-list/${Status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

export const GetUserTicketDetails = async (TicketId: any) => {
  try {
    const response = await axiosInstance.get(`/tickets/ticket/${TicketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

export const GetMasterDropdown = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-dropdowns');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

export const CloseTicketUser = async (data: { ticket_id: string | number }) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/isTicketResolved', data);
    return response.data;
  } catch (error) {
    console.error('Error closing ticket:', error);
  }
  return null;
};

export const addcomment = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/create-comment', formData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
  }
  return null;
};

export const addFeedback = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/addFeedback', formData);
    return response.data;
  } catch (error) {
    console.error('Error adding feedback:', error);
  }
  return null;
};

export const ChartDataCustomer = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/Dashboard/charts/', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer chart data:', error);
    return null;
  }
};

// agent

export const ChartDataAgent = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/myTickets/Dashboard/charts', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching agent chart data:', error);
    return null;
  }
};

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

export const MyTicketDetails = async (TicketId: string) => {
  try {
    const response = await axiosInstance.get(`/agent/myTicket/details/${TicketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};



export const getEscalatedTickets = async (formData?: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/myTicket/escalated', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching escalated tickets:', error);
  }
};

export const forceResolve = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/AddResovedPost', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};
export const requestReassign = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/myTicket/requestReassign', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

export const ticketIncomplete = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/ticketIncomplete', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

export const closeTicket = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/closed/ticket', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};
export const updateResolution = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/agent/update/resolution', formData);
    return response.data;
  } catch (error) {
    console.error('Error force resolving ticket:', error);
  }
  return null;
};

export const GetPushNotifications = async () => {
  try {
    const response = await axiosInstance.post('/users/pushNotification');
    return response.data;
  } catch (error) {
    console.error('Error fetching push notifications:', error);
  }
};

export const getReassignList = async () => {
  try {
    const response = await axiosInstance.get('/agent/myTicket/RequestReassign/pending');
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign list:', error);
  }
};

export const getReassignListPending = async () => {
  try {
    const response = await axiosInstance.get('/agent/myTicket/RequestReassign/');
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign list:', error);
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.post(`/users/delete/pushNotification/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};


export const getTicketComments = async (ticketId: string) => {
  try {
    const response = await axiosInstance.get(`/agent/myTicket/comments/${ticketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket comments:', error);
  }
} 