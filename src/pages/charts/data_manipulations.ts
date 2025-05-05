import { ChartData } from "@/api/api";

async function DashboardData(fromDate: string, toDate: string) {
    try {
        const formData = new FormData();
        formData.append("fromDate", fromDate);
        formData.append("toDate", toDate);

        const response = await ChartData(formData);
        console.log("Response from ChartData:", response);

        if (response.success) { 
            const fetchedData = response.data;
            const statusCharts = fetchedData.statusCharts;
            const statusData = Object.values(statusCharts);
            const statusLabels = Object.keys(statusCharts);

            const categoryCharts = fetchedData.categoryCharts;
            const categoryData = Object.values(categoryCharts);
            const categoryLabels = Object.keys(categoryCharts);

            const priorityCharts = fetchedData.priorityCharts;
            const priorityData = Object.values(priorityCharts);
            const priorityLabels = Object.keys(priorityCharts);

            const ticketsByVolume = fetchedData.ticketsbyVolume;
            const ticketVolumeData = Object.values(ticketsByVolume);
            const ticketVolumeLabels = Object.keys(ticketsByVolume);

            return { statusData, statusLabels, categoryData, categoryLabels, priorityData, priorityLabels, ticketVolumeData, ticketVolumeLabels };
        } else {
            console.error("API did not return success:", response);
            return null;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

export { DashboardData };