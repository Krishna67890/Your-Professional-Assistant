import React, { useContext, useState, useRef, useEffect } from 'react';
import { UserDataContext } from '../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import aiGif from '../assets/ai.gif';
import { HumanCommunicationGuide } from '../utils/HumanCommunicationGuide';

function Home() {
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('female');
  const [inputText, setInputText] = useState('');
  const [availableVoices, setVoices] = useState([]);
  const [activeTab, setActiveTab] = useState('live'); // 'live' or 'history'
  const [history, setHistory] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    autoPlay: true,
    voiceSpeed: 1.0,
    searchMode: 'direct' // 'direct' or 'search'
  });
  const [systemStatus, setSystemStatus] = useState({
    memory: 'Optimal',
    cpu: 'Stable',
    network: 'Connected'
  });
  const [quickCommands, setQuickCommands] = useState([
    { id: 1, command: 'play music', label: '🎵 Play Music', icon: '🎵' },
    { id: 2, command: 'search AI', label: '🔍 Search AI', icon: '🔍' },
    { id: 3, command: 'current time', label: '🕒 Time', icon: '🕒' },
    { id: 4, command: 'play latest songs', label: '🔥 Latest', icon: '🔥' },
    { id: 5, command: 'open youtube', label: '📺 YouTube', icon: '📺' },
    { id: 6, command: 'weather today', label: '☀️ Weather', icon: '☀️' }
  ]);
  const [isSpeechAllowed, setIsSpeechAllowed] = useState(true);

  const recognitionRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const commGuide = useRef(new HumanCommunicationGuide());
  const speechSynthesisRef = useRef({
    isSpeaking: false,
    utterance: null
  });
  const hasGreetedRef = useRef(false);

  const languages = {
    'en': { name: 'English', greeting: 'Hello Sir! I am ready to assist you.' },
    'hi': { name: 'Hindi', greeting: 'नमस्ते सर! मैं आपकी सहायता के लिए तैयार हूं।' },
    'mr': { name: 'Marathi', greeting: 'नमस्कार सर! मी तुमची मदत करण्यासाठी तयार आहे।' },
    'es': { name: 'Spanish', greeting: '¡Hola Señor! Estoy listo para ayudarte.' },
    'fr': { name: 'French', greeting: 'Bonjour Monsieur ! Je suis prêt à vous aider.' }
  };

  // Enhanced YouTube video database for direct play
  const youtubeVideos = {
    // Gaming channels - FIXED: Using correct video IDs
    'techno gamerz': 'UCE5Qk-Olz3LqLJj5wA8Rz0Q',
    'techno gamerz game on song': 'KQ6zr6kCPj8', // Actual gaming music mix
    'total gaming': 'UC7iMqMXKC1v6fTF7ZswfBug',
    'gaming with aj': 'UCYTxRc6xM5qLw2aF7HWKv8w',
    'mythpat': 'UCd_4yOQ4r8Xag5CJ35A7_QQ',

    // Music categories
    'latest songs': 'PLFgquLnL59alCl_2TQvOiD5Vgm1hCaGSI',
    'trending songs': 'PLDIoUOhQQPlXr63I_vwF9GD8sAKh77dWU',
    'bollywood songs': 'PLcRN7uK9CFp5Gv1pN3Hm1ZuF9Ck6lUw1q',
    'english songs': 'PL4fGSI1pDJn5rWIT4X2KXp5C2LujX6F9J',

    // Special videos
    'special video': 'Ilx_xJHuhAc',
    'gaming music': '5qap5aO4i9A', // Lofi hip hop radio
    'game on song': 'KQ6zr6kCPj8' // Gaming music mix
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, activeTab]);

  // Check speech synthesis availability
  useEffect(() => {
    let voicesLoaded = false;
    
    const checkSpeechSupport = () => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this browser');
        setIsSpeechAllowed(false);
        addAiMessage("Speech synthesis is not supported in your browser. Please use a modern browser like Chrome.", 'system');
        return;
      }
      
      // First, try to get voices immediately
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log(`Loaded ${voices.length} voices immediately`);
        setVoices(voices);
        setIsSpeechAllowed(true);
        voicesLoaded = true;
        return;
      }
      
      // If no voices available, set up the voiceschanged listener immediately
      console.warn('No voices available initially, setting up voiceschanged listener');
      const handleVoicesChanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0 && !voicesLoaded) {
          console.log(`Loaded ${availableVoices.length} voices via voiceschanged`);
          setVoices(availableVoices);
          setIsSpeechAllowed(true);
          voicesLoaded = true;
          window.speechSynthesis.onvoiceschanged = null; // Remove listener after successful load
        }
      };
      
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      
      // Also try to force voice loading by accessing the property multiple times
      setTimeout(() => {
        voices = window.speechSynthesis.getVoices();
        if (voices.length > 0 && !voicesLoaded) {
          console.log(`Loaded ${voices.length} voices on first timeout`);
          setVoices(voices);
          setIsSpeechAllowed(true);
          voicesLoaded = true;
          window.speechSynthesis.onvoiceschanged = null;
        }
      }, 100);
      
      // Additional attempts to load voices
      for (let i = 1; i <= 10; i++) {
        setTimeout(() => {
          if (!voicesLoaded) {
            voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
              console.log(`Loaded ${voices.length} voices on attempt ${i + 1}`);
              setVoices(voices);
              setIsSpeechAllowed(true);
              voicesLoaded = true;
              window.speechSynthesis.onvoiceschanged = null;
            }
          }
        }, i * 200);
      }
    };

    // Try to load voices immediately
    checkSpeechSupport();
    
    return () => {
      // Clean up voiceschanged listener if still set
      if (!voicesLoaded) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Load all data on component mount
  useEffect(() => {
    const loadInitialData = () => {
      // Load voices - IMPROVED LOADING
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoices(voices);
          setIsSpeechAllowed(true);
          return true;
        }
        return false;
      };
      
      // Try to load voices immediately
      if (!loadVoices()) {
        // If voices aren't loaded yet, wait for the voiceschanged event
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }

      // Load preferences
      const savedPrefs = localStorage.getItem('ai_assistant_prefs');
      if (savedPrefs) {
        try {
          const prefs = JSON.parse(savedPrefs);
          setUserPreferences(prefs);
          setSelectedLanguage(prefs.language || 'en');
          setIsLanguageSelected(!!prefs.language);
          setSelectedVoice(prefs.voice || 'female');
        } catch (e) {
          console.error('Error loading preferences:', e);
        }
      }

      // Load history
      const savedHistory = localStorage.getItem('ai_assistant_history');
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory);
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory.slice(0, 100)); // Limit to 100 entries
          }
        } catch (e) {
          console.error('Error loading history:', e);
        }
      }

      // Load quick commands
      const savedCommands = localStorage.getItem('ai_quick_commands');
      if (savedCommands) {
        try {
          setQuickCommands(JSON.parse(savedCommands));
        } catch (e) {
          console.error('Error loading commands:', e);
        }
      }

      // Load messages if exists
      const savedMessages = localStorage.getItem('ai_current_session');
      if (savedMessages) {
        try {
          setMessages(JSON.parse(savedMessages));
        } catch (e) {
          console.error('Error loading messages:', e);
        }
      }
    };

    loadInitialData();

    // Ensure voices are loaded even after component re-mounts
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoices(voices);
          setIsSpeechAllowed(true);
        }
      };
    }
  }, []);

  // Save data on changes
  useEffect(() => {
    const prefs = {
      ...userPreferences,
      language: selectedLanguage,
      voice: selectedVoice
    };
    try {
      localStorage.setItem('ai_assistant_prefs', JSON.stringify(prefs));
    } catch (e) {
      console.error('Error saving preferences:', e);
    }
  }, [userPreferences, selectedLanguage, selectedVoice]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_assistant_history', JSON.stringify(history));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('ai_current_session', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages:', e);
    }
  }, [messages]);

  // System greeting on refresh
  useEffect(() => {
    // Use a ref to track if the greeting has already been shown
    if (isLanguageSelected && !hasGreetedRef.current) {
      // Check if this is a new session after termination
      if (!userData || !userData?.assistantName) {
        // Show the termination prompt message
        const terminationMessage = {
          id: Date.now(),
          text: "Please write your name so I can assist you.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          type: 'system'
        };
        
        setMessages([terminationMessage]);
        hasGreetedRef.current = true;
        
        // Only speak if speech is allowed
        if (isSpeechAllowed) {
          setTimeout(() => speakTextIfAllowed(terminationMessage.text, selectedLanguage), 1000);
        }
      } else {
        // Regular greeting for returning users
        const aiName = userData?.assistantName || 'JARVIS';
        const greeting = commGuide.current.getGreeting('warm');
        const text = `${greeting} I'm ${aiName}, your advanced AI assistant. How may I assist you today?`;

        const initialMessage = {
          id: Date.now(),
          text: text,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString(),
          type: 'greeting'
        };

        // Only add to messages if it's truly a new session (empty messages)
        if (messages.length === 0) {
          setMessages([initialMessage]);
          hasGreetedRef.current = true;
        }
        
        // Only speak if speech is allowed
        if (isSpeechAllowed) {
          // Try to speak immediately if voices are loaded, otherwise wait
          if (availableVoices.length > 0) {
            setTimeout(() => speakTextIfAllowed(text, selectedLanguage), 1000);
          } else {
            // Wait a bit longer for voices to load
            setTimeout(() => {
              speakTextIfAllowed(text, selectedLanguage);
            }, 2000);
          }
        }
      }
    }
  }, [availableVoices, isLanguageSelected, userData, userData?.assistantName, isSpeechAllowed, messages.length]);

  // Speech recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
      }

      const langMap = {
        'hi': 'hi-IN',
        'mr': 'mr-IN',
        'es': 'es-ES',
        'fr': 'fr-FR',
        'en': 'en-US'
      };
      recognitionRef.current.lang = langMap[selectedLanguage] || 'en-US';
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('Recognized:', transcript);
        handleUserMessage(transcript);
        // Don't reset listening state immediately since continuous = true
        // setIsListening(false); // Reset listening state after processing
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        // Restart recognition if continuous mode is enabled and language is selected
        if (isLanguageSelected && recognitionRef.current && !isListening) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              setIsListening(true);
              console.log('Speech recognition restarted');
            } catch (e) {
              console.error('Error restarting speech recognition:', e);
              // If there's an error, try again after a longer delay
              setTimeout(() => {
                try {
                  if (isLanguageSelected && recognitionRef.current && !isListening) {
                    recognitionRef.current.start();
                    setIsListening(true);
                  }
                } catch (retryError) {
                  console.error('Retry failed to restart speech recognition:', retryError);
                }
              }, 3000);
            }
          }, 1000); // Restart after 1 second
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          addAiMessage("Please allow microphone access when prompted by your browser.", 'error');
        } else if (event.error === 'no-speech') {
          console.debug('No speech detected, continuing to listen');
          // Don't show a message for this, just continue listening
          // Restart recognition after a short delay
          setTimeout(() => {
            if (isLanguageSelected && recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start();
                setIsListening(true);
              } catch (e) {
                console.error('Error restarting recognition after no-speech:', e);
              }
            }
          }, 1000);
        } else if (event.error === 'audio-capture') {
          addAiMessage("Audio capture failed. Please check your microphone.", 'error');
        } else if (event.error === 'network') {
          addAiMessage("Network error occurred. Please check your internet connection.", 'error');
        } else if (event.error === 'service-not-allowed') {
          addAiMessage("Speech recognition service is not allowed. Please check your browser settings.", 'error');
        } else if (event.error === 'bad-grammar') {
          addAiMessage("Speech recognition grammar error. Please try again.", 'error');
        } else if (event.error === 'language-not-supported') {
          addAiMessage("Selected language is not supported for speech recognition.", 'error');
        } else {
          addAiMessage(`Speech recognition error: ${event.error}. Please try again.`, 'error');
        }
      };
      
      // Log that speech recognition is ready
      console.log('Speech recognition initialized and ready');
    } else {
      console.warn('Speech Recognition not supported in this browser');
      addAiMessage("Speech recognition is not supported in your browser. Please use Chrome or Edge.", 'system');
    }
  }, [selectedLanguage]);

  // Additional effect to ensure voices are loaded when component mounts
  useEffect(() => {
    const loadVoicesOnMount = () => {
      // Try to get voices multiple times as they may not be immediately available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && !isSpeechAllowed) {  // Only update if not already set
        setVoices(voices);
        setIsSpeechAllowed(true);
        return true; // Indicate success
      } else if (voices.length === 0 && !isSpeechAllowed) {
        // Set up listener for when voices become available
        window.speechSynthesis.onvoiceschanged = () => {
          const availableVoices = window.speechSynthesis.getVoices();
          if (availableVoices.length > 0 && !isSpeechAllowed) {
            setVoices(availableVoices);
            setIsSpeechAllowed(true);
            window.speechSynthesis.onvoiceschanged = undefined;
            return true; // Indicate success
          }
          return false; // Indicate failure
        };
      }
      return false; // Indicate failure
    };

    // Try multiple times to ensure voices are loaded
    for (let i = 0; i < 25; i++) {  // Increased attempts
      setTimeout(() => {
        const success = loadVoicesOnMount();
        if (success && window.speechSynthesis.onvoiceschanged) {
          window.speechSynthesis.onvoiceschanged = undefined; // Clean up listener
        }
      }, i * 80);  // Faster attempts
    }
    
    // Additional backup: Check if voices are loaded after a longer delay
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && !isSpeechAllowed) {
        setVoices(voices);
        setIsSpeechAllowed(true);
      }
    }, 3000); // 3 seconds delay as final backup
    
    // Final backup after 5 seconds
    setTimeout(() => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0 && !isSpeechAllowed) {
        setVoices(voices);
        setIsSpeechAllowed(true);
      }
    }, 5000); // 5 seconds delay as ultimate backup
  }, []);

  const speakText = (text, lang = selectedLanguage) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not available in this browser');
      return;
    }

    // Use the state voices instead of getting from API directly
    const currentVoices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    
    if (currentVoices.length === 0) {
      // Voices may still be loading, set up a callback
      console.debug('No voices available, setting up voiceschanged listener');
      
      // Create a more robust voiceschanged handler
      const handleVoicesChanged = () => {
        // Retry speaking after voices are loaded
        setTimeout(() => {
          const retryVoices = window.speechSynthesis.getVoices();
          if (retryVoices.length > 0) {
            // Update state with loaded voices
            setVoices(retryVoices);
            
            // Create a new utterance with the loaded voices
            const retryUtterance = new SpeechSynthesisUtterance(text);
            const langCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' :
                            lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-US';
            retryUtterance.lang = langCode;

            let retryVoice = retryVoices.find(v => {
              const isCorrectLang = v.lang.startsWith(langCode.split('-')[0]);
              if (selectedVoice === 'male') {
                return isCorrectLang && (v.name.toLowerCase().includes('male') ||
                       v.name.includes('David') ||
                       v.name.includes('Google हिन्दी') ||
                       v.name.includes('Rishi') ||
                       v.name.includes('Microsoft'));
              } else {
                return isCorrectLang && (v.name.toLowerCase().includes('female') ||
                       v.name.includes('Zira') ||
                       v.name.includes('Google US English') ||
                       v.name.includes('Kalpana') ||
                       v.name.includes('Microsoft'));
              }
            });

            if (!retryVoice && retryVoices.length > 0) {
              retryVoice = retryVoices[0]; // Fallback to first available voice
            }
            
            if (retryVoice) retryUtterance.voice = retryVoice;
            retryUtterance.rate = Math.max(0.1, Math.min(10, userPreferences.voiceSpeed));
            retryUtterance.pitch = 1;
            retryUtterance.volume = 1;
            
            // Stop any ongoing speech
            if (window.speechSynthesis.speaking) {
              window.speechSynthesis.cancel();
            }
            
            window.speechSynthesis.speak(retryUtterance);
            
            // Clean up the listener after successful speech
            window.speechSynthesis.onvoiceschanged = null;
          }
        }, 100);
      };
      
      // Set the handler
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      
      // Also try again after a brief moment in case voices load quickly
      setTimeout(() => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          // If voices loaded quickly, use them directly
          handleVoicesChanged();
        }
      }, 50);
      
      return;
    }

    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const langCode = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' :
                      lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'en-US';
      utterance.lang = langCode;

      // Use available voices
      let voice = currentVoices.find(v => {
        const isCorrectLang = v.lang.startsWith(langCode.split('-')[0]);
        if (selectedVoice === 'male') {
          return isCorrectLang && (v.name.toLowerCase().includes('male') ||
                 v.name.includes('David') ||
                 v.name.includes('Google हिन्दी') ||
                 v.name.includes('Rishi') ||
                 v.name.includes('Microsoft'));
        } else {
          return isCorrectLang && (v.name.toLowerCase().includes('female') ||
                 v.name.includes('Zira') ||
                 v.name.includes('Google US English') ||
                 v.name.includes('Kalpana') ||
                 v.name.includes('Microsoft'));
        }
      });

      if (!voice && currentVoices.length > 0) {
        voice = currentVoices[0]; // Fallback to first available voice
      }
      
      if (voice) utterance.voice = voice;

      utterance.rate = Math.max(0.1, Math.min(10, userPreferences.voiceSpeed));
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
        speechSynthesisRef.current.isSpeaking = true;
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        speechSynthesisRef.current.isSpeaking = false;
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        speechSynthesisRef.current.isSpeaking = false;
        
        // Handle specific errors
        if (event.error === 'interrupted' || event.error === 'canceled') {
          console.debug('Speech was interrupted or cancelled');
        } else if (event.error === 'not-allowed') {
          console.warn('Speech synthesis not allowed by browser');
          setIsSpeechAllowed(false);
          addAiMessage("Speech synthesis not allowed. Please check browser permissions.", 'system');
        }
      };

      // Store reference
      speechSynthesisRef.current.utterance = utterance;
      
      // Add small delay to prevent race conditions
      setTimeout(() => {
        try {
          // Double-check that no speech is happening before speaking
          if (!window.speechSynthesis.speaking) {
            window.speechSynthesis.speak(utterance);
          }
        } catch (error) {
          console.error('Error starting speech synthesis:', error);
          setIsSpeaking(false);
        }
      }, 50); // Reduced delay

    } catch (error) {
      console.error('Error creating speech utterance:', error);
      setIsSpeaking(false);
    }
  };



  // Error boundary handler to catch extension-related errors
  useEffect(() => {
    const handleError = (event) => {
      // Filter for specific extension-related errors
      if (event.message && (event.message.includes('Could not establish connection') || 
          event.message.includes('no-op fetch handler') ||
          event.message.includes('fetch handler') ||
          event.message.includes('Receiving end does not exist'))) {
        // Specifically suppress the no-op fetch handler warning
        if (event.message.includes('no-op fetch handler')) {
          console.debug('No-op fetch handler warning suppressed:', event.message);
          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
          return false;
        } else if (event.message.includes('Receiving end does not exist')) {
          // Suppress extension communication errors
          console.debug('Extension communication error suppressed:', event.message);
          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
          return false;
        } else {
          console.warn('Extension communication error caught and suppressed:', event.message);
          // Prevent the error from propagating
          event.preventDefault && event.preventDefault();
          event.stopPropagation && event.stopPropagation();
          return false; // Explicitly return false to prevent default handling
        }
      }
    };

    // Listen for unhandled errors
    window.addEventListener('error', handleError);
    
    // Listen for unhandled promise rejections
    const handlePromiseRejection = (event) => {
      if (event.reason && event.reason.message && (event.reason.message.includes('Could not establish connection') ||
          event.reason.message.includes('no-op fetch handler') ||
          event.reason.message.includes('message channel closed') ||
          event.reason.message.includes('Receiving end does not exist'))) {
        // Specifically suppress the no-op fetch handler warning
        if (event.reason.message.includes('no-op fetch handler')) {
          console.debug('No-op fetch handler promise rejection warning suppressed:', event.reason.message);
          event.preventDefault();
          return false;
        } else if (event.reason.message.includes('Receiving end does not exist')) {
          // Suppress extension communication errors
          console.debug('Extension communication promise rejection suppressed:', event.reason.message);
          event.preventDefault();
          return false;
        } else {
          console.warn('Extension communication promise rejection caught and suppressed:', event.reason.message);
          event.preventDefault();
          return false; // Explicitly return false to prevent default handling
        }
      }
    };
    
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    // Cleanup function
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  // Enhanced YouTube video handler
  const handleYouTubeRequest = (userText) => {
    const normalized = userText.toLowerCase().trim();
    const aiName = (userData?.assistantName || 'AI').toLowerCase();
    let searchQuery = '';

    // Remove common phrases and AI name
    let cleanedText = normalized
      .replace(aiName, '')
      .replace('play a video', '')
      .replace('play video', '')
      .replace('play song', '')
      .replace('on youtube', '')
      .replace('on youtuve', '')
      .replace('youtube', '')
      .replace('youtuve', '')
      .replace('please', '')
      .replace('can you', '')
      .replace('could you', '')
      .replace('would you', '')
      .replace('i want', '')
      .trim();

    // Check for direct video matches - IMPROVED MATCHING
    for (const [keyword, videoId] of Object.entries(youtubeVideos)) {
      // More flexible matching: check if cleaned text contains keyword or if original text contains it
      const keywordLower = keyword.toLowerCase();
      if (cleanedText.includes(keywordLower) || 
          normalized.includes(keywordLower)) {
        // Direct video play
        const youtubeUrl = videoId.startsWith('UC')
          ? `https://www.youtube.com/channel/${videoId}`
          : `https://www.youtube.com/watch?v=${videoId}`;

        // Open in new tab
        const newWindow = window.open(youtubeUrl, '_blank');
        if (!newWindow) {
          // If popup blocked, inform user
          addAiMessage("YouTube blocked popup. Please check your browser settings or click the link manually.", 'system');
        }

        let response;
        if (keyword.includes('techno gamerz')) {
          response = "Playing Techno Gamerz gaming music, Sir. Enjoy the beats! Opening in new tab...";
        } else if (keyword.includes('game on song')) {
          response = "Playing gaming music mix, Sir. Perfect for your gaming sessions! Opening in new tab...";
        } else {
          response = `Playing ${keyword}, Sir. Opening in new tab...`;
        }

        return { type: 'direct', response, query: keyword };
      }
    }
    
    // Additional flexible matching: try to match partial keywords
    // Split the cleaned text into words and see if they match any part of the keywords
    const words = cleanedText.split(/\s+/).filter(word => word.length > 0);
    for (const [keyword, videoId] of Object.entries(youtubeVideos)) {
      const keywordLower = keyword.toLowerCase();
      // Check if all words in the keyword are present in the user input (in any order)
      const keywordWords = keywordLower.split(/\s+/);
      const allKeywordWordsPresent = keywordWords.every(kw => 
        words.some(word => word.includes(kw) || kw.includes(word))
      );
      
      if (allKeywordWordsPresent && words.length > 0) {
        // Direct video play
        const youtubeUrl = videoId.startsWith('UC')
          ? `https://www.youtube.com/channel/${videoId}`
          : `https://www.youtube.com/watch?v=${videoId}`;

        // Open in new tab
        const newWindow = window.open(youtubeUrl, '_blank');
        if (!newWindow) {
          // If popup blocked, inform user
          addAiMessage("YouTube blocked popup. Please check your browser settings or click the link manually.", 'system');
        }

        let response;
        if (keyword.includes('techno gamerz')) {
          response = "Playing Techno Gamerz gaming music, Sir. Enjoy the beats! Opening in new tab...";
        } else if (keyword.includes('game on song')) {
          response = "Playing gaming music mix, Sir. Perfect for your gaming sessions! Opening in new tab...";
        } else {
          response = `Playing ${keyword}, Sir. Opening in new tab...`;
        }

        return { type: 'direct', response, query: keyword };
      }
    }

    // If no direct match, perform search
    if (cleanedText) {
      searchQuery = cleanedText;
    } else if (normalized.includes('youtube') || normalized.includes('youtuve')) {
      searchQuery = 'youtube';
    } else {
      searchQuery = 'music';
    }

    const encodedQuery = encodeURIComponent(searchQuery);
    let youtubeUrl;

    if (userPreferences.searchMode === 'direct') {
      // Try to play first result directly
      youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}&sp=EgIQAQ%253D%253D`;
    } else {
      // Show search results
      youtubeUrl = `https://www.youtube.com/results?search_query=${encodedQuery}`;
    }

    // Open in new tab
    const newWindow = window.open(youtubeUrl, '_blank');
    if (!newWindow) {
      addAiMessage("YouTube blocked popup. Please check your browser settings.", 'system');
    }

    return {
      type: 'search',
      response: `Searching YouTube for "${searchQuery}", Sir. Opening in new tab...`,
      query: searchQuery
    };
  };

  // Enhanced Google search handler
  const handleGoogleSearch = (query) => {
    const encodedQuery = encodeURIComponent(query);
    const newWindow = window.open(`https://www.google.com/search?q=${encodedQuery}`, '_blank');
    
    if (!newWindow) {
      addAiMessage("Google search blocked popup. Please check your browser settings.", 'system');
    }

    // Try to provide intelligent response based on query
    let response = `Searching Google for "${query}", Sir. Opening in new tab... `;

    if (query.toLowerCase().includes('weather')) {
      response += "I'll show you the weather forecast.";
    } else if (query.toLowerCase().includes('news')) {
      response += "Fetching latest news updates.";
    } else if (query.toLowerCase().includes('time')) {
      response += `Current time is ${new Date().toLocaleTimeString()}.`;
    } else if (query.toLowerCase().includes('date')) {
      response += `Today's date is ${new Date().toLocaleDateString()}.`;
    }

    return response;
  };

  const handleUserMessage = async (originalUserText) => {
    if (!originalUserText.trim() || !isLanguageSelected) return;

    // Check if this is the initial naming after termination
    if (!userData?.assistantName && messages.some(msg => msg.text.includes("Please write your name so I can assist you"))) {
      // User has provided their name, so initialize the assistant
      const name = originalUserText.trim();
      const updatedData = { ...userData, assistantName: name, isGuest: true };
      setUserData(updatedData);

      const response = `Protocol initiated. My designation is now confirmed as ${name}. I am at your service, Sir. How may I help you?`;
      addAiMessage(response, 'system');
      speakTextIfAllowed(response, selectedLanguage);
      saveToHistory(originalUserText, response);
      return;
    }

    // Process AI name extraction
    let processedUserText = originalUserText;
    const aiName = (userData?.assistantName || 'AI').toLowerCase();
    const originalNormalized = originalUserText.toLowerCase().trim();
    
    // Check if user is calling the AI - also handle commands that start with the AI name
    if (originalNormalized === aiName || originalNormalized.includes(`hey ${aiName}`) || originalNormalized.includes(`hello ${aiName}`) || originalNormalized.startsWith(`${aiName} `) || originalNormalized.startsWith(`${aiName},`)) {
      // Extract the actual command if the message starts with the AI name
      let commandText = originalUserText;
      let shouldProcessCommand = false;
      
      if (originalNormalized.startsWith(`${aiName} `) || originalNormalized.startsWith(`${aiName},`)) {
        commandText = originalUserText.substring(aiName.length + 1).trim();
        shouldProcessCommand = true;
      }
      
      // If it's just the AI name being called, respond
      if (originalNormalized === aiName || originalNormalized.includes(`hey ${aiName}`) || originalNormalized.includes(`hello ${aiName}`)) {
        const response = `Yes Sir? ${userData?.assistantName} is online and ready.`;
        addAiMessage(response, 'response');
        speakTextIfAllowed(response, selectedLanguage);
        saveToHistory(originalUserText, response);
        return;
      } else if (shouldProcessCommand) {
        // Process the command that came after the AI name
        console.log(`Processing command after AI name: ${commandText}`);
        processedUserText = commandText;
      }
    }
    
    const normalized = processedUserText.toLowerCase().trim();
    const userMessage = {
      id: Date.now(),
      text: processedUserText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // App opening - Check this BEFORE YouTube/Video requests to avoid conflicts
    const apps = {
      'facebook': 'https://www.facebook.com',
      'instagram': 'https://www.instagram.com',
      'twitter': 'https://www.twitter.com',
      'whatsapp': 'https://web.whatsapp.com',
      'youtube': 'https://www.youtube.com',
      'gmail': 'https://mail.google.com',
      'github': 'https://www.github.com',
      'netflix': 'https://www.netflix.com',
      'spotify': 'https://open.spotify.com',
      'amazon': 'https://www.amazon.com',
      'flipkart': 'https://www.flipkart.com',
      'google': 'https://www.google.com'
    };

    for (const [name, url] of Object.entries(apps)) {
      // Enhanced detection for opening apps
      const isOpenCommand = normalized.includes(`open ${name}`) || 
                           normalized.includes(`launch ${name}`) || 
                           (normalized.includes(name) && (normalized.includes('open') || normalized.includes('launch')));
      
      // Special handling for YouTube since it can be both an app and a video player
      if (name === 'youtube' && (isOpenCommand || normalized.includes('youtube'))) {
        // Check if it's a general 'open youtube' request vs a video request
        const isVideoRequest = normalized.includes('play') || 
                              normalized.includes('video') || 
                              normalized.includes('song') || 
                              normalized.includes('music') || 
                              normalized.includes('watch');
        
        if (!isVideoRequest) {
          // This is just an 'open youtube' request
          console.log(`Opening YouTube app via voice command: ${processedUserText}`);
          const newWindow = window.open(url, '_blank');
          if (!newWindow) {
            addAiMessage("Popup blocked. Please check your browser settings.", 'system');
          }
          const response = `Opening YouTube for you, Sir.`;
          addAiMessage(response, 'app');
          speakTextIfAllowed(response, selectedLanguage);
          saveToHistory(processedUserText, response);
          return;
        }
      } else if (isOpenCommand) {
        // Handle other apps
        console.log(`Opening ${name} app via voice command: ${processedUserText}`);
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          addAiMessage("Popup blocked. Please check your browser settings.", 'system');
        }
        const response = `Opening ${name.charAt(0).toUpperCase() + name.slice(1)} for you, Sir.`;
        addAiMessage(response, 'app');
        speakTextIfAllowed(response, selectedLanguage);
        saveToHistory(processedUserText, response);
        return;
      }
    }

    // YouTube/Video requests - Only if NOT an 'open youtube' command
    if ((normalized.includes('play') ||
        normalized.includes('youtube') ||
        normalized.includes('youtuve') ||
        normalized.includes('video') ||
        normalized.includes('song') ||
        normalized.includes('music') ||
        normalized.includes('watch')) &&
        !normalized.includes('open youtube') && !normalized.includes('launch youtube')) {
      console.log(`YouTube command detected: ${processedUserText}`);
      const result = handleYouTubeRequest(processedUserText);
      addAiMessage(result.response, 'youtube');
      speakTextIfAllowed(result.response, selectedLanguage);
      saveToHistory(processedUserText, result.response);
      return;
    }

    // Google Search requests
    if (normalized.includes('google') ||
        normalized.includes('search') ||
        normalized.includes('what is') ||
        normalized.includes('who is') ||
        normalized.includes('how to') ||
        normalized.includes('where is') ||
        normalized.includes('tell me about') ||
        normalized.includes('open google')) {
      console.log(`Google search command detected: ${processedUserText}`);

      let query = normalized
        .replace('search google for', '')
        .replace('search for', '')
        .replace('google', '')
        .replace('what is', '')
        .replace('who is', '')
        .replace('how to', '')
        .replace('where is', '')
        .replace('tell me about', '')
        .trim();

      if (query) {
        const response = handleGoogleSearch(query);
        addAiMessage(response, 'search');
        speakTextIfAllowed(response, selectedLanguage);
        saveToHistory(processedUserText, response);
        return;
      }
    }

    // Quick commands
    if (normalized === 'time' || normalized.includes('what time')) {
      const time = new Date().toLocaleTimeString();
      const response = `Current time is ${time}, Sir.`;
      addAiMessage(response, 'response');
      speakTextIfAllowed(response, selectedLanguage);
      saveToHistory(processedUserText, response);
      return;
    }

    if (normalized === 'date' || normalized.includes('what date')) {
      const date = new Date().toLocaleDateString();
      const response = `Today's date is ${date}, Sir.`;
      addAiMessage(response, 'response');
      speakTextIfAllowed(response, selectedLanguage);
      saveToHistory(processedUserText, response);
      return;
    }

    if (normalized === 'clear' || normalized.includes('clear chat')) {
      setMessages([]);
      const response = 'Conversation cleared, Sir.';
      addAiMessage(response, 'system');
      speakTextIfAllowed(response, selectedLanguage);
      return;
    }



    // Default: Use Gemini AI
    setIsLoading(true);
    try {
      const { getGeminiResponse } = await import('../utils/geminiApi');
      const contextPrompt = `User is speaking in ${languages[selectedLanguage].name}.
      Location: ${userData?.state || 'Unknown'}, ${userData?.country || 'Global'}.
      Be respectful and helpful. User is "Sir".
      Query: ${processedUserText}`;

      const response = await getGeminiResponse(contextPrompt, userData?.assistantName || 'AI Assistant');
      addAiMessage(response, 'ai');
      speakTextIfAllowed(response, selectedLanguage);
      saveToHistory(processedUserText, response);
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMsg = "I apologize, but I'm having trouble processing your request. Please try again or check your connection.";
      addAiMessage(errorMsg, 'error');
      speakTextIfAllowed(errorMsg, selectedLanguage);
    } finally {
      setIsLoading(false);
    }
  };

  const addAiMessage = (text, type = 'ai') => {
    const aiMessage = {
      id: Date.now() + 1,
      text: text,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString(),
      type: type
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  // Function to speak text only if speech is allowed and voices are available
  const speakTextIfAllowed = (text, lang = selectedLanguage) => {
    // Check both speech permission and voice availability
    const hasVoices = availableVoices && availableVoices.length > 0;
    const canSpeak = isSpeechAllowed && hasVoices;
    
    if (canSpeak) {
      speakText(text, lang);
    } else {
      console.warn('Speech not allowed or no voices available:', { 
        isSpeechAllowed, 
        voicesCount: availableVoices?.length,
        hasVoices,
        message: `Speech allowed: ${isSpeechAllowed}, Voices available: ${availableVoices?.length || 0}`
      });
      
      // Attempt to speak after a brief delay if voices are still loading
      setTimeout(() => {
        const retryHasVoices = availableVoices && availableVoices.length > 0;
        const retryCanSpeak = isSpeechAllowed && retryHasVoices;
        
        if (retryCanSpeak) {
          speakText(text, lang);
        } else {
          console.info('Retried but still no voices available, may need manual refresh or different browser');
        }
      }, 800);
    }
  };

  const saveToHistory = (query, response) => {
    const historyEntry = {
      id: Date.now(),
      query: query,
      response: response,
      timestamp: new Date().toLocaleString(),
      language: selectedLanguage,
      type: determineHistoryType(query)
    };

    setHistory(prev => [historyEntry, ...prev].slice(0, 100)); // Keep last 100 entries
  };

  const determineHistoryType = (query) => {
    const normalized = query.toLowerCase();
    if (normalized.includes('play') || normalized.includes('youtube')) return 'video';
    if (normalized.includes('search') || normalized.includes('google')) return 'search';
    if (normalized.includes('read about') || normalized.includes('information about') || normalized.includes('explain about')) return 'info';
    if (normalized.includes('open') || normalized.includes('launch')) return 'app';
    if (normalized.includes('time') || normalized.includes('date')) return 'command';
    return 'chat';
  };

  const handleTerminateSession = () => {
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    // Stop speech recognition if active
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }

    // Clear all user data to trigger re-customization
    if (userData) {
      setUserData(null); // Clear all user data completely
    }
    
    // Clear any stored guest data
    localStorage.removeItem('guestUserData');
    
    // Reset the greeting flag so it shows again when user returns
    hasGreetedRef.current = false;
    
    // Speak termination message if speech is allowed
    if (isSpeechAllowed && availableVoices.length > 0) {
      speakText("Session terminated. Redirecting to log in page.", selectedLanguage);
    }
    
    // Navigate to login page immediately after speaking
    setTimeout(() => {
      navigate('/login');
      // Force refresh of voice data on the login page by clearing any cached data
      setTimeout(() => {
        // Trigger a slight delay to ensure the login page has loaded
        // The login page will handle its own voice initialization
      }, 100);
    }, 500); // Reduced timeout to ensure quick redirect
  };

  const toggleAutoPlay = () => {
    setUserPreferences(prev => ({ ...prev, autoPlay: !prev.autoPlay }));
  };

  const changeVoiceSpeed = (speed) => {
    setUserPreferences(prev => ({ ...prev, voiceSpeed: speed }));
  };

  const toggleSearchMode = () => {
    setUserPreferences(prev => ({
      ...prev,
      searchMode: prev.searchMode === 'direct' ? 'search' : 'direct'
    }));
  };

  const deleteHistoryEntry = (id) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      const response = "All history cleared, Sir.";
      addAiMessage(response, 'system');
      if (isSpeechAllowed) speakText(response, selectedLanguage);
    }
  };

  const runHistoryEntry = (query) => {
    handleUserMessage(query);
  };

  const addQuickCommand = () => {
    const newCommand = prompt('Enter new quick command (e.g., "play latest bollywood songs"):');
    if (newCommand && newCommand.trim()) {
      const label = prompt('Enter label for this command:');
      const icon = prompt('Enter emoji icon:') || '⚡';

      const newCmd = {
        id: Date.now(),
        command: newCommand.trim(),
        label: label || newCommand.substring(0, 20),
        icon: icon
      };

      setQuickCommands(prev => [...prev, newCmd].slice(0, 12));
      localStorage.setItem('ai_quick_commands', JSON.stringify([...quickCommands, newCmd].slice(0, 12)));

      const response = `Quick command "${newCommand.substring(0, 30)}..." added successfully.`;
      addAiMessage(response, 'system');
      if (isSpeechAllowed) speakText(response, selectedLanguage);
    }
  };

  const removeQuickCommand = (id) => {
    setQuickCommands(prev => prev.filter(cmd => cmd.id !== id));
    localStorage.setItem('ai_quick_commands', JSON.stringify(quickCommands.filter(cmd => cmd.id !== id)));
  };

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans overflow-x-hidden flex flex-col">
      {/* Advanced background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/10 to-red-600/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-blue-600 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black rounded-lg px-4 py-2 border border-white/10 flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
                <span className="font-black text-xl tracking-tighter uppercase bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  JARVIS <span className="text-white">AI</span>
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Operator</span>
                <span className="text-xs font-mono text-red-400 uppercase">{userData?.name || 'CLASSIFIED'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Language</span>
                <span className="text-xs font-mono text-blue-400 uppercase">{languages[selectedLanguage].name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Status</span>
                <span className={`text-xs font-mono uppercase animate-pulse ${isSpeechAllowed ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isSpeechAllowed ? 'ACTIVE' : 'SPEECH DISABLED'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab(activeTab === 'live' ? 'history' : 'live')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              {activeTab === 'live' ? '📜 History' : '💬 Live Chat'}
            </button>
            <button
              onClick={handleTerminateSession}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-black uppercase tracking-widest rounded-lg transition-all shadow-lg shadow-red-900/20 active:scale-95 border border-red-500/20"
            >
              Terminate
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 flex-1 overflow-hidden">

        {/* Left Panel - Controls & Info */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* AI Avatar & Info */}
          <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -inset-3 bg-gradient-to-br from-red-600 via-blue-600 to-purple-600 rounded-full blur opacity-30 animate-spin-slow"></div>
                <div className="relative w-32 h-32 rounded-full border-2 border-white/20 bg-black overflow-hidden">
                  <img
                    src={userData?.assistantImage || aiGif}
                    alt="AI Assistant"
                    className={`w-full h-full object-cover transition-all duration-500 ${isSpeaking ? 'scale-110 brightness-125' : 'grayscale-50'}`}
                  />
                  {isSpeaking && (
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/20 to-transparent"></div>
                  )}
                </div>
                {isListening && (
                  <div className="absolute -inset-4 border-2 border-red-500/50 rounded-full animate-ping"></div>
                )}
              </div>

              <h2 className="text-xl font-black uppercase tracking-tight text-center mb-1">
                {userData?.assistantName || 'JARVIS AI'}
              </h2>
              <p className="text-[8px] text-red-400 font-mono uppercase tracking-[0.3em] mb-4">
                NEURAL INTERFACE {isLanguageSelected ? 'ACTIVE' : 'AWAITING INIT'}
              </p>

              {/* System Status */}
              <div className="w-full grid grid-cols-3 gap-2 mb-4">
                {Object.entries(systemStatus).map(([key, value]) => (
                  <div key={key} className="bg-white/5 border border-white/10 p-2 rounded-xl text-center">
                    <div className="text-[6px] text-gray-500 uppercase font-black tracking-widest">{key}</div>
                    <div className="text-[8px] font-bold text-green-400 uppercase">{value}</div>
                  </div>
                ))}
              </div>

              {/* Speech Status */}
              {!isSpeechAllowed && (
                <div className="w-full p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-xl mb-4">
                  <div className="text-[8px] text-yellow-400 font-bold uppercase text-center">
                    Speech Synthesis Disabled
                  </div>
                  <div className="text-[7px] text-yellow-500 text-center mt-1">
                    Check browser permissions
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language Selection */}
          {!isLanguageSelected ? (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-6">
              <h3 className="text-[12px] font-black uppercase text-blue-300 mb-4 text-center tracking-widest">
                🗣️ SELECT INTERFACE LANGUAGE
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(languages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      setSelectedLanguage(code);
                      setIsLanguageSelected(true);
                      localStorage.setItem('ai_assistant_prefs', JSON.stringify({
                        ...userPreferences,
                        language: code
                      }));
                      const response = `${lang.greeting} Language set to ${lang.name}.`;
                      addAiMessage(response);
                      if (isSpeechAllowed) speakText(response, code);
                    }}
                    className="py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <span className="text-lg">{code === 'hi' ? '🇮🇳' : code === 'mr' ? '🇮🇳' : code === 'es' ? '🇪🇸' : code === 'fr' ? '🇫🇷' : '🇺🇸'}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Quick Actions */}
              <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest">⚡ QUICK ACTIONS</h3>
                  <button
                    onClick={addQuickCommand}
                    className="text-[8px] px-2 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors"
                    title="Add new command"
                  >
                    +
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {quickCommands.map((cmd) => (
                    <div key={cmd.id} className="relative group">
                      <button
                        onClick={() => handleUserMessage(cmd.command)}
                        disabled={!isLanguageSelected}
                        className={`w-full px-3 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1 ${
                          !isLanguageSelected
                            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-600/50'
                        }`}
                      >
                        <span>{cmd.icon}</span>
                        <span>{cmd.label}</span>
                      </button>
                      <button
                        onClick={() => removeQuickCommand(cmd.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove command"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice & Settings */}
              <div className="bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6">
                <h3 className="text-[10px] font-black uppercase text-gray-500 mb-4 tracking-widest">⚙️ VOICE CONTROLS</h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-[8px] text-gray-500 uppercase font-black mb-2">Voice Gender</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['female', 'male'].map(v => (
                        <button
                          key={v}
                          onClick={() => setSelectedVoice(v)}
                          disabled={!isSpeechAllowed}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                            selectedVoice === v
                              ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg'
                              : isSpeechAllowed
                              ? 'bg-white/5 text-gray-400 hover:bg-white/10'
                              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[8px] text-gray-500 uppercase font-black mb-2">Voice Speed: {userPreferences.voiceSpeed}x</div>
                    <div className="flex space-x-1">
                      {[0.8, 1.0, 1.2, 1.5, 1.8].map(speed => (
                        <button
                          key={speed}
                          onClick={() => changeVoiceSpeed(speed)}
                          disabled={!isSpeechAllowed}
                          className={`flex-1 py-1 text-[8px] rounded ${
                            userPreferences.voiceSpeed === speed
                              ? 'bg-blue-600 font-bold'
                              : isSpeechAllowed
                              ? 'bg-white/5 hover:bg-white/10'
                              : 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={toggleAutoPlay}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        userPreferences.autoPlay
                          ? 'bg-gradient-to-r from-green-600 to-green-700'
                          : 'bg-gradient-to-r from-red-600 to-red-700'
                      }`}
                    >
                      Auto-play: {userPreferences.autoPlay ? 'ON' : 'OFF'}
                    </button>

                    <button
                      onClick={toggleSearchMode}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                        userPreferences.searchMode === 'direct'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700'
                          : 'bg-gradient-to-r from-yellow-600 to-yellow-700'
                      }`}
                    >
                      Mode: {userPreferences.searchMode === 'direct' ? 'Direct' : 'Search'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Chat & History */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <div className="flex-1 bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl">

            {/* Tab Navigation */}
            <div className="flex border-b border-white/10 bg-white/5">
              <button
                onClick={() => setActiveTab('live')}
                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'live'
                    ? 'text-red-500 border-red-600 bg-gradient-to-b from-red-600/10 to-transparent'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                💬 LIVE CHAT
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                  activeTab === 'history'
                    ? 'text-blue-500 border-blue-600 bg-gradient-to-b from-blue-600/10 to-transparent'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                📜 HISTORY {history.length > 0 && `(${history.length})`}
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {activeTab === 'live' ? (
                <>
                  {messages.map(m => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-in fade-in slide-in-from-bottom-2`}
                    >
                      <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-red-600 to-red-700 text-white rounded-tr-none shadow-lg shadow-red-900/20'
                          : m.type === 'youtube'
                          ? 'bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/20 text-purple-200 rounded-tl-none'
                          : m.type === 'search'
                          ? 'bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/20 text-blue-200 rounded-tl-none'
                          : m.type === 'info'
                          ? 'bg-gradient-to-r from-blue-700/20 to-blue-600/10 border border-blue-400/20 text-blue-100 rounded-tl-none'
                          : m.type === 'app'
                          ? 'bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/20 text-green-200 rounded-tl-none'
                          : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                      }`}>
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                            {m.sender === 'user' ? 'USER' :
                             m.type === 'youtube' ? 'YOUTUBE' :
                             m.type === 'search' ? 'SEARCH' :
                             m.type === 'info' ? 'INFO' :
                             m.type === 'app' ? 'APP' : 'AI'}
                          </span>
                          <span className="text-[8px] opacity-40 font-mono">{m.timestamp}</span>
                        </div>
                        <div className="mt-1">{m.text}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-red-900/20 to-blue-900/20 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></div>
                          <span className="text-[8px] text-gray-400 font-bold uppercase ml-2">Processing Neural Response...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[12px] font-black uppercase text-blue-300 tracking-widest">
                      INTERACTION HISTORY
                    </h3>
                    {history.length > 0 && (
                      <button
                        onClick={clearAllHistory}
                        className="px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-lg text-[8px] font-black uppercase hover:bg-red-600/30 transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="text-6xl mb-4 opacity-20">📜</div>
                      <div className="text-gray-600 text-xs uppercase font-black tracking-widest opacity-40">
                        No History Records
                      </div>
                      <div className="text-[10px] text-gray-700 mt-2">
                        Your interactions will appear here
                      </div>
                    </div>
                  ) : (
                    history.map(item => (
                      <div
                        key={item.id}
                        className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 group hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <span className={`text-[8px] px-2 py-1 rounded uppercase font-black ${
                              item.type === 'video' ? 'bg-purple-600/20 text-purple-400' :
                              item.type === 'search' ? 'bg-blue-600/20 text-blue-400' :
                              item.type === 'info' ? 'bg-blue-400/20 text-blue-300' :
                              item.type === 'app' ? 'bg-green-600/20 text-green-400' :
                              item.type === 'command' ? 'bg-yellow-600/20 text-yellow-400' :
                              'bg-gray-600/20 text-gray-400'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-[8px] font-mono text-gray-500">{item.timestamp}</span>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => runHistoryEntry(item.query)}
                              className="text-[8px] px-2 py-1 bg-blue-600/20 border border-blue-600/30 rounded hover:bg-blue-600/30 transition-colors"
                              title="Run again"
                            >
                              ▶
                            </button>
                            <button
                              onClick={() => deleteHistoryEntry(item.id)}
                              className="text-[8px] px-2 py-1 bg-red-600/20 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors"
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center text-[10px]">Q</div>
                            <div className="flex-1">
                              <div className="text-[10px] text-gray-500 uppercase font-black">Query</div>
                              <div className="text-sm font-medium text-white">{item.query}</div>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px]">A</div>
                            <div className="flex-1">
                              <div className="text-[10px] text-gray-500 uppercase font-black">Response</div>
                              <div className="text-sm text-gray-300">{item.response}</div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/10">
                          <div className="text-[8px] text-gray-600 uppercase font-black">
                            Language: {languages[item.language]?.name || 'English'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Input Area (Only for Live Chat) */}
            {activeTab === 'live' && (
              <div className="p-6 bg-black/60 border-t border-white/10">
                <div className="flex items-center space-x-3 mb-4 bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-red-600/50 transition-all shadow-inner">
                  <input
                    type="text"
                    placeholder={
                      !isLanguageSelected
                        ? "Select language first to begin..."
                        : `Speak or type command in ${languages[selectedLanguage].name}...`
                    }
                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm placeholder-gray-700 font-bold"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUserMessage(inputText)}
                    disabled={!isLanguageSelected || isLoading}
                  />
                  <button
                    onClick={() => handleUserMessage(inputText)}
                    disabled={!inputText.trim() || isLoading || !isLanguageSelected}
                    className={`p-3 rounded-xl transition-transform duration-200 ${
                      !inputText.trim() || isLoading || !isLanguageSelected
                        ? 'text-gray-700'
                        : 'text-red-500 hover:text-red-400 hover:scale-110'
                    }`}
                  >
                    <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {['Play Music', 'Search Google', 'Current Time', 'Open YouTube', 'Clear Chat'].map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => handleUserMessage(cmd.toLowerCase())}
                        disabled={!isLanguageSelected || isLoading}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                          !isLanguageSelected || isLoading
                            ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border border-white/10 text-gray-500 hover:text-white hover:border-red-600/50'
                        }`}
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${
                      isListening ? 'text-red-500 animate-pulse' : 'text-gray-600'
                    }`}>
                      {isListening ? '🎤 Listening...' : '🎤 Voice Standby'}
                    </span>
                    <button
                      onClick={() => {
                        if (!isLanguageSelected) {
                          addAiMessage("Please select a language first!", 'system');
                          return;
                        }
                        if (isListening) {
                          try {
                            recognitionRef.current.stop();
                            setIsListening(false);
                          } catch (e) {
                            console.error('Error stopping recognition:', e);
                            setIsListening(false);
                          }
                        } else {
                          try {
                            // Ensure the speech recognition is properly initialized
                            if (!recognitionRef.current) {
                              const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                              recognitionRef.current = new SpeechRecognition();
                              
                              const langMap = {
                                'hi': 'hi-IN',
                                'mr': 'mr-IN',
                                'es': 'es-ES',
                                'fr': 'fr-FR',
                                'en': 'en-US'
                              };
                              recognitionRef.current.lang = langMap[selectedLanguage] || 'en-US';
                              recognitionRef.current.continuous = false;
                              recognitionRef.current.interimResults = false;
                              
                              recognitionRef.current.onresult = (event) => {
                                const transcript = event.results[0][0].transcript;
                                console.log('Recognized:', transcript);
                                handleUserMessage(transcript);
                                setIsListening(false); // Reset listening state after processing
                              };
                              
                              recognitionRef.current.onend = () => {
                                console.log('Speech recognition ended');
                                setIsListening(false);
                              };
                              
                              recognitionRef.current.onerror = (event) => {
                                console.error('Speech recognition error:', event.error);
                                setIsListening(false);
                                if (event.error === 'not-allowed') {
                                  addAiMessage("Microphone access denied. Please allow microphone permissions in your browser settings.", 'error');
                                } else if (event.error === 'no-speech') {
                                  addAiMessage("No speech detected. Please try again.", 'system');
                                } else if (event.error === 'audio-capture') {
                                  addAiMessage("Audio capture failed. Please check your microphone.", 'error');
                                } else if (event.error === 'network') {
                                  addAiMessage("Network error occurred. Please check your internet connection.", 'error');
                                } else if (event.error === 'service-not-allowed') {
                                  addAiMessage("Speech recognition service is not allowed. Please check your browser settings.", 'error');
                                } else if (event.error === 'bad-grammar') {
                                  addAiMessage("Speech recognition grammar error. Please try again.", 'error');
                                } else if (event.error === 'language-not-supported') {
                                  addAiMessage("Selected language is not supported for speech recognition.", 'error');
                                } else {
                                  addAiMessage(`Speech recognition error: ${event.error}. Please try again.`, 'error');
                                }
                              };
                            }
                            
                            // Request microphone access with a user gesture
                            recognitionRef.current.start();
                            setIsListening(true);
                            
                            // Add a small delay to ensure the mic permission prompt appears
                            setTimeout(() => {
                              if (!isListening) {
                                addAiMessage("Please allow microphone access when prompted by your browser.", 'system');
                              }
                            }, 500);
                          } catch(e) {
                            console.error('Speech recognition error:', e);
                            addAiMessage("Speech recognition not available. Please check permissions in your browser settings.", 'error');
                            setIsListening(false);
                          }
                        }
                      }}
                      disabled={!isLanguageSelected || isLoading}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        !isLanguageSelected || isLoading
                          ? 'bg-gray-800/50 border-gray-600 cursor-not-allowed'
                          : isListening
                            ? 'bg-gradient-to-r from-red-600 to-red-700 border-red-400 animate-pulse shadow-[0_0_30px_rgba(220,38,38,0.7)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-red-600/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                      }`}
                    >
                      <img
                        src={aiGif}
                        alt="Voice Control"
                        className={`w-6 h-6 object-contain transition-all duration-300 ${
                          !isLanguageSelected || isLoading
                            ? 'opacity-20 grayscale'
                            : isListening
                              ? 'brightness-200 scale-110'
                              : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Status */}
      <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-2">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between text-[8px] font-mono">
            <div className="flex items-center space-x-4">
              <span className="text-green-500">● SYSTEM: ONLINE</span>
              <span className="text-blue-500">LANG: {languages[selectedLanguage].name.toUpperCase()}</span>
              <span className={`uppercase ${isSpeechAllowed ? 'text-purple-500' : 'text-yellow-500'}`}>
                SPEECH: {isSpeechAllowed ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">HISTORY: {history.length} ENTRIES</span>
              <span className="text-yellow-500">SESSION: {messages.length} MESSAGES</span>
              <span className="text-gray-500">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;