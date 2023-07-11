import React, {useContext} from 'react'
import {Link, Navigate} from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

const Navbar = () => {
    const {authState, authDispatch} = useContext(AuthContext)
  return (
    <nav className="header">
       <div className="logo">
        Exchange
       </div>
       <div className="links">
       {authState ? (
        <>
        <button className='logout' onClick={()=>authDispatch({type:'logout'})}>Logout</button>
        <Link to="/write">Publish</Link>
        </>
       ): 
       <>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
       </>
      }
       </div>
    </nav>
  )
}

export default Navbar