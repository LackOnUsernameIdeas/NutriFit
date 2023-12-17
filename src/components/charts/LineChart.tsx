import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Import Chart.js

type ChartProps = {
  chartData: any[];
  chartOptions: any;
};

const ColumnChart: React.FC<ChartProps> = ({ chartData, chartOptions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ["babati", "dqdoti", "strinkati"],
            datasets: [
              {
                label: 'Chart Data',
                data: [1,2,0],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          },
          options: chartOptions,
        });
      }
    }
  }, [chartData, chartOptions]);

  return <canvas ref={chartRef} style={{ width: '100%', height: '100%' }} />;
};

export default ColumnChart;

