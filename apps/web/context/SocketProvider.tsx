'use client'

import React, { useCallback, useContext, useEffect, useState } from "react";

import {io, Socket} from 'socket.io-client'

interface SocketProviderProp  {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string)=> any;
    messages: string[]
}

export const useSocket = () => {
    const state = useContext(SocketContext);
    if(!state) throw new Error('state is undefined');
    return state;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProp> = ({children}) => {
const [socket, setSocket] = useState<Socket>();
const [messages, setMessages] = useState<string[]>([])
const sendMessage: ISocketContext['sendMessage'] = useCallback((msg)=>{
    console.log('Send Message', msg);
    if(socket) {
        socket.emit('event:msg', {msg})
    }
},[socket]);

const onMessageRec = useCallback((msg: string)=>{
    console.log('from server msg received', msg);
     const {msg: message} = JSON.parse(msg['msg']);
    setMessages(prevMsg => [...prevMsg, message])
},[]);

const onPrevMessageRec = useCallback((prevMsg: string[])=>{
    console.log('from server prev msg received', prevMsg);
    setMessages(prevMsg.map(msg => msg && msg.text && JSON.parse(msg?.text!)?.msg));
},[])

useEffect(()=>{
const _socket = io('http://localhost:8000');
_socket.on('previousMessages', onPrevMessageRec);
_socket.on('message', onMessageRec)
setSocket(_socket);

return () => {
    _socket.disconnect();
    _socket.off('previousMessages')
    _socket.off('message')
    setSocket(undefined)
}

},[]);


    return (
        <SocketContext.Provider value={{sendMessage, messages}}>
            {children}
        </SocketContext.Provider>
    )
}
