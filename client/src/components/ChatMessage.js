import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '../utils/cn';

const ChatMessage = ({ message, isUser }) => {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-healthcare-500 rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "flex flex-col max-w-xs lg:max-w-md",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "chat-bubble",
          isUser ? "chat-bubble-user" : "chat-bubble-bot"
        )}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.isWelcome ? (
              <div className="prose prose-sm max-w-none">
                {message.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-lg font-bold mb-2 text-primary-900">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-base font-semibold mb-2 mt-4 text-primary-900">{line.substring(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-sm font-medium mb-1 mt-3 text-primary-900">{line.substring(4)}</h3>;
                  } else if (line.startsWith('• ')) {
                    return <div key={index} className="ml-4 mb-1">• {line.substring(2)}</div>;
                  } else if (line === '---') {
                    return <hr key={index} className="my-3 border-gray-300" />;
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="mb-2">{line}</p>;
                  }
                })}
              </div>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        </div>
        
        <span className={cn(
          "text-xs mt-1 text-gray-900",
          isUser ? "text-right" : "text-left"
        )}>
          {formatTime(message.timestamp)}
        </span>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 