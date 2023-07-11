const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const date = new Date().getFullYear()

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        unique: true
    },
    password:{
        type: String,
        required: true,
        match: /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    sex:{
        type:String,
        enum:["male", "female", "other"],
        required: true
    },
    yearOfBirth:{
        type:Number,
        min:date-100,
        max:date-15,
        required:true
    }
})

userSchema.statics.signup = async function(data){
    const User = this
    const user = new User(data)
    if(! user instanceof User)
        throw JSON.stringify({"message": "Request body has fields with invalid or missing values", "status": 400})
    const exists = await User.findOne({email:data.email})
    if(exists)
        throw JSON.stringify({"message": "An account is already registered with this email", "status": 409})
    try{
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(data.password, salt)
        user.password = hash
        const savedData = await user.save();
        return savedData._id
    }catch(error){
        console.log(error)
        throw JSON.stringify({})
    }
}

userSchema.statics.login = async function(data){
    const User = this
    if(!data.email || !data.password)
        throw JSON.stringify({"message": "Request body has fields with missing values", "status": 400})
    const exists = await User.findOne({email:data.email})
    console.log(exists)
    if(!exists)
        throw JSON.stringify({"message": "Invalid User Credentials", "status": 401})
    const isSame = await bcrypt.compare(data.password, exists.password)
    if(!isSame)
        throw JSON.stringify({"message": "Invalid User Credentials", "status": 401})
    return exists._id
}

userSchema.statics.remove = async function(data){
    const User = this
    if(!data.email)
        throw JSON.stringify({"message": "Request body has fields with missing values", "status": 400})
    const exists = await User.findOne({email:data.email})
    if(!exists)
        throw JSON.stringify({"message": "No account registered with this email id exists", "status": 401})
    const deleted = await User.deleteOne({email:data.email})
    try{
        if(deleted)
            return true;
    }catch(err){
        throw JSON.stringify({})
    }
}

const User = mongoose.model('User', userSchema)
module.exports = User