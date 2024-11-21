import React, { useState } from 'react';
import logo from './logo.svg';
import './Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

function Signup() {
  const[email, setEmail] = useState()
  const[name, setName] = useState()
  const[password, setPassword] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/signup',{name,email,password})
    .then(result => {console.log(result)
      navigate('/Login')
    })
    .catch(err=>console.log(err))
  }

  return (
    <div className='signup-page'>
      <div className='form'>
        <img src={logo} className='logoo' alt="Logo" />
        <form className='form-ele' method='POST' onSubmit={handleSubmit}>
          <div>
            <label className='label'>Email</label>
            <br />
            <input
              type='email' className='textbox' onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div>
            <label className='label'>Username</label>
            <br />
            <input
              type='text' className='textbox' onChange={(e)=>setName(e.target.value)}/>
          </div>
          <br />
          <div>
            <label className='label'>Password</label>
            <br />
            <input
              type='password' className='textbox' onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <br />
          <button type='submit' className='login-button'>Create account</button>
        </form>
        <br />
        <div className='create-account'>
          <Link to='/Login'>
            <p>Have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;