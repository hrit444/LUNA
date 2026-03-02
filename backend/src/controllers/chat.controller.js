const chatModel = require("../models/chat.model")
const messageModel = require("../models/message.model")

const createChat = async (req,res) => {
  const {title} = req.body
  const user = req.user

  console.log("BODY:", req.body)
console.log("USER:", req.user)

  const chat = await chatModel.create({
    user: user._id,
    title
  })

  res.status(201).json({
    message: "chat created successfully",
    chat:{
      _id: chat.id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user
    }
  })
}

const getChat = async (req,res) => {
  const user = req.user

  const chats = await chatModel.find({user: user._id}).sort({lastActivity: -1})

  res.status(200).json({
    message: "chats fetched successfully",
    chats: chats.map(chat => ({
      _id: chat.id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user
    }))
  })
} 

const getChatById = async (req,res) => {
  const chatId = req.params.id

  const messages = await messageModel.find({chat: chatId}).sort({createdAt: -1})

  if(!messages.length){
    return res.status(404).json({
      message: "chat not found"
    })
  }

  res.status(200).json({
    message: "chat fetched successfully",
    messages: messages
  })
}

module.exports = {createChat, getChat, getChatById}