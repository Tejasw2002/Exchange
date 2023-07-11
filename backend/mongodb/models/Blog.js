const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true,
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    likes:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    },
    reads:[{
        reader:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        liked:{
            type:Number,
            default:0,
            enum:[-1, 0, 1]
        },
        readAt:{
            type: Date,
            required:true
        }
    }],
    comments:[{
        commenter:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
        comment:{
            type:String,
            required:true
        },
        commentedAt:{
            type:Date,
            default:Date.now
        },
        replies:[{
            commenter:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            comment:{
                type:String,
                required:true
            },
            commentedAt:{
                type:Date,
                // required:true
                default:Date.now
            }
        }]
    }]
})

const Blog = mongoose.model('Blog', blogSchema)
module.exports = Blog


// db.blogs.findOneAndUpdate(
//     {_id:ObjectId("648b3dd0db164e312324159f"), reads:{$elemMatch:{_id:ObjectId("648bd68804b95e14efd1b3a8")}}}, 
//     {$set:{'reads.$.liked':0}},
//     {new:true}
// )

// db.blogs.findOneAndUpdate(
//     {_id:ObjectId("648b3dd0db164e312324159f")},
//     {$push:{reads:{
//         reader: ObjectId("648bd68804b95e14efd1b3a8"),
//         liked:1
//     }}},
//     {new:true}
// )

// db.blogs.findOneAndUpdate({_id: ObjectId("648b3dd0db164e312324159f"), reads:{$elemMatch:{reader:ObjectId("648bd68804b95e14efd1b3a8")}}},{$set:{'reads.$.liked':0}},{new:true})