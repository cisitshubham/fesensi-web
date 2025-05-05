import ReactApexChart from "react-apexcharts";
import React from "react";
import { Card } from "@/components/ui/card";
import CardContent from "@mui/material/CardContent/CardContent";

export default function LineChart () {
    const [state, setState] = React.useState({
      
        series: [{
            name: "Desktops",
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        options: {
          chart: {
            height: 350,
            type: "line" as "line",
            zoom: {
              enabled: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight' as "straight"
          },
          title: {
            text: 'Product Trends by Month',
            align: "left" as "left"
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          }
        },
      
      
    });

    

    return (
      <div className="w-full">
        <div id="chart">
        <Card className=" w-full ">
        <div className="font-bold text-center text-xl mt-4">Ticket by Volume </div>

   
          <CardContent>
            <ReactApexChart options={state.options} series={state.series} type="line"  classname="w-full" />
          </CardContent>
        </Card>
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }
