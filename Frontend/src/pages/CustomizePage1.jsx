import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';
import aiGif from '../assets/ai.gif';
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.jpg';
import image2_1 from '../assets/image2 (1).jpg';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.jpeg';
import image7 from '../assets/image7.jpeg';

const aiFaces = [
  { id: 1, name: 'Om', image: aiGif, color: 'from-red-500 to-orange-500' },
  { id: 2, name: 'Aniket', image: image1, color: 'from-green-500 to-teal-500' },
  { id: 3, name: 'Cyber', image: image2, color: 'from-blue-500 to-purple-500' },
  { id: 4, name: 'Gunjan', image: image2_1, color: 'from-purple-500 to-pink-500' },
  { id: 5, name: 'Quantum', image: image4, color: 'from-yellow-500 to-red-500' },
  { id: 6, name: 'Atharva', image: image5, color: 'from-indigo-500 to-blue-500' },
  { id: 7, name: 'Krishna', image: image6, color: 'from-yellow-500 to-red-500' },
  { id: 8, name: 'Mahesh', image: image7, color: 'from-yellow-500 to-red-500' }
];

function CustomizePage1() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserDataContext);
  const [selectedFace, setSelectedFace] = useState(null);
  const [isSpeechAllowed, setIsSpeechAllowed] = useState(false);
  const [voices, setVoices] = useState([]);
  const [customImage, setCustomImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('faces'); // 'faces' or 'projects'

  useEffect(() => {
    // Check speech synthesis availability
    const checkSpeechSupport = () => {
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          if (availableVoices.length > 0) {
            setVoices(availableVoices);
            setIsSpeechAllowed(true);
            // Welcome message for customization page 1
            speakText("Welcome to AI customization. Please select my face from the predefined options or upload your own image, then press the Next button.");
          }
        };
        
        loadVoices();
        if (voices.length === 0) {
          window.speechSynthesis.onvoiceschanged = loadVoices;
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
    
    const voice = voices.find(v => v.lang.startsWith('en') && 
      (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google'))) || voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleFaceSelect = (face) => {
    setSelectedFace({ ...face, isCustom: false });
    setCustomImage(null); // Clear custom image when selecting a predefined face
    
    // Optional: Speak confirmation
    if (isSpeechAllowed) {
      speakText(`You selected ${face.name} face. If you're satisfied, press Next to continue.`);
    }
  };

  const handleCustomImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setCustomImage(imageUrl);
        setSelectedFace({
          id: 'custom',
          name: 'Custom',
          image: imageUrl,
          color: 'from-purple-500 to-pink-500',
          isCustom: true
        });
        
        setIsUploading(false);
        
        if (isSpeechAllowed) {
          speakText("Custom image uploaded successfully. Press Next to continue.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!selectedFace) {
      if (isSpeechAllowed) {
        speakText("Please select a face first before proceeding.");
      }
      return;
    }

    // Save selected face to user data
    setUserData(prev => ({
      ...prev,
      assistantImage: selectedFace.image,
      assistantFaceName: selectedFace.name,
      isCustom: selectedFace.isCustom
    }));

    if (isSpeechAllowed) {
      speakText("Face selected successfully. Now you will be redirected to name your AI assistant.");
    }

    setTimeout(() => {
      navigate('/customize-2');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Customize Your AI Assistant
          </h1>
          <p className="text-gray-400">Step 1: Select AI Personality & Appearance</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-blue-600 flex items-center justify-center font-bold">
              1
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-gray-600"></div>
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
              2
            </div>
          </div>
        </div>

        {/* Voice Instructions */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <span className="text-xl">🎙️</span>
            </div>
            <div>
              <h3 className="font-bold text-purple-300">Voice Guidance Active</h3>
              <p className="text-sm text-gray-400">Listen for audio instructions to navigate this page</p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800/50 rounded-xl p-1">
            <button 
              onClick={() => {
                setActiveTab('faces');
                if (isSpeechAllowed) {
                  speakText("Showing AI faces selection.");
                }
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'faces' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              AI Faces
            </button>
            <button 
              onClick={() => {
                setActiveTab('projects');
                if (isSpeechAllowed) {
                  speakText("You can visit the websites like online Chicken Delivery app, GameHub, Python Course, SQL Course, C/C++ course, LinkedIn Clone, Singgers App, Sikkim Travel APP, Formula Hub, Cyber Hub, Typing Master, Little Learners Hub.");
                }
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'projects' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : 'hover:bg-gray-700/50'
              }`}
            >
              My Projects
            </button>
          </div>
        </div>

        {activeTab === 'faces' && (
          <>
            {/* Upload Custom Image Section */}
            <div className="mb-12 bg-gray-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 text-center">Or Upload Your Own Image</h2>
              <div className="flex flex-col items-center">
                <label className="cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 py-3 rounded-xl font-bold transition-all mb-4">
                  {isUploading ? 'Uploading...' : 'Choose Image from Device'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCustomImageUpload}
                    className="hidden" 
                  />
                </label>
                <p className="text-gray-400 text-sm text-center max-w-md">
                  Select an image from your computer or mobile device to use as your AI assistant's face
                </p>
              </div>
            </div>

            {/* AI Faces Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {aiFaces.map((face) => (
                <div
                  key={face.id}
                  onClick={() => handleFaceSelect(face)}
                  className={`bg-gray-900/50 backdrop-blur-xl border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedFace?.id === face.id && !selectedFace?.isCustom
                      ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 hover:border-purple-500/50'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-purple-500/30">
                      <img
                        src={face.image}
                        alt={face.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {face.name}
                    </h3>
                    <div className={`h-2 rounded-full bg-gradient-to-r ${face.color} mb-4`}></div>
                    <p className="text-gray-400 text-sm">
                      Advanced AI Personality with {face.name}-style interface
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'projects' && (
          <div className="mb-12 bg-gray-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-purple-300">My Projects</h2>
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">1) Online Chicken Delivery App</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2026/01/online-chicken-delivery-app.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Online Chicken Delivery App website")}
                >
                  https://krishnablogy.blogspot.com/2026/01/online-chicken-delivery-app.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">2) GameHub</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2026/01/gamehub.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening GameHub website")}
                >
                  https://krishnablogy.blogspot.com/2026/01/gamehub.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">3) Python Course</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/12/python-programming-course.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Python Course website")}
                >
                  https://krishnablogy.blogspot.com/2025/12/python-programming-course.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">4) SQL Course</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/12/sql-course.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening SQL Course website")}
                >
                  https://krishnablogy.blogspot.com/2025/12/sql-course.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">5) C/C++ Course</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/12/cc-language-course-codes.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening C/C++ Course website")}
                >
                  https://krishnablogy.blogspot.com/2025/12/cc-language-course-codes.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">6) LinkedIn Clone</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/11/linkedin-clone.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening LinkedIn Clone website")}
                >
                  https://krishnablogy.blogspot.com/2025/11/linkedin-clone.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">7) Singgers App</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/09/singgers-app.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Singgers App website")}
                >
                  https://krishnablogy.blogspot.com/2025/09/singgers-app.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">8) Sikkim Travel APP</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/09/sikkim-travel-app.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Sikkim Travel APP website")}
                >
                  https://krishnablogy.blogspot.com/2025/09/sikkim-travel-app.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">9) Formula Hub</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/09/formula-hub.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Formula Hub website")}
                >
                  https://krishnablogy.blogspot.com/2025/09/formula-hub.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">10) Cyber Hub</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/09/cyber-hub-learners.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Cyber Hub website")}
                >
                  https://krishnablogy.blogspot.com/2025/09/cyber-hub-learners.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">11) Typing Master</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/08/typing-master-lerners.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Typing Master website")}
                >
                  https://krishnablogy.blogspot.com/2025/08/typing-master-lerners.html
                </a>
              </div>
              
              <div className="p-4 bg-gray-800/50 rounded-xl border border-purple-500/30">
                <h3 className="font-bold text-lg text-blue-300 mb-2">12) Little Learners Hub</h3>
                <a 
                  href="https://krishnablogy.blogspot.com/2025/08/little-lerners-hub.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-300 hover:text-purple-100 underline break-all"
                  onClick={() => isSpeechAllowed && speakText("Opening Little Learners Hub website")}
                >
                  https://krishnablogy.blogspot.com/2025/08/little-lerners-hub.html
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleNext}
            disabled={!selectedFace}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedFace
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/20'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedFace ? 'Next: Name Your AI' : 'Select a Face First'}
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg transition-all"
          >
            Skip Customization
          </button>
        </div>

        {/* Selected Face Preview */}
        {selectedFace && (
          <div className="mt-8 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-500">
                <img
                  src={selectedFace.image}
                  alt={selectedFace.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-400">
                  Selected: {selectedFace.name}{selectedFace.isCustom ? ' (Custom)' : ''}
                </h3>
                <p className="text-gray-400">
                  {selectedFace.isCustom 
                    ? 'Your custom AI assistant appearance' 
                    : 'Your AI assistant will use this appearance'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomizePage1;