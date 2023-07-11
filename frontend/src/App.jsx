import React, { useContext } from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { AuthContext } from './contexts/AuthContext'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Publish from './pages/Publish'
import Blog from './pages/Blog'
import './App.css'
const App = () => {
  const {authState} = useContext(AuthContext)
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/signup" element={!authState? <Signup/> : <Navigate to="/"/>} />
          <Route path="/login" element={!authState? <Login/> : <Navigate to="/"/>} />
          {/* <Route path="/write" element={authState? <Publish/> : <Navigate to="/login"/>} /> */}
          <Route path="/write" element={<Publish/>} />
          <Route path="/read/:blogId" element={authState? <Blog/> : <Navigate to="/login"/>}/> 
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App