const jwt = require('jsonwebtoken')

const requireAuth = async function (req, res, next){
    const {authorization} = req.headers
    if(!authorization)
        next (JSON.stringify({"message":"Authorization token required", "status":401}))
    const token = authorization.split(' ')[1] 
    // the token is a two word string: The first is the word 'Bearer' and second is the token
    try{
        const id = jwt.verify(token, process.env.SECRET).id[0][0].id
        req.body.user_id = id
        console.log(id)
        next()
    }catch(err){
        next(JSON.stringify({"message":"Unauthorised request", "status":401}))
    }
}

module.exports = requireAuth;

// this function will be imported in all the routes files
// this will be the first route to be procesed and only if the user is authorised, will he be able to go to the next controller function
