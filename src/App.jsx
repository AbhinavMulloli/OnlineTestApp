import './App.css'
import {Route, Routes } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';


export default function App() {
  return (
  <Routes>
    <Route path="/" element={ <Login />}></Route>
     <Route path="/register" element={ <Register />}></Route>
  </Routes>
  )
}
