const express = require("express")
const db = require("../database")

router = express.Router()


//api/tasks/

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