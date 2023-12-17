'use client'

import React from "react"

interface SocketProviderProp  {
    children?: React.ReactNode
}

interface ISocketContext {
    sendMessage: (msg: string)=> any;
}

const SocketContext = React.createContext<ISocketContext | null>(null);

export const SocketProvider: React.FC<SocketProviderProp> = ({children}) => {
    return (
        <SocketContext.Provider value={null}>
            {children}
        </SocketContext.Provider>
    )
}