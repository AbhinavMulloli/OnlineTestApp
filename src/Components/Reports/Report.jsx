import React, { useState, useEffect, useRef } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody
} from 'mdb-react-ui-kit';
import moment from 'moment';
import { useReactToPrint } from "react-to-print";
import { FiDownload } from "react-icons/fi";
import { getallMarks } from '../../service/allapi';

function Report() {
  const uid = localStorage.getItem("id");
  const user = localStorage.getItem("user");
  const componentPDF = useRef();//for printing pdf
  const today = new Date();//to get current date

  const [allmarks, SetAllMarks] = useState([]);//state to store all marks 
  const [highestAchievement, setHighestAchievement] = useState(null);
  const [lowestAchievement, setLowestAchievement] = useState(null);
  //funtion to get all marks from database
  const getAllMarks = async () => {
    const response = await getallMarks(uid);
    console.log(response.data);
    SetAllMarks(response.data);
  };
  //funtion for generate pdf
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "user data",
    onAfterPrint: () => toast.success("Data saved in pdf")
  });

  useEffect(() => {
    getAllMarks();
  }, []);

  const scores = {};

  allmarks.forEach(mark => {
    if (!scores[mark.subject]) {
      scores[mark.subject] = [];
    }
    scores[mark.subject].push(mark.correctAnswersCount);
  });

  const subjectStats = Object.keys(scores).map(subject => {
    const subjectScores = scores[subject];
    const highest = Math.max(...subjectScores);
    const lowest = Math.min(...subjectScores);
    const sum = subjectScores.reduce((acc, curr) => acc + curr, 0);
    const average = sum / subjectScores.length;

    // Calculate Average Time Taken for the Subject
    const subjectTimeTaken = allmarks
      .filter(mark => mark.subject === subject && mark.timeTaken)
      .reduce((acc, mark) => acc + mark.timeTaken, 0);
    const averageTimeTaken = subjectTimeTaken / subjectScores.length;

    // Check if this is the new highest score
    if (!highestAchievement || highest > highestAchievement.highest) {
      setHighestAchievement({
        subject,
        highest,
        date: moment(today).format("DD/MM/YYYY")
      });
    }

    // Check if this is the new lowest score
    if (!lowestAchievement || lowest < lowestAchievement.lowest) {
      setLowestAchievement({
        subject,
        lowest,
        date: moment(today).format("DD/MM/YYYY")
      });
    }

    return {
      subject,
      highest,
      lowest,
      average,
      averageTimeTaken
    };
  });

  return (
    <div className='gradient'>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard className='my-5 mx-auto bg-white cardss' style={{ backgroundColor: "rgba(255,255,255,0.55)", maxWidth: "86%",height:"fit-content", borderRadius: '13px', }}>
              <MDBCardBody className='p-3 w-100 d-flex flex-column mt-1' style={{ boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
                <nav className="navbar">
                  <div className="container-fluid">
                    <section className=" navbar-brand ps-1" style={{ fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
                      <a className='text-success' href="/dashboard" style={{ textDecoration: 'none' }}>Back</a>
                    </section>
                    <section onClick={generatePDF} className="navbar-brand text-white ps-2 me-1 pe-1" style={{ fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
                      <FiDownload
                        className="d-inline-block align-top"
                        style={{
                          color: "darkgreen",
                          height: "24px",
                          width: "24px",
                          borderRadius: "200px",
                          cursor: "pointer",
                        }}
                      />
                    </section>
                  </div>
                </nav>
                <div ref={componentPDF} className='bg-white  p-4'>
                  <h2 className='text-center'>Scores Summary</h2>
                  <p className=' ms-3'><b>Date: {moment(today).format("DD/MM/YYYY")}</b></p>
                  <p className=' ms-3'  ><b>User: {user} </b></p>
                  <div className="table-responsive mt-3">
                    <table className="table table-striped table-bordered text-center">
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Highest Score</th>
                          <th>Lowest Score</th>
                          <th>Average Score</th>
                          <th>Average Time Taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjectStats.map(stats => (
                          <tr key={stats.subject}>
                            <td>{stats.subject}</td>
                            <td>{stats.highest}</td>
                            <td>{stats.lowest}</td>
                            <td>{stats.average.toFixed(2)}</td>
                            <td>{stats.averageTimeTaken.toFixed(2)} sec</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-center  mt-4">
                    {highestAchievement && (
                      <div className='col-lg-6 p-4 '>
                        <h5>Highest Achievement</h5>
                        <p>Subject: {highestAchievement.subject}</p>
                        <p>Score: {highestAchievement.highest}</p>
                        <p>Date: {highestAchievement.date}</p>
                      </div>
                    )}
                    {lowestAchievement && (
                      <div className='col-lg-6 p-4 '>
                        <h5>Lowest Achievement</h5>
                        <p>Subject: {lowestAchievement.subject}</p>
                        <p>Score: {lowestAchievement.lowest}</p>
                        <p>Date: {lowestAchievement.date}</p>
                      </div>
                    )}
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Report;
