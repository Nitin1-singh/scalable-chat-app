"use client"
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react"
import { Socket, io } from "socket.io-client"

interface SocketProviderProps {
  children?: ReactNode
}

interface SocketContextProps {
  sendMessage: (msg: string) => any
  messages: string[]
}

interface msgT {
  message: string
}

const SocketContext = createContext<SocketContextProps | null>(null)

export const useSocket = () => {
  const state = useContext(SocketContext)
  if (!state) throw new Error("State is undefined")
  return state
}

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>()
  const [messages, setMsg] = useState<string[]>([])

  const sendMessage: SocketContextProps["sendMessage"] = useCallback((msg) => {
    console.log("send Message client", msg)
    if (socket) {
      socket.emit("event:message", { message: msg })
    }
  }, [socket])

  const onMsgRec = useCallback(async (msg: msgT) => {
    const message = msg.message
    setMsg(prev => [...prev, message])
  }, [])

  useEffect(() => {
    const _socket = io("http://localhost:8000")
    _socket.on("message", onMsgRec)
    setSocket(_socket)

    return () => {
      _socket.disconnect()
      _socket.off("message", onMsgRec)
      setSocket(undefined)
    }
  }, [])

  return (
    <SocketContext.Provider value={{ sendMessage, messages }} >
      {children}
    </SocketContext.Provider>
  )
}