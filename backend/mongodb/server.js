const mongoose = require("mongoose")
const dotenv = require("dotenv")
const express = require("express")
const cors = require('cors')
const app = express()
dotenv.config()

mongoose.connect(process.env.DB_URL)
    .then(data=>{
        console.log("Connected to the database successfully")
        app.listen(process.env.PORT, ()=>{
            console.log("Listening on port", process.env.PORT)
        })
    }).catch(err=>{
        console.log("Some error occured while connecting to the database")
        console.log(err.message)
    })

const userRouter = require("./routes/User")
const blogRouter = require("./routes/Blog")

app.use(cors());

app.use("/", (req, res, next)=>{
    console.log(req.method, req.path)
    next()
})
app.use(express.json())
// app.use("/",(req, res, next)=>{
//     res.header(`Access-Control-Allow-Origin`, 'http://localhost:3000');
//     res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE,OPTIONS,PATCH`);
//     res.header(`Access-Control-Allow-Headers`, `Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization`);
//     next();
// })

app.use("/user", userRouter)
app.use("/blog", blogRouter)


app.use("/", (err, req, res, next)=>{
    err = JSON.parse(err)
    err.status = err.status || 500
    err.message = err.message || "Internal Server Error"
    console.log(err)
    res.status(err.status).json({"message":err.message})
    // res.status(500).json({})
})