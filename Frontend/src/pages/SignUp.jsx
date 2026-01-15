import React, { useContext, useState } from 'react';
import bg from "../assets/authBg.png";
import { FaEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import axios from 'axios';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    
    // Password validation
    if (password.length < 9) {
      setErr("Password must be at least 9 characters long");
      return;
    }

    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      
      setUserData(result.data);
      navigate("/signin"); // Navigate to signin after successful signup
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form 
        className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' 
        onSubmit={handleSignUp}
      >
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Register to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>
        
        <input 
          type="text" 
          placeholder='Enter your Name' 
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' 
          required 
          onChange={(e) => setName(e.target.value)} 
          value={name}
        />
        
        <input 
          type="email" 
          placeholder='Enter Your Email' 
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' 
          required 
          onChange={(e) => setEmail(e.target.value)} 
          value={email}
        />
        
        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder='Password (min 9 characters)' 
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]' 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            minLength={9}
          />
          {!showPassword ? (
            <FaEye 
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' 
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <FaRegEyeSlash 
              className='absolute top-[18px] right-[20px] w-[25px] h-[25px] text-white cursor-pointer' 
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        
        {err && <p className='text-red-500 text-[17px]'>*{err}</p>}
        
        <button 
          className={`min-w-[150px] h-[60px] mt-[30px] font-semibold rounded-full text-[19px] ${
            password.length < 9 ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-black'
          }`}
          disabled={loading || password.length < 9}
          type="submit"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        
        <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signin")}>
          Already have an account? <span className='text-blue-400 cursor-pointer'>Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;