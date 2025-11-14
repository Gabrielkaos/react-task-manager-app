import React, {useContext, useState, useEffect} from "react"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"
import "./Tasks.css"

const Tasks = () =>{
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editingId, setEditingId] = useState(null)

    const {user, logout} = useContext(AuthContext)

    const fetchTasks = async () =>{
        try{
            const res = await api.get("/tasks")
            setTasks(res.data.tasks)
        }catch(err){
            console.error("Error fetching tasks",err)
        }
    }

    useEffect(()=>{
        fetchTasks()
    },[])

    const handleCreateTask = async (e) =>{
        e.preventDefault()
        try{
            const res = await api.post("/tasks",{title, description})
            setTitle("")
            setDescription("")
            fetchTasks()
        }catch(err){
            console.error("Error creating tasks",err)
        }
    }
    const handleUpdateTask = async (id) =>{
        
        try{
            const res = await api.put(`/tasks/${id}`,{title, description})
            setTitle("")
            setDescription("")
            setEditingId(null)
            fetchTasks()
        }catch(err){
            console.error("Error updating task",err)
        }
    }
    const handleDeleteTask = async (id) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
        }
    }
    const toggleStatus = async (task) => {
        const newStatus = task.status === 'pending' ? 'completed' : 'pending';
        try {
            await api.put(`/tasks/${task.id}`, { status: newStatus });
            fetchTasks();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const startEdit = (task) => {
        setEditingId(task.id)
        setTitle(task.title)
        setDescription(task.description)
    }
    return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>My Tasks</h1>
        <div className="user-info">
          <span>Welcome, {user?.username}!</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <div className="task-form-container">
        <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdateTask(editingId); } : handleCreateTask}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              {editingId ? 'Update Task' : 'Add Task'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Create your first task above!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status}`}>
              <div className="task-content">
                <h3>{task.title}</h3>
                {task.description && <p>{task.description}</p>}
                <span className={`status-badge ${task.status}`}>
                  {task.status}
                </span>
              </div>
              <div className="task-actions">
                <button
                  onClick={() => toggleStatus(task)}
                  className="btn-toggle"
                >
                  {task.status === 'pending' ? '✓' : '↻'}
                </button>
                <button
                  onClick={() => startEdit(task)}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
    
}

export default Tasks