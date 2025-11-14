import React, {useContext, useState} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link, useNavigate } from "react-router-dom";
import "./Auth.css"


const Register = () =>{
    const {register} = useContext(AuthContext)
    const navigate = useNavigate()

    const [username, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const res = await register(username, email, password)

        if(res.success){
            navigate("/tasks")
        }else{
            setError(res.error)
        }
    }

    return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-primary">Register</button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );

}


export default Register