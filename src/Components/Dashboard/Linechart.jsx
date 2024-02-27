import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

function Linechart({ allmarks }) {
  // Define states to store subjectsArray and averageTimeArray
  const [subjectsArray, setSubjectsArray] = useState([]);
  const [averageTimeArray, setAverageTimeArray] = useState([]);

  useEffect(() => {
    //Initialize an object to store cumulative sum and count for each subject
    const subjectData = {};

    //  Iterate through the data array and update the subjectData object
    allmarks.forEach(entry => {
      const { subject, timeTaken } = entry;
      if (!subjectData[subject]) {
        subjectData[subject] = { sum: 0, count: 0 };
      }
      subjectData[subject].sum += timeTaken;
      subjectData[subject].count += 1;
    });

    //  Calculate average time taken for each subject
    const averageTime = {};
    for (const subject in subjectData) {
      // Calculate average with one decimal point
      averageTime[subject] = (subjectData[subject].sum / subjectData[subject].count).toFixed(1);
    }

    //  Create arrays for subject names and average time taken
    const updatedSubjectsArray = Object.keys(averageTime);
    const updatedAverageTimeArray = updatedSubjectsArray.map(subject => averageTime[subject]);

    // Set the states with the updated arrays
    setSubjectsArray(updatedSubjectsArray);
    setAverageTimeArray(updatedAverageTimeArray);

    console.log("Subject Names:", updatedSubjectsArray);
    console.log("Average Time Taken:", updatedAverageTimeArray);
  }, [allmarks]);

  return (
    <div className='bg-white' style={{boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)'}}>
      <div className="container-fluid mb-5" >
        <Chart
          type="line"
          series={[
            {
              name: "Average Time Taken",
              data: averageTimeArray,
            },
          ]}
          options={{
            chart: {
              id: "line-chart",
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              categories: subjectsArray,
              title: {
                text: "Subjects",
                style: { fontSize: 13 },
              },
            },
            yaxis: {
              title: {
                text: "Average Time Taken To Complete Exam",
                style: { fontSize: 12 },
              },
            },
            title: {
              text: "Average Time Taken in each Subject Line Graph",
              style: { fontSize: 14 },
            },
            colors: ["#826de1"],
            theme: { mode: "light" },
            legend: {
              show: true,
              position: "right",
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: undefined,
              formatter: function (val) {
                return `${val} sec`;
              },
              offsetY: -10,
              style: {
                colors: ["black"],
                fontSize: 12,
              },
            },
            markers: {
              size: 5,
              colors: ["#826de1"],
              strokeWidth: 0,
              hover: {
                size: 7,
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Linechart;
