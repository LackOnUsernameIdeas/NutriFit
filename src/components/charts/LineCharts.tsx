import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart.js

type ChartProps = {
  lineChartData: number[];
  lineChartData2?: number[];
  lineChartOptions: object;
  lineChartLabels: string[];
  lineChartLabelName: string;
  lineChartLabelName2?: string;
};

const LineChart: React.FC<ChartProps> = ({
  lineChartData,
  lineChartLabels,
  lineChartOptions,
  lineChartLabelName
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
                label: lineChartLabelName,
                data: lineChartData,
                backgroundColor: "#3d25f8",
                borderColor: "rgba(67,24,255,1)",
                borderWidth: 1
              }
            ]
          },
          options: lineChartOptions
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [lineChartData, lineChartLabels, lineChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%" }} />;
};

export { LineChart };

const LineAvaragesChart: React.FC<ChartProps> = ({
  lineChartData,
  lineChartLabels,
  lineChartOptions,
  lineChartLabelName,
  lineChartData2,
  lineChartLabelName2
}) => {
  const chartInstance = useRef<Chart | null>(null);
  useEffect(() => {
    if (chartInstance.current) {
      // Destroy the existing chart if it exists
      chartInstance.current.destroy();
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [lineChartData, lineChartLabels, lineChartOptions]);

  return (
    <Line
      data={{
        labels: lineChartLabels,
        datasets: [
          {
            label: lineChartLabelName,
            data: lineChartData,
            borderColor: "#3d25f8",
            backgroundColor: "#3d25f8",
            tension: 0.3
          },
          {
            label: lineChartLabelName2,
            data: lineChartData2,
            borderColor: "#6e5cfa",
            backgroundColor: "#6e5cfa",
            tension: 0.3
          }
        ]
      }}
      options={lineChartOptions}
    />
  );
};

export { LineAvaragesChart };
