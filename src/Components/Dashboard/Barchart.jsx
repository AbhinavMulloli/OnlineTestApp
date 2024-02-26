    import React, { useState, useEffect } from 'react';
    import Chart from "react-apexcharts";

    function Barchart({ allmarks }) {
      // Define states to store subjectsArray and averageMarksArray
      const [subjectsArray, setSubjectsArray] = useState([]);
      const [averageMarksArray, setAverageMarksArray] = useState([]);

      useEffect(() => {
        //Initialize an object to store cumulative sum and count for each subject
        const subjectData = {};

        //  Iterate through the data array and update the subjectData object
        allmarks.forEach(entry => {
          const { subject, correctAnswersCount } = entry;
          if (!subjectData[subject]) {
            subjectData[subject] = { sum: 0, count: 0 };
          }
          subjectData[subject].sum += correctAnswersCount;
          subjectData[subject].count += 1;
        });

        //  Calculate average marks for each subject
        const averageMarks = {};
        for (const subject in subjectData) {
          // Calculate average with one decimal point
          averageMarks[subject] = (subjectData[subject].sum / subjectData[subject].count).toFixed(1);
        }

        //  Create arrays for subject names and average marks
        const updatedSubjectsArray = Object.keys(averageMarks);
        const updatedAverageMarksArray = updatedSubjectsArray.map(subject => averageMarks[subject]);

        // Set the states with the updated arrays
        setSubjectsArray(updatedSubjectsArray);
        setAverageMarksArray(updatedAverageMarksArray);

        console.log("Subject Names:", updatedSubjectsArray);
        console.log("Average Marks:", updatedAverageMarksArray);
      }, [allmarks]);

      return (
        <div className='bg-white'>
          <div className="container-fluid mb-5" >
            <Chart
              type="bar"
              series={[
                {
                  name: "Average Mark",
                  data: averageMarksArray,
                  style: { color: "white", fontSize: 12 },
                },
              ]}
              options={{
                title: {
                  text: " Average marks in each Subject Bar Graph",
                  style: { fontSize: 14 },
                },
                colors: ["#826de1"],
                theme: { mode: "light" },
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
                ],
                xaxis: {
                  tickPlacement: "on",
                  categories: subjectsArray,
                  title: {
                    text: "Subjects",
                    style: { color: "black", fontSize: 13 },
                  },
                },
                yaxis: {
                  labels: {
                    formatter: (val) => {
                      return `${val}`;
                    },
                    style: { fontSize: "12", colors: ["black"] },
                  },
                  title: {
                    text: "Expense In Rs",
                    style: { color: "black", fontSize: 12 },
                  },
                },
                legend: {
                  show: true,
                  position: "right",
                },
                dataLabels: {
                  formatter: (val) => {
                    return `${val}`;
                  },
                  style: {
                    colors: ["black"],
                    fontSize: 15,
                  },
                },
              }}
            ></Chart>
          </div>
        </div>
      );
    }

    export default Barchart;
