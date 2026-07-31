import { createServer } from "http";
import { Server } from "socket.io";

import GameManager from "./GameManager.js";
import registerEvents from "./handlers/index.js";

const httpServer = createServer();

import config from "../config.js";

const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigin,
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

httpServer.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
  console.log(`Running on: ${config.host}:${config.port}`)
});