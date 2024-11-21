import logo from './logo.svg'
import img from './assets/Reader-NoSideBar.svg'
import { Link } from 'react-router-dom'; 
import './App.css'

function App(){
  return (
    <div>

      <nav className="navbar">
        <img src={logo} className="logo"/>
        <div className="nav-login">
          <Link to='/About'>
            <h3 className="login-text">About us</h3>
          </Link>
          <a href='https://github.com/Abhiii2904/Bookmark'><h3 className="login-text">Github</h3></a>
          <Link to='/Login'>
            <h3 className="login-text">Login</h3>
          </Link>
        </div>
      </nav>
      <div className='hero'>
        <h1>ePub Reader.</h1>
        <div className='container'>
          <span className='typed'>        
              <h2 className='text1'>Free. Open Source. Browser based.</h2>
          </span>
        </div>
      </div>

      <div className="feature-box">
        <div>
          <img src={img} className='img'></img>
        </div>
        <div className='feature-list'>
          <h2 className='fh'>Features:</h2>
          <div>
            <p className='fl'>1. Upload and import books</p>
            <p className='fl'>2. Reader progress</p>
            <p className='fl'>3. Global Search</p>
            <p className='fl'>4. Customize your books</p>
            <p className='fl'>5. Font style and weights</p>
            <p className='fl'>6. Text highlight options</p>
          </div>
        </div>
      </div>

    </div>

  )
}

export default App
