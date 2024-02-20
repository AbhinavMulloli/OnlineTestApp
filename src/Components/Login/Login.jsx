import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
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
import { BsPersonCircle } from 'react-icons/bs';
import { loginUser } from '../../service/allapi';

function Login() {
  const [focus, setFocus] = useState({
    errName: false,
    errEmail: false,
    errPass: false
  });

  const [userData, setUser] = useState({
    email: "",
    psw: ""
  });

  const navigate = useNavigate();

  const userDetails = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const key = e.target.name;
    setUser({ ...userData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, psw } = userData;

    if (email === "") {
      toast.error('email required');
    } else if (psw === "") {
      toast.error('password required');
    } else {
      const response = await loginUser(userData);

      if (response.status === 200) {
        console.log(response.data);
        if (response.data.message === "Login successful") {
          localStorage.setItem("email", email);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('id', response.data.id);
          toast.success(response.data.message);
          setTimeout(() => {
            navigate('dashboard');
          }, 1500);
        } else {
          toast.error(response.data.message);
        }

        setUser({
          email: "",
          psw: ""
        });
      } else {
        toast.error(response.data.message);
      }
    }
  };

  return (
    <div className='gradient'>
      <MDBContainer fluid>
        <MDBRow className='d-flex justify-content-center align-items-center h-100'>
          <MDBCol col='12'>
            <div className='header-right' style={{ marginLeft: "91%", marginTop: "2px" }}>
              <Link><BsPersonCircle className='icon' /></Link>
            </div>

            <MDBCard className=' my-5 pageb  mx-auto border bg-white' style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              borderRadius: '13px', maxWidth: '430px', maxHeight: '512px', boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)',
              marginBottom: "200px"
            }}>
              <MDBCardBody className='p-5 w-100 d-flex flex-column mt-1'>
                <h2 className=" mb-5 text-center" style={{ color: 'black', marginTop: "-5%" }}>Sign in</h2>
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
                <div>
                  <input
                    required
                    pattern='^(?=.*\d).{8,}$'
                    onBlur={() => setFocus({ ...focus, errPass: true })}
                    focus={focus.errPass.toString()}
                    className='form-control mb-3 w-100'
                    onChange={userDetails}
                    name='psw'
                    placeholder='Password'
                    id='formControl'
                    type='password'
                    size="lg"
                  />
                  <p className='ms-2 spa'>Password must have minimum 8 characters</p>
                  <p className="medium mb-2  pb-lg-3 text-center"><a style={{ textDecoration: 'none', color: 'orange' }} href="/forgetpass">Forgot password?</a></p>
                </div>

                <button
                  size='lg'
                  className='btn btn-primary  p-2 text-center'
                  style={{ borderRadius: '5px', backgroundColor: "green", color: "white" }}
                  onClick={handleSubmit}
                >
                  login
                </button>

                <hr className="my-3" />

                <div className="text-center mt-1">
                  <p style={{ color: 'black' }}>Not a member? <a href="/register" style={{ textDecoration: 'none', color: 'orange' }}>Register</a></p>
                </div>
              </MDBCardBody>
            </MDBCard>
            <ToastContainer autoClose={1400} position="top-center" />
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Login;