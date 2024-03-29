import React, { useState, useEffect } from 'react';
import "./Dashboard.css";
import { Navbar, Nav, Form, FormControl, Button, Modal } from 'react-bootstrap';
import { FiUser } from "react-icons/fi";
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineWorkspacePremium } from "react-icons/md";
import moment from 'moment';
import Barchart from './Barchart';
import Piechart from './Piechart';
import Linechart from './Linechart';
import Donut from './Donut'
import { deleteAccount, getallMarks, paymentApi, getUser } from '../../service/allapi';

function Dashboard() {
  const uid = localStorage.getItem("id");
  const id = "maths";
  const idb = "computer science";
  const idbc = "history";

  const [show, setShow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [allmarks, SetAllMarks] = useState([]);
  const [isShow, setInvokeModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [premium, setPremium] = useState('no');
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlelogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    navigate('/');
  }

  const handleredirect = () => {
    toast.error("Available only for Premium members");
  }

  const handleInstructionsClose = () => setShowInstructions(false);
  const handleInstructionsShow = () => setShowInstructions(true);

  const initModal = () => {
    setInvokeModal(!isShow);
  };

  const confimrDelete = async () => {
    const response = await deleteAccount(uid);
    if (response.status === 200) {
      toast.success(response.data.message);
      navigate('/');
    } else {
      toast.error(response.data.message);
    }
  }

  const userName = localStorage.getItem("user");
  const profilePicUrl = 'https://i.postimg.cc/mZN0z8kf/profile.png';

  const getAllMarks = async () => {
    const response = await getallMarks(uid);
    SetAllMarks(response.data);
  };

  const getUserCurrent = async () => {
    const response = await getUser(uid);
    setPremium(response.data.isPremium);
  };

  useEffect(() => {
    getAllMarks();
    getUserCurrent();
  }, []);

  const [focus, setFocus] = useState({
    errName: false,
    errPass: false
  });

  const [userData, setUser] = useState({
      accno: "",
      psw: "",
      toaccno: "781236",
      amount:99,
      uid:uid
  });

  const userDetails = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const key = e.target.name;
    setUser({ ...userData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { accno, psw } = userData;

    if (accno === "") {
      toast.error('Account number required');
    } else if (psw === "") {
      toast.error('Password required');
    } else {
      const response = await paymentApi(userData);

      if (response.data.statusCode === 200) {
        closeModal();
        getUserCurrent();
        toast.success(response.data.message);
        setUser({
          accno: "",
          psw: ""
        });
      } else {
        toast.error(response.data.message);
      }
    }
  };

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
            <Nav.Link onClick={initModal} className="text-success">Delete Account</Nav.Link>
            <Nav.Link onClick={handlelogout} className="text-success ms-4">Log out</Nav.Link>
            { premium != 'yes' ? 
            <Nav.Link onClick={handleredirect}  className="text-success ms-4">Online Competition</Nav.Link> : 
            <Nav.Link href='/competition'  className="text-success ms-4">Online Competition</Nav.Link> }
            { premium != 'yes' ? 
            <Nav.Link onClick={openModal} className="text-success ms-4">Buy Premium</Nav.Link>
            : "" }
          </Nav>
          {/* modal for delete account confirmation */}
          <Modal className='deleteModal' show={isShow} onHide={initModal}>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body><h5 className='text-center text-dark b'>Are you sure to delete this account ?</h5></Modal.Body>
            <Modal.Footer>
              <Button className='bg-white text-success '  style={{color:"white",marginLeft:"-50px",borderColor:"green"}} onClick={() =>  setInvokeModal(false)}>Close</Button>
              <Button variant="success" style={{color:"white",borderColo:"green"}} onClick={confimrDelete}>Confirm</Button>
            </Modal.Footer>
          </Modal>
          <Form className="d-flex">
            <FormControl type="search" placeholder="Maths,Cs etc" className="me-2" aria-label="Search" />
            <Button variant="outline-success" type="submit">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Navbar>
       {/* offcanvas for showing profile and previous marks */}
      <Offcanvas show={show} onHide={handleClose} placement='end' style={{ color: 'darkgreen' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Profile  { premium != 'no' ?  <a className='text-center' style={{paddingLeft:"74px",textDecoration:"none",color:"gold"}}>Premium  <MdOutlineWorkspacePremium /> </a>:""}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div style={styles.container}>
            <img src={profilePicUrl} alt="Profile" style={styles.profilePic} />
            <div style={styles.email}>{userName}</div>
          </div>
          <h4 className="mt-3 mb-2 ms-4">Previous Scores</h4>
          {allmarks.map((a, index) => (
            <div className="card mt-3 mx-auto" style={{ width: '18rem', background: 'linear-gradient(75.7deg, rgb(34, 126, 34) 3.8%, rgb(99, 162, 17) 87.1%)' }}>
              <ul className="list-group list-group-flush mb-3 bg-dark">
                <li className="list-group-item">Subject: {a.subject}</li>
                <li className="list-group-item">Questions: {a.questions}</li>
                <li className="list-group-item">Date: {moment(a.date).format("DD/MM/YYYY")}</li>
                <li className="list-group-item">Duration: 3 min</li>
                <li className="list-group-item">Score: {a.correctAnswersCount}/{a.questions}</li>
                <li className="list-group-item">Time taken: {a.timeTaken} sec</li>
              </ul>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      <div className="container-fluid" style={{ backgroundColor: 'darkgreen', textAlign: 'center' }}>
        <div className="row">
          <div className="col-lg-12 col-sm-12">
            <h3 style={{ color: 'white' }} className="mt-3">History, Maths & Computer Science Questions Available</h3>
            <h5 style={{ color: 'white' }} className="mt-3">Practice Mode Available</h5>
            <div className="first mb-5 mt-3 text-success buy"><a className="g">Maths</a></div>
            <div className="first mb-5 mt-3 text-success buy"><a className="g">History</a></div>
          </div>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 p-5">
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Maths Online Exam Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 3 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${id}`}>Attempt Now - Practice Mode</a>
                  <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>Computer Science Exam Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 3 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idb}`}>Attempt Now - Practice Mode</a>
                  <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4 p-4">
          <div className="p-5 card h-100 text-center border-dark" style={{ minWidth: '33%',boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)' }}>
            <h3 className="card-header" style={{ fontSize: '1.25rem' }}><strong>History Exam Paper Questions</strong></h3>
            <div className="card-body d-flex flex-column">
              <div className="align-self-end w-100" style={{ marginTop: 'auto' }}>
                <div className="d-flex flex-column" style={{ marginBottom: '1rem' }}>
                  <div><b>Question :</b>10</div>
                  <div><b>Time :</b> 3 minutes</div>
                </div>
                <span>
                  <a className="btn btn-md btn-info btn-block mb-3" href={`/questions/${idbc}`}>Attempt Now - Practice Mode</a>
                  <Button variant="success" onClick={handleInstructionsShow} className="btn btn-md btn-success btn-block">Instructions</Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Instructions */}
      <Modal show={showInstructions} onHide={handleInstructionsClose} centered>
        <Modal.Header closeButton className="bg-success text-light border-0">
          <Modal.Title className="text-white">Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="text-dark">
            <p><strong>Duration:</strong> <span className="text-info">3 minutes</span></p>
            <p><strong>Total Marks:</strong> <span className="text-info">10</span></p>
            <p><strong>Number of Questions:</strong> <span className="text-info">10</span></p>
            <p className="text-danger"><strong>Important Note:</strong> If you switch or minimize tabs during the exam, the exam will be considered over.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-light border-0">
          <Button variant="outline-success" onClick={handleInstructionsClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* modal for payment */}
      <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton className='bg-success'>
            <Modal.Title className='text-white' >Payment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="payment-form-container p-4">
              <Form className="payment-form" onSubmit={handleSubmit}>
                <Form.Group controlId="accountNumber">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    pattern='^(?=.*\d).{6,}$'
                    onBlur={() => setFocus({ ...focus, errName: true })}
                    focus={focus.errName.toString()}
                    type="text"
                    placeholder="Enter Account Number"
                    name="accno"
                    onChange={userDetails}
                    required
                  />
                </Form.Group>
                <p className='ms-2 spa'>Account number must be valid</p>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    pattern='^(?=.*\d).{4,}$'
                    onBlur={() => setFocus({ ...focus, errPass: true })}
                    focus={focus.errPass.toString()}
                    type="password"
                    name="psw"
                    placeholder="Enter Password"
                    onChange={userDetails}
                    required
                  />
                  <p className='ms-2 spa'>Password must be valid</p>
                </Form.Group>
                <Form.Group controlId="amount">
                  <Form.Label>Amount (Rs)</Form.Label>
                  <Form.Control
                    type="text"
                    value="99 Rs"
                    disabled
                  />
                </Form.Group>
                <Button variant="success" type="submit" className="w-100 mt-4" onClick={handleSubmit}>
                  Pay Now
                </Button>
              </Form>
            </div>
          </Modal.Body>
        </Modal>

      <div className='row row-cols-1 row-cols-lg-2'>
        <h3 className='mx-auto text-white text-center'>Result Analysis with average score</h3>
        <div className='d-flex justify-content-center'>
          <a href='/report'><button className='mt-3 btn btn-light'>View Score Summary</button></a>
        </div>
        <div className='col p-2'>
          <Barchart allmarks={allmarks} />
        </div>
        <div className='col p-2'>
          <Piechart allmarks={allmarks} />
        </div>
      </div>
      <div className='row row-cols-1 row-cols-lg-2'>
        <h3 className='mx-auto text-white text-center'>Result Analysis with average time taken</h3>
        <div className='d-flex justify-content-center'>
        </div>
        <div className='col p-2'>
          <Linechart allmarks={allmarks} />
        </div>
        <div className='col p-2'>
          <Donut allmarks={allmarks} />
        </div>
      </div>


        <footer className="section bg-white mt-5 text-dark" style={{ border: '1px solid white' }}>
          <div className="text-center mt-5">
            <p className="footer-alt mb-0 f-14">All Rights Reserved ©2016-2023 mock test</p>
            <p className="footer-alt mb-0 f-14">Other Countries</p>
            <p className="footer-alt mb-0 f-14">Indonesia-Pakistan-Russia</p>
          </div>
        </footer>
        <ToastContainer autoClose={1400} position="top-center" />
      </>
  );
}
//styles for profile pic and previous marks
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
