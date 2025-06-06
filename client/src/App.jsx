import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigationBar from './components/common/NavigationBar'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { Routes, Route } from 'react-router-dom'
import ForgotPassword from './components/auth/ForgotPassword'
import Home from './components/home/Home'

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <NavigationBar />
      <main className="w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/" element={<Home/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
