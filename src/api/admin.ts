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
