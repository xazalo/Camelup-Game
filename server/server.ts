import { createServer } from "http";
import { Server } from "socket.io";

import GameManager from "./GameManager.js";
import registerEvents from "./events/index.js";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4173",
    methods: ["GET", "POST"],
  },
});

const manager = new GameManager();

io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  registerEvents(io, socket, manager);

  socket.on("disconnect", (reason) => {
    console.log(
      "Player disconnected:",
      socket.id,
      "reason:",
      reason
    );
  });

});

httpServer.listen(3000, () => {
  console.log("Listening on port 3000");
});