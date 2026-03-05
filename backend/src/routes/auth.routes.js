const express = require("express")
const authController = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware")

const router = express.Router()

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.get("/me", authUser, authController.getMeController)
router.post("/logout", authController.logoutController)

module.exports = router