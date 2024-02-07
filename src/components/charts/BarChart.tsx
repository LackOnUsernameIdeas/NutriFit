import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

type ChartProps = {
  chartData: any[];
  chartData2?: any[];
  chartOptions: any;
  chartLabels: string[];
  chartLabelName: string;
  chartLabelName2?: string;
};

const ColumnChart: React.FC<ChartProps> = ({
  chartData,
  chartOptions,
  chartLabels,
  chartLabelName,
  chartData2,
  chartLabelName2
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Destroy the existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: chartLabels,
            datasets: [
              {
                label: chartLabelName,
                data: chartData,
                backgroundColor: "#472ffb",
                borderColor: "rgba(67,24,255,1)",
                borderWidth: 1
              },
              {
                label: chartLabelName2,
                data: chartData2,
                backgroundColor: "#6e5cfa",
                borderColor: "rgba(67,24,255,1)",
                borderWidth: 1
              }
            ]
          },
          options: chartOptions
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, chartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default ColumnChart;
