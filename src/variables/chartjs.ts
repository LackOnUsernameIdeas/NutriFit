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

//Other shit
export const barChartDataDailyTraffic = [
  {
    name: "Daily Traffic",
    data: [20, 30, 40, 20, 45, 50, 30]
  }
];

export const barChartDataUserActivity = [
  {
    name: "PRODUCT A",
    data: [70, 55, 41, 67, 22, 43]
  },
  {
    name: "PRODUCT B",
    data: [90, 70, 60, 50, 80, 90]
  }
];

// User Activity

export const barChartOptionsUserActivity = {
  chart: {
    stacked: true,
    toolbar: {
      show: false
    }
  },
  tooltip: {
    style: {
      fontSize: "12px"
    },
    onDatasetHover: {
      style: {
        fontSize: "12px"
      }
    },
    theme: "dark"
  },
  xaxis: {
    categories: ["S", "M", "T", "W", "T", "F"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500"
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: true,
    color: "black",
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500"
      }
    }
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: true,
        opacity: 0.5
      }
    },
    row: {
      opacity: 0.5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  fill: {
    type: "solid",
    colors: ["#5E37FF", "#6AD2FF"]
  },
  legend: {
    show: false
  },
  colors: ["#5E37FF", "#6AD2FF"],
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "30px"
    }
  }
};
// Consumption Users Reports

export const barChartDataConsumption = [
  {
    name: "PRODUCT A",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380]
  },
  {
    name: "PRODUCT B",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380]
  },
  {
    name: "PRODUCT C",
    data: [400, 370, 330, 390, 320, 350, 360, 320, 380]
  }
];

export const barChartOptionsConsumption: any = {
  chart: {
    stacked: true,
    toolbar: {
      show: false
    }
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined
      }
    },
    theme: "dark"
  },
  xaxis: {
    categories: ["17", "18", "19", "20", "21", "22", "23", "24", "25"],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500"
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500"
      }
    }
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5
      }
    },
    row: {
      opacity: 0.5
    },
    xaxis: {
      lines: {
        show: false
      }
    }
  },
  fill: {
    type: "solid",
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"]
  },
  legend: {
    show: false
  },
  colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
  dataLabels: {
    enabled: false
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "20px"
    }
  },
  plugins: {
    legend: {
      position: "bottom"
    }
  }
};

export const pieChartOptions: any = {
  labels: ["Your files", "System", "Empty"],
  colors: ["#4318FF", "#6AD2FF", "#EFF4FB"],
  chart: {
    width: "50px"
  },
  states: {
    hover: {
      filter: {
        type: "none"
      }
    }
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false
        }
      }
    }
  },
  fill: {
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB"]
  },
  tooltip: {
    enabled: true,
    theme: "dark"
  }
};

export const pieChartData = [63, 25, 12];

// Total Spent Default

export const lineChartDataTotalSpent = [
  {
    name: "Revenue",
    data: [50, 64, 48, 66, 49, 68]
  },
  {
    name: "Profit",
    data: [30, 40, 24, 46, 20, 46]
  }
];

export const lineChartOptionsTotalSpent: any = {
  chart: {
    toolbar: {
      show: false
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: "#4318FF"
    }
  },
  colors: ["#4318FF", "#39B8FF"],
  markers: {
    size: 0,
    colors: "white",
    strokeColors: "#7551FF",
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    shape: "circle",
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true
  },
  tooltip: {
    theme: "dark"
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: "smooth",
    type: "line"
  },
  xaxis: {
    type: "numeric",
    categories: ["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"],
    labels: {
      style: {
        colors: "#A3AED0",
        fontSize: "12px",
        fontWeight: "500"
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  legend: {
    show: false
  },
  grid: {
    show: false,
    column: {
      color: ["#7551FF", "#39B8FF"],
      opacity: 0.5
    }
  },
  color: ["#7551FF", "#39B8FF"]
};
