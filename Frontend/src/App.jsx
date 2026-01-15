import React, { useContext, useState, useEffect } from 'react'
import SignUp from './pages/SignUp'
import Signin from './pages/Signin'
import Login from './pages/Login'
import Home from './pages/Home'
import Customize from './pages/Customize'
import Customize2 from './pages/Customize2'
import CustomizePage1 from './pages/CustomizePage1'
import CustomizePage2 from './pages/CustomizePage2'
import axios from 'axios';
import { UserDataContext } from './Context/UserContext';
import { Navigate, Route, Routes } from 'react-router-dom';

// Removed unused API functions that were conflicting with component names

function App() {
  const {userData, setUserData, isLoading} = useContext(UserDataContext);
  
  // Show loading state while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Routes>
      <Route path='/' element={userData ? <Home/> : <Navigate to="/login"/>}/>
      <Route path='/home' element={userData ? <Home/> : <Navigate to="/login"/>}/>
      <Route path='/signup' element={!userData? <SignUp/> : <Navigate to={"/"}/>} />
      <Route path='/signin' element={!userData? <Signin/> : <Navigate to={"/"}/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/customize-1' element={userData? <CustomizePage1/> : <Navigate to={"/login"}/>} />
      <Route path='/customize-2' element={userData? <CustomizePage2/> : <Navigate to={"/login"}/>} />
      <Route path='/customize' element={userData? <Customize/> : <Navigate to={"/login"}/>} />
      <Route path='/customize2' element={userData? <Customize2/> : <Navigate to={"/login"}/>} />
    </Routes>
  )
}

export default App