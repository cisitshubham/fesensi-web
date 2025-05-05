import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";

export default function Pie({ series, labels }: { series: number[]; labels: string[] }) {
  const [state, setState] = React.useState({
    series: series,
    options: {
      chart: {
        width: 380,
        type: "pie" as "pie",
      },
      labels: labels,
      colors: [" #D32F2F", "#F57C00", "#FBC02D", "#388E3C"],
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
      },
    }));
  }, [series, labels]);

  return (
    <div id="chart" className="w-full">
      <Card className="w-full ">
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
