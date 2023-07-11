const dotenv = require("dotenv")
const express = require("express")
const cors = require('cors')
const app = express()
dotenv.config()

global.db = null
require('./utils/db').connectToDb().then(conn=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`Listening on port ${process.env.PORT}`)
    })
    global.db = conn
}).catch(err=>console.log(err));


const userRouter = require("./routes/User")
const blogRouter = require("./routes/Blog")

app.use(cors());

app.use("/", (req, res, next)=>{
    console.log(req.method, req.path)
    next()
})
app.use(express.json())

app.get('/get_image', function (req, res) {
    let image = req.query.image
    const url = `C:/Users/Tejasw/Desktop/project/image_store/${image}`
    console.log(url)
    res.sendFile(url);
});

app.use("/user", userRouter)
app.use("/blog", blogRouter)

app.use("*", (req, res, next)=>{
    console.log("Path not found")
    next()
})

app.use("/", (err, req, res, next)=>{
    err = JSON.parse(err)
    err.status = err.status || 500
    err.message = err.message || "Internal Server Error"
    console.log(err)
    res.status(err.status).json({"message":err.message})
    // res.status(500).json({})
})