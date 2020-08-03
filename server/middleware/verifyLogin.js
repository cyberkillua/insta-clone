const {JWT_TOKEN} = require("../confiq/keys")
const jwt = require("jsonwebtoken")
const { User } = require("../models/user")



module.exports = (req, res, next)=> {
    const {authorization} = req.headers

    if(!authorization){
      return  res.status(401).json({error: "Must be logged in to continue"})
    }
   const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_TOKEN, (err, payload)=> {
        if(err){
            return res.status(401).json({error: "Must be logged in to continue"})
        }
        const {_id} = payload
        User.findById(_id).then(userdata => {
            req.user = userdata
            // console.log(req.user)
            next()
        })
       
    })
}