import axios from 'axios'
import React, {createContext, use, useState, useEffect} from 'react'
export const UserDataContext = createContext()

function UserContext({ children }) {
  const serverUrl="http://localhost:8000"
  
  // Check if backend is known to be unreachable (cache for 5 minutes)
  const isBackendUnreachable = () => {
    const unreachableData = localStorage.getItem('backend_unreachable');
    if (unreachableData) {
      const { timestamp } = JSON.parse(unreachableData);
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes in milliseconds
      return timestamp > fiveMinutesAgo;
    }
    return false;
  };
  
  // Mark backend as unreachable in localStorage
  const markBackendAsUnreachable = () => {
    localStorage.setItem('backend_unreachable', JSON.stringify({
      timestamp: Date.now()
    }));
  };
  
  // Initialize userData from localStorage to prevent flickering on page load
  const getInitialUserData = () => {
    const storedUserData = localStorage.getItem('guestUserData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.isGuest) {
          return parsedData;
        }
      } catch (e) {
        console.error('Error parsing stored user data:', e);
      }
    }
    return null;
  };
  
  const [userData, setUserDataState] = useState(getInitialUserData());
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom setter for userData that also saves to localStorage
  const setUserData = (data) => {
    setUserDataState(data);
    if(data === null) {
      // If setting to null (termination), clear all session data
      localStorage.removeItem('guestUserData');
    } else if(data?.isGuest) {
      localStorage.setItem('guestUserData', JSON.stringify(data));
    }
  };

  const handleCurrentUser = async () => {
    try {
      setIsLoading(true);
      
      // Check if backend is known to be unreachable
      if (isBackendUnreachable()) {
        // Skip API call if backend is marked as unreachable
        console.debug('Backend marked as unreachable recently, skipping API call');
        
        // Check for existing guest data
        const storedUserData = localStorage.getItem('guestUserData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData.isGuest) {
            setUserData(parsedData);
          }
        } else {
          // If no stored guest data, initialize with default guest data
          const defaultGuestData = {
            isGuest: true,
            name: 'Guest User',
            email: 'guest@example.com',
            assistantName: 'JARVIS',
            assistantImage: null,
            assistantFaceName: 'Default',
            isCustom: false
          };
          setUserData(defaultGuestData);
          localStorage.setItem('guestUserData', JSON.stringify(defaultGuestData));
        }
        setIsLoading(false);
        return;
      }
      
      // Check if we already have guest user data
      const storedUserData = localStorage.getItem('guestUserData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.isGuest) {
          setUserData(parsedData);
          setIsLoading(false);
          return; // Don't make API call for guest users
        }
      }
      
      const response = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true
      });
      setUserData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching current user:", error);
      
      // Check if it's a connection error (backend not running)
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.response?.status === 0) {
        console.info('Backend server not reachable. Marking as unreachable and using guest mode as fallback. You can still use the AI assistant functionality offline.');
        
        // Mark backend as unreachable to avoid repeated API calls
        markBackendAsUnreachable();
        
        // Check for existing guest data
        const storedUserData = localStorage.getItem('guestUserData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData.isGuest) {
            setUserData(parsedData);
          }
        } else {
          // If no stored guest data, initialize with default guest data
          const defaultGuestData = {
            isGuest: true,
            name: 'Guest User',
            email: 'guest@example.com',
            assistantName: 'JARVIS',
            assistantImage: null,
            assistantFaceName: 'Default',
            isCustom: false
          };
          setUserData(defaultGuestData);
          localStorage.setItem('guestUserData', JSON.stringify(defaultGuestData));
        }
      } else {
        // For other types of errors, try to use stored guest data
        const storedUserData = localStorage.getItem('guestUserData');
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          if (parsedData && parsedData.isGuest) {
            setUserData(parsedData);
          }
        }
      }
      
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl, userData, setUserData, frontendImage, setFrontendImage, backendImage, setBackendImage, selectedImage, setSelectedImage, isLoading
  }

  return (
    <div>
      <UserDataContext.Provider value={value}>
        {children}
      </UserDataContext.Provider>
    </div>
  )
}

export default UserContext