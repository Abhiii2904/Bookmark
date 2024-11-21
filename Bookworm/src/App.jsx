import { useState } from 'react'
import {BrowserRouter, Routes,  Route} from "react-router-dom";
import Home from './home.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import './App.css'

function App(){
  return (
    <div> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Home />}></Route>
          <Route path="/Login" element = {<Login />}></Route>
          <Route path="/Signup" element = {<Signup />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
