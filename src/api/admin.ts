import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

// Get ticket by status
export const getTicketByStatus = async () => {
  try {
    const response = await axiosInstance.post('/admin/tickets/dashboard/tickets/progression');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by status:', error);
  }
};

// Get ticket by category
export const getTicketByCategory = async () => {
  try {
    const response = await axiosInstance.post('/admin/tickets/dashboard/tickets/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by category:', error);
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
  }
};

// Get user by ID
export const getUserById = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
  }
};

// Update user
export const updateUser = async (userId: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/users/update/${userId}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// Create force close reason
export const CreateForceCloseReason = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/resolved/post/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign options:', error);
  }
};

export const updateForceCloseReason = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/resolved/post/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating force close reason:', error);
  }
};



export const updateCategory = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin//categories/update/${id}`, formData)
    return response.data;
  }
  catch (error) {
  }
}



// Create reassign options
export const CreateReassignOptions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/reassignement/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign options:', error);
  }
};

// Create feedback options
export const CreateFeedbackOptions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/feedback/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback options:', error);
  }
};

export const updateFeedbackOptions = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/feedback/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating feedback options:', error);
  }
};


// Get escalated tickets admin
export const getEscalatedTicketsAdmin = async () => {
  try {
    const response = await axiosInstance.get('/admin/request/reassign/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching feedback options:', error);
  }
};

// Get roles
export const getRoles = async () => {
  try {
    const response = await axiosInstance.get('/admin/roles/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
};

// Create roles
export const createRoles = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/roles/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
  }
  return null;
};

// Create announcement
export const createAnnouncement = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/announcements/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating announcement:', error);
  }
};

// Update announcement
export const updateAnnouncement = async (formData: FormData, id: string) => {
  try {
    const response = await axiosInstance.post(`/admin/announcements/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating announcement:', error);
  }
};

// Get announcements admin
export const getAnnouncementsAdmin = async () => {
  try {
    const response = await axiosInstance.get('/admin/announcements/getAllAnnouncements');
    return response.data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};

// Get permissions list
export const GetPermissionsList = async () => {
  try {
    const response = await axiosInstance.get('/admin/assigned/permissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching permissions list:', error);
  }
};

// Update permissions
export const UpdatePermissions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/assign/permissions', formData);
    return response.data;
  } catch (error) {
    console.error('Error updating permissions:', error);
  }
};

// Delete permissions
export const deletePermissions = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/delete/permissions', formData);
    return response.data;
  } catch (error) {
    console.error('Error deleting permissions:', error);
  }
};


export const getReassignTicketDetail = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/admin/ticket/by/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reassign ticket detail:', error);
  }
};


export const denyReassign = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/update/ticket/reassign`, formData);
    return response.data;
  } catch (error) {
    console.error('Error denying reassign:', error);
  }
};

export const ReassignAgentList = async () => {
  try {
    const response = await axiosInstance.get('/admin/users/by/role');
    return response.data;
  } catch (error) {
    console.error('Error fetching agent list:', error);
  }
};

export const reassignTicketAdmin = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/assign/ticket/to/agent', formData);
    return response.data;
  } catch (error) {
    console.error('Error reassigning ticket:', error);
  }
};


export const CreatePriorities = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/admin/priority/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error fetching priorities:', error);
  }
};

export const updatePriorities = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/priroty/update/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating priorities:', error);
  }
};




export const getApprovedReassignlist = async () => {
  try {
    const response = await axiosInstance.get('/admin/request/reassign/tickets/approved');
    return response.data;

  }
  catch (error) {
    console.error('error occured:', error);
  }
}


export const UpdateReassignOptions = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.post(`/admin/reassignement/post/update/${id}`, formData);
    return response.data;
  }
  catch (error) {
    console.error('Error updating reassign options:', error);
  }
}


export const Makeandremoveadmin = async (id: String) => {


  try {
    const responce = await axiosInstance.post(`/admin/users/make/admin/${id}`)
 
    return responce
  }
  catch(error){
    console.error('error occured',error)

  }
}


export const deactiveateUser=async (id: String) => {
  try {
    const responce = await axiosInstance.post(`/admin//users/activate/${id}`)
    return responce
  }
  catch(error){
    console.error('error occured',error)

  }
}



export const getContactSupport = async () => {
  try {
    const response = await axiosInstance.get('/admin/contact/support/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching contact support:', error);
  }
}


export const Updatesupport = async (id: string, ) => {
  try {
    const response = await axiosInstance.get(`/admin/contact/support/update/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error updating contact support:', error);
  }
}


export const deleteAnnouncement = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/admin/announcements/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
  }
}


export const getAllTicketsAdmin = async (formData:FormData) => {
  try {
    const response = await axiosInstance.get(`/admin/tickets?page=${formData.get('page')}&limit=${formData.get('ticketsPerPage')}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all tickets:', error);
  }
}



export const getFilteredTickets = async (status:string) => {
  try {
    const response = await axiosInstance.post(`/admin/Dashboard/charts/${status}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching filtered tickets:', error);
  }
}


export const getTrustLevelInfo= async ()=>{
  try{
    const responce = await axiosInstance.get("/admin/trust/level/info/list")
    return responce.data;
  }
  catch(error){
    console.error('Error fetcing api')
  }
}


export const updateTrustLevelInfo = async (formdata:FormData,_id:string) => {
try{

  const responce = await axiosInstance.post(`/admin/trust/level/info/update/${_id}`,formdata)
  return responce;
}
catch(error){
  console.error("error fetching api")
}
  
}