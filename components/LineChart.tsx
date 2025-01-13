import dynamic from "next/dynamic";
import React from "react";

// Dynamically import ReactApexChart with SSR disabled
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface ColumnChartProps {
  levels: number[];
  totals: number[];
  tooltips: string[];
}

const ColumnChart: React.FC<ColumnChartProps> = ({ levels, totals, tooltips }) => {
  const type = "bar" as const; // Explicitly specify the chart type as a bar

  const options = {
    chart: {
      height: 350,
      type,
      toolbar: { show: false },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataPointMouseEnter: (event: any) => {
          event.target.style.cursor = "pointer";
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataPointClick: (event: any, chartContext: any, { dataPointIndex }: any) => {
          alert(tooltips[dataPointIndex]);
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        dataLabels: {
          position: "top", // Position the labels at the top of each bar
        },
      },
    },
    tooltip: {
      enabled: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        custom: ({ dataPointIndex }: any) => {
        return `<div style="padding:10px; font-size:14px;">
                  ${tooltips[dataPointIndex]}
                </div>`;
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val}`, // Display the total as the data label
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#000"], // Customize label color
      },
    },
    xaxis: {
      categories: levels,
      title: { text: "Levels" },
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: { text: "Number of Students" },
      labels: {
        formatter: (value: number) => `${value}`,
      },
    },
    title: {
      text: "Students per Level ",
      align: "center" as const,
      style: {
        fontSize: "16px",
      },
    },
  };

  const series = [
    {
      name: "Students per Level",
      data: totals,
    },
  ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default ColumnChart;
