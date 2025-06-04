import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card } from "@/components/ui/card";

interface BarChartProps {
  resolved: number[];
  inprogress: number[];
  labels: string[];
}

function BarChart({ resolved, inprogress, labels }: BarChartProps) {
  const [state, setState] = React.useState<{
    series: { name: string; data: number[] }[];
    options: ApexOptions;
  }>({
    series: [
      { name: "Resolved", data: resolved },
      { name: "In Progress", data: inprogress },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "category",
        categories: labels,
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  });

  // Update chart when props change
  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [
        { name: "Resolved", data: resolved },
        { name: "In Progress", data: inprogress },
      ],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: labels,
        },
      },
    }));
  }, [resolved, inprogress, labels]);

  return (
    <Card>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="bar"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </Card>
  );
}

export default React.memo(BarChart);

