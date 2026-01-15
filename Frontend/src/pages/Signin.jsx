import React, { useContext, useState } from 'react';
import bg from "../assets/authBg.png";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Set default user data
    const guestData = {
      _id: "guest-" + Date.now(), // Unique ID for each guest session
      email: "guest@virtualassistant.com",
      name: "Guest User",
      isGuest: true,
      // Add any other default fields you need
    };
    setUserData(guestData);
    
    // Navigate after a small delay to show loading state
    setTimeout(() => {
      navigate("/customize");
      setLoading(false);
    }, 500);
  };

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{ backgroundImage: `url(${bg})` }}>
      <form 
        className='w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]' 
        onSubmit={handleContinue}
      >
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Welcome to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>
        
        {/* Removed email and password inputs since they're not needed */}
        
        <button 
          className={`min-w-[150px] h-[60px] mt-[30px] font-semibold rounded-full text-[19px] transition-all ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-100'
          }`}
          disabled={loading}
          type="submit"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </div>
          ) : (
            "Continue as Guest"
          )}
        </button>
        
        {/* Optional: Keep sign up link if you still want that functionality */}
        <p className='text-white text-[18px]'>
          Want personalized experience?{' '}
          <span 
            className='text-blue-400 cursor-pointer hover:underline' 
            onClick={() => !loading && navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}

export default SignIn;