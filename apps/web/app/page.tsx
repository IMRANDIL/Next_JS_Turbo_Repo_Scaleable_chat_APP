'use client'

import ChatInterface from "../components/ChatInterface"
import { useSocket } from "../context/SocketProvider"

export default function Page() {
  const {sendMessage, messages} = useSocket()
  return (
    <>
    <h1 style={{
      background: 'green',
      textAlign: 'center'
    }}>The Chat</h1>

    <div style={{
      background: 'green',
      height: '90vh',
      display: 'flex',
      justifyContent:'center'
    }}>
<ChatInterface sendMessage={sendMessage} messages={messages}/>
    </div>
    </>
  )
}