import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";

export default function BarChart({ series, labels }: { series: number[]; labels: string[] }) {
  const [state, setState] = React.useState({
    series: [{
      name: "Tickets",
      data: series
    }],
    options: {
      chart: {
        type: "bar" as "bar",
        height: 350,
        toolbar: {
          show: true
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          borderRadiusApplication: "end" as "end",
          horizontal: true,
        }
      },
      dataLabels: {
        enabled: true,
      },
      xaxis: {
        categories: labels,
      },
      colors: ['#3B82F6'],
      title: {
        text: 'Tickets by Category',
        align: 'center',
        style: {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      }
    }
  });

  React.useEffect(() => {
    setState(prevState => ({
      ...prevState,
      series: [{
        name: "Tickets",
        data: series
      }],
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: labels
        }
      }
    }));
  }, [series, labels]);

  return (
    <div className="w-full">
      <Card className="w-full p-4">
        <CardContent>
          <ReactApexChart 
            options={{...state.options, title: {...state.options.title, align: 'center' as 'center'}}}
            series={state.series} 
            type="bar" 
            height={350} 
          />
        </CardContent>
      </Card>
      </div>
  );
}

