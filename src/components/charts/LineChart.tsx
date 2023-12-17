import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

type ChartProps = {
  lineChartData: number[];
  lineChartOptions: object;
  lineChartLabels: string[];
};


const LineChart: React.FC<ChartProps> = ({
  lineChartData,
  lineChartLabels,
  lineChartOptions,
}) => {

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy the existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: lineChartLabels,
            datasets: [
              {
                label: "Chart Data",
                data: lineChartData,
                backgroundColor: "#3d25f8",
                borderColor: "rgba(67,24,255,1)",
                borderWidth: 1,
              },
            ],
          },
          options: lineChartOptions,
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };

  }, [lineChartData, lineChartLabels, lineChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default LineChart;
