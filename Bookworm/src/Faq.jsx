import logo from './logo.svg'
import img from './assets/Reader-NoSideBar.svg'
import { Link } from 'react-router-dom'; 
import './App.css'

function App(){
  return (
    <div>
      <Link to='/'>
        <img src={logo} className="logo2"/>
      </Link>

      <div className="faq-box">
        <div className='feature-list'>
          <h2 className='fah'>Frequently Asked Questions:</h2>
          <br/>
          <div>
            <p className='fah'>1. What is an ePUB reader?</p>
            <p className='fal'>An EPUB reader is a digital tool that allows you to read eBooks in the EPUB format, which is a widely-used, open standard for eBooks.</p>
            <p className='fah'>2. Is it free?</p>
            <p className='fal'>Yes, our EPUB reader is completely free to use. There are no hidden costs or subscriptions required.</p>
            <p className='fah'>3. Do I need to create an account to use the reader?</p>
            <p className='fal'>Yes, our reader allows you to maintain a digital library, and an account is needed to access additional features</p>
          </div>
        </div>
      </div>

    </div>

  )
}

export default App
