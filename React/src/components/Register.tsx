// import { useRef, FormEvent, CSSProperties, useState } from "react";
// import { useDispatch } from "react-redux";
// import { registerUser } from "../store/userSlice";
// import { Dispatch } from "../store/store";
// import { UserRegister } from "../models/UserAuth";
// import { useNavigate } from "react-router";
// import { IconButton } from "@mui/material";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// const Register = () => {
//     const dispatch = useDispatch<Dispatch>();
//     const navigate = useNavigate();

//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

//     const [emailError, setEmailError] = useState("");
//     const [passwordError, setPasswordError] = useState("");
//     const [confirmPasswordError, setConfirmPasswordError] = useState("");
//     const [fieldError, setFieldError] = useState("");

//     const emailRef = useRef<HTMLInputElement>(null);
//     const passwordRef = useRef<HTMLInputElement>(null);
//     const confirmPasswordRef = useRef<HTMLInputElement>(null);
//     const nameRef = useRef<HTMLInputElement>(null);

//     const validateEmail = (email: string) => {
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return emailPattern.test(email);
//     };

//     const validatePassword = (password: string) => {
//         const passwordPattern = /^(?=.*[a-zA-Z]).{6,}$/;
//         return passwordPattern.test(password);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();

//         const email = emailRef.current?.value || "";
//         const password = passwordRef.current?.value || "";
//         const confirmPassword = confirmPasswordRef.current?.value || "";
//         const userName = nameRef.current?.value || "";

//         // Check if fields are empty
//         if (!userName || !email || !password || !confirmPassword) {
//             setFieldError("All fields are required");
//             return;
//         } else {
//             setFieldError("");
//         }

//         // Check email validity
//         if (!validateEmail(email)) {
//             setEmailError("Invalid email address");
//             return;
//         } else {
//             setEmailError("");
//         }

//         // Check password validity
//         if (!validatePassword(password)) {
//             setPasswordError("Password must be at least 6 characters long and contain at least one letter");
//             return;
//         } else {
//             setPasswordError("");
//         }

//         // Check if passwords match
//         if (password !== confirmPassword) {
//             setConfirmPasswordError("Password confirmation failed");
//             return;
//         } else {
//             setConfirmPasswordError("");
//         }

//         const userReg: UserRegister = { userName, email, password };

//         const resultAction = await dispatch(registerUser(userReg));
//         if (registerUser.fulfilled.match(resultAction)) navigate('/');
//     };

//     return (
//         <form onSubmit={handleSubmit} style={styles.form}>
//             <input type="text" placeholder="Username" ref={nameRef} style={styles.input} />
            
//             <input type="text" placeholder="Email" ref={emailRef} style={styles.input} />
//             {emailError && <span style={styles.error}>{emailError}</span>}

//             {/* Password */}
//             <div style={styles.passwordContainer}>
//                 <input
//                     type={passwordVisible ? "text" : "password"}
//                     placeholder="Password"
//                     ref={passwordRef}
//                     style={styles.input}
//                 />
//                 <IconButton
//                     style={styles.eyeIcon}
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     edge="start"
//                 >
//                     {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                 </IconButton>
//             </div>
//             {passwordError && <span style={styles.error}>{passwordError}</span>}

//             {/* Confirm Password */}
//             <div style={styles.passwordContainer}>
//                 <input
//                     type={confirmPasswordVisible ? "text" : "password"}
//                     placeholder="Confirm Password"
//                     ref={confirmPasswordRef}
//                     style={styles.input}
//                     onPaste={(e) => e.preventDefault()} // Block paste
//                 />
//                 <IconButton
//                     style={styles.eyeIcon}
//                     onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
//                     edge="start"
//                 >
//                     {confirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                 </IconButton>
//             </div>
//             {confirmPasswordError && <span style={styles.error}>{confirmPasswordError}</span>}

//             {fieldError && <span style={styles.error}>{fieldError}</span>}

//             <button
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-gray)"}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-black)"}
//                 type="submit"
//                 style={styles.button}
//             >
//                 Register
//             </button>
//         </form>
//     );
// };

// const styles: { [key: string]: CSSProperties } = {
//     form: {
//         display: "flex",
//         flexDirection: "column",
//         padding: "20px",
//         borderRadius: "12px",
//         width: "500px",
//     },
//     input: {
//         width: "100%",
//         padding: "10px",
//         marginBottom: "10px",
//         fontSize: "16px",
//         backgroundColor: "var(--color-gray)",
//         color: "var(--color-white)",
//         border: "0.5px solid var(--color-gray)",
//         borderRadius: "8px",
//     },
//     button: {
//         width: "520px",
//         padding: "10px",
//         paddingLeft: "30px",
//         fontSize: "16px",
//         marginTop: "15px",
//         color: "var(--color-white)",
//         border: "1.5px solid var(--color-gray)",
//         borderRadius: "25px",
//         cursor: "pointer",
//         backgroundColor: "var(--color-black)",
//     },
//     eyeIcon: {
//         position: "absolute",
//         right: "10px",
//         top: "40%",
//         transform: "translateY(-50%)",
//         color: "#707070",
//     },
//     passwordContainer: {
//         position: "relative",
//     },
//     error: {
//         color: "red",
//         fontSize: "12px",
//         marginBottom: "10px",
//     }
// };

// export default Register;

"use client"

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
        navigate("/")
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
