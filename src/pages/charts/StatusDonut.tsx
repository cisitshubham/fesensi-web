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
        width: '100%',
        height: '100%',
        animations: {
          enabled: true
        },
        offsetY: 5
      },
      labels: labels,
      colors: labels.map(label => getColorFromStatus(label as TicketStatus)),
      legend: {
        position: "bottom" as const,
        fontSize: '14px',
        itemMargin: {
          horizontal: 5,
          vertical: 8
        },
        height: 80,
        horizontalAlign: 'center' as const,
        floating: false,
        offsetY: -10
      },
      title: {
        text: "Tickets by Status",
        align: "center" as const,
        style: {
          fontSize: "24px",
          fontWeight: "bold",
        },
        offsetY: 5
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: '100%',
              height: '100%',
              offsetY: 5
            },
            legend: {
              position: "bottom" as const,
              fontSize: '14px',
              itemMargin: {
                horizontal: 5,
                vertical: 8
              },
              height: 80,
              horizontalAlign: 'center' as const,
              floating: false,
              offsetY: -10
            },
            title: {
              style: {
                fontSize: '20px'
              },
              offsetY: 0
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '65%',
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      fontSize: '14px',
                      fontWeight: 600
                    },
                    value: {
                      show: true,
                      fontSize: '14px',
                      fontWeight: 600
                    }
                  }
                }
              }
            }
          },
        },
      ],
    },
  });

  // Update chart when props change
  React.useEffect(() => {
    setState(prevState => ({
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
    <div className="w-full h-full min-h-[400px]">
      <div id="chart" className="h-full w-full">
        <Card className="w-full h-full p-2 sm:p-4">
          <CardContent className="p-0">
            <div className="h-[400px] w-full">
              <ReactApexChart
                options={state.options}
                series={state.series}
                type="donut"
                height="100%"
                width="100%"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(Donut);