
import React, { useRef, useEffect } from 'react';
import { Home } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SessionInfo from './SessionInfo';
import PrivacyDisclosure from './PrivacyDisclosure';
import UserRegistration from './UserRegistration';
import { cn } from '../utils/cn';
// Accessible skip link styles (for reference, not used as a variable)
// const skipLinkStyles = `
//   absolute left-2 top-2 z-50 px-4 py-2 bg-white text-blue-900 rounded shadow
//   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
//   transition-transform -translate-y-16 focus:translate-y-0
// `;

const ChatInterface = () => {
  const {
    sessionId,
    healthcareContext,
    privacyStyle,
    userDetails,
    isUserRegistered,
    messages,
    isLoading,
    error,
    privacyBoxVisible,
    welcomeMessage,
    addMessage,
    setLoading,
    setError,
    clearError,
    togglePrivacyBox,
    registerUser
  } = useChat();

  // Button handler to reset registration and go back to registration page
  const handleGoToRegistration = () => {
    // Clear registration state and localStorage
    localStorage.removeItem('chatbotState');
    window.location.reload();
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      id: Date.now(),
      content,
      timestamp: new Date().toISOString(),
      sender: 'user'
    };

    addMessage(userMessage);
    setLoading(true);
    clearError();

    try {
      // Send message to backend (Vercel serverless expects userInput and healthcareContext)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: content,
          healthcareContext
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.reply) {
        // Remove all asterisks (**) from the bot reply
        const cleanReply = data.reply.replace(/\*+/g, '');
        const botMessage = {
          id: Date.now() + 1,
          content: cleanReply,
          timestamp: new Date().toISOString(),
          sender: 'bot'
        };

        addMessage(botMessage);

        // Save chat log
        await fetch('/api/chatlog', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            healthcareContext,
            privacyStyle,
            userInput: content,
            botReply: data.reply,
            userDetails
          }),
        });
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show registration form if user is not registered
  if (!isUserRegistered) {
    return (
      <UserRegistration
        onRegister={registerUser}
        healthcareContext={healthcareContext}
        privacyStyle={privacyStyle}
      />
    );
  }

  return (
    <>
      <a
        href="#main-content"
        className="skip-to-main-content absolute left-2 top-2 z-50 px-4 py-2 bg-white text-blue-900 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-transform -translate-y-16 focus:translate-y-0"
        tabIndex={0}
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex flex-col h-screen bg-gradient-to-br from-blue-100 to-white" role="main" aria-label="Chat interface">
      {/* Sticky, responsive header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur shadow border-b border-gray-200" role="banner">
        <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight" tabIndex={0} aria-label="CAPS Healthbot">
              CAPS Healthbot
            </h1>
            <p className="text-gray-900 text-base sm:text-lg" tabIndex={0}>
              Privacy-aware AI assistant for healthcare support
            </p>
            {userDetails && (
            <p className="text-sm text-blue-900 mt-1 leading-relaxed" tabIndex={0} aria-live="polite">
                Welcome, {userDetails.firstName}!
              </p>
            )}
          </div>
          <button
            onClick={handleGoToRegistration}
            className="mt-2 sm:mt-0 w-11 h-11 min-w-[44px] min-h-[44px] bg-blue-700 text-white rounded-full shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:bg-blue-800 transition flex items-center justify-center"
            aria-label="Go to Home / Registration"
            title="Go to Home / Registration"
          >
            <Home className="w-6 h-6" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </button>
        </div>
        {/* Session Info Bar */}
        {sessionId && healthcareContext && privacyStyle && (
          <div className="w-full px-4 pb-2">
            <SessionInfo 
              healthcareContext={healthcareContext} 
              privacyStyle={privacyStyle} 
            />
          </div>
        )}
      </header>

      {/* Chat area, scrollable, with modern card look */}
      <section
        className="flex-1 overflow-y-auto px-1 sm:px-0 py-2 sm:py-4 w-full flex flex-col gap-3 sm:gap-4 bg-gradient-to-b from-white/80 to-blue-50"
        aria-label="Chat messages"
        role="region"
        tabIndex={0}
      >
        {/* Welcome message and session status */}
        {welcomeMessage && (
          <div className="mx-auto max-w-2xl w-full">
            <ChatMessage
              message={{
                id: 'welcome',
                content: welcomeMessage,
                timestamp: new Date().toISOString(),
                sender: 'bot',
                isWelcome: true
              }}
              isUser={false}
            />
            <div className="flex justify-center mb-4" aria-live="polite">
              <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center shadow-sm w-full max-w-md">
                <p className="text-green-900 text-sm font-semibold mb-2 leading-relaxed">
                  <span aria-hidden="true">✅</span> Session initialized successfully
                </p>
                <p className="text-green-900 text-xs leading-relaxed">
                  You can now start your conversation below
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chat messages */}
        <div className="flex flex-col gap-2 sm:gap-3 mx-auto w-full max-w-2xl">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
            />
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4 animate-fade-in mx-auto max-w-2xl w-full" aria-live="polite" aria-busy="true">
            <div className="flex gap-3 items-center">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="chat-bubble chat-bubble-bot" aria-label="Bot is typing">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center mb-4 mx-auto max-w-2xl w-full" aria-live="assertive" role="alert">
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-red-700 text-sm shadow w-full">
              {error}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} tabIndex={-1} aria-hidden="true" />
      </section>

      {/* Sticky, mobile-friendly chat input */}
      <footer className="sticky bottom-0 z-20 w-full px-2 sm:px-4 py-2 sm:py-3 bg-white/95 border-t border-gray-200 shadow-sm" role="contentinfo">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!sessionId}
          />
        </div>
      </footer>
      </main>
    </>
  );
};

export default ChatInterface; 