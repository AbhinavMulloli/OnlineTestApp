import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { FiUser } from "react-icons/fi";
import Offcanvas from 'react-bootstrap/Offcanvas';
import moment from 'moment';
import Barchart from './Barchart';
import Piechart from './Piechart';
import { getallMarks } from '../../service/allapi';

function Dashboard() {
  const uid = localStorage.getItem("id");
  const id = "maths";
  const idb = "computer science";
  const idbc = "history";

  const [show, setShow] = useState(false);
  const [allmarks, SetAllMarks] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userEmail = localStorage.getItem("email");
  const profilePicUrl = 'https://i.postimg.cc/mZN0z8kf/profile.png';

  const getAllMarks = async () => {
    const response = await getallMarks(uid);
    SetAllMarks(response.data);
  };

  useEffect(() => {
    getAllMarks();
  }, []);

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: 'darkgreen'}}>
        <div className="container-fluid">
          <section className="text-white navbar-brand ps-1" style={{ fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
            Get Your Question Papers
          </section>

          <section onClick={handleShow} className="navbar-brand text-white ps-2 me-1 pe-1" style={{ fontSize: '14px', fontFamily: 'Montserrat, sans-serif' }}>
            <FiUser
              className="d-inline-block align-top"
              style={{
                color: "White",
                height: "24px",
                width: "24px",
                borderRadius: "200px",
                backgroundColor: "darkgreen",
                cursor: "pointer",
              }}
            />
            <i className="fa-solid fa-location-dot ps-1  icon"></i>
          </section>
        </div>
      </nav>

      <Navbar className="text-dark" bg="body-tertiary" variant="dark" sticky="top" expand="md">
        <Navbar.Brand href="#">Your Brand</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarSupportedContent" className="text-dark" />
        <Navbar.Collapse id="navbarSupportedContent" className="text-dark">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link href="#" className="text-dark" active>Maths</Nav.Link>
            <Nav.Link href="#" className="text-dark">Computer Science</Nav.Link>
            <Nav.Link href="#" className="text-dark">History</Nav.Link>
            <Nav.Link href="/" className="text-success">Log out</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <FormControl type="search" placeholder="Maths,Cs etc" className="me-2" aria-label="Search" />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement='end' style={{ color: 'darkgreen' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={styles.container}>
            <img src={profilePicUrl} alt="Profile" style={styles.profilePic} />
            <div style={styles.email}>{userEmail}</div>
          </div>
          <h4 className="mt-3 mb-2 ms-4">Previous Scores</h4>
          {allmarks.map((a, index) => (
            <div className="card mt-3 mx-auto" style={{ width: '18rem', background: 'linear-gradient(75.7deg, rgb(34, 126, 34) 3.8%, rgb(99, 162, 17) 87.1%)' }}>
              <ul className="list-group list-group-flush mb-3 bg-dark">
                <li className="list-group-item">Subject: {a.subject}</li>
                <li className="list-group-item">Questions: {a.questions}</li>
                <li className="list-group-item">Date: {moment(a.date).format("DD/MM/YYYY")}</li>
                <li className="list-group-item">Duration: 3 min</li>
                <li className="list-group-item">Score: {a.correctAnswersCount} out of {a.questions}</li>
              </ul>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <div className="container-fluid" style={{ backgroundColor: 'darkgreen', textAlign: 'center' }}>
        <div className="row">
          <div className="col-lg-12 col-sm-12">
            <h3 style={{ color: 'white' }} className="mt-3">History, Maths & Computer Science questions Available</h3>
            <h5 style={{ color: 'white' }} className="mt-3">Practice Mode Available</h5>
            <div className="first mb-5 mt-3 text-success buy"><a className="g">Maths</a></div>
            <div className="first mb-5 mt-3 text-success buy"><a className="g">History</a></div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 p-5">
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Computer Science Exam Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 5 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${id}`}>Attempt Now - Practice Mode</a>
                  <a className="btn btn-md btn-success btn-block" target="_blank" href={`/questions/${id}`}>Attempt Now - Test Mode</a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Maths Online Exam Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 5 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idb}`}>Attempt Now - Practice Mode</a>
                  <a className="btn btn-md btn-success btn-block" target="_blank" href={`/questions/${idb}`}>Attempt Now - Test Mode</a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>History Exam Paper Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 5 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idbc}`}>Attempt Now - Practice Mode</a>
                  <a className="btn btn-md btn-success btn-block" target="_blank" href={`/questions/${idbc}`}>Attempt Now - Test Mode</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <h3 className='mx-auto text-white text-center'>Result Analysis</h3>
      <div className='col-lg-6 p-5'>
       <Barchart allmarks={allmarks}/>
        </div>
         <div className='col-lg-6 p-5'>
       <Piechart allmarks={allmarks}/>
         </div>
      </div>
        
      <footer className="section bg-white mt-5 text-dark" style={{ border: '1px solid white' }}>
        <div className="text-center mt-5">
          <p className="footer-alt mb-0 f-14">All Rights Reserved ©2016-2023 mock test</p>
          <p className="footer-alt mb-0 f-14">Other Countries</p>
          <p className="footer-alt mb-0 f-14">Indonesia-Pakistan-Russia</p>
        </div>
      </footer>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  profilePic: {
    width: '120px',
    height: '80px',
    marginBottom: '20px',
  },
  email: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
};

export default Dashboard;
