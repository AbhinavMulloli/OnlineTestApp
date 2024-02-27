import './App.css'
import {Route, Routes,Navigate } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import Question from './Components/Questions/Question';
import ForgetPass from './Components/Forgetpassword/ForgetPass';
import UpdatePass from './Components/Forgetpassword/UpdatePass';
import Report from './Components/Reports/Report';
import Competition from './Components/Competitions/Competition';

export default function App() {
  return (
  <Routes>
    <Route path="/" element={ <Login />}></Route>
     <Route path="/register" element={ <Register />}></Route>
    <Route path="/dashboard" element={<ProtectedRoutes><Dashboard/></ProtectedRoutes>}></Route>
    <Route path="/questions/:id" element={ <Question />}></Route>
    <Route path="/forgetpass" element={ <ForgetPass />}></Route>
    <Route path="/updatepass/:id" element={ <UpdatePass />}></Route>
    <Route path="/report" element={ <Report />}></Route>
    <Route path="/competition" element={ <Competition />}></Route>
  </Routes>
  )
}
export function ProtectedRoutes(props){
  if(localStorage.getItem('email')){
    return props.children
  }
  else{
    return <Navigate to="/"/>
  }
}
