import dynamic from "next/dynamic";
import React, { useState } from "react";

// Dynamically import ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface BarChartProps {
  totalUp: number;
  totalDown: number;
}

const BarChart: React.FC<BarChartProps> = ({ totalUp, totalDown }) => {
  const type: "bar" = "bar"; // Example of strong typing

  const formatSize = (size: number) => {
    if (size >= 1000000) {
      // Convert to MB and show 2 decimal places
      return (size / 1000000).toFixed(2) + " MB";
    } else if (size >= 1000) {
      // Show KB and first 3 digits of the number
      return (size / 1000).toFixed(3) + " KB";
    }
    return size + " B"; // You can handle bytes if needed, although this part is optional
  };

  const [chartOptions] = useState({
    series: [
      {
        name: "Audit Ratio",
        data: [totalUp, totalDown],
      },
    ],
    options: {
      chart: {
        type, // Explicitly set to the correct type
        height: 200,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ["Done", "Received"], // Categories for bars
      },
      title: {
        text: "Audit Done and Received  ",
        align: "center" as "center",
        style: {
          fontSize: "16px",
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => formatSize(value), // Format the tooltip value
        },
      },
    },
  });
  if (!chartOptions.options.chart || !chartOptions.options.chart.type) {
    console.error("Chart type is undefined");
  }
  return (
    <div id="chart">
      <ReactApexChart
        options={chartOptions.options}
        series={chartOptions.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default BarChart;
