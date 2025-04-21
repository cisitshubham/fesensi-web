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
    const response = await axiosInstance.post('/users/update-profile', formData,);

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

export const getTicketFromStatus = async (categoryId: any) => {
	try {		
		const response = await axiosInstance.get(`/tickets/ticket-status/${categoryId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching tickets by status:", error);
		return null;  // Handle errors properly
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
		const response = await axiosInstance.get('/tickets/ticket-dropdowns');
		return response.data;
  } catch (error) {
		console.error('Error fetching dropdown:', error);
  }
}

export const getTicketByStatus = async () => {
	try {
		const response = await axiosInstance.post('/admin//tickets/dashboard/tickets/progression');
		return response.data;
  } catch (error) {
		console.error('Error fetching ticket by status:', error);
  }
}
export const getTicketByCategory = async () => {
	try {
		const response = await axiosInstance.post('/admin/tickets/dashboard/tickets/categories');
		return response.data;
  } catch (error) {
		console.error('Error fetching ticket by category:', error);
  }
}

export const createTicket = async (formData: FormData) => {
	try {
		const response = await axiosInstance.post('/tickets/raise-ticket', formData)
		return response;
	} catch (error: any) {

		if (error.response) {
			console.error("🚨 Server Error Response:", error.response.data); 
		} else {
			console.error("🚨 No Response from Server");
		}
	}
};

export const updateTicket = async (formData: FormData) => {
	let ticketID= formData.get('ticketId')
	try {
		const response = await axiosInstance.post(`/admin/tickets/update/${ticketID}`, formData)
		return response;
	} catch (error: any) {

		if (error.response) {
			console.error("🚨 Server Error Response:", error.response.data); 
		} else {
			console.error("🚨 No Response from Server");
		}
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
			status: formData.status || null,
		};		
		const response = await axiosInstance.post('/admin/tickets/filter', cleanData);
		let responseData = response as any;
		if (responseData?.success==false) {
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

// AGENT API 

export const MyTickets = async ()=>{
	try {
		const response = await axiosInstance.get('/agent/myTickets');
		return response.data;
		} catch (error) {
			console.error('Error fetching ticket by ID:', error);
		}
}
export const MyTicketDetails = async (TicketId:any)=>{
	try {
		const response = await axiosInstance.get(`/agent/myTicket/details/${TicketId}`);		
		return response.data;		
		} catch (error) {	
			console.error('Error fetching ticket by ID:', error);
		}
}
