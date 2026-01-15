import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import aiGif from '../assets/ai.gif';

function Login() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);
  const [isGuest, setIsGuest] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSpeechAllowed, setIsSpeechAllowed] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // Check speech synthesis availability
    const checkSpeechSupport = () => {
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          if (availableVoices.length > 0) {
            setVoices(availableVoices);
            setIsSpeechAllowed(true);
            // Welcome message - start with guest/login options first
            speakText("Welcome to login page, you can login and continue as a guest. Please do not use your personal Gmail and password, this is for only demo purpose. You can continue with random Gmail ID and password that is safe. I am here to guide or else assist you. This professional Website is made by Krishna Patil Rajput.");
            // Remove the listener after successful load
            window.speechSynthesis.onvoiceschanged = null;
            return true; // Indicate that voices were loaded
          }
          return false; // Indicate that voices were not loaded
        };
        
        // Try to load voices immediately
        let voicesLoaded = loadVoices();
        
        // Set up listener if voices are not loaded yet
        if (!voicesLoaded) {
          // Create a more robust voiceschanged listener
          const voicesChangedHandler = () => {
            const success = loadVoices();
            if (success) {
              // Clean up the listener after successful load
              window.speechSynthesis.onvoiceschanged = null;
            }
          };
          
          window.speechSynthesis.onvoiceschanged = voicesChangedHandler;
          
          // Additional backup: try multiple times to ensure voices load
          // Use a more systematic approach with exponential backoff
          for (let i = 1; i <= 20; i++) {
            setTimeout(() => {
              if (!isSpeechAllowed) {
                const success = loadVoices();
                if (success) {
                  window.speechSynthesis.onvoiceschanged = null;
                }
              }
            }, Math.min(100 * i, 1000)); // Gradually increase delay up to 1 second
          }
          
          // Final backup after 3 seconds
          setTimeout(() => {
            if (!isSpeechAllowed) {
              loadVoices();
            }
          }, 3000);
        }
      }
    };

    checkSpeechSupport();
  }, []);

  // Error boundary handler to catch extension-related errors
  useEffect(() => {
    const handleError = (event) => {
      // Filter for specific extension-related errors
      if (event.message && (event.message.includes('Could not establish connection') ||
          event.message.includes('Receiving end does not exist') ||
          event.message.includes('no-op fetch handler') ||
          event.message.includes('fetch handler'))) {
        console.warn('Extension communication error caught and suppressed:', event.message);
        // Prevent the error from propagating
        event.preventDefault && event.preventDefault();
        event.stopPropagation && event.stopPropagation();
        return false; // Explicitly return false to prevent default handling
      }
    };

    // Listen for unhandled errors
    window.addEventListener('error', handleError);
    
    // Listen for unhandled promise rejections
    const handlePromiseRejection = (event) => {
      if (event.reason && event.reason.message && (event.reason.message.includes('Could not establish connection') ||
          event.reason.message.includes('Receiving end does not exist') ||
          event.reason.message.includes('message channel closed') ||
          event.reason.message.includes('no-op fetch handler'))) {
        console.warn('Extension communication promise rejection caught and suppressed:', event.reason.message);
        event.preventDefault();
        return false; // Explicitly return false to prevent default handling
      }
    };
    
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || voices.length === 0) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    // Try to find a good voice
    const voice = voices.find(v => v.lang.startsWith('en') && 
      (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google'))) || voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (isGuest) {
      // Guest login
      const guestData = {
        name: 'Guest User',
        email: 'guest@example.com',
        isGuest: true,
        loginTime: new Date().toISOString()
      };
      setUserData(guestData);
      
      if (isSpeechAllowed) {
        speakText("Thank you for logging in as guest. Now you can customize your AI assistant.");
      }
      
      // Navigate to customize page 1
      setTimeout(() => {
        navigate('/customize-1');
      }, 2000);
    } else {
      // Regular login
      if (email && password) {
        const userData = {
          name: email.split('@')[0],
          email: email,
          isGuest: false,
          loginTime: new Date().toISOString()
        };
        setUserData(userData);
        
        if (isSpeechAllowed) {
          speakText("Thank you for logging in. Now you can customize your AI assistant.");
        }
        
        setTimeout(() => {
          navigate('/customize-1');
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-500/50">
            <img src={aiGif} alt="AI Assistant" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            KRISHNA's AI
          </h1>
          <p className="text-gray-400 text-sm mt-2">Please sign in to continue</p>
        </div>

        {!isGuest ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-600 to-blue-600 rounded-xl font-bold hover:from-red-700 hover:to-blue-700 transition-all active:scale-95"
            >
              Sign In
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsGuest(true)}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Continue as Guest
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-gray-400 mb-6">
              You'll be logged in as a guest. Your data will be saved locally.
            </p>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all active:scale-95 mb-4"
            >
              Continue as Guest
            </button>
            <button
              onClick={() => setIsGuest(false)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;