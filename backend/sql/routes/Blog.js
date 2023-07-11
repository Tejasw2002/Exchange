const express = require("express")
const authn = require("../utils/Auth")
const blogRouter = express.Router()
const { addBlog, deleteBlog, updateReadsOnBlog, likeBlog, getBlogs, getComments, getBlog, comment, deleteComment, likeComment} = require("../controllers/Blog")

// These are read only operations, user does not have be logged in to read them
blogRouter.get("/fetch", getBlogs)
// blogRouter.get("/getBlog", getBlog)
blogRouter.use(authn)
blogRouter.post("/comment/fetch", getComments)
blogRouter.post("/publish", addBlog)
blogRouter.delete("/remove", deleteBlog)
blogRouter.patch("/like", likeBlog)
blogRouter.post("/read", updateReadsOnBlog)
blogRouter.post("/comment", comment)
blogRouter.delete("/comment/remove", deleteComment)
blogRouter.patch("/comment/like", likeComment)

module.exports = blogRouter