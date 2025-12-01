import React from 'react'
import './App.css'
import Signup from './pages/signup'
import Dashboard from './pages/Dashboard'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ToastContainer,toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"

const App = () => {
  return (
    <>
    <ToastContainer/>
    <Router>
      <Routes>
        <Route path='/' element={<Signup/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
