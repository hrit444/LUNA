const mongoose = require("mongoose")

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("Connected to mongodb");
    
  } catch (error) {
    console.error("Error connecting to mongoDB", error)
  }
}

module.exports = connectDB