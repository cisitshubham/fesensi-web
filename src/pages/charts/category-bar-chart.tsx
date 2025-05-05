import React from "react";
import ReactApexChart from "react-apexcharts";

export default function BarChart({ series, labels }: { series: number[]; labels: string[] })  {
  console.log("series", series);
  console.log("labels", labels);
  const [state, setState] = React.useState({
    
      series: [{
        data: series
      }],
      options: {
        chart: {
          type: "bar" as "bar",
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end" as "end",
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories:labels,
        }
      },
    
    
  });

  

  return (
    <div>
      <div id="chart">
          <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
        </div>
      <div id="html-dist"></div>
    </div>
  );
}

