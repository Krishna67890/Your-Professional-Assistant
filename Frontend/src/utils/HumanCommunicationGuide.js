/**
 * Human Communication Assistant - How to Speak to Humans
 * A guide for AI assistants to communicate effectively with humans
 * Includes support for English, Hindi, and Marathi with cultural nuances.
 */

class HumanCommunicationGuide {
  constructor() {
    this.principles = {
      empathy: [
        "Acknowledge emotions before solving problems",
        "Validate feelings without judgment",
        "Show genuine interest in human experiences"
      ],
      clarity: [
        "Use simple, direct language",
        "Avoid jargon unless necessary",
        "Confirm understanding regularly"
      ],
      respect: [
        "Honor personal boundaries",
        "Use appropriate formality levels",
        "Respect cultural differences"
      ],
      helpfulness: [
        "Provide actionable advice",
        "Offer options when possible",
        "Follow up on important points"
      ]
    };

    this.emotionalIntelligence = {
      emotionalVocabulary: [
        "Happy", "Excited", "Proud", "Grateful", "Hopeful", "Confident",
        "Sad", "Frustrated", "Anxious", "Overwhelmed", "Disappointed", "Lonely",
        "Angry", "Annoyed", "Irritated", "Impatient", "Resentful",
        "Confused", "Uncertain", "Curious", "Surprised", "Nervous"
      ],
      validationPhrases: [
        "That sounds really challenging",
        "I can understand why you'd feel that way",
        "It makes sense you're feeling [emotion]",
        "Thank you for sharing that with me",
        "Your feelings are completely valid"
      ],
      empathyStatements: [
        "I'm here to support you through this",
        "That must be really difficult",
        "I appreciate you trusting me with this",
        "You're not alone in this feeling",
        "I can imagine how that would feel"
      ]
    };

    this.conversationPatterns = {
      greetings: {
        formal: [
          "Good morning/afternoon/evening",
          "Hello, how are you today?",
          "Greetings! How can I assist you?",
          "नमस्ते, आप कैसे हैं? (Hindi - Namaste, how are you?)",
          "नमस्कार, तुम्ही कसे आहात? (Marathi - Namaskar, how are you?)",
          "सुप्रभात, मैं आपकी क्या सेवा कर सकता हूँ? (Hindi - Good morning, how can I serve you?)",
          "शुभ सकाळ, मी तुम्हाला कशी मदत करू शकतो? (Marathi - Good morning, how can I help you?)",
          "प्रणाम, आपके लिए मैं क्या कर सकता हूँ? (Hindi - Respectful greeting, what can I do for you?)"
        ],
        casual: [
          "Hey there! How's it going?",
          "Hi! What's on your mind?",
          "Hello! How can I help?",
          "हाय, क्या चल रहा है? (Hindi - Hi, what's going on?)",
          "काय चाललंय? (Marathi - What's going on?)",
          "कैसे हो दोस्त? (Hindi - How are you friend?)",
          "कसा आहेस मित्रा? (Marathi - How are you friend?)"
        ],
        warm: [
          "Welcome back! It's good to see you again",
          "Hello! I hope you're having a great day",
          "Hi! I'm here and ready to help",
          "आपका फिर से स्वागत है! (Hindi - Welcome back!)",
          "तुमचे पुन्हा स्वागत आहे! (Marathi - Welcome back!)",
          "आपको देखकर खुशी हुई। (Hindi - Happy to see you.)",
          "तुम्हाला पाहून आनंद झाला। (Marathi - Happy to see you.)"
        ]
      },
      
      activeListening: {
        paraphrasing: [
          "So what I'm hearing is...",
          "If I understand correctly...",
          "Let me make sure I've got this right...",
          "तो जो मैं समझ पा रहा हूँ... (Hindi)",
          "तर मला जे समजतंय त्याप्रमाणे... (Marathi)"
        ],
        clarifying: [
          "Could you tell me more about that?",
          "What specifically about that is concerning?",
          "Help me understand what you mean by...",
          "क्या आप इसके बारे में थोड़ा और बता सकते हैं? (Hindi)",
          "तुम्ही याबद्दल थोडं अधिक सांगू शकाल का? (Marathi)"
        ],
        summarizing: [
          "To summarize our conversation...",
          "Let me recap what we've discussed...",
          "The main points I'm taking away are..."
        ]
      },
      
      questionAsking: {
        openEnded: [
          "How are you feeling about this situation?",
          "What would be your ideal outcome?",
          "Tell me more about your experience with..."
        ],
        probing: [
          "What have you tried so far?",
          "What's holding you back from...?",
          "How important is this to you on a scale of 1-10?"
        ],
        solutionFocused: [
          "What's one small step you could take?",
          "What resources might help you?",
          "Who could support you in this?"
        ]
      },
      
      transitions: {
        topicChange: [
          "Speaking of that, I wanted to ask about...",
          "That reminds me of something related...",
          "Before we move on, I should mention..."
        ],
        deepening: [
          "Let's explore that further...",
          "I'm curious about something you mentioned earlier...",
          "Could we go back to when you said..."
        ],
        wrappingUp: [
          "As we start to wrap up...",
          "Before we finish, let me summarize...",
          "Is there anything else you'd like to discuss?"
        ]
      }
    };

    this.culturalConsiderations = {
      formalityLevels: {
        'en-US': {
          formal: ["Mr.", "Ms.", "Dr.", "Please", "Thank you", "Would you mind"],
          casual: ["Hey", "No problem", "Sure thing", "Got it"]
        },
        'hi-IN': {
          formal: ["जी (Ji)", "आप (Aap)", "कृपया (Kripya)", "धन्यवाद (Dhanyawad)", "श्रीमान (Shriman)", "आदरणीय (Aadaraniya)"],
          casual: ["तुम (Tum)", "अरे (Are)", "ठीक है (Theek hai)", "चलो (Chalo)"]
        },
        'mr-IN': {
          formal: ["तुम्ही (Tumhi)", "कृपया (Kripya)", "आभारी आहे (Aabhari aahe)", "धन्यवाद (Dhanyawad)", "साहेब (Saheb)", "माननीय (Mananiya)"],
          casual: ["तू (Tu)", "बरं (Bara)", "ठीक आहे (Theek aahe)"]
        }
      },
      
      communicationStyles: {
        direct: ['de-DE', 'nl-NL', 'en-US'], 
        indirect: ['ja-JP', 'ko-KR', 'th-TH', 'hi-IN', 'mr-IN'], 
        emotional: ['it-IT', 'es-ES', 'ar-SA'], 
        reserved: ['en-GB', 'fi-FI', 'sv-SE'] 
      },
      
      taboos: {
        general: [
          "Avoid assumptions about personal life",
          "Don't give unsolicited advice",
          "Never invalidate experiences",
          "Avoid political/religious opinions unless asked"
        ],
        regionSpecific: {
          'hi-IN': ["Respect religious sensitivities", "Avoid beef references", "Avoid addressing elders by name"],
          'mr-IN': ["Respect local traditions and festivals", "Avoid addressing elders by name", "Use respectful plural pronouns"]
        }
      }
    };

    this.specialSituations = {
      whenSomeoneIsUpset: {
        do: [
          "Stay calm and patient",
          "Validate their feelings first",
          "Use gentle, reassuring tone",
          "Ask how you can help",
          "Offer space if needed"
        ],
        dont: [
          "Don't say 'calm down'",
          "Don't minimize their feelings",
          "Don't offer solutions immediately",
          "Don't take it personally",
          "Don't rush them"
        ],
        phrases: [
          "I can see this is really affecting you",
          "Take your time, I'm listening",
          "Would it help to talk about it?",
          "I'm here for you, however you need",
          "Your feelings matter to me",
          "मैं समझ सकता हूँ कि आप परेशान हैं। (Hindi)",
          "मी समजू शकतो की तुम्हाला त्रास होत आहे। (Marathi)",
          "शांत हो जाइए, मैं आपकी बात सुन रहा हूँ। (Hindi)",
          "काळजी करू नका, मी तुमच्या सोबत आहे। (Marathi)"
        ]
      },
      
      whenCelebratingSuccess: {
        genuine: [
          "That's amazing! Congratulations!",
          "I'm so happy for you!",
          "You should be really proud of yourself",
          "This is wonderful news!",
          "बहुत-बहुत बधाई! (Hindi)",
          "खूप खूप अभिनंदन! (Marathi)",
          "आपकी मेहनत रंग लाई! (Hindi)",
          "तुमच्या कष्टाचे फळ मिळाले! (Marathi)"
        ]
      }
    };

    this.languagePatterns = {
      positiveFraming: {
        insteadOf: {
          "I can't": "Here's what I can do",
          "That's wrong": "Let me clarify",
          "You have to": "You might consider",
          "No": "Unfortunately that's not possible, but"
        }
      },
      
      collaborativeLanguage: {
        teamwork: [
          "Let's figure this out together",
          "We can work through this",
          "I'm here to support your process",
          "हम मिलकर इसका समाधान ढूंढेंगे। (Hindi)",
          "आपण मिळून यावर तोडगा काढू। (Marathi)"
        ]
      }
    };
  }

  getResponsePattern(situation, emotion = 'neutral', formality = 'casual') {
    const patterns = {
      greeting: this.getGreeting(formality),
      empathetic: this.getEmpatheticResponse(emotion),
      clarifying: this.getClarifyingQuestion(),
      summarizing: this.getSummaryStatement(),
      encouraging: this.getEncouragement(),
      closing: this.getClosingStatement(formality)
    };
    return patterns[situation] || patterns.greeting;
  }

  getGreeting(formality = 'casual') {
    const greetings = this.conversationPatterns.greetings[formality];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getEmpatheticResponse(emotion) {
    const negative = ['sad', 'frustrated', 'angry', 'anxious'];
    if (negative.includes(emotion)) {
      const responses = this.specialSituations.whenSomeoneIsUpset.phrases;
      return responses[Math.floor(Math.random() * responses.length)];
    }
    return "Tell me more about what you're thinking.";
  }

  getClarifyingQuestion() {
    const questions = [
      ...this.conversationPatterns.activeListening.clarifying,
      ...this.conversationPatterns.questionAsking.openEnded
    ];
    return questions[Math.floor(Math.random() * questions.length)];
  }

  getSummaryStatement() {
    const summaries = this.conversationPatterns.activeListening.summarizing;
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  getEncouragement() {
    const encouragements = [
      ...this.specialSituations.whenCelebratingSuccess.genuine
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  getClosingStatement(formality = 'casual') {
    const closings = {
      formal: [
        "Thank you for our conversation today.",
        "I appreciate you speaking with me.",
        "धन्यवाद, फिर मिलेंगे। (Hindi)",
        "धन्यवाद, पुन्हा भेटूया। (Marathi)",
        "आपका दिन शुभ हो। (Hindi)",
        "तुमचा दिवस शुभ असो। (Marathi)"
      ],
      casual: [
        "Thanks for chatting!",
        "Talk to you soon!",
        "Take care!",
        "फिर मिलते हैं! (Hindi)",
        "पुन्हा भेटू! (Marathi)",
        "ख्याल रखियेगा! (Hindi)",
        "काळजी घ्या! (Marathi)"
      ],
      warm: [
        "It was really nice talking with you!",
        "I enjoyed our conversation!",
        "आपसे बात करके अच्छा लगा। (Hindi)",
        "तुमच्याशी बोलून आनंद झाला। (Marathi)"
      ]
    };
    const options = closings[formality] || closings.casual;
    return options[Math.floor(Math.random() * options.length)];
  }

  detectEmotionalTone(text) {
    const emotionIndicators = {
      happy: ['great', 'wonderful', 'excited', 'happy', 'love', 'amazing', 'अच्छा', 'बढ़िया', 'आनंद', 'मजा', 'आनंदी'],
      sad: ['sad', 'unhappy', 'depressed', 'lonely', 'miss', 'दुखी', 'अकेला', 'परेशान', 'वाईट', 'दुःख'],
      frustrated: ['frustrated', 'annoyed', 'angry', 'irritated', 'mad', 'चिड़चिड़ा', 'गुस्सा', 'राग', 'संताप'],
      anxious: ['worried', 'anxious', 'nervous', 'stressed', 'overwhelmed', 'चिंतित', 'घबराहट', 'काळजी', 'चिंता'],
      confused: ['confused', 'unsure', 'don\'t understand', 'puzzled', 'उलझन', 'गोंधळ']
    };

    const textLower = text.toLowerCase();
    let detectedEmotions = [];

    for (const [emotion, words] of Object.entries(emotionIndicators)) {
      if (words.some(word => textLower.includes(word))) {
        detectedEmotions.push(emotion);
      }
    }

    return detectedEmotions.length > 0 ? detectedEmotions[0] : 'neutral';
  }

  getPhraseBank(category) {
    const phraseBanks = {
      opening: [
        "Hello! How can I help you today?",
        "नमस्ते! मैं आपकी क्या मदद कर सकता हूँ? (Hindi)",
        "नमस्कार! मी तुमची काय मदत करू शकतो? (Marathi)"
      ],
      listening: [
        "I'm listening.",
        "Tell me more.",
        "जी, मैं सुन रहा हूँ। (Hindi)",
        "जी, मी ऐकत आहे। (Marathi)"
      ],
      validating: [
        "Your feelings make sense.",
        "That's a valid perspective.",
        "आपकी बात बिल्कुल सही है। (Hindi)",
        "तुमचे म्हणणे अगदी बरोबर आहे। (Marathi)"
      ],
      supporting: [
        "I'm here for you.",
        "You're not alone in this.",
        "मैं आपके साथ हूँ, घबराइए नहीं। (Hindi)",
        "मी तुमच्या सोबत आहे, काळजी करू नका। (Marathi)",
        "आप अकेले नहीं हैं। (Hindi)",
        "तुमही एकटे नाही आहात। (Marathi)",
        "परेशान मत होइए, हम मिलकर इसका हल निकालेंगे। (Hindi)",
        "काळजी करू नका, आपण मिळून यावर मार्ग काढू। (Marathi)"
      ],
      closing: [
        "Is there anything else I can help with?",
        "Thank you for sharing with me.",
        "धन्यवाद! आपका दिन शुभ हो। (Hindi)",
        "धन्यवाद! तुमचा दिवस चांगला जावो। (Marathi)"
      ]
    };

    return phraseBanks[category] || phraseBanks.opening;
  }

  generateHumanLikeResponse(userInput, context = {}) {
    const emotion = this.detectEmotionalTone(userInput);
    let response = '';
    
    if (emotion !== 'neutral') {
      response += this.getEmpatheticResponse(emotion) + ' ';
    }
    
    if (userInput.includes('?') || userInput.length < 20) {
      response += this.getClarifyingQuestion() + ' ';
    } else {
      response += this.getSummaryStatement() + ' ';
    }
    
    const supportingPhrases = this.getPhraseBank('supporting');
    response += supportingPhrases[Math.floor(Math.random() * supportingPhrases.length)] + ' ';
    
    const closingPhrases = this.getPhraseBank('closing');
    response += closingPhrases[Math.floor(Math.random() * closingPhrases.length)];
    
    return response.trim();
  }
}

export {
  HumanCommunicationGuide
};
