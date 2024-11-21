import { useState } from 'react'
import {BrowserRouter, Routes,  Route} from "react-router-dom";
import Home from './Home.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import About from './About.jsx'
import Faq from './Faq.jsx'
import Reader from './Reader.jsx'
import './App.css'

function App(){
  return (
    <div> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<Home />}></Route>
          <Route path="/Login" element = {<Login />}></Route>
          <Route path="/Signup" element = {<Signup />}></Route>
          <Route path="/About" element = {<About />}></Route>
          <Route path="/Faq" element = {<Faq />}></Route>
          <Route path="/Reader" element = {<Reader />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  )
}

export default App
