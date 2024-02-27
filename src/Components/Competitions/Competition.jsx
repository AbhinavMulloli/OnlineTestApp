import React, { useState, useEffect, useRef } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import { Button,Modal } from 'react-bootstrap';
import "./Competition.css";
import { useReactToPrint } from "react-to-print";
import { FiDownload } from "react-icons/fi";
import BarGraph from "./BarGraph";
import { getallMarksCompetition } from '../../service/allapi';

function Competition() {
  const uid = localStorage.getItem("id");
  const loggedInUsername = localStorage.getItem("user");
  const componentPDF = useRef();//for print pdf
  const id = "scienceComp";
  const idb = "mathsComp";
  const idbc = "historyComp";

  const [allmarks, SetAllMarks] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [subject, setSubject] = useState('all');

  const handleInstructionsClose = () => setShowInstructions(false);
  const handleInstructionsShow = () => setShowInstructions(true);

  const getMarks = async () => {
    try {
      let response = await getallMarksCompetition({ uid, subject });
      let marksData = response.data;

      // Sorting compMarks array by correctAnswersCount in descending order,
      // and then by timeTaken in ascending order to show the fastest timeTaken first
      marksData = marksData.sort((a, b) => {
        if (b.correctAnswersCount === a.correctAnswersCount) {
          return a.timeTaken - b.timeTaken;
        }
        return b.correctAnswersCount - a.correctAnswersCount;
      });

      SetAllMarks(marksData);
    } catch (error) {
      console.error("Error fetching competition marks: ", error);
    }
  };
  //funtion for generating pdf
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "user data",
    onAfterPrint: () => toast.success("Data saved in pdf")
  });

  useEffect(() => {
    getMarks();
  }, [subject]);

  // Function to get the appropriate place icon based on position
  const getPlaceIcon = (position) => {
    switch (position) {
      case 1:
        return <img src="https://i.postimg.cc/C1Ft2M3v/first.png" alt="1st" style={{ width: "20px", height: "20px" }}  />;
      case 2:
        return <img src="https://i.postimg.cc/X7dv3QZT/second.png" alt="2nd" style={{ width: "20px", height: "20px" }} />;
      case 3:
        return <img src="https://i.postimg.cc/QdShxPjn/third.png" alt="3rd" style={{ width: "20px", height: "20px" }} />;
      default:
        return null;
    }
  };

  return (
    <div className='gradient'>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <MDBCard className='my-5 mx-auto bg-white cardss' style={{ backgroundColor: "rgba(255,255,255,0.55)", borderColor: 'green', maxWidth: "88%", height: "fit-content", borderRadius: '13px', }}>
              <MDBCardBody className='p-3 w-100 d-flex flex-column mt-1' style={{ boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
                <nav className="navbar">
                  <div className="container-fluid">
                    <section className="navbar-brand ps-1" style={{ fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
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
                <div className="row row-cols-1 row-cols-md-3 p-3 ">
                  <div className="col-md-4 mb-4 p-4 ">
                    <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
                      <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Computer Science Competition</strong></h3>
                      <div className="card-body d-flex flex-column">
                        <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                          <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                            <div><b>Question :</b>10</div>
                            <div><b>Time :</b> 3 minutes</div>
                          </div>
                          <span>
                            <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${id}`}>Attempt Now </a>
                            <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 p-4">
                    <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
                      <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Maths Quetions Competition</strong></h3>
                      <div className="card-body d-flex flex-column">
                        <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                          <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                            <div><b>Question :</b>10</div>
                            <div><b>Time :</b> 3 minutes</div>
                          </div>
                          <span>
                            <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idb}`}>Attempt Now </a>
                            <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 mb-4 p-4">
                    <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
                      <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>History Questions Competition</strong></h3>
                      <div className="card-body d-flex flex-column">
                        <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                          <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                            <div><b>Question :</b>10</div>
                            <div><b>Time :</b> 3 minutes</div>
                          </div>
                          <span>
                            <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idbc}`}>Attempt Now </a>
                            <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* modal for show instructions */}
                <Modal show={showInstructions} onHide={handleInstructionsClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="text-success">Instructions</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-success"><strong  >Duration:</strong> <b className="text-info">3 minutes</b></p>
                    <p className="text-success"><strong>Total Marks:</strong> <b className="text-info">10</b></p>
                    <p className="text-success"><strong>Number of Questions:</strong><b className="text-info"> 10</b></p>
                    <p className="text-danger"> <strong>Important Note:</strong> If you switch or minimize tabs during the exam, the exam will be considered over.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button className="bg-white text-success " style={{borderColor:"green"}}  onClick={handleInstructionsClose}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* leaderboard section */}
                <div  className='bg-white p-4 '>
                  <h3 className='text-center'>Leaderboard</h3>
                  <div className="d-flex align-items-center mb-3 ">
                    <label className="me-2 mb-0 ms-2">Select Subject:</label>
                    <select
                      className="form-select form-select-sm flex-grow-1 ms-3"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="scienceComp">Computer</option>
                      <option value="mathsComp">Maths</option>
                      <option value="historyComp">History</option>
                    </select>
                  </div>
                <div ref={componentPDF} className='table-responsive mt-3 p-4 border' style={{boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)'}} >
                    {/* leaderboard table */}
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>User name</th>
                          <th>Subject</th>
                          <th>Score</th>
                          <th>Time taken</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allmarks.map((stats, index) => (
                          <tr
                            key={`${stats.username}-${stats.subject}-${index}`}
                            className={stats.username === loggedInUsername ? 'highlight-row' : ''}
                          >
                            <td>
                              {index < 3 ? getPlaceIcon(index + 1) : index + 1}
                            </td>
                            <td>{stats.username}</td>
                            <td>{stats.subject.slice(0, -4)}</td>
                            <td>{stats.correctAnswersCount}</td>
                            <td>{stats.timeTaken} sec</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  <h3 className='text-center mt-4'>Score Analysis</h3>
                      {/* Render the BarGraph component */}
                      <BarGraph allmarks={allmarks} />
                    </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Competition;
