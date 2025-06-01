

import { useRef, type FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { IconButton } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { Mail, Lock } from "lucide-react"
import "./style/Auth.css"
import { Dispatch } from "../store/store"
import { loginUser } from "../store/userSlice"

const Login = () => {
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  // State
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  })

  // Refs
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  // Validation functions
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailPattern.test(email)
  }

  const validateForm = () => {
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""
    let isValid = true
    const newErrors = {
      email: "",
      password: "",
      general: "",
    }

    // Check if fields are empty
    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({ email: "", password: "", general: "" })

    try {
      const email = emailRef.current?.value || ""
      const password = passwordRef.current?.value || ""
      const userLog = { email, password }

      const resultAction = await dispatch(loginUser(userLog))

      if (loginUser.fulfilled.match(resultAction)) {
        const redirect = sessionStorage.getItem("redirectAfterLogin")
        if (redirect) {
          sessionStorage.removeItem("redirectAfterLogin")
          navigate(redirect)
        } else {
          navigate("/") 
        }
      } else if (loginUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.error.message || "Login failed. Please check your credentials."
        setErrors((prev) => ({ ...prev, general: errorMessage }))
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, general: "An unexpected error occurred. Please try again." }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="input-container">
          <Mail className="input-icon" size={18} />
          <input
            type="text"
            placeholder="Email"
            ref={emailRef}
            className={`auth-input ${errors.email ? "error" : ""}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <div className="input-container">
          <Lock className="input-icon" size={18} />
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            ref={passwordRef}
            className={`auth-input ${errors.password ? "error" : ""}`}
            disabled={isSubmitting}
          />
          <IconButton
            className="visibility-toggle"
            onClick={() => setPasswordVisible(!passwordVisible)}
            edge="end"
            size="small"
          >
            {passwordVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </div>
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      {errors.general && <div className="general-error">{errors.general}</div>}

      <div className="form-footer">
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>

        <div className="forgot-password">
          <a href="#" className="forgot-link">
            Forgot password?
          </a>
        </div>
      </div>
    </form>
  )
}

export default Login
