// LineChart.tsx

import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";

interface LineChartProps {
  series: number[];
  labels: string[];
}

export default function LineChart({ series, labels }: LineChartProps) {

  const [chartState, setChartState] = React.useState({
    series: [
      {
        name: "Ticket Volume",
        data: series,
      },
    ],
    options: {
      chart: {
        height: 350,
       
        type: "line" as "line", 
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: true,
        },
      },
      dataLabels: {
        enabled: false, // Disable to avoid hiding lines
      },
      stroke: {
        curve: "smooth" as "smooth",
        width: 3, // Ensure line is visible
      },
      colors: ["#3B82F6"], // Global line color
      grid: {
        row: {
          colors: ["#f3f3f3"],
          opacity: 0.5,
        },
      },
  
      xaxis: {
        categories: labels,
      },
      yaxis: {
        title: {
          text: "Number of Tickets",
        },
      },
      title: {
        text: "Ticket Volume Over Time",
        align: "center" as const,
        style: {
          fontSize: "20px",
          fontWeight: "bold",
        },
      },
    },
  });

  React.useEffect(() => {
    setChartState((prevState) => ({
      ...prevState,
      series: [
        {
          name: "Ticket Volume",
          data: series,
        },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: labels,
        },
      },
    }));
  }, [series, labels]);

  return (
    <div className="w-full">
      <Card className="w-full p-4">
        <CardContent>
          <ReactApexChart
            options={chartState.options}
            series={chartState.series}
            type="area"
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  );
}
