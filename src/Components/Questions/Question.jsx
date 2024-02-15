import React, { useState, useEffect } from 'react';
import "./Question.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,useParams } from 'react-router-dom';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox
}
from 'mdb-react-ui-kit';
import { addMarks } from '../../service/allapi';

function Question() {
  const [triviaData, setTriviaData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage] = useState(1); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  
  //for quit modal
  const [isShow, setInvokeModal] = useState(false);

  const userid = localStorage.getItem("id");

   const{id} =useParams()

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

    // param id 
    console.log(id)
  
    if(id == "maths123") {

      fetch('https://opentdb.com/api.php?amount=10&category=18&type=multiple')
      .then(response => response.json())
      .then(data => {
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
      })
      .catch(error => console.error('Error fetching trivia data:', error));

    }else if(id =="science123"){
     fetch('https://opentdb.com/api.php?amount=10&category=19&type=multiple')
      .then(response => response.json())
      .then(data => {
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
      })
      .catch(error => console.error('Error fetching trivia data:', error));

    }else{
      fetch('https://opentdb.com/api.php?amount=10&category=23&type=multiple')
      .then(response => response.json())
      .then(data => {
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
      })
      .catch(error => console.error('Error fetching trivia data:', error));
      
    }
    
      
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(prevTime => prevTime - 1);
      } else {
        handleSubmit();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

      //object for useNavigate
  const navigate=useNavigate()

  const indexOfLastQuestion = currentPage * questionsPerPage;
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

  const correctAnswersCount = triviaData.reduce((acc, question) => {
    const selectedAnswer = selectedAnswers[question.question];
    if (selectedAnswer === question.correct_answer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  // mark sheet

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  //create an object to store datas from input
  const [userData, setUser] = useState({
    subject: id,
    questions: 10,
    date: currentDate,
    uid: userid,
    correctAnswersCount: 0 
  });

  useEffect(() => {
    setUser(prevUserData => ({
      ...prevUserData,
      correctAnswersCount: correctAnswersCount
    }));
  }, [correctAnswersCount]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowResults(true);
    console.log(correctAnswersCount)
    const response = await addMarks(userData)

    if (response.status == 200) {
      console.log(response.data.message);

    } else {
      console.log(response.response.data)

    }
  };

  const handleClose = () => {
    setShowResults(false);
    navigate('/dashboard')

  };
  return (
    <>
      <div className='gradient' >
      <MDBContainer fluid >

      <MDBRow className='d-flex justify-content-center align-items-center h-100'>
        <MDBCol col='12'>



      <MDBCard className=' my-5 mx-auto bg-white cardss' style={{backgroundColor:"rgba(255,255,255,0.55)",maxWidth:"86%"
      }}>

      <MDBCardBody className='p-5 w-100 d-flex flex-column mt-1' style={{boxShadow:'0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)'}}>
        <div>
          <h2>NEET Questions</h2>
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
          <div style={{ marginTop: '10px' }} className="d-flex justify-content-center space-evenly">
            {currentPage > 0 && (
              <button className="bg-info btn text-white" onClick={paginatePrev}>Previous</button>
            )}
            {currentPage < Math.ceil(triviaData.length / questionsPerPage) - 1 && (
              <button className="bg-success btn text-white ms-4" onClick={paginateNext}>Next</button>
            )}
            <button className="bg-danger btn text-white ms-4" onClick={handleback} >Quit</button>
            {currentPage === Math.ceil(triviaData.length / questionsPerPage) - 1 && (
              <button className="bg-primary btn text-white ms-4" onClick={handleSubmit}>Submit</button>
            )}
          </div>
          <Modal show={showResults} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-dark">Results</Modal.Title>
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
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>

        </MDBCardBody>
      </MDBCard>
          <Modal className='deleteModal' show={isShow} onHide={initModal}>

            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body><h5 className='text-center text-dark b'>Are you sure to quit the test ?</h5></Modal.Body>
            <Modal.Footer >
              <Button variant="secondary" style={{ borderRadius: '10px',
              backgroundColor:"red",color:"white",marginLeft:"-50px"}} onClick={() =>  setInvokeModal(false)}>Close</Button>
              <Button variant="primary" style={{ borderRadius: '10px',
              backgroundColor:"green",color:"white"}} onClick={confirmQuit}>Confirm</Button>
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