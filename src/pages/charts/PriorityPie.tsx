import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
export default function Pie() {
    const [state, setState] = React.useState({

        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                width: 380,
                type: 'pie' as 'pie',
            },
            labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        } as ApexOptions,


    });



    return (
        <div id="chart" className="w-full">
            <Card className="w-full ">
            <div className="font-bold text-center text-xl mt-4">
                Ticket by priority
            </div>

                <CardContent>
                    <ReactApexChart options={state.options} series={state.series} type="pie" width={480} />
                </CardContent>
            </Card>
        </div>
    );
}
