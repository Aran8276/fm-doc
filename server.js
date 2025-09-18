// server.js
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { applyUpdate, encodeStateAsUpdate, Doc } from "yjs";
import { setupWSConnection, docs } from "y-websocket/bin/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const wss = new WebSocketServer({ noServer: true });
const debounceTimers = new Map();
const persistenceAttached = new Set();

const attachPersistence = async (docName) => {
  if (persistenceAttached.has(docName)) {
    return;
  }

  const doc = docs.get(docName);
  if (!doc) {
    console.error(`[Error] Doc not found immediately after setup: ${docName}`);
    return;
  }

  const ytext = doc.getText("codemirror");

  try {
    const dbDoc = await prisma.document.findUnique({ where: { id: docName } });
    if (dbDoc && dbDoc.content && ytext.length === 0) {
      applyUpdate(doc, encodeStateAsUpdate(new Doc()));
      ytext.insert(0, dbDoc.content);
      console.log(`[Loaded] Content for ${docName} from database.`);
    }
  } catch (e) {
    console.error(
      `[Error] Could not load document ${docName} from database:`,
      e
    );
  }

  doc.on("update", (update) => {
    if (debounceTimers.has(docName)) {
      clearTimeout(debounceTimers.get(docName));
    }

    const timer = setTimeout(async () => {
      const content = ytext.toString();
      try {
        await prisma.document.update({
          where: { id: docName },
          data: { content },
        });
        console.log(`[Saved] Document ${docName}`);
      } catch (error) {
        console.error(`[Error] Failed to save document ${docName}:`, error);
      }
    }, 2000);

    debounceTimers.set(docName, timer);
  });

  persistenceAttached.add(docName);
  console.log(`[Persistence Attached] Logic attached to ${docName}`);
};

const server = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

wss.on("connection", (ws, req) => {
  setupWSConnection(ws, req);
  const docName = req.url.slice(1).split("?")[0];
  if (docName) {
    attachPersistence(docName);
  }
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(8080, () => {
  console.log("WebSocket server listening on port 8080");
});
