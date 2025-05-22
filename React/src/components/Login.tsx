// import { useRef, FormEvent, CSSProperties, useState } from "react";
// import { useDispatch } from "react-redux";
// import { loginUser } from "../store/userSlice";
// import { Dispatch } from "../store/store";
// import { UserLogin } from "../models/UserAuth";
// import { useNavigate } from "react-router";
// import { IconButton } from "@mui/material";
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import Swal from 'sweetalert2';
// const Login = () => {
//     const dispatch = useDispatch<Dispatch>();
//     const navigate = useNavigate();

//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [emailError, setEmailError] = useState("");
//     const [fieldError, setFieldError] = useState("");

//     const emailRef = useRef<HTMLInputElement>(null);
//     const passwordRef = useRef<HTMLInputElement>(null);

//     const validateEmail = (email: string) => {
//         const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//         return emailPattern.test(email);
//     };

//     const handleSubmit = async (e: FormEvent) => {
//         e.preventDefault();

//         const email = emailRef.current?.value || "";
//         const password = passwordRef.current?.value || "";

//         // בדיקה אם השדות לא ריקים
//         if (!email || !password) {
//             setFieldError("כל השדות הם שדות חובה");
//             return;
//         } else {
//             setFieldError("");
//         }

//         // בדיקת תקינות אימייל
//         if (!validateEmail(email)) {
//             setEmailError("מייל לא תקין");
//             return;
//         } else {
//             setEmailError("");
//         }

//         const userLog: UserLogin = { email, password };
//         const resultAction = await dispatch(loginUser(userLog));

//         if (loginUser.fulfilled.match(resultAction)) 
//             {
//                 // Swal.fire({
//                 //     title: 'הודעה ברקע כהה',
//                 //     text: 'התאמה אישית עם CSS',
//                 //     icon: 'warning',
//                 //     background: 'var(--color-black)',  // רקע כהה
//                 //     color: 'var(--color-white)',        // צבע טקסט בהיר
//                 //     confirmButtonColor: 'var(--color-gray)' // צבע לכפתור
//                 // });
//                 navigate('/');
//             }
//     };

//     return (
//         <form onSubmit={handleSubmit} style={styles.form}>
//             <input
//                 type="text"
//                 placeholder="email"
//                 ref={emailRef}
//                 style={styles.input}
//             />
//             {emailError && <span style={styles.error}>{emailError}</span>}

//             <div style={styles.passwordContainer}>
//                 <input
//                     type={passwordVisible ? "text" : "password"}
//                     placeholder="password"
//                     ref={passwordRef}
//                     style={styles.input}
//                 />
//                 <IconButton
//                     style={{ ...styles.eyeIcon }} 
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     edge="start"
//                 >
//                     {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
//                 </IconButton>
//             </div>

//             {fieldError && <span style={styles.error}>{fieldError}</span>}

//             <button
//                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-gray)"}
//                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-black)"}
//                 type="submit"
//                 style={styles.button}
//             >
//                 Login
//             </button>
//         </form>
//     );
// };

// // **עיצוב**
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
//         backgroundColor: "var(--color-black)",
//         color: "var(--color-white)",
//         border: "1.5px solid var(--color-gray)",
//         borderRadius: "25px",
//         cursor: "pointer",
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

// export default Login;


"use client"

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
