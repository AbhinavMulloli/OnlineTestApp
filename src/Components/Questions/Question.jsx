import React, { useState, useEffect } from 'react';
import "./Question.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { BsArrowRightShort, BsArrowLeftShort } from 'react-icons/bs';
import { LuClipboardSignature } from "react-icons/lu";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
} from 'mdb-react-ui-kit';
import { addMarks, addMarksCompetition } from '../../service/allapi';


function Question() {
  const [triviaData, setTriviaData] = useState([]);//to store data from api
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [showUnansweredModal, setShowUnansweredModal] = useState(false);
  const [isShow, setInvokeModal] = useState(false);
  const [startTime, setStartTime] = useState(null); // New state for start time
  const [tabActive, setTabActive] = useState(true);

  const userid = localStorage.getItem("id");
  const user = localStorage.getItem("user");
  const { id } = useParams();

  const initModal = () => {
    setInvokeModal(!isShow);
  };

  const handleback = () => {
    initModal()
  };

  const confirmQuit = () => {
    navigate('/dashboard')
  };

  useEffect(() => {
    //diffrent api for diffrent subjects
    const fetchData = async () => {
      let apiUrl = '';
      switch (id) {
        case "maths":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=19&type=multiple';
          break;
        case "computer science":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';
          break;
        case "history":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=23&type=multiple';
          break;
        case "mathsComp":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=19&type=multiple';
          break;
        case "scienceComp":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=18&type=multiple';
          break;
        case "historyComp":
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=23&type=multiple';
          break;
        default:
          apiUrl = 'https://opentdb.com/api.php?amount=10&category=26&type=multiple';
      }

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const formattedData = data.results.map((question, index) => {
          const options = [...question.incorrect_answers, question.correct_answer];
          options.sort(() => Math.random() - 0.5);
          return {
            ...question,
            options: options,
            number: index + 1
          };
        });
        setTriviaData(formattedData);
      } catch (error) {
        console.error('Error fetching trivia data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(prevTime => prevTime - 1);
        if (timeLeft === 60) {
          toast.warn('Only 1 minute left!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } else {
        handleSubmit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, currentPage]);
  //object for useNavigte
  const navigate = useNavigate();

  const indexOfLastQuestion = (currentPage + 1) * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestion = triviaData.slice(indexOfFirstQuestion, indexOfLastQuestion)[0];

  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  const handleSelectAnswer = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.question]: option
    });
  };
  //to find correct answers
  const correctAnswersCount = triviaData.reduce((acc, question) => {
    const selectedAnswer = selectedAnswers[question.question];
    if (selectedAnswer === question.correct_answer) {
      return acc + 1;
    }
    return acc;
  }, 0);
  //state to store result details
  const [markData, setMark] = useState({
    subject: id,
    questions: 10,
    date: new Date(),
    uid: userid,
    username: user,
    correctAnswersCount: 0,
    timeTaken: 0 // Initialize timeTaken
  });

  useEffect(() => {
    setMark(prevUserData => ({
      ...prevUserData,
      correctAnswersCount: correctAnswersCount
    }));
  }, [correctAnswersCount]);

  const handlecheck = () => {
    setShowUnansweredModal(true);
  };


  const handleSubmit = async () => {
    if (!startTime) {
      return;
    }

    // Calculate time taken
    const endTime = new Date();
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in seconds

    // Update markData with timeTaken
    const updatedMarkData = {
      ...markData,
      timeTaken: timeTaken
    };

    setShowResults(true);
    // Check if it is normal questions or competition
    if (id === "mathsComp" || id === "scienceComp" || id === "historyComp") {
      const response = await addMarksCompetition(updatedMarkData);
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.log(response.response.data);
      }
    } else {
      const response = await addMarks(updatedMarkData);
      if (response.status === 200) {
        console.log(response.data.message);
      } else {
        console.log(response.response.data);
      }
    }
  };
  const handleClose = () => {
    setShowResults(false);
    navigate('/dashboard');
  };

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  // for unanswered questions
  const handleShowUnansweredModal = () => {
    setShowUnansweredModal(true);
  };

  const handleCloseUnansweredModal = () => {
    setShowUnansweredModal(false);
  };

  // for unanswered questions getting
  const handleUnansweredQuestions = () => {
    const unansweredQuestions = triviaData.filter(question => !selectedAnswers[question.question]);
    return unansweredQuestions.map(question => question.number);
  };

  // pagination
  const renderPaginationNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < Math.ceil(triviaData.length / questionsPerPage); i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`pagination-btn page ${i === currentPage ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
          style={{
            padding: '8px 12px',
            margin: '0 5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: i === currentPage ? 'green' : '#fff',
            color: i === currentPage ? '#fff' : '#333',
            cursor: 'pointer',
            transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
          }}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    setStartTime(new Date());
  }, []);
  //for submit answers when user switch or minimize the tab
  const handleVisibilityChange = () => {
    setTabActive(!document.hidden);
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const handleUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      handleSubmit();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  useEffect(() => {
    if (!tabActive) {
      handleSubmit();
    }
  }, [tabActive]);


  return (
    <>
      <div className='gradient'>
        <MDBContainer fluid>
          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol col='12'>
              <MDBCard className='my-5 mx-auto bg-white cardss' style={{backgroundColor: "rgba(255,255,255,0.55)", maxWidth: "86%"}}>
                <MDBCardBody className='p-5 w-100 d-flex flex-column mt-1' style={{boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)'}}>
                  <div>
                    <div className="d-flex justify-content-center">
                      <h2>Answer The Questions</h2>{" "}
                      <Link
                        className="float-right mt-1"
                        style={{ paddingLeft: "100px" }}
                        onClick={handleShowUnansweredModal}
                      >
                        <LuClipboardSignature
                          style={{height: "24px", width: "24px", cursor: "pointer"}}
                          className="icon"
                        />
                      </Link>
                    </div>
                    <h4 className="text-danger mb-3">Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</h4>
                    {currentQuestion && (
                      <div>
                        <h3 className='mb-2'>{currentQuestion.question}</h3>
                        <form>
                          <ul>
                            {currentQuestion.options.map((option, optionIndex) => (
                              <li className="mt-3" key={optionIndex}>
                                <label>
                                  <input
                                    type="radio"
                                    value={option}
                                    checked={selectedAnswers[currentQuestion.question] === option}
                                    onChange={() => handleSelectAnswer(option)}
                                  />
                                  {option}
                                </label>
                              </li>
                            ))}
                          </ul>
                        </form>
                      </div>
                    )}
                    <div
                      style={{ marginTop: "10px" }}
                      className="d-flex justify-content-center space-evenly"
                    >
                      {currentPage > 0 && (
                        <button
                          className="btn-outline-success btn me-3"
                          onClick={paginatePrev}
                        >
                          <BsArrowLeftShort className="iconss" />
                          Previous
                        </button>
                      )}
                      {renderPaginationNumbers()}
                      {currentPage <
                        Math.ceil(triviaData.length / questionsPerPage) - 1 && (
                        <button
                          className="btn-outline-success btn  ms-3"
                          onClick={paginateNext}
                        >
                          Next <BsArrowRightShort className="iconss" />
                        </button>
                      )}
                      <button
                        className="bg-danger btn text-white ms-3"
                        onClick={handleback}
                      >
                        Quit
                      </button>
                      {currentPage ===
                        Math.ceil(triviaData.length / questionsPerPage) - 1 && (
                        <button
                          className="bg-primary btn text-white ms-3"
                          onClick={handlecheck}
                        >
                          Submit
                        </button>
                      )}
                   
                    </div>
                    <div
                      style={{ marginTop: "10px" }}
                      className="d-flex justify-content-center space-evenly mt-5"
                    >    <p className="text-danger"> <strong>Important Note:</strong> If you switch or minimize tabs during the exam, the exam will be considered over.</p>
                    </div>
                    {/* result modal */}
                    <Modal show={showResults} onHide={handleClose} centered>
                      <Modal.Header closeButton className='bg-success'>
                        <Modal.Title className="text-white">Results</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <h4 className="text-primary">Your score: {correctAnswersCount} out of {triviaData.length}</h4>
                        <ListGroup>
                          {triviaData.map((question) => (
                            <ListGroup.Item
                              key={question.number}
                              className={selectedAnswers[question.question] === question.correct_answer ? 'text-success' : 'text-danger'}
                            >
                              <p>
                                <strong>Question {question.number}:</strong> <br />
                                <strong>Your Answer:</strong> {selectedAnswers[question.question]}<br />
                                <strong>Correct Answer:</strong> {question.correct_answer}
                              </p>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button className='bg-white text-success ' style={{borderColor:"green"}} onClick={handleClose}>
                          Close
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </div>
                </MDBCardBody>
              </MDBCard>
              {/* confirm quit modal */}
              <Modal className='deleteModal' show={isShow} onHide={initModal}>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body><h5 className='text-center text-dark b'>Are you sure to quit the test ?</h5></Modal.Body>
                <Modal.Footer>
                  <Button className='bg-white text-success '  style={{color:"white",marginLeft:"-50px",borderColor:"green"}} onClick={() =>  setInvokeModal(false)}>Close</Button>
                  <Button variant="success" style={{color:"white",borderColo:"green"}} onClick={confirmQuit}>Confirm</Button>
                </Modal.Footer>
              </Modal>
              {/* modal to show unanswered questions */}
              <Modal style={{color:"green"}}  show={showUnansweredModal} onHide={handleCloseUnansweredModal} centered >
                <Modal.Header  closeButton className='bg-success'>
                  <Modal.Title className='text-white' >Unanswered Questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="unanswered-questions">
                    <p className="unanswered-header">Unanswered question numbers:</p>
                    <div className="number-boxes">
                      {handleUnansweredQuestions().map(number => (
                        <div key={number} className="number-box">{number}</div>
                      ))}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button className='bg-white text-success ' style={{borderColor:"green"}} onClick={handleCloseUnansweredModal}>Close</Button>
                  <Button variant="success" onClick={handleSubmit}>Submit</Button>
                </Modal.Footer>
              </Modal>
              <ToastContainer autoClose={1400} position="top-center" />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    </>
  );
}

export default Question;