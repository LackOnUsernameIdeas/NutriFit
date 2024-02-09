import React, { useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto"; // Import Chart.js
import { lineChartOptions } from "../../variables/chartjs";
import { useColorMode } from "@chakra-ui/react";

type ChartProps = {
  lineChartData: number[];
  lineChartData2?: number[];
  lineChartLabels: string[];
  lineChartLabelName: string;
  lineChartLabelName2?: string;
  textColor?: string;
  color?: string;
};

const LineChart: React.FC<ChartProps> = ({
  lineChartData,
  lineChartLabels,
  lineChartLabelName,
  textColor,
  color
}) => {
  const { colorMode } = useColorMode();
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);
  const fontWeight = colorMode === "light" ? 550 : 0;
  useEffect(() => {
    if (chartRef.current) {
      // Destroy the existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const customOptions = {
        ...lineChartOptions,
        scales: {
          x: {
            ...lineChartOptions.scales.x,
            ticks: {
              ...lineChartOptions.scales.x.ticks,
              color: textColor,
              font: {
                ...lineChartOptions.scales.x.ticks.font,
                weight: fontWeight
              }
            }
          },
          y: {
            ...lineChartOptions.scales.y,
            ticks: {
              ...lineChartOptions.scales.y.ticks,
              color: textColor,
              font: {
                ...lineChartOptions.scales.y.ticks.font,
                weight: fontWeight
              }
            }
          }
        },
        plugins: {
          ...lineChartOptions.plugins,
          legend: null,
          tooltip: {
            ...lineChartOptions.plugins?.tooltip,
            bodyFont: {
              ...lineChartOptions.plugins?.tooltip?.bodyFont,
              color: textColor,
              weight: fontWeight
            }
          }
        }
      };

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
                borderColor: color,
                borderWidth: 4,
                tension: 0.3
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
  }, [lineChartData, lineChartLabels, lineChartOptions]);

  return <canvas ref={chartRef} style={{ width: "100%" }} />;
};

export { LineChart };

const LineAvaragesChart: React.FC<ChartProps> = ({
  lineChartData,
  lineChartLabels,
  lineChartLabelName,
  lineChartData2,
  lineChartLabelName2,
  textColor
}) => {
  const { colorMode } = useColorMode();
  const chartInstance = useRef<Chart | null>(null);
  const fontWeight = colorMode === "light" ? 550 : 0;

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

  const customOptions = {
    ...lineChartOptions,
    scales: {
      x: {
        ...lineChartOptions.scales.x,
        ticks: {
          ...lineChartOptions.scales.x.ticks,
          color: textColor,
          font: {
            ...lineChartOptions.scales.x.ticks.font,
            weight: fontWeight
          }
        }
      },
      y: {
        ...lineChartOptions.scales.y,
        ticks: {
          ...lineChartOptions.scales.y.ticks,
          color: textColor,
          font: {
            ...lineChartOptions.scales.y.ticks.font,
            weight: fontWeight
          }
        }
      }
    },
    plugins: {
      ...lineChartOptions.plugins,
      legend: {
        ...lineChartOptions.plugins?.legend,
        labels: {
          ...lineChartOptions.plugins?.legend?.labels,
          color: textColor,
          font: {
            ...lineChartOptions.plugins?.legend?.labels.font,
            weight: fontWeight
          }
        }
      },
      tooltip: {
        ...lineChartOptions.plugins?.tooltip,
        bodyFont: {
          ...lineChartOptions.plugins?.tooltip?.bodyFont,
          color: textColor,
          weight: fontWeight
        }
      }
    }
  };

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
      options={customOptions}
    />
  );
};

export { LineAvaragesChart };
