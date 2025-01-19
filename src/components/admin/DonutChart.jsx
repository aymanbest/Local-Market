import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register the necessary components of Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ stats }) => {
  // Calculate the data for the donut chart
  const chartData = {
    labels: stats.map(stat => stat.title),  // Titles for the segments
    datasets: [
      {
        data: stats.map(stat => stat.value),  // Values for each segment
        backgroundColor: stats.map(stat => stat.color),  // Colors for each segment
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = (context.raw / context.dataset.data.reduce((a, b) => a + b, 0)) * 100;
            return `${context.label}: ${percentage.toFixed(1)}%`;
          },
        },
      },
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <Doughnut data={chartData} options={options} />
      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300">User Categories</h5>
    </div>
  );
};

export default DonutChart;
