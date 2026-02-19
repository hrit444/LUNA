const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;

  const isExistingUser = await userModel.findOne({ email });

  if (isExistingUser) {
    return res.status(400).json({
      message: "User already exist",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered sucessfully!",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
  });
};

const loginController = async (req,res)=> {
  const {email, password} = req.body

  const user = await userModel.findOne({email})

  if(!user){
    return res.status(400).json({
      message: "Invalid email"
    })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid){
    return res.status(400).json({
      message: "Invalid password"
    })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in sucessfully!",
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    },
  });
}

module.exports = { registerController, loginController };
