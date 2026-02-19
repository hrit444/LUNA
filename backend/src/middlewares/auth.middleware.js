const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

const authUser = async (req,res,next) => {
  const {token} = req.cookies

  if(!token){
    return res.status(401).json({message: "Unauthorized"})
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    if(!user){
      return res.status(401).json({message: "Unauthorized: User not found!"})
    }

    req.user = user

    next()

  } catch (error) {
    res.status(401).json({message: "Unauthorized"})
  }
}

module.exports = { authUser}