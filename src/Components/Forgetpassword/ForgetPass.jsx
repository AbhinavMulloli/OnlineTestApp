import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,

} from 'mdb-react-ui-kit';
import { VerifyEmail } from '../../service/allapi';

function ForgetPass() {
  //for validation purpose
  const [focus, setFocus] = useState({
    errName: false,
    errEmail: false
  });

  const [userData, setUser] = useState({
    email: ""
  });

  const navigate = useNavigate();

  const userDetails = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const key = e.target.name;
    setUser({ ...userData, [key]: value });
  };
  //funtion for submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email } = userData;

    if (email === "") {
      toast.error('email required');
    } else {
      const response = await VerifyEmail(userData);
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate('/');
        }, 2000);
        setUser({
          email: ""
        });
      } else {
        toast.error(response.data.message);
      }
    }
  };

  return (
    <div>
      <div className="gradient">
        <MDBContainer fluid>
          <div className='header-right' style={{ marginLeft: "91%" }}>
            <Link><BsPersonCircle className='icon mt-5' /></Link>
          </div>
          <MDBRow className='d-flex justify-content-center align-items-center h-100'>
            <MDBCol col='12'>
              <MDBCard className=' my-5 pageb mx-auto border bg-white' style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderRadius: '13px', maxWidth: '430px', maxHeight: '516px', boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)',
              }}>
                <MDBCardBody className='p-5 w-100 d-flex flex-column mb-5'>
                  <h2 className=" mb-5 text-center" style={{ color: 'black', marginTop: "-3%" }}>Verify Email</h2>
                  <label className=' mb-3 ms-1' style={{ color: 'black' }}><b>Enter Your Email</b></label>
                  <div>
                    <input
                      required
                      onBlur={() => setFocus({ ...focus, errEmail: true })}
                      focus={focus.errEmail.toString()}
                      className='form-control mb-3  w-100'
                      onChange={userDetails}
                      name='email'
                      placeholder='Email address'
                      id='formControlLg'
                      type='email'
                      size="lg"
                    />
                     <p className='ms-2 spa'>Enter a valid email id</p>
                  </div>
                  <button
                    size='lg'
                    className='btn btn-primary  p-2 text-center mt-3'
                    style={{ borderRadius: '5px', backgroundColor: "green", color: "white" }}
                    onClick={handleSubmit}
                  >
                    Confirm
                  </button>
                  <a href="/">
                    <button
                      size='lg'
                      className='btn btn-primary  p-2 text-center mt-4'
                      style={{ borderRadius: '5px', width: "100%", backgroundColor: "green", color: "white" }}
                    >
                      Go Back
                    </button>
                  </a>
                  <hr className="my-2" />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default ForgetPass;