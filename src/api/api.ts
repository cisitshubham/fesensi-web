/* eslint-disable prettier/prettier */
import axiosInstance from '../api/axiosInstance';
export const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

export const updateProfile = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile); 
    const response = await axiosInstance.post('/users/update-profile', formData,);
    console.log('User profile updated:', response.data);
  } catch (error) {
    console.error('Error updating user profile:', error);
  }
};

export const dashaboardTicket = async () => {
	try {
    const response = await axiosInstance.get('/tickets/ticket-status');
    return response.data;
  } catch (error) {
		console.error('Error fetching dashboard ticket:', error);
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

export const getDropdown = async () => {
	try {
		const response = await axiosInstance.get('/tickets/ticket-dropdown');
		return response.data;
  } catch (error) {
		console.error('Error fetching dropdown:', error);
  }
}

export const getTicketByStatus = async () => {
	try {
		const response = await axiosInstance.get('/admin//tickets/dashboard/tickets/progression');
		return response.data;
  } catch (error) {
		console.error('Error fetching ticket by status:', error);
  }
}
export const getTicketByCategory = async () => {
	try {
		const response = await axiosInstance.get('/admin/tickets/dashboard/tickets/categories');
		return response.data;
  } catch (error) {
		console.error('Error fetching ticket by category:', error);
  }
}
