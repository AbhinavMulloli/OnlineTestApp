import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";

function Piechart({ allmarks }) {
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
      averageMarks[subject] = subjectData[subject].sum / subjectData[subject].count;
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
    <div className='bg-white' style={{boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)'}}>
      <div className='charts' style={{ width: '88%', height: '98%' }}>
            <Chart  className='d-flex text-white pies '
              type="pie"
             series={averageMarksArray}


              options={{
                title: {
                  text: "Average marks in each Subject Pie Graph"
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
                ],
                noData: { text: "Empty Data" },
                colors:["#0dcaf0","#67d09a","#eaea34"],
                labels: subjectsArray

              }}
            >
            </Chart>
          </div>
    </div>
  );
}

export default Piechart;
