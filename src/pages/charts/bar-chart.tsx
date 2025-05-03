import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card,CardContent } from '@/components/ui/card';

export default function BarChart ()  {
    const [state, setState] = React.useState({
      
        series: [
          {
            name: 'Actual',
            data: [
              {
                x: '2011',
                y: 12,
                goals: [
                  {
                    name: 'Expected',
                    value: 14,
                    strokeWidth: 2,
                    strokeDashArray: 2,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: '2012',
                y: 44,
                goals: [
                  {
                    name: 'Expected',
                    value: 54,
                    strokeWidth: 5,
                    strokeHeight: 10,
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: '2013',
                y: 54,
                goals: [
                  {
                    name: 'Expected',
                    value: 52,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: 'round',
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: '2014',
                y: 66,
                goals: [
                  {
                    name: 'Expected',
                    value: 61,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: 'round',
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: '2015',
                y: 81,
                goals: [
                  {
                    name: 'Expected',
                    value: 66,
                    strokeWidth: 10,
                    strokeHeight: 0,
                    strokeLineCap: 'round',
                    strokeColor: '#775DD0'
                  }
                ]
              },
              {
                x: '2016',
                y: 67,
                goals: [
                  {
                    name: 'Expected',
                    value: 70,
                    strokeWidth: 5,
                    strokeHeight: 10,
                    strokeColor: '#775DD0'
                  }
                ]
              }
            ]
          }
        ],
        options: {
          chart: {
            height: 350,
            type: 'bar' as 'bar'
          },
          plotOptions: {
            bar: {
              horizontal: true,
            }
          },
          colors: ['#00E396'],
          dataLabels: {
            formatter: function(val:any, opt:any) {
              const goals =
                opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
                  .goals
          
              if (goals && goals.length) {
                return `${val} / ${goals[0].value}`
              }
              return val
            }
          },
          legend: {
            show: true,
            showForSingleSeries: true,
            customLegendItems: ['Actual', 'Expected'],
            markers: {
              fillColors: ['#00E396', '#775DD0']
            }
          }
        },
      
      
    });

    

    return (
      <div className='w-full h-full'>
        <div id="chart" className='h-full' >
        <Card className=" w-full h-full">
        <div className="font-bold text-center text-xl mt-4">Ticket by ticket by category </div>

   
          <CardContent>
            <ReactApexChart options={state.options} series={state.series} type="bar" />
          </CardContent>
        </Card>
          </div>
        <div id="html-dist"></div>
      </div>
    );
  }
