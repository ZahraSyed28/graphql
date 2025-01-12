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
  const type: "bar" = "bar"; // Explicitly specify the chart type as a bar

  const options = {
    chart: {
      height: 350,
      type,
      toolbar: { show: false },
      events: {
        dataPointMouseEnter: (event: any, chartContext: any, { dataPointIndex }: any) => {
          event.target.style.cursor = "pointer";
        },
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
      custom: ({ series, seriesIndex, dataPointIndex }: any) => {
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
      align: "center" as "center",
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
