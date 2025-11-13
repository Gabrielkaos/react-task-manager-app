const jwt = require("jsonwebtoken")


const authMiddleWare = (req, res, next) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            return res.status(401).json({error:"No token, authorization denied"})
        }
        const decoded = jwt.decode(token,process.env.JWT_SECRET)

        req.user = decoded
        next()
    }catch(err){
        res.status(401).json({error:"Token is Invalid"})
    }
    
}

module.exports = authMiddleWare