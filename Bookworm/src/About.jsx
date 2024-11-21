import logo from './logo.svg'
import img1 from './assets/Abhi_img.jpg'
import img2 from './assets/Advay_img.jpg'
import img3 from './assets/Abhijna_img.jpg'
import { Link } from 'react-router-dom'; 
import './App.css'

function About(){
  return (
    <div>
      <nav className="navbar">
        <img src={logo} className="logo"/>
        <div className="nav-login">
          <h3 className="login-text">About us</h3>
          <a href='https://github.com/Abhiii2904/Bookmark'><h3 className="login-text">Github</h3></a>
          <Link to='/Login'>
            <h3 className="login-text">Login</h3>
          </Link>
        </div>
      </nav>

      <div className="about-box">
          <div>
            <img src={img1} className='abt-img'></img>
            <p className='al'>Abhinandan. S</p>
            <p className='al'>PES1UG23AM013</p>
            <p className='al'>B. Tech in CSE & AIML</p>
          </div>
          <div>
            <img src={img2} className='abt-img'></img>
            <p className='al'>Advay Pervatikar</p>
            <p className='al'>PES1UG23AM027</p>
            <p className='al'>B. Tech in CSE & AIML</p>
          </div>
          <div>
            <img src={img3} className='abt-img'></img>
            <p className='al'>Abhijna </p>
            <p className='al'>PES1UG23AM011</p>
            <p className='al'>B. Tech in CSE & AIML</p>
          </div>
      </div>

    </div>

  )
}

export default About;
