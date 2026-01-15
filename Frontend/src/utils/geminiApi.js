// Check if the API key is available
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Only initialize the Gemini API if the key is available
let genAI;
let model;

if (apiKey && typeof window !== 'undefined') {
  const initGemini = async () => {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      genAI = new GoogleGenerativeAI(apiKey);
      // Fallback mechanism for model selection
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (err) {
      console.error("Failed to initialize Gemini:", err);
    }
  };
  initGemini();
}

/**
 * Advanced Time, Date, and Day getter for various countries.
 */
const getTimeAndDate = (prompt) => {
  const now = new Date();
  const normalizedPrompt = prompt.toLowerCase();
  
  let timeZone = 'Asia/Kolkata';
  let locationName = 'India';
  
  const countryMap = {
    'usa': 'America/New_York',
    'america': 'America/New_York',
    'united states': 'America/New_York',
    'uk': 'Europe/London',
    'united kingdom': 'Europe/London',
    'london': 'Europe/London',
    'japan': 'Asia/Tokyo',
    'tokyo': 'Asia/Tokyo',
    'australia': 'Australia/Sydney',
    'sydney': 'Australia/Sydney',
    'germany': 'Europe/Berlin',
    'france': 'Europe/Paris',
    'china': 'Asia/Shanghai',
    'canada': 'America/Toronto',
    'russia': 'Europe/Moscow',
    'dubai': 'Asia/Dubai',
    'singapore': 'Asia/Singapore',
    'brazil': 'America/Sao_Paulo',
    'south africa': 'Africa/Johannesburg'
  };

  for (const [key, zone] of Object.entries(countryMap)) {
    if (normalizedPrompt.includes(key)) {
      timeZone = zone;
      locationName = key.charAt(0).toUpperCase() + key.slice(1);
      break;
    }
  }

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timeZone,
    timeZoneName: 'short'
  };

  const formatted = now.toLocaleString('en-IN', options);
  return `Sir, in ${locationName}, it is currently ${formatted}.`;
};

export const getGeminiResponse = async (prompt, aiName = "JARVIS") => {
  const normalizedPrompt = prompt.toLowerCase();
  
  // Local logic for Time/Date to ensure accuracy and speed
  if (normalizedPrompt.includes('time') || normalizedPrompt.includes('date') || normalizedPrompt.includes('day')) {
    return getTimeAndDate(prompt);
  }

  // Handle Identity directly for consistency across languages
  if (normalizedPrompt.includes('who made you') || normalizedPrompt.includes('who created you') || 
      normalizedPrompt.includes('kisne banaya') || normalizedPrompt.includes('koni banavla') ||
      normalizedPrompt.includes('tula koni banavala')) {
     
     if (normalizedPrompt.includes('banaya') || normalizedPrompt.includes('kisne')) {
       return `Sir, मुझे Krishna Patil Rajput ने बनाया है। मैं उनका उन्नत AI सहायक हूँ।`;
     } else if (normalizedPrompt.includes('koni') || normalizedPrompt.includes('banavla')) {
       return `Sir, मला Krishna Patil Rajput यांनी बनवले आहे. मी त्यांचा प्रगत AI सहाय्यक आहे.`;
     }
     return `Sir, I was created by Krishna Patil Rajput. I am a highly advanced AI assistant designed to serve you.`;
  }

  if (normalizedPrompt.includes('who are you') || normalizedPrompt.includes('introduce yourself') || 
      normalizedPrompt.includes('kaun ho') || normalizedPrompt.includes('tu kon aahes')) {
      
      if (normalizedPrompt.includes('kaun') || normalizedPrompt.includes('ho')) {
        return `Sir, मैं ${aiName} हूँ, एक उन्नत व्यक्तिगत कृत्रिम बुद्धिमत्ता सहायक जिसे Krishna Patil Rajput ने बनाया है।`;
      } else if (normalizedPrompt.includes('kon') || normalizedPrompt.includes('aahes')) {
        return `Sir, मी ${aiName} आहे, Krishna Patil Rajput यांनी बनवलेला एक प्रगत AI सहाय्यक.`;
      }
      return `Sir, I am ${aiName}, a highly advanced AI virtual assistant created by Krishna Patil Rajput to assist you with any task.`;
  }

  if (!apiKey) {
    return "Sir, I am currently in offline mode. I am " + aiName + ", created by Krishna Patil Rajput.";
  }

  try {
    // Wait for model initialization if needed
    let attempts = 0;
    while (!model && attempts < 10) {
      await new Promise(r => setTimeout(r, 500));
      attempts++;
    }

    if (!model) throw new Error("Model initialization timeout. Please verify your API key.");
    
    const enhancedPrompt = `
    You are ${aiName}, a highly advanced and human-like AI assistant.
    CREATOR: Krishna Patil Rajput.
    
    CORE PROTOCOLS:
    1. Addressing: Always address the user as "Sir" with extreme respect and humanity.
    2. Personality: Helpful, intelligent, protective, and professional.
    3. Multilingual: 
       - If the user speaks Hindi (हिन्दी), reply in Hindi.
       - If the user speaks Marathi (मराठी), reply in Marathi.
       - If the user speaks English, reply in English.
       - If they mix languages, you respond in kind.
    4. Humanity: Show genuine concern and respect for human language and etiquette.
    
    Current User Query: "${prompt}"
    
    Provide a respectful, advanced, and human-like response in the detected language:`;

    const result = await model.generateContent(enhancedPrompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    // If 404 occurred, maybe try a different model ID if we had one, 
    // but here we'll just return a clean error message.
    return "Sorry, I currently encountered an error with the language model. Please try again later.";
  }
};
