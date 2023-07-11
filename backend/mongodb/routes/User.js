const express = require("express")
const userRouter = express.Router()
const {addUser, authenticate, deleteUser} = require("../controllers/User")

userRouter.post("/signup", addUser)
userRouter.post("/login", authenticate)
userRouter.delete("/remove", deleteUser)


module.exports = userRouter