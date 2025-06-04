import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";
import { getPriorityBadge } from "../global-components/GetStatusColor";

// Define TicketPriority enum
enum TicketPriority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL"
}

function PriorityPie({ series, labels }: { series: number[]; labels: string[] }) {
  const getColorFromPriority = (priority: TicketPriority) => {
    const badge = getPriorityBadge(priority);
    return badge.hex;
  };

  const [state, setState] = React.useState({
    series: series,
    options: {
      chart: {
        width: '100%',
        height: '100%',
        type: "pie" as "pie",
        toolbar: {
          show: true
        },
        animations: {
          enabled: true
        },
        offsetY: 5
      },
      labels: labels,
      colors: labels.map(label => getColorFromPriority(label as TicketPriority)),
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
        text: "Tickets by Priority",
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
        colors: labels.map(label => getColorFromPriority(label as TicketPriority)),
      },
    }));
  }, [series, labels]);

  return (
    <div id="chart" className="w-full h-full min-h-[400px]">
      <Card className="w-full h-full p-2 sm:p-4">
        <CardContent className="p-0">
          <div className="h-[400px] w-full">
            <ReactApexChart
              options={state.options}
              series={state.series}
              type="pie"
              height="100%"
              width="100%"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default React.memo(PriorityPie);
