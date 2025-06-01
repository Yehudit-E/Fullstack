

import { useRef, type FormEvent, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router"
import { IconButton } from "@mui/material"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import { Mail, Lock, User } from "lucide-react"
import "./style/Auth.css"
import { Dispatch } from "../store/store"
import { registerUser } from "../store/userSlice"

const Register = () => {
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  // State
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  })

  // Refs
  const usernameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  // Validation functions
  const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailPattern.test(email)
  }

  const validatePassword = (password: string) => {
    // At least 6 characters with at least one letter
    const passwordPattern = /^(?=.*[a-zA-Z]).{6,}$/
    return passwordPattern.test(password)
  }

  const validateForm = () => {
    const username = usernameRef.current?.value || ""
    const email = emailRef.current?.value || ""
    const password = passwordRef.current?.value || ""
    const confirmPassword = confirmPasswordRef.current?.value || ""

    let isValid = true
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    }

    // Check username
    if (!username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      isValid = false
    }

    // Check email
    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    // Check password
    if (!password.trim()) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (!validatePassword(password)) {
      newErrors.password = "Password must be at least 6 characters with at least one letter"
      isValid = false
    }

    // Check confirm password
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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
    setErrors({ username: "", email: "", password: "", confirmPassword: "", general: "" })

    try {
      const userName = usernameRef.current?.value || ""
      const email = emailRef.current?.value || ""
      const password = passwordRef.current?.value || ""

      const userReg = { userName, email, password }

      const resultAction = await dispatch(registerUser(userReg))

      if (registerUser.fulfilled.match(resultAction)) {
        const redirect = sessionStorage.getItem("redirectAfterLogin")
        if (redirect) {
          sessionStorage.removeItem("redirectAfterLogin")
          navigate(redirect)
        } else {
          navigate("/") // דף ברירת מחדל
        }
      } else if (registerUser.rejected.match(resultAction)) {
        const errorMessage = resultAction.error.message || "Registration failed. Please try again."

        // Check for specific error types
        if (errorMessage.includes("email") || errorMessage.toLowerCase().includes("already exists")) {
          setErrors((prev) => ({ ...prev, email: "This email is already registered" }))
        } else if (errorMessage.includes("username")) {
          setErrors((prev) => ({ ...prev, username: "This username is already taken" }))
        } else {
          setErrors((prev) => ({ ...prev, general: errorMessage }))
        }
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
          <User className="input-icon" size={18} />
          <input
            type="text"
            placeholder="Username"
            ref={usernameRef}
            className={`auth-input ${errors.username ? "error" : ""}`}
            disabled={isSubmitting}
          />
        </div>
        {errors.username && <div className="error-message">{errors.username}</div>}
      </div>

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

      <div className="form-group">
        <div className="input-container">
          <Lock className="input-icon" size={18} />
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            ref={confirmPasswordRef}
            className={`auth-input ${errors.confirmPassword ? "error" : ""}`}
            disabled={isSubmitting}
            onPaste={(e) => e.preventDefault()} // Prevent pasting for security
          />
          <IconButton
            className="visibility-toggle"
            onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            edge="end"
            size="small"
          >
            {confirmPasswordVisible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </IconButton>
        </div>
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>

      {errors.general && <div className="general-error">{errors.general}</div>}

      <div className="form-footer">
        <button type="submit" className="auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        <div className="terms-text">
          By registering, you agree to our{" "}
          <a href="/terms" className="terms-link">
            Terms of Service
          </a>
        </div>
      </div>
    </form>
  )
}

export default Register
