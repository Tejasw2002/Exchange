const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

function createToken(id){
    return jwt.sign({id}, process.env.SECRET, {expiresIn:'3d'})
}
    
async function signup(req, res, next){
    const query = "INSERT INTO Users(email, name, age, sex, password) VALUES (?, ?, ?, ?, ?)";
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)
    const params = [req.body.email, req.body.name, req.body.age, req.body.sex, password].map(param=>param??null)
    console.log(params)
    try{
        const result = await db.execute(query, params)
        const userId = await db.execute('SELECT id from Users WHERE email LIKE ?', [req.body.email])
        res.status(201).json({"token":createToken(userId)})
    }catch(err){
        next(JSON.stringify({"message":err.sqlMessage, "status":500}))
    }
}

async function login(req, res, next){
    const params = [req.body.email, req.body.password].map(param=>param??null)
    const query = "SELECT password FROM Users WHERE email LIKE ?"
    try{
        const [result,] = await db.execute(query, [params[0]])
        if(!result.length)
            throw "Invalid Email Address"
        const isSame = await bcrypt.compare(params[1], result[0].password)
        if(isSame){
            const userId = await db.execute('SELECT id from Users WHERE email LIKE ?', [req.body.email])
            res.status(200).json({"token":createToken(userId)})
        }else{
            throw "Wrong Password"
        }
    }catch(err){
        next(JSON.stringify({"message":err.sqlMessage || err, "status":500}))
    }
}

async function deleteAccount(req, res, next){
    const query = "DELETE FROM Users WHERE email LIKE ? "
    const params = [req.body.email]
    try{
        const result = await db.execute(query, params)
        const exists  = result[0]['affectedRows']
        if(exists)
            res.status(200).json("ok")
        else
            throw "No account is associated with this email id"
    }catch(err){
        next(JSON.stringify({"message":err.sqlMessage || err, "status":500}))
    }
}

module.exports = {
    signup,
    login,
    deleteAccount
}