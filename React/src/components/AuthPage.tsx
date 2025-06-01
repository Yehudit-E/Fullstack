
import { useState } from "react"
import Login from "./Login"
import Register from "./Register"
import "./style/Auth.css"
import Google from "./Google"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header with gradient title */}
        <div className="auth-header">
          <h1 className="auth-title">
            Welcome to <span className="gradient-text">MusiX</span>
          </h1>
          <p className="auth-subtitle">Sign in to continue to your account</p>
        </div>

        {/* Toggle Switch */}
        <div className="auth-switch-container">
          <button className={`auth-switch-option ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={`auth-switch-option ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
          <div
            className="auth-switch-underline"
            style={{
              left: isLogin ? "0" : "50%",
            }}
          ></div>
        </div>
        <div className="auth-google-container">
          <Google />
        </div>
        
        {/* Form Container */}
        <div className="auth-form-container">{isLogin ? <Login /> : <Register />}</div>
      </div>
    </div>
  )
}

export default AuthPage
