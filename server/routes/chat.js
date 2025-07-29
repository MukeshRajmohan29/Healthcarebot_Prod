const express = require('express');
const { body, validationResult } = require('express-validator');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Healthcare context system prompts
const HEALTHCARE_CONTEXTS = {
  'symptom checking': {
    name: 'Symptom Checking',
    systemPrompt: `You are a healthcare assistant specializing in symptom assessment. Your role is to:
- Help users understand their symptoms
- Provide general health information
- Suggest when to seek professional medical care
- Ask relevant follow-up questions to better understand symptoms
- Always remind users that you cannot provide medical diagnosis
- Be empathetic and professional in your responses
- Focus on general wellness and preventive care advice`
  },
  'mental health support': {
    name: 'Mental Health Support',
    systemPrompt: `You are a compassionate mental health support assistant. Your role is to:
- Provide emotional support and active listening
- Offer coping strategies and stress management techniques
- Help users identify when they might need professional mental health care
- Be non-judgmental and supportive
- Encourage self-care practices
- Provide crisis resources when appropriate
- Always emphasize that you are not a replacement for professional therapy
- Maintain appropriate boundaries while being warm and understanding`
  },
  'chronic care management': {
    name: 'Chronic Care Management',
    systemPrompt: `You are a chronic care management assistant. Your role is to:
- Help users manage their chronic health conditions
- Provide education about their conditions
- Suggest lifestyle modifications and self-care strategies
- Help track symptoms and medication adherence
- Encourage regular medical check-ups
- Provide support for medication management
- Help users communicate better with their healthcare providers
- Always remind users to follow their doctor's advice and treatment plans`
  }
};

// Privacy style configurations
const PRIVACY_STYLES = {
  'minimal': 'minimal',
  'contextual': 'contextual', 
  'progressive': 'progressive'
};

// Validation middleware
const validateChatRequest = [
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
  body('sessionId').isLength({ min: 1, max: 255 }).withMessage('Session ID is required'),
  body('healthcareContext').isIn(Object.keys(HEALTHCARE_CONTEXTS)).withMessage('Valid healthcare context is required'),
  body('privacyStyle').isIn(Object.keys(PRIVACY_STYLES)).withMessage('Valid privacy style is required')
];

// POST /api/chat
router.post('/', validateChatRequest, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { message, sessionId, healthcareContext, privacyStyle } = req.body;

    // Get the appropriate system prompt for the healthcare context
    const contextConfig = HEALTHCARE_CONTEXTS[healthcareContext];
    if (!contextConfig) {
      return res.status(400).json({ error: 'Invalid healthcare context' });
    }

    // Add privacy-aware instructions based on privacy style
    let privacyInstructions = '';
    let privacyContext = '';
    switch (privacyStyle) {
      case 'minimal':
        privacyInstructions = 'Maintain minimal data collection and avoid asking for personal identifiers.';
        privacyContext = 'Minimal Privacy: We maintain minimal data collection practices. Your conversations are private and secure, and we do not collect personal identifying information. Data is stored securely and encrypted, used only for service improvement.';
        break;
      case 'contextual':
        privacyInstructions = 'When asking sensitive questions, provide context about why the information is needed and how it will be used.';
        privacyContext = 'Contextual Privacy: We collect conversation data to provide personalized health guidance. Sensitive information is handled with extra care and only used for providing relevant health support. Data is anonymized and used only for service improvement.';
        break;
      case 'progressive':
        privacyInstructions = 'Provide detailed privacy information when discussing sensitive topics and explain data handling practices.';
        privacyContext = 'Progressive Privacy: We provide comprehensive privacy information to ensure transparency. Your data is encrypted, anonymized, and never shared with third parties. Detailed privacy information is available throughout our conversation, and you can request data deletion at any time.';
        break;
    }

    const fullSystemPrompt = `${contextConfig.systemPrompt}

Privacy Guidelines:
- ${privacyInstructions}
- Do not collect or store personal identifying information
- Focus on general health guidance rather than specific medical advice
- Always encourage users to consult healthcare professionals for specific medical concerns
- Be transparent about your limitations as an AI assistant

Welcome Message Guidelines:
- When generating welcome messages, create a natural, conversational flow
- Start with a warm, personalized greeting using the user's name
- Explain the healthcare context and capabilities in a friendly, accessible way
- Include privacy information naturally within the conversation
- Use bullet points only for listing capabilities and privacy features
- Avoid markdown headers - make it feel like a natural conversation
- End with a friendly, encouraging closing using their name
- Keep the tone warm, supportive, and age-appropriate
- Do not include session IDs or technical details

Privacy Context for Welcome Messages:
${privacyContext}

Remember: You are an AI assistant providing general health information and support. You cannot provide medical diagnosis, treatment, or replace professional healthcare.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: fullSystemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const botReply = completion.choices[0].message.content;

    // Return the response
    res.json({
      success: true,
      reply: botReply,
      sessionId,
      healthcareContext: contextConfig.name,
      privacyStyle,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    if (error.code === 'insufficient_quota' || error.code === 'invalid_api_key') {
      return res.status(401).json({ 
        error: 'OpenAI API configuration error. Please check your API key and quota.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 