'use client'

import ChatInterface from "../components/ChatInterface"

export default function Page() {
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
<ChatInterface/>
    </div>
    </>
  )
}