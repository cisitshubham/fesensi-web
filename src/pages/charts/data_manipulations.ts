import { ChartDataAgent, ChartDataAdmin, ChartDataCustomer } from '@/api/api';

export async function fetchDashboardData(fromDate: string, toDate: string, role: string) {
  try {
    const formData = new FormData();
    formData.append('fromDate', fromDate);
    formData.append('toDate', toDate);

    let apiResponse;
    if (role === 'ADMIN') {


      apiResponse = await ChartDataAdmin(formData);
      console.log(apiResponse);
    } else if (role === 'AGENT') {
      apiResponse = await ChartDataAgent(formData);
      console.log(apiResponse);
    } else if (role === 'CUSTOMER' || role === 'USER') {
      apiResponse = await ChartDataCustomer(formData);
    }

    if (apiResponse && apiResponse.success) {
      const fetchedData = apiResponse.data;

      // Ensure we have default values if any data is missing
      const statusCharts = fetchedData.statusCharts || {};
      const statusData = Object.values(statusCharts);
      const statusLabels = Object.keys(statusCharts);

      const categoryCharts = fetchedData.categoryCharts || {};
      const categoryData = Object.values(categoryCharts);
      const categoryLabels = Object.keys(categoryCharts);

      const priorityCharts = fetchedData.priorityCharts || {};
      const priorityData = Object.values(priorityCharts);
      const priorityLabels = Object.keys(priorityCharts);

      const ticketsByVolume = fetchedData.ticketsbyVolume || {};
      const ticketVolumeData = Object.values(ticketsByVolume);
      const ticketVolumeLabels = Object.keys(ticketsByVolume);

      // Ensure ticketsbyCategory has the required structure
      const ticketsbyCategory = fetchedData.TicketsByCategory;
      console.log(ticketsbyCategory);
      return {
        statusData,
        statusLabels,
        categoryData,
        categoryLabels,
        priorityData,
        priorityLabels,
        ticketVolumeData,
        ticketVolumeLabels,
        ticketsbyCategory
      };
    } else {
      console.error('API did not return success:', apiResponse);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
