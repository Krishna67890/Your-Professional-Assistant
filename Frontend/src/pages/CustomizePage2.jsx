import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../Context/UserContext';

function CustomizePage2() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserDataContext);
  const [aiName, setAiName] = useState(userData?.assistantName || 'JARVIS');
  const [isSpeechAllowed, setIsSpeechAllowed] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    let voicesLoaded = false;
    
    // Check speech synthesis availability
    const checkSpeechSupport = () => {
      if ('speechSynthesis' in window) {
        const loadVoices = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          if (availableVoices.length > 0 && !voicesLoaded) {
            setVoices(availableVoices);
            setIsSpeechAllowed(true);
            voicesLoaded = true;
            // Welcome message for customization page 2
            speakText("Welcome to the second step of customization. Please enter the name for your AI assistant, then press the Finish button.");
          }
        };
        
        loadVoices();
        if (voices.length === 0 && !voicesLoaded) {
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
    if (!('speechSynthesis' in window)) return;

    // Use available voices or try to get them
    const currentVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    
    if (currentVoices.length === 0) {
      // Voices may still be loading, set up a callback
      console.debug('No voices available in CustomizePage2, setting up voiceschanged listener');
      
      const handleVoicesChanged = () => {
        const retryVoices = window.speechSynthesis.getVoices();
        if (retryVoices.length > 0) {
          const retryUtterance = new SpeechSynthesisUtterance(text);
          retryUtterance.lang = 'en-US';
          
          const retryVoice = retryVoices.find(v => v.lang.startsWith('en') && 
            (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google'))) || retryVoices[0];
          
          if (retryVoice) retryUtterance.voice = retryVoice;
          retryUtterance.rate = 1.0;
          retryUtterance.volume = 1;
          
          if (!window.speechSynthesis.speaking) {
            window.speechSynthesis.speak(retryUtterance);
          }
          
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      
      // Also try again after a brief moment in case voices load quickly
      setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          handleVoicesChanged();
        }
      }, 50);
      
      return;
    }

    // Only speak if no speech is currently happening
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    
    const voice = currentVoices.find(v => v.lang.startsWith('en') && 
      (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Google'))) || currentVoices[0];
    
    if (voice) utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleFinish = () => {
    if (!aiName.trim()) {
      if (isSpeechAllowed) {
        speakText("Please enter a name for your AI assistant before finishing.");
      }
      return;
    }

    // Save AI name to user data
    setUserData(prev => ({
      ...prev,
      assistantName: aiName.trim()
    }));

    if (isSpeechAllowed) {
      speakText(`Great! Your AI assistant will now be known as ${aiName}. Enjoy your personalized experience.`);
    }

    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  const handleSkip = () => {
    if (isSpeechAllowed) {
      speakText("Skipping naming step. Your AI assistant will use the default name.");
    }

    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            Name Your AI Assistant
          </h1>
          <p className="text-gray-400">Step 2: Personalize Your Experience</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center font-bold text-white">
              1
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-blue-600 flex items-center justify-center font-bold text-white">
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

        {/* Name Input Section */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Choose a Name for Your AI</h2>
            <p className="text-gray-400">
              Give your AI assistant a personalized name that reflects its personality
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              AI Assistant Name
            </label>
            <input
              type="text"
              value={aiName}
              onChange={(e) => setAiName(e.target.value)}
              className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-purple-500 transition-colors text-center text-lg"
              placeholder="Enter AI name (e.g., JARVIS, FRIDAY, KRISHNA)"
            />
            
            <div className="mt-4 text-center">
              <p className="text-gray-500 text-sm">
                Current selection: <span className="text-purple-400 font-bold">{aiName || 'Default'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-blue-400 mb-2">Preview</h3>
            <div className="bg-black/30 rounded-xl p-6 inline-block">
              <div className="text-4xl mb-2">🤖</div>
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {aiName || ''}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                AI Assistant
              </div>
            </div>
            <p className="text-gray-400 mt-4">
              This is how your AI will be addressed in conversations
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleFinish}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-500/20"
          >
            Finish & Go to Home
          </button>
          
          <button
            onClick={handleSkip}
            className="px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold text-lg transition-all"
          >
            Skip & Use Default
          </button>
          
          <button
            onClick={() => navigate('/customize-1')}
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold text-lg transition-all"
          >
            Back to Face Selection
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-8 text-center">
          <h4 className="text-gray-400 font-bold mb-3">Popular Names</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {['JARVIS', 'FRIDAY', 'ALEXA', 'CORTANA', 'SIRI', 'KRISHNA', 'GUNJAN', 'OM'].map((name) => (
              <button
                key={name}
                onClick={() => setAiName(name)}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomizePage2;
