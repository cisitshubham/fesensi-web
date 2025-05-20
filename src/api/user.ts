import axiosInstance from '../api/axiosInstance';

// Fetch user profile
export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

// Verify user role
export const verifyRole = async () => {
  try {
    const response = await axiosInstance.get('/users/veryfiy/role');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user role:', error?.response?.data || error.message);
  }
};

// Update user profile
export const updateProfile = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axiosInstance.post('/users/update-profile', formData);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

// Update password
export const updatepassword = async (formData: any) => {
  try {
    const response = await axiosInstance.post('/users/forget-password', formData);
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error);
  }
  return null;
};

// Get user tickets
export const GetUserTickets = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-list');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

// Get user ticket details
export const GetUserTicketDetails = async (TicketId: any) => {
  try {
    const response = await axiosInstance.get(`/tickets/ticket/${TicketId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

// Get master dropdown
export const GetMasterDropdown = async () => {
  try {
    const response = await axiosInstance.get('/tickets/ticket-dropdowns');
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket by ID:', error);
  }
};

// Close ticket (user)
export const CloseTicketUser = async (data: { ticket_id: string | number }) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/isTicketResolved', data);
    return response.data;
  } catch (error) {
    console.error('Error closing ticket:', error);
  }
  return null;
};

// Add comment
export const addcomment = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/create-comment', formData);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
  }
  return null;
};

// Add feedback
export const addFeedback = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post('/tickets/ticket/addFeedback', formData);
    return response.data;
  } catch (error) {
    console.error('Error adding feedback:', error);
  }
  return null;
};

// Get push notifications
export const GetPushNotifications = async () => {
  try {
    const response = await axiosInstance.post('/users/pushNotification');
    return response.data;
  } catch (error) {
    console.error('Error fetching push notifications:', error);
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.post(`/users/delete/pushNotification/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};



export const GetSkippedFeedback = async () => {
  try {
    const response = await axiosInstance.get('/tickets/feedback/ticket');
    return response.data;
  } catch (error) {
    console.error('Error fetching skipped feedback:', error);
  }
}