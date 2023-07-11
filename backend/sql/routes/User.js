const express = require("express")
const userRouter = express.Router()
const {signup, login, deleteAccount} = require("../controllers/User")

userRouter.post("/login", login)
userRouter.post("/signup", signup)
userRouter.delete("/delete", deleteAccount)

module.exports = userRouter