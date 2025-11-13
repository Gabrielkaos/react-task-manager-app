const express = require("express")
const db = require("../database")
const authMiddleWare = require("../middleware/auth")

router = express.Router()
router.use(authMiddleWare)

//api/tasks/

router.post("/",(req, res)=>{
    const {title, description, status} = req.body
    const userId = req.user.userId

    if(!title){
        return res.status(401).json({error:"Title required"})
    }

    db.run(`INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)`,
        [title, description || '', status || 'pending',userId],
        (err)=>{
            if(err){
                return res.status(500).json({error:"Database Error"})
            }
            res.status(201).json({
                message:"Task created successfully",
                task:{id:this.lastID,title, description, status:status || 'pending',user_id:userId}
            })
        }
    )
})

router.get("/:id",(req, res)=>{
    const taskId = req.params.id
    const userId = req.user.userId

    try{
        db.get(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`,[taskId, userId],(err,task)=>{
            if(err){
                return res.status(500).json({error:"Database Error"})
            }
            if(!task){
                res.status(404).json({error:"Task not Found"})
            }
            res.json({task})
        })
    }catch(err){
        res.status(500).json({error:"Server Error"})
    }
})