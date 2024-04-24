import { Redis } from "ioredis";
import { Server } from "socket.io";
import { produceMessage } from "./kafka";

const pub = new Redis({
  host: 'localhost',
  port: 6379
})

const sub = new Redis({
  host: 'localhost',
  port: 6379
})

export class SocketService {
  private _io: Server;
  // contructor
  constructor() {
    this._io = new Server({
      cors: {
        allowedHeaders: ["*"],
        origin: "*"
      }
    })
    sub.subscribe("MESSAGES")
  }
  // all event are here
  public initListner() {
    const io = this._io
    io.on("connect", socket => {
      console.log("Socket connect:", socket.id)
      // on message recieve
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message = ", message)
        await pub.publish("MESSAGES", JSON.stringify(message))
      })
    })
    sub.on("message", async (channel, message) => {
      if (channel == "MESSAGES") {
        io.emit("message", { message })
        await produceMessage(message)
      }
    })
  }
  get io() {
    return this._io
  }
}