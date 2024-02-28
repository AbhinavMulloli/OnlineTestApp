import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsPersonCircle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
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
} from 'mdb-react-ui-kit';
import "./Register.css";
import { registerUser } from '../../service/allapi';

function Register() {
  //for validation
  const [focus, setFocus] = useState({
    errName: false,
    errEmail: false,
    errPass: false
  });

  const [userData, setUser] = useState({
    uname: "",
    email: "",
    psw: "",
    isPremium:"no"
  });
  //object for useNavigate
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
    const { uname, email, psw } = userData;
    if (uname === "") {
      toast.error('username required');
    } else if (email === "") {
      toast.error('email required');
    } else if (psw === "") {
      toast.error('password required');
    } else {
      const response = await registerUser(userData);
      if (response.status === 201) {
        if (response.data.message === "Registration successful") {
          toast.success(response.data.message);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        } else {
          toast.error(response.data.message);
        }
        setUser({
          uname: "",
          email: "",
          psw: ""
        });
      } else {
        toast.error(response.data.message);
      }
    }
  };

  return (
    <div className="gradient">
      <div>
        <MDBContainer fluid style={{ marginTop: "1px" }}>
          <div className='header-right' style={{ marginLeft: "91%", marginTop: "-2px" }}>
            <Link><BsPersonCircle className='icon mt-5' /></Link>
          </div>
          <MDBRow className='d-flex justify-content-center align-items-center '>
            <MDBCol col='12'>
              <MDBCard className=' my-5 pageb mx-auto border  bg-white' style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                borderRadius: '13px', maxWidth: '430px', maxHeight: '510px', boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)',
              }}>
                <MDBCardBody className='p-5 w-100 d-flex flex-column mt-1'>
                  <h2 className=" mb-4 text-center " style={{ color: 'black', marginTop: "-5%" }}>Register</h2>
                  <div>
                    <input
                      required
                      onBlur={() => setFocus({ ...focus, errName: true })}
                      focus={focus.errName.toString()}
                      pattern='^[A-Za-z0-9].{2,16}'
                      className='form-control mb-3  w-100'
                      onChange={userDetails}
                      name='uname'
                      placeholder='User Name'
                      id='formCont'
                      type='text'
                      size="lg"
                    />
                    <p className='ms-2 spa'>Username Should have 3-16 characters</p>
                  </div>
                  <div>
                    <input
                      required
                      onBlur={() => setFocus({ ...focus, errEmail: true })}
                      focus={focus.errEmail.toString()}
                      className='form-control mb-3  w-100'
                      onChange={userDetails}
                      name='email'
                      placeholder='Email address'
                      id='formC'
                      type='email'
                      size="lg"
                    />
                     <p className='ms-2 spa'>Enter a valid email id</p>
                  </div>
                  <div>
                    <input
                      required
                      onBlur={() => setFocus({ ...focus, errPass: true })}
                      focus={focus.errPass.toString()}
                      pattern='^(?=.*\d).{8,}$'
                      className='form-control mb-3  w-100'
                      onChange={userDetails}
                      name='psw'
                      placeholder='Password'
                      id='fo'
                      type='password'
                      size="lg"
                    />
                    <p className='ms-2 spa'>Password must have minimum 8 characters</p>
                  </div>
                  <p className="medium mb-1  pb-lg-3 text-center"><a style={{ textDecoration: 'none', color: 'orange' }} href="/">Back to Login</a></p>
                  <button
                    size='lg'
                    className='btn btn-primary  p-2 text-center '
                    style={{ borderRadius: '5px', backgroundColor: "green", color: "white" }}
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                  <hr className="my-3" />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
      <ToastContainer autoClose={1400} position="top-center" />
    </div>
  );
}

export default Register;