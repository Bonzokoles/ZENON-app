self.addEventListener("install", (event) => {
  console.log("Service Worker installed")
})

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated")
})

// Background timer sync
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "START_BACKGROUND_TIMER") {
    const startTime = Date.now()

    // Sprawdzaj timer co minutę
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)

      // Wyślij aktualizację do aplikacji
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: "TIMER_UPDATE",
            elapsed: elapsed,
          })
        })
      })
    }, 60000)

    // Zapisz interval ID
    self.timerInterval = interval
  }

  if (event.data && event.data.type === "STOP_BACKGROUND_TIMER") {
    if (self.timerInterval) {
      clearInterval(self.timerInterval)
      self.timerInterval = null
    }
  }
})
