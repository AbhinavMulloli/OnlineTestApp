import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

function BarGraph({ allmarks }) {
  const [users, setUsers] = useState([]);
  const [scores, setScores] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const usersArray = allmarks.map(mark => mark.username);
    const scoresArray = allmarks.map(mark => mark.correctAnswersCount);
    const subjectsArray = allmarks.map(mark => mark.subject.slice(0, -4));

    setUsers(usersArray);
    setScores(scoresArray);
    setSubjects(subjectsArray);
  }, [allmarks]);

  // Bar Chart options
  const barChartOptions = {
    chart: {
      id: "bar-chart"
    },
    xaxis: {
      categories: users.map((user, index) => `${user} - ${subjects[index]}`),
      title: {
        text: "Users",
        style: { fontSize: 13, color: "black" }
      }
    },
    yaxis: {
      title: {
        text: "Scores",
        style: { fontSize: 13, color: "black" }
      }
    },
    colors: ["#826de1"],
    plotOptions: {
      bar: {
        horizontal: false
      }
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: "Scores Graph",
      style: { fontSize: 14 }
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  // Pie Chart options
  const pieChartOptions = {
    labels: users.map((user, index) => `${user} - ${subjects[index]}`),
    colors: ["#FF5733", "#FFC300", "#DAF7A6", "#C70039", "#900C3F"],
    title: {
      text: "Scores Distribution",
      style: { fontSize: 14 }
    },
    responsive: [
      {
        breakpoint: 1000,
        options: {
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  };

  return (
    <div className='row d-flex justify-content-center border mt-4' style={{ overflow: "hidden", boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
      <div className='col-lg-6 col-sm-12 p-2'>
        <Chart
          options={barChartOptions}
          series={[{ name: "Scores", data: scores }]}
          type="bar"
          height={350}
        />
      </div>
      <div className='col-lg-6 col-sm-12 p-2'>
        <Chart
          options={pieChartOptions}
          series={scores}
          type="pie"
          height={350}
        />
      </div>
    </div>

  );
}

export default BarGraph;
