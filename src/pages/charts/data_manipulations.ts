
import { ChartData } from "@/api/api";
import { useEffect } from "react";
import { useState } from "react";

function DashboardData() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedData = await ChartData();
        setData(fetchedData);
        console.log("API Data:", fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (!data) return null;

  const StatusCHarts = data.statusCharts;
  const statusData = Object.values(StatusCHarts);
  const statusLabels = Object.keys(StatusCHarts);

  const categoryCharts = data.categoryCharts;
  const categoryData = Object.values(categoryCharts);
  const categoryLabels = Object.keys(categoryCharts);

  const priorityCharts = data.priorityCharts;
  const priorityData = Object.values(priorityCharts);
  const priorityLabels = Object.keys(priorityCharts);

  return {statusData, statusLabels, categoryData, categoryLabels, priorityData, priorityLabels};
}

export { DashboardData };