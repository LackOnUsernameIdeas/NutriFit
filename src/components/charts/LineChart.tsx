import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js

type ChartProps = {
  lineChartData: number[];
  lineChartOptions: object;
  lineChartLabels: string[];
};

const ColumnChart: React.FC<ChartProps> = ({ lineChartData, lineChartLabels, lineChartOptions }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        new Chart(ctx, {
          type: "line",
          data: {
            labels: lineChartLabels,
            datasets: [
              {
                label: "Chart Dataaaaaaaaaaa",
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
  }, [lineChartData, lineChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />;
};

export default ColumnChart;
