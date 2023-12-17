'use client'

import React, { useState } from 'react';
import styles from '../styles/ChatInterface.module.css'

const ChatInterface = ({sendMessage, messages}) => {
  // const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      sendMessage(newMessage)
      // setMessages([...messages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messageContainer}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
             
                 styles.userMessage
               
            }
          >
            {message}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatInterface;
