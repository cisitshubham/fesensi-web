import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";
import { getPriorityBadge } from "../global-components/GetStatusColor";
import { TicketPriority } from "@/types";

export default function Pie({ series, labels }: { series: number[]; labels: string[] }) {
  const getColorFromPriority = (priority: TicketPriority) => {
    const badge = getPriorityBadge(priority);
    return badge.hex;
  };

  const [state, setState] = React.useState({
    series: series,
    options: {
      chart: {
        width: 380,
        type: "pie" as "pie",
        toolbar: {
          show: true
        },
      },
      labels: labels,
      colors: labels.map(label => getColorFromPriority(label as TicketPriority)),
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
      series: series,
      options: {
        ...prevState.options,
        labels: labels,
        colors: labels.map(label => getColorFromPriority(label as TicketPriority)),
      },
    }));
  }, [series, labels]);

  return (
    <div id="chart" className="w-full">
      <Card className="w-full p-4">
        <div className="font-bold text-center text-xl mt-4">Ticket by priority</div>

        <CardContent>
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="pie"
            width={480}
          />
        </CardContent>
      </Card>
    </div>
  );
}
