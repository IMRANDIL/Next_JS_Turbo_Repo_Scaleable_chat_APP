'use client'

import React, { useState, useRef,useEffect, FC } from 'react';
import styles from '../styles/ChatInterface.module.css';

interface ChatInterfaceProps {
  sendMessage: (message: string) => void;
  messages: Message[];
}

const ChatInterface: FC<ChatInterfaceProps> = ({ sendMessage, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const messageContainerRef = useRef();

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of adding a newline
      handleSendMessage();
    }
  };

  // UseEffect to scroll to the latest message when messages are updated
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageContainer} ref={messageContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={styles.userMessage}>
            {message}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
