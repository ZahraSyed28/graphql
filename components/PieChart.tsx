/** @format */

import React from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  transactions: {
    amount: number;
    path: string;
    type: string;
    userLogin: string;
    eventId: number;
  }[];
}

const PolarAreaChart: React.FC<PieChartProps> = ({ transactions }) => {
  // Filter transactions to include only those related to skills
  const skillTransactions = transactions.filter((transaction) =>
    transaction.type.toLowerCase().includes("skill")
  );

  // Aggregate points for each skill
  const skillPoints: Record<string, number> = {};
  skillTransactions.forEach((transaction) => {
    const skill = transaction.type.split("/").pop() || "Unknown Skill";
    const trimmedSkill = skill.replace(/^skill_/, ""); // Trim "skill_" from the skill name
    skillPoints[trimmedSkill] = (skillPoints[trimmedSkill] || 0) + transaction.amount;
  });

  // Filter out skills with values less than or equal to 100
  const filteredSkills = Object.entries(skillPoints).filter(
    ([, value]) => value > 100
  );

  // Prepare data for the polar area chart
  const categories = filteredSkills.map(([skill]) => skill);
  const data = filteredSkills.map(([, value]) => value);

  const chartOptions = {
    chart: {
      type: "polarArea" as "polarArea",
    },
    stroke: {
      colors: ["#fff"],
    },
    fill: {
      opacity: 0.8,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    labels: categories,
    title: {
      text: "Here are your skills with the highest completion rate among all categories",
      align: "center" as "center",
    },
  };

  return (
    <div>
      <ReactApexChart
        options={chartOptions}
        series={data}
        type="polarArea"
        height={350}
      />
    </div>
  );
};

export default PolarAreaChart;
