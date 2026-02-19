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
        if (!messagePayload?.content || !messagePayload?.chat) {
          return socket.emit("error", { message: "Invalid payload" });
        }

        // save user message in db
        const message = await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        });

        // generate vector for user message
        const vectors = await aiService.generateVector(messagePayload.content);

        // query pinecone for related memory
        const memory = await vectorService.queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: { 
            user: socket.user._id 
          }
        });

        // save user messsage in pinecone
        await vectorService.createMemory({
          vectors: vectors,
          messageId: message._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: messagePayload.content,
          },
        });

        // get chat history from db
        const chatHistory = (
          await messageModel
            .find({ chat: messagePayload.chat })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse()

        // creating stm using chatHistory
        const stm = chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        })

        // creating ltm using query memory in pinecone
        const ltm = [
          {
            role: "user",
            parts: [
              {
                text: `
            
            these are some previous messages from the chat, use them to generate response

            ${memory.map((item) => item.metadata.text).join("\n")}
            
            `,
              },
            ],
          },
        ]

        // Generating AI response using ltm & stm
        const response = await aiService.generateResponse([...ltm, ...stm])

        // save AI generated response in db
        const responseMessage = await messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model"
        })

        // generate vector for AI response
        const responseVectors = await aiService.generateVector(response)

        // save AI response in pinecone
        await vectorService.createMemory({
          vectors: responseVectors,
          messageId: responseMessage._id,
          metadata: {
            chat: messagePayload.chat,
            user: socket.user._id,
            text: response
          }
        });

        //shows in frontend
        socket.emit("ai-response", {
          content: response,
          chat: messagePayload.chat
        })

      } catch (err) {
        console.error("AI error:", err);
        socket.emit("error", { message: "Something went wrong" });
      }
    });
  });
};

module.exports = initSocketServer;
