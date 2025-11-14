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

router.get("/",(req, res)=>{
    const userId = req.user.userId
    db.all(`SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,[userId],(err, tasks)=>{
        if(err){
            return res.status(500).json({error:"Databse Error"})
        }

        res.json({tasks})
    })
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


router.put("/:id",(req, res)=>{
    const taskId = req.params.id
    const userId = req.user.userId
    const {title, description, status} = req.body

    db.get("SELECT * FROM tasks WHERE user_id = ? AND id = ?",[userId, taskId],(err, task)=>{
        if(err){
            return res.status(500).json({error:"Database Error"})
        }
        if(!task){
            return res.status(400).json({error:"Task not found"})
        }

        db.run("UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?",
            [
                title || task.title,
                description !== undefined ? description : task.description,
                status || task.status,
                taskId
            ],
            (err)=>{
                if(err){
                    return res.status(500).json({error:"Database Error"})
                }

                res.json({
                    message:"Task updated successfully",
                    task:{
                        title:title || task.title,
                        description:description !== undefined ? description : task.description,
                        status:status || task.status,
                        id:taskId
                    }
                })
            }
        )

    })
})

router.delete('/:id', (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    }
  );
});

module.exports = router