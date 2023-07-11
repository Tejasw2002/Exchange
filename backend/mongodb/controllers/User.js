const jwt = require("jsonwebtoken")
const User = require("../models/User")
const bcrypt = require("bcrypt")

function createToken(id){
    return jwt.sign({id}, process.env.SECRET, {expiresIn:'3d'})
}
    
async function addUser(req, res, next){
    try{
        const user = await User.signup(req.body)
        return res.status(201).json({"id":user, "token":createToken(user)})
    }catch(err){
        next(err)
    }
}

async function authenticate(req, res, next){
    try{
        const user = await User.login(req.body)
        console.log(user)
        return res.status(200).json({"id":user, "token":createToken(user)})
    }catch(err){
        next(err)
    }
}

async function deleteUser(req, res, next){
    try{
        const user = await User.remove(req.body)
        return res.status(204).json({})
    }catch(err){
        next(err)
    }
}

module.exports = {
    addUser,
    authenticate,
    deleteUser
}