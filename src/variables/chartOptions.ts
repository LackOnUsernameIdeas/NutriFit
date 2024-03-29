import { useColorMode } from "@chakra-ui/react";

//Shit for distinguishing between light shit and dark shit
export const useCustomColorMode = () => {
  const { colorMode } = useColorMode();
  return colorMode === "light" ? 550 : 100; // Adjust font weight based on color mode
};
//Main shit
export const barChartOptions: any = {
  maintainAspectRatio: false,
  aspectRatio: 5,
  animation: {
    onComplete: () => ({
      delayed: true
    }),
    delay: (context: any) => {
      let delay = 0;
      if (context.type === "data" && context.mode === "default") {
        delay = context.dataIndex * 50;
      }
      return delay;
    }
  },
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
          size: 16, // Adjust font size
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

export const lineChartOptions: any = {
  maintainAspectRatio: false,
  aspectRatio: 5,
  animation: {
    onComplete: () => ({
      delayed: true
    }),
    delay: (context: any) => {
      let delay = 0;
      if (context.type === "data" && context.mode === "default") {
        delay = context.dataIndex * 50;
      }
      return delay;
    }
  },
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
          size: 16, // Adjust font size
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
