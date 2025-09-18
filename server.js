// server.js
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { setupWSConnection } from "y-websocket/bin/utils";

const wss = new WebSocketServer({ noServer: true });
const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(8080, () => {
  console.log("WebSocket server listening on port 8080");
});
