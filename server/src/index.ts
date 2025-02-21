import { WebSocketServer, WebSocket } from "ws";
import express from "express";
import cors from "cors";
import http from "http";

const app = express();
app.use(cors());

const server = http.createServer(app);
const ws = new WebSocketServer({ server });

app.get("/ping", (req, res) => {
  res.status(200).send("Server is alive");
});

interface User {
  socket: WebSocket;
  roomId: string;
}

let userCount: number = 0;
let allSockets: User[] = [];

ws.on("connection", function connection(socket: WebSocket) {
  console.log("User connected");
  userCount++;

  socket.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString());

      if (parsedMessage.type === "join") {
        allSockets.push({ socket, roomId: parsedMessage.payload.roomId });
        console.log(`User joined room: ${parsedMessage.payload.roomId}`);
      }

      if (parsedMessage.type === "chat") {
        const currentUserRoom = allSockets.find((x) => x.socket === socket)?.roomId;

        if (currentUserRoom) {
          allSockets.forEach((user) => {
            if (user.roomId === currentUserRoom && user.socket.readyState === WebSocket.OPEN) {
              user.socket.send(
                JSON.stringify({
                  type: "chat",
                  senderId: parsedMessage.senderId,
                  message: parsedMessage.payload.message,
                })
              );
            }
          });
        }
      }
    } catch (error) {
      console.error("Invalid JSON received:", message.toString());
    }
  });

  socket.on("close", () => {
    console.log("User disconnected");
    userCount--;

    // Remove disconnected user from allSockets
    allSockets = allSockets.filter((user) => user.socket !== socket);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
