import { Kafka, Producer } from "kafkajs";
import { prismaClient } from "./prisma";

export const kafa = new Kafka({
  clientId: "Kafka-backend",
  brokers: ["localhost:9092"]
})

let producer: null | Producer = null

export async function createProducer() {
  if (producer) return producer
  const _producer = kafa.producer()
  await _producer.connect()
  producer = _producer
  return producer
}

export async function produceMessage(msg: string) {
  const producer = await createProducer()
  await producer.send({
    messages: [{ key: `message-${Date.now()}`, value: msg }],
    topic: "MESSAGE"
  })
  return true
}

export async function startMessageConsumer() {
  const consumer = kafa.consumer({ groupId: "default" })
  await consumer.connect()
  await consumer.subscribe({ topic: "MESSAGE", fromBeginning: true })
  await consumer.run({
    autoCommit: true,
    eachMessage: async ({ message, pause }) => {
      if (!message.value) return
      try {
        await prismaClient.messages.create({
          data: { text: message.value?.toString() }
        })
      }
      catch (e) {
        console.log("error = ", e)
        pause()
        setTimeout(() => { consumer.resume([{ topic: "MESSAGE" }]) }, 60 * 1000)
      }
    }
  })

}

