
import ReactApexChart from "react-apexcharts";
import { Card, CardContent } from "@/components/ui/card";
import { ApexOptions } from "apexcharts";

interface LineChartProps {
  series: number[];
  labels: string[];
}

export default function LineChart({ series, labels }: LineChartProps) {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350
        }
      },
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    colors: ["#60A5FA"],
    grid: {
      row: {
        colors: ["#f3f3f3"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      title: {
        text: "Number of Tickets",
      },
    },
    title: {
      text: "Ticket Volume Over Time",
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
      },
    },
  };

  const chartSeries = [{
    name: "Ticket Volume",
    data: series,
  }];

  return (
    <div className="w-full">
      <Card className="w-full p-4">
        <CardContent>
          <ReactApexChart
            options={options}
            series={chartSeries}
            type="area"
            height={350}
          />
        </CardContent>
      </Card>
    </div>
  );
}
