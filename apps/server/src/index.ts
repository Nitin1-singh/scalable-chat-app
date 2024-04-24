import http from "http"
import { SocketService } from "./services/socket"
import { startMessageConsumer } from "./services/kafka"
async function main() {
  startMessageConsumer()
  const httpServer = http.createServer()
  const sockerService = new SocketService()
  const PORT = process.env.PORT ? process.env.PORT : 8000

  sockerService.io.attach(httpServer)
  httpServer.listen(PORT, () => {
    console.log(`server at ${PORT}`)
  })
  sockerService.initListner()

}
main()