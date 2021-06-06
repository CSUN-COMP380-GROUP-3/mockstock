import React from 'react';
import { ActiveInvestmentContext } from '../../contexts/ActiveInvestmentContext';
import ReactApexChart from "react-apexcharts";

export default function StockChart() {
    const { activeInvestment } = React.useContext(ActiveInvestmentContext);
    const { candles } = activeInvestment;

    const data = []
    if(candles) {
        var i
        for(i = 0; i < candles["t"].length; i++) {
            const x = new Date(candles["t"][i] * 1000)
            const y0 = candles["o"][i]
            const y1 = candles["h"][i]
            const y2 = candles["l"][i]
            const y3 = candles["c"][i]

            const y = []
            y.push(y0)
            y.push(y1)
            y.push(y2)
            y.push(y3)

            const ob = {
                x: x,
                y: y
            }
                
            data.push(ob)
        }
    }

    const obk = {
        data: data
    }

    var series = []
    series.push(obk)

    return (
        <div id="chart">
            <ReactApexChart 
                options={
                    {
                        chart: {
                            type: 'candlestick',
                            height: 350
                        },
                        title: {
                            text: 'CandleStick Chart',
                            align: 'left'
                        },
                        xaxis: {
                            type: 'datetime'
                        },
                        yaxis: {
                            tooltip: {
                                enabled: true
                            }
                        }
                    }
                }  
                series={series} type="candlestick" height={350} 
            />
        </div>
    )    
};

// NOT SURE WHAT TO DO WITH THIS CODE BELOW, CAME WITH ApexChart
// const domContainer = document.querySelector('#app');