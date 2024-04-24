"use server"

import { AllMessage } from "../components/AllMessage"

export default async function Home() {
  return (
    <main>
      <h1>Scalable Chat App</h1>
      <AllMessage />
    </main>
  )
}