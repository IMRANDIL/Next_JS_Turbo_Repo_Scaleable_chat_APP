'use client'

import React, { useState, useRef,useEffect, FC } from 'react';
import styles from '../styles/ChatInterface.module.css';

interface ChatInterfaceProps {
  sendMessage: (message: string) => void;
  messages: string[];
}

const ChatInterface: FC<ChatInterfaceProps> = ({ sendMessage, messages }) => {
  const [newMessage, setNewMessage] = useState('');
   const messageContainerRef = useRef<HTMLDivElement | null>(null);

 //  const messageContainerRef = useRef<HTMLDivElement>(null);
  //const messageContainerRef = useRef();

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
    const { scrollTop, scrollHeight } = messageContainerRef.current;

    // Use the non-null assertion operator (!) to assert that scrollTop and scrollHeight are not null or undefined
    if (scrollTop !== undefined && scrollHeight !== undefined) {
      messageContainerRef.current.scrollTop! = scrollHeight;
    }
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
