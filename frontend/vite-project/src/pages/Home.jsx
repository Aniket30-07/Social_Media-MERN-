import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosCalls/axios'

function Home() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout')
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <div className="min-h-screen relative p-4">
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {user && <span className="font-medium text-gray-700">Hi, {user.name || user.username}</span>}
        <button 
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>
      
      <div className="flex items-center justify-center min-h-[80vh]">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Home</h1>
      </div>
    </div>
  )
}

export default Home