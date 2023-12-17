'use client'

import ChatInterface from "../components/ChatInterface"

export default function Page() {
  return (
    <div style={{
      background: 'green',
      height: '100vh',
      display: 'flex',
      justifyContent:'center'
    }}>
<ChatInterface/>
    </div>
  )
}