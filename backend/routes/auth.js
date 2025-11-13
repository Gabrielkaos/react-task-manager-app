const db = require("../database")
const jwt = require("jsonwebtoken")
const express = require("express")
router = express.Router()
const bcrypt = require('bcryptjs')


router.post("/register",(req, res)=>{
    const {username, email, password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({error:"Provide all fields"})
    }
    try{
        const salt = bcrypt.genSalt(10)
        const hashedPassword = bcrypt.hash(password,salt)

        db.run(`INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username,email,hashedPassword],
            (err)=>{
                if(err){
                    if(err.message.includes("UNIQUE")){
                        return res.status(400).json({error:"Username or Email already Exists"})
                    }
                    return res.status(500).json({error:"Database Error"})
                }

                const token = jwt.sign({userId:this.lastID, username},process.env.JWT_SECRET,{expiresIn:'7d'})

                res.status(201).json({message:"Registered successfully",token,user:{id:this.lastID,username, email}})
            }
        )
    }catch(err){
        res.status(500).json({error:"Server Error"})
    }
})


router.post("/login",(req, res)=>{
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({error:"Provide all fields"})
    }

    try{
        db.get(`SELECT * FROM users WHERE email = ?`,[email], async (err, user)=>{
            if(err){
                return res.status(500).json({error:"Database Error"})
            }

            if(!user){
                return res.status(401).json({error:"No user with the given credentials"})
            }

            //compare password
            const match = await bcrypt.compare(password, user.password)
            if(!match){
                return res.status(401).json({error:"Password does not match"})
            }

            const token = jwt.token({userId:user.id, username:user.username},process.env.JWT_SECRET,{expiresIn:'7d'})

            res.status(201).json({message:"Login Sucessful",token,user:{id:user.id, username:user.username, email:user.email}})
        })
    }catch(err){
        res.status(500).json({error:"Server Error"})
    }
})

module.exports = router