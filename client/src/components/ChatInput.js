import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-gray-200 bg-white">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here..."
          className={cn(
            "input-field resize-none py-3 pr-12",
            "min-h-[44px] max-h-32",
            "focus:ring-2 focus:ring-primary-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          rows={1}
          disabled={disabled || isLoading}
        />
      </div>
      
      <button
        type="submit"
        aria-label="Send message"
        disabled={!message.trim() || isLoading || disabled}
        className={cn(
          "btn-primary flex-shrink-0 w-12 h-12 flex items-center justify-center",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all duration-200"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
};

export default ChatInput; 