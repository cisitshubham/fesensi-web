import ReactApexChart from "react-apexcharts";
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@mui/material";
import { DashboardData } from './data_manipulations';

const Donut = () => {
  const dashboardData = DashboardData();
  const statusData: number[] = (dashboardData?.statusData as number[]) || [];
  const statusLabels = dashboardData?.statusLabels || [];

  const [state, setState] = React.useState({
    series: statusData || [44, 55, 41, 17, 15],
    options: {
      chart: {
        type: "donut" as "donut",
      },
      labels: statusLabels || ["Label1", "Label2", "Label3", "Label4", "Label5"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  React.useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      series: statusData,
      options: { ...prevState.options, labels: statusLabels },
    }));
  }, [statusData, statusLabels]);

  return (
    <div className="w-full">
      <div id="chart">
        <Card className="w-full">
          <div className="font-bold text-center text-xl mt-4">Ticket by status</div>
          <CardContent>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="donut"
              width={480}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donut;