const jwt = require("jsonwebtoken")
const User = require('../models/User')
const mongoose = require("mongoose")
const Blog = require("../models/Blog")

async function addBlog(req, res, next){
    try{
        const _id = jwt.verify(req.headers.authorization.split(' ')[1], process.env.SECRET).id
        const user = await User.findOne({_id}).select('_id')
        const blog = (await Blog.create({...req.body, author:user }))
        console.log(blog)
        return res.status(201).json({"id":blog._id})
    }catch(err){
        console.log(err)
        next(err)
    }
}

async function getBlogs(req, res, next){
    try{
        const page = req.query.page
        console.log(page)
        const limit = 20
        let offset = (page-1)*limit
        const results = await Blog.find().select('title content author createdAt likes').skip(offset).limit(limit)
        if(!results)
            throw JSON.stringify({})
        res.status(200).json(results)
    }catch(err){
        next(err)
    }
}

async function comment(req, res, next){
    try{
        const blog = await Blog.findById(req.body.id)
        let response 
        if(blog){
            if(req.body.parent){
                response = await Blog.findOneAndUpdate(
                    {_id: req.body.id, 'comments._id': req.body.parent},
                    {$push:{
                        'comments.$.replies':{
                            commenter: req.body.commenter,
                            comment: req.body.comment,
                        }
                    }}
                )
            }
            else{
                response = await Blog.updateOne(
                    {_id: req.body.id},
                    {$push:{
                        comments:{
                            commenter: req.body.commenter,
                            comment: req.body.comment,
                        }
                    }}
                )
            }
            if(!response)
                next(JSON.stringify({"message":"This commented could not be inserted", "status":500}))
            else
                return res.status(201).json({"message":"Commented succesfully"})
        }
        else
            throw JSON.stringify({"message":"No blog with this id exists", status:400})
    }catch(err){
        console.log(err)
        next("{}")
    }
}


async function updateReads(req, res, next){
    try{
        const found = await Blog.findOne({ _id: req.body.blog, reads: { $elemMatch: {reader: new mongoose.Types.ObjectId(req.body.reader)}}})
        if(!found){
            const updated = await Blog.findOneAndUpdate(
                { _id: req.body.blog},
                { $push: { 'reads': {reader: new mongoose.Types.ObjectId(req.body.reader), readAt:  new Date(Date.now()).toISOString()}}},
                {new:true})
            if(updated)
                res.status(201).json({"message":"success"})
        }
        return res.status(200).json({"message":"Already exists"})
    }catch(err){
        console.log(err)
        next("{}")
    }
}

async function updateLikes(req, res, next){
    try{
        const likes = await Blog.findOne(
            { _id: req.body.blog, reads: { $elemMatch: {reader: new mongoose.Types.ObjectId(req.body.reader)}}}, {'reads.liked.$':1})
        let cur_like = Number(req.body.like==1)-Number(likes.reads[0].liked==1)
        console.log(likes)
        const updated = await Blog.findOneAndUpdate(
            { _id: req.body.blog, reads: { $elemMatch: {reader: new mongoose.Types.ObjectId(req.body.reader)}}},
            { $set: {'reads.$.liked': req.body.like}, $inc:{likes:cur_like}},
            {new:true}
            )
        if(updated)
            return res.status(200).json({"message":"Done Successfully"})
        else
            throw JSON.stringify({"message":""})
    }catch(err){
        console.log(err)
        next("{}")
    }
}


module.exports = {
    addBlog,
    comment,
    updateLikes,
    updateReads,
    getBlogs,
}