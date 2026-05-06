// Lightweight WebSocket relay for presence messages
// Usage: `npm install ws` then `node scripts/presence-server.js`

const port = process.env.PORT || 3012
try {
  const WebSocket = require('ws')
  const wss = new WebSocket.Server({ port })
  console.log('Presence relay running on ws://0.0.0.0:' + port)

  wss.on('connection', (ws) => {
    ws.on('message', (msg) => {
      try {
        // broadcast to other clients
        for (const client of wss.clients) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(msg)
          }
        }
      } catch (err) {}
    })

    ws.on('close', () => {})
  })
} catch (err) {
  console.error('Failed to start presence server. Run `npm install ws` to install dependencies.')
  console.error(err && err.stack ? err.stack : err)
  process.exit(1)
}
