const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const cookie = require("cookie");
const aiService = require("../services/ai.service");
const vectorService = require("../services/vector.service");
const crypto = require("crypto");

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
        // if we get the payload
        if (!messagePayload?.content || !messagePayload?.chat) {
          return socket.emit("error", { message: "Invalid payload" });
        }

        // Save user message
        // await messageModel.create({
        //   chat: messagePayload.chat,
        //   user: socket.user._id,
        //   content: messagePayload.content,
        //   role: "user",
        // });

        const vectors = await aiService.generateVector(messagePayload.content);

        await vectorService.createMemory({
          vectors,
          messageId: crypto.randomUUID(),
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });

        // chat history
        const chatHistory = (
          await messageModel
            .find({
              chat: messagePayload.chat,
            })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
        ).reverse();

        const response = await aiService.generateResponse(
          chatHistory.map((item) => {
            return {
              role: item.role,
              parts: [{ text: item.content }],
            };
          }),
        );

        // Save AI message
        // await messageModel.create({
        //   chat: messagePayload.chat,
        //   user: socket.user._id,
        //   content: response,
        //   role: "model",
        // });

        //shows in frontend
        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat,
        });
      } catch (err) {
        console.error("AI error:", err);
        socket.emit("error", { message: "Something went wrong" });
      }
    });
  });
};

module.exports = initSocketServer;
