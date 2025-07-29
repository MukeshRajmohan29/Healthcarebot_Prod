import React from 'react';
import { ChatProvider } from './contexts/ChatContext';
import ChatInterface from './components/ChatInterface';
import './index.css';

function App() {
  return (
    <ChatProvider>
      <div className="App">
        <ChatInterface />
      </div>
    </ChatProvider>
  );
}

export default App; 