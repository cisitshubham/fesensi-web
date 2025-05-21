import ReactApexChart from "react-apexcharts";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusBadge } from "../global-components/GetStatusColor";
import { TicketStatus } from "@/types";

const Donut = ({ series, labels }: { series: number[]; labels: string[] }) => {
  const getColorFromStatus = (status: TicketStatus) => {
    const badge = getStatusBadge(status);
    return badge.hex;
  };

  const [state, setState] = React.useState({
    series: series,
    options: {
      chart: {
        type: "donut" as "donut",
        toolbar: {
          show: true
        },
      },
   
      labels: labels,
      colors: labels.map(label => getColorFromStatus(label as TicketStatus)),
      title: {
        text: "Tickets by Status",
        align: "center",
        style: {
          fontSize: "20px",
          fontWeight: "bold",
        },
      },
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
        colors: labels.map(label => getColorFromStatus(label as TicketStatus)),
      },
    }));
  }, [series, labels]);

  return (
    <div className="w-full h-full">
      <div id="chart" className="h-full">
        <Card className="w-full h-full p-4">

          <CardContent>
            <ReactApexChart
              options={{
                ...state.options,
                title: {
                  ...state.options.title,
                  align: "center" as "center"
                }
              }}
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