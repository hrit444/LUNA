const chatModel = require("../models/chat.model")

const createChat = async (req,res) => {
  const {title} = req.body
  const user = req.user

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

module.exports = {createChat, getChat}