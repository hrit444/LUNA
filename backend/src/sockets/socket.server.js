const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const cookie = require("cookie")
const aiService = require("../services/ai.service")

const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {});

  //middleware like stuff
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        next(new Error("Authentication error: No chat will be created"));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: No token provided"));
    }
  });

  io.on("connection", (socket) => {

    socket.on("ai-message", async (messagePayload) => {

      try {
        const response = await aiService.generateResponse(messagePayload.message);

        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat
        });

      } catch (error) {
        console.error("AI Error:", error.message);

        socket.emit("ai-response", {
          content: "AI failed to respond.",
          chat: messagePayload.chat
        })
      }
      
    })
  });
};

module.exports = initSocketServer;
