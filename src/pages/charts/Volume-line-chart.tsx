import ReactApexChart from "react-apexcharts";
import React from "react";
import { Card } from "@/components/ui/card";
import CardContent from "@mui/material/CardContent/CardContent";

interface LineChartProps {
  series: number[];
  labels: string[];
}

export default function LineChart({ series, labels }: LineChartProps) {
  const [state, setState] = React.useState({
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
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight" as "straight",
      },
  
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: labels,
      },
    },
  });

  return (
    <div className="w-full">
      <div id="chart">
        <Card className="w-full ">
          <div className="font-bold text-center text-xl mt-4">Ticket by Volume</div>

          <CardContent>
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="line"
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>
      <div id="html-dist"></div>
    </div>
  );
}
