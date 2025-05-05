import ReactApexChart from "react-apexcharts";
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@mui/material";

const Donut = ({ series, labels }: { series: number[]; labels: string[] }) => {
  const [state, setState] = React.useState({
    series: series,
    options: {
      chart: {
        type: "donut" as "donut",
      },
      labels: labels,
      colors: [],
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