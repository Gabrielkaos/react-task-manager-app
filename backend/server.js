const cors = require("cors")
const express = require("express")
const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
require("dotenv").config()

app = express()
PORT = process.env.PORT

app.use(cors())
app.use(express.json())


app.use("/api/auth",authRoutes)
app.use("/api/tasks",taskRoutes)


app.get("/",(req, res)=>{
    res.json({message:"API"})
})


app.listen(PORT,()=>console.log(`Server listening on port ${PORT}`))