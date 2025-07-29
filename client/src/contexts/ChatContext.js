import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Generate session ID based on user details
const generateSessionId = (userDetails) => {
  const { firstName, lastName, dateOfBirth } = userDetails;
  const dob = new Date(dateOfBirth);
  const dobString = dob.toISOString().split('T')[0]; // YYYY-MM-DD format
  
  // Create a hash-like string from user details
  const baseString = `${lastName.toLowerCase()}_${firstName.toLowerCase()}_${dobString}`;
  
  // Generate a hash and take first 8 characters
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const hashString = Math.abs(hash).toString(36).substring(0, 8);
  
  return `${hashString}_${Date.now().toString(36)}`;
};

// Load persisted state from localStorage
function getInitialState() {
  let persisted = {};
  try {
    persisted = JSON.parse(localStorage.getItem('chatbotState')) || {};
  } catch {}
  return {
    sessionId: persisted.sessionId || null,
    healthcareContext: persisted.healthcareContext || null,
    privacyStyle: persisted.privacyStyle || null,
    userDetails: persisted.userDetails || null,
    isUserRegistered: persisted.isUserRegistered || false,
    messages: persisted.messages || [],
    isLoading: false,
    error: null,
    privacyBoxVisible: persisted.privacyBoxVisible || false,
    welcomeMessage: persisted.welcomeMessage || null
  };
}

const initialState = getInitialState();

// Action types
const ACTIONS = {
  INITIALIZE_SESSION: 'INITIALIZE_SESSION',
  REGISTER_USER: 'REGISTER_USER',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_PRIVACY_BOX: 'TOGGLE_PRIVACY_BOX',
  SET_WELCOME_MESSAGE: 'SET_WELCOME_MESSAGE'
};

// Reducer function
function chatReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INITIALIZE_SESSION:
      // Only set privacyBoxVisible to false on first load (when state.privacyStyle is null)
      return {
        ...state,
        sessionId: action.payload.sessionId,
        healthcareContext: action.payload.healthcareContext,
        privacyStyle: action.payload.privacyStyle,
        privacyBoxVisible: (state.privacyStyle !== action.payload.privacyStyle) ? false : state.privacyBoxVisible
      };
    
    case ACTIONS.REGISTER_USER:
      return {
        ...state,
        userDetails: action.payload.userDetails,
        sessionId: action.payload.sessionId,
        isUserRegistered: true
      };
    
    case ACTIONS.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null
      };
    
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case ACTIONS.TOGGLE_PRIVACY_BOX:
      // Only allow toggling for progressive privacy style
      if (state.privacyStyle === 'progressive') {
        return {
          ...state,
          privacyBoxVisible: !state.privacyBoxVisible
        };
      } else {
        return {
          ...state,
          privacyBoxVisible: false
        };
      }
    
    case ACTIONS.SET_WELCOME_MESSAGE:
      return {
        ...state,
        welcomeMessage: action.payload
      };
    
    default:
      return state;
  }
}

// Create context
const ChatContext = createContext();

// Provider component
export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Persist relevant state to localStorage on change
  useEffect(() => {
    localStorage.setItem('chatbotState', JSON.stringify({
      sessionId: state.sessionId,
      healthcareContext: state.healthcareContext,
      privacyStyle: state.privacyStyle,
      userDetails: state.userDetails,
      isUserRegistered: state.isUserRegistered,
      messages: state.messages,
      welcomeMessage: state.welcomeMessage
    }));
  }, [state.sessionId, state.healthcareContext, state.privacyStyle, state.userDetails, state.isUserRegistered, state.messages, state.welcomeMessage]);

  // Initialize session on component mount
  useEffect(() => {
    // Only initialize session if not already registered
    if (!state.isUserRegistered) {
      const initializeSession = () => {
        // Randomly select healthcare context
        const healthcareContexts = ['symptom checking', 'mental health support', 'chronic care management'];
        const healthcareContext = healthcareContexts[Math.floor(Math.random() * healthcareContexts.length)];
        // Randomly select privacy style
        const privacyStyles = ['minimal', 'contextual', 'progressive'];
        const privacyStyle = privacyStyles[Math.floor(Math.random() * privacyStyles.length)];
        dispatch({
          type: ACTIONS.INITIALIZE_SESSION,
          payload: { sessionId: null, healthcareContext, privacyStyle }
        });
        // Generate comprehensive welcome message based on context and privacy style
        const getWelcomeMessage = (healthcareContext, privacyStyle) => {
          const contextExplanations = {
            'symptom checking': {
              title: "Symptom Checking Assistant",
              description: "I'm here to help you understand your symptoms and provide general health guidance. I can help you identify potential causes, suggest when to seek professional care, and offer general wellness advice.",
              capabilities: [
                "Assess common symptoms and their possible causes",
                "Provide general health information and education",
                "Suggest when to consult healthcare professionals",
                "Offer preventive care and wellness tips"
              ],
              limitations: [
                "I cannot provide medical diagnosis",
                "I cannot prescribe medications",
                "Always consult healthcare professionals for specific medical concerns"
              ]
            },
            'mental health support': {
              title: "Mental Health Support Assistant",
              description: "I'm here to provide emotional support and help you explore coping strategies. I can offer a listening ear, suggest stress management techniques, and help you identify when professional help might be beneficial.",
              capabilities: [
                "Provide emotional support and active listening",
                "Suggest coping strategies and stress management techniques",
                "Help identify when professional mental health care might be needed",
                "Offer general wellness and self-care advice"
              ],
              limitations: [
                "I am not a replacement for professional therapy",
                "I cannot provide clinical mental health diagnosis",
                "For crisis situations, please contact emergency services or crisis hotlines"
              ]
            },
            'chronic care management': {
              title: "Chronic Care Management Assistant",
              description: "I'm here to support you in managing your chronic health conditions. I can help with education about your conditions, suggest lifestyle modifications, and assist with tracking strategies.",
              capabilities: [
                "Provide education about chronic conditions",
                "Suggest lifestyle modifications and self-care strategies",
                "Help with medication adherence and tracking",
                "Support communication with healthcare providers"
              ],
              limitations: [
                "I cannot replace your doctor's treatment plan",
                "Always follow your healthcare provider's advice",
                "I cannot adjust medications or treatment protocols"
              ]
            }
          };
          const privacyExplanations = {
            'minimal': {
              title: "Minimal Privacy Disclosure",
              description: "We maintain minimal data collection practices. Your conversations are private and secure, and we do not collect personal identifying information.",
              details: [
                "No personal identifiers are collected",
                "Conversation data is used only for service improvement",
                "Data is stored securely and encrypted"
              ]
            },
            'contextual': {
              title: "Contextual Privacy Disclosure",
              description: "We collect conversation data to provide personalized health guidance. Sensitive information is handled with extra care and only used for providing relevant health support.",
              details: [
                "Conversation data helps provide better health guidance",
                "Sensitive topics trigger additional privacy protections",
                "Data is anonymized and used only for service improvement"
              ]
            },
            'progressive': {
              title: "Progressive Privacy Disclosure",
              description: "We provide comprehensive privacy information to ensure transparency. Your data is encrypted, anonymized, and never shared with third parties.",
              details: [
                "Detailed privacy information is available throughout our conversation",
                "Data is encrypted and anonymized",
                "No data is shared with third parties",
                "You can request data deletion at any time"
              ]
            }
          };
          const contextConfig = contextExplanations[healthcareContext];
          const privacy = privacyExplanations[privacyStyle];
          return `# Welcome to Your Healthcare Assistant

## ${contextConfig.title}

${contextConfig.description}

### What I Can Help With:
${contextConfig.capabilities.map(cap => `• ${cap}`).join('\n')}

### Important Limitations:
${contextConfig.limitations.map(lim => `• ${lim}`).join('\n')}

---

## ${privacy.title}

${privacy.description}

### Privacy Practices:
${privacy.details.map(detail => `• ${detail}`).join('\n')}

---

**Ready to begin?** Please share your health concerns or questions, and I'll do my best to help while respecting your privacy and maintaining appropriate boundaries.`;
        };
        const welcomeMessage = getWelcomeMessage(healthcareContext, privacyStyle);
        // Remove all asterisks (**) from the welcome message
        const cleanWelcome = welcomeMessage.replace(/\*+/g, '');
        dispatch({
          type: ACTIONS.SET_WELCOME_MESSAGE,
          payload: cleanWelcome
        });
      };
      initializeSession();
    }
  }, [state.isUserRegistered]);

  // Context value
  const value = {
    ...state,
    registerUser: async (userDetails) => {
      const sessionId = generateSessionId(userDetails);
      dispatch({ 
        type: ACTIONS.REGISTER_USER, 
        payload: { userDetails, sessionId } 
      });
      // Do NOT update the welcome message after registration; keep the initial context-based welcome message only.
    },
    addMessage: (message) => dispatch({ type: ACTIONS.ADD_MESSAGE, payload: message }),
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTIONS.CLEAR_ERROR }),
    togglePrivacyBox: () => dispatch({ type: ACTIONS.TOGGLE_PRIVACY_BOX })
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 