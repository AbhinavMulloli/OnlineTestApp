import './App.css'
import {Route, Routes } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import Question from './Components/Questions/Question';

export default function App() {
  return (
  <Routes>
    <Route path="/" element={ <Login />}></Route>
     <Route path="/register" element={ <Register />}></Route>
    <Route path="/dashboard" element={ <Dashboard />}></Route>
    <Route path="/questions/:id" element={ <Question />}></Route>
  </Routes>
  )
}
