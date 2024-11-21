import React, { useState } from 'react';
import logo from './logo.svg';
import './Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function Signup() {
  const[email, setEmail] = useState()
  const[password, setPassword] = useState()
  const[error, setError] = useState()
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/login',{email,password})
    .then(result => {console.log(result)
      if(result.data === "Success"){
        navigate('/')
      }
      else{
        setError("Incorrect email or password.");
      }
    })
    .catch(()=>{
      setError("An error occurred. Please try again later.");
    })
  }

  return (
    <div className='signup-page'>
      <div className='form'>
        <img src={logo} className='logoo' alt="Logo" />
        <form className='form-ele' onSubmit={handleSubmit}>
          <div>
            <label className='label'>Email</label>
            <br />
            <input
              type='email' className='textbox' onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <br />
          <div>
            <label className='label'>Password</label>
            <br />
            <input
              type='password' className='textbox' onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <br />
          {error && <p className="error-message">{error}</p>}
          <br />
          <button type='submit' className='login-button'>Login</button>
        </form>
        <br />
        <div className='create-account'>
          <Link to='/Signup'>
            <p>Don't have an account?</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;