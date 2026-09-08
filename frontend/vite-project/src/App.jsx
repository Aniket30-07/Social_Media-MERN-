import './App.css'
import Login from './pages/Login.jsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to="/login" replace />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/home' element={<Home/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
