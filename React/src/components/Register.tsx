import { useRef, FormEvent, CSSProperties, useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/userSlice";
import { Dispatch } from "../store/store";
import { UserRegister } from "../models/UserAuth";
import { useNavigate } from "react-router";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const dispatch = useDispatch<Dispatch>();
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [fieldError, setFieldError] = useState("");

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    const validateEmail = (email: string) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    const validatePassword = (password: string) => {
        const passwordPattern = /^(?=.*[a-zA-Z]).{6,}$/;
        return passwordPattern.test(password);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const email = emailRef.current?.value || "";
        const password = passwordRef.current?.value || "";
        const confirmPassword = confirmPasswordRef.current?.value || "";
        const userName = nameRef.current?.value || "";

        // בדיקה אם השדות ריקים
        if (!userName || !email || !password || !confirmPassword) {
            setFieldError("כל השדות הם שדות חובה");
            return;
        } else {
            setFieldError("");
        }

        // בדיקת תקינות אימייל
        if (!validateEmail(email)) {
            setEmailError("מייל לא תקין");
            return;
        } else {
            setEmailError("");
        }

        // בדיקת תקינות סיסמה
        if (!validatePassword(password)) {
            setPasswordError("הסיסמה צריכה להיות באורך 6 תווים לפחות ולהכיל לפחות אות אחת באנגלית");
            return;
        } else {
            setPasswordError("");
        }

        // בדיקה שסיסמת האימות זהה
        if (password !== confirmPassword) {
            setConfirmPasswordError("אימות סיסמה נכשל");
            return;
        } else {
            setConfirmPasswordError("");
        }

        const userReg: UserRegister = { userName, email, password };

        const resultAction = await dispatch(registerUser(userReg));
        if (registerUser.fulfilled.match(resultAction)) navigate('/');
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <input type="text" placeholder="שם משתמש" ref={nameRef} style={styles.input} />
            
            <input type="text" placeholder="אימייל" ref={emailRef} style={styles.input} />
            {emailError && <span style={styles.error}>{emailError}</span>}

            {/* סיסמה */}
            <div style={styles.passwordContainer}>
                <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="סיסמה"
                    ref={passwordRef}
                    style={styles.input}
                />
                <IconButton
                    style={styles.eyeIcon}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    edge="start"
                >
                    {passwordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </div>
            {passwordError && <span style={styles.error}>{passwordError}</span>}

            {/* אימות סיסמה */}
            <div style={styles.passwordContainer}>
                <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    placeholder="אימות סיסמה"
                    ref={confirmPasswordRef}
                    style={styles.input}
                    onPaste={(e) => e.preventDefault()} // חוסם העתקה/הדבקה
                />
                <IconButton
                    style={styles.eyeIcon}
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    edge="start"
                >
                    {confirmPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </div>
            {confirmPasswordError && <span style={styles.error}>{confirmPasswordError}</span>}

            {fieldError && <span style={styles.error}>{fieldError}</span>}

            <button
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-gray)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--color-black)"}
                type="submit"
                style={styles.button}
            >
                הרשמה
            </button>
        </form>
    );
};

const styles: { [key: string]: CSSProperties } = {
    form: {
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        borderRadius: "12px",
        width: "500px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        fontSize: "16px",
        backgroundColor: "var(--color-gray)",
        color: "var(--color-white)",
        border: "0.5px solid var(--color-gray)",
        borderRadius: "8px",
    },
    button: {
        width: "520px",
        padding: "10px",
        fontSize: "16px",
        marginTop: "15px",
        color: "var(--color-white)",
        border: "1.5px solid var(--color-gray)",
        borderRadius: "25px",
        cursor: "pointer",
    },
    eyeIcon: {
        position: "absolute",
        left: "10px",
        top: "40%",
        transform: "translateY(-50%)",
        color: "#707070",
    },
    passwordContainer: {
        position: "relative",
    },
    error: {
        color: "red",
        fontSize: "12px",
        marginBottom: "10px",
    }
};

export default Register;
