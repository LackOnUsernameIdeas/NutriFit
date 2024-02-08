import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

type ChartProps = {
  chartData: any[];
  chartData2?: any[];
  chartOptions?: any;
  chartLabels: string[];
  chartLabelName: string;
  chartLabelName2?: string;
  textColor?: string;
};

export const barChartOptions: any = {
  maintainAspectRatio: false,
  aspectRatio: 5,
  scales: {
    x: {
      ticks: {
        beginAtZero: false,
        suggestedMin: 57,
        suggestedMax: 63,
        padding: 10,
        color: "white", // Change tick color to blue
        font: {
          size: 13, // Adjust font size
          weight: 550 // Make font bold
        }
      }
    },
    y: {
      ticks: {
        beginAtZero: false,
        suggestedMin: 57,
        suggestedMax: 63,
        padding: 10,
        color: "white", // Change tick color to blue
        font: {
          size: 13, // Adjust font size
          weight: 550 // Make font bold
        }
      }
    }
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        // Custom styling for legend labels
        color: "white", // Change legend label color to red
        font: {
          size: 13, // Adjust font size
          weight: 550 // Make font bold
        }
      }
    },
    tooltip: {
      // Custom styling for tooltip
      bodyFont: {
        size: 13, // Adjust font size
        weight: 550 // Make font bold
      }
    }
  }
};

const ColumnChart: React.FC<ChartProps> = ({
  chartData,
  chartLabels,
  chartLabelName
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
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
              }
            ]
          },
          options: barChartOptions
        });
      }
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, barChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%" }} />;
};

export { ColumnChart };

const ColumnAvaragesChart: React.FC<ChartProps> = ({
  chartData,
  chartLabels,
  chartLabelName,
  chartData2,
  chartLabelName2,
  textColor
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart>();

  const customOptions = {
    ...barChartOptions,
    scales: {
      x: {
        ...barChartOptions.scales.x,
        ticks: {
          ...barChartOptions.scales.x.ticks,
          color: textColor
        }
      },
      y: {
        ...barChartOptions.scales.y,
        ticks: {
          ...barChartOptions.scales.y.ticks,
          color: textColor
        }
      }
    },
    plugins: {
      ...barChartOptions.plugins,
      legend: {
        ...barChartOptions.plugins?.legend,
        labels: {
          ...barChartOptions.plugins?.legend?.labels,
          color: textColor
        }
      },
      tooltip: {
        ...barChartOptions.plugins?.tooltip,
        bodyFont: {
          ...barChartOptions.plugins?.tooltip?.bodyFont,
          color: textColor
        }
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
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
          options: customOptions
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData, barChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%" }} />;
};

export { ColumnAvaragesChart };
