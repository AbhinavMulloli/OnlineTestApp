 import React, { useState } from 'react';
 import { ToastContainer, toast } from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';
 import { Link, useNavigate, useParams } from 'react-router-dom';
 import { BsPersonCircle} from 'react-icons/bs'
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
import { Updatepassword } from '../../service/allapi';

 function UpdatePass() {


 const{id} =useParams()


 const [focus,setFocus] = useState({
   errName : false,
   errEmail : false,
   errPass : false
 })

   //create an object to store datas from input
   const [userData, setUser] = useState({
    psw:"",
    cpsw: "",
    id:id

   })
     //object for useNavigate
 const navigate=useNavigate()
    // a function to update userdata when user enter the input in html
 const userDetails = (e) => {
   //prevent the event
   e.preventDefault()
   //access value to update in userData
   const { value } = e.target
   //access key to update in userData
   const key = e.target.name
   //update the data with existing data
   setUser({ ...userData, [key]: value })

 }

 const handleSubmit = async (e) => {
   e.preventDefault()
   const { psw,id,cpsw } = userData
   if (psw === "") {
     toast.error('Enter valid password')
   }
   if (cpsw === "") {
     toast.error('Confirm password requierd')
   }
   else if (psw !== cpsw)
   {
     toast.error('Password does not match')
   }

   else {

     //api call
     const response = await Updatepassword(userData)
     if(response.status==200){
       toast.success(response.data.message);
         setTimeout(()=> {
           navigate('/')
         }, 1500);


     //reset all states datas
     setUser({
       psw: "",
       cpsw: ""

     })

     }else{
       toast.error(response.data.message);
     }

   }
   }

   return (
     <div>
        <div className="gradient" >
       <MDBContainer fluid >
       <div className='header-right ' style={{marginLeft:"91%"}}>

           <Link ><BsPersonCircle  className='icon mt-5'/></Link> 
        </div>

 <MDBRow className='d-flex justify-content-center align-items-center h-100'>
   <MDBCol col='12'>


          <MDBCard className=' my-5 pageb mx-auto border  bg-white' style={{backgroundColor:"rgba(255,255,255,0.55)",
    borderRadius: '13px', maxWidth: '430px',maxHeight:'515px', boxShadow:'0 10px 16px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.22)',
    }}>
       <MDBCardBody className='p-5 w-100 d-flex flex-column mb-5'>

     <h2 className=" mb-5 text-center" style={{color:'black',marginTop:"-5%"}}>Update Password</h2>

     <label className='  mb-3 ms-1' style={{ color: 'black' }} ><b>Enter New Password</b></label>
     <div>
        <input required  pattern='^(?=.*\d).{8,}$' onBlur={()=>setFocus({...focus,errPass : true})} focus ={focus.errPass.toString()} 
        className='form-control mb-3 w-100' onChange={userDetails} name='psw' placeholder='Password' id='formControl' type='password' size="lg"/>
        <span className='ms-2 spa'>Password must have minimum 8 characters</span>
          </div>
           <div>
              <input required  pattern='^(?=.*\d).{8,}$' onBlur={()=>setFocus({...focus,errPass : true})} focus ={focus.errPass.toString()} 
              className='form-control mb-3 w-100' onChange={userDetails} name='cpsw' placeholder='Confirm Password' id='formControls' type='password' size="lg"/>
              <span className='ms-2 spa'>Password must have minimum 8 characters</span>
                 </div>


     <button size='lg' className='btn btn-primary  p-2 text-center mt-3  ' style={{borderRadius:'5px',backgroundColor:"green",color:"white"}} onClick={handleSubmit}>
       Confirm
     </button>

     <hr className="my-2" />


   </MDBCardBody>
 </MDBCard>

 </MDBCol>
 </MDBRow>

 </MDBContainer>

 </div>
 <ToastContainer position="top-center" />
 </div>
   )
 }

 export default UpdatePass