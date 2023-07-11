const express = require("express")
const blogRouter = express.Router()
const {addBlog, comment, updateLikes, updateReads, getBlogs} = require("../controllers/Blog")
const requireAuth = require("../middlewares/Auth")

blogRouter.get('/getBlogs', getBlogs)
// blogRouter.use(requireAuth)

blogRouter.post("/write", addBlog)
blogRouter.post("/comment", comment)
blogRouter.patch("/updateLikes", updateLikes)
blogRouter.patch("/updateReads", updateReads)

module.exports = blogRouter