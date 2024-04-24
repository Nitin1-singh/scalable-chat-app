"use client"

import { useState } from "react"
import { useSocket } from "../context/SocketProvider"

export function AllMessage() {
  const { sendMessage, messages } = useSocket()
  const [msg, setMsg] = useState<string>("")
  return (
    <div>
      <h1>All Message</h1>
      <div>
        {messages.map((m) => (<li>{m}</li>))}
      </div>
      <div>
        <input onChange={(e) => setMsg(e.target.value)} placeholder="enter your message" />
        <button onClick={(e) => sendMessage(msg)}>Send</button>
      </div>
    </div>
  )
}