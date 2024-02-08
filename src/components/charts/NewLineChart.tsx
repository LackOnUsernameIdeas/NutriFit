import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
type ChartProps = {
  lineChartData: number[];
  lineChartData2?: number[];
  lineChartOptions: object;
  lineChartLabels: string[];
  lineChartLabelName: string;
  lineChartLabelName2?: string;
};

const NewLineChart: React.FC<ChartProps> = ({
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

export default NewLineChart;
