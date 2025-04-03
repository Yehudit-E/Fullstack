import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div style={styles.container}>
            {/* כפתור בחירה דו-מצבי */}
            <div style={styles.switchContainer}>
                <div
                    style={{
                        ...styles.switchOption,
                        color:"var(--color-white)", 
                        zIndex: isLogin ? 1 : 2 
                    }}
                    onClick={() => setIsLogin(true)}  
                >
                    התחברות
                </div>

                <div
                    style={{
                        ...styles.switchOption,
                        color: "var(--color-white)" ,
                        zIndex: isLogin ? 2 : 1 // החלק שנבחר יהיה מעל
                    }}
                    onClick={() => setIsLogin(false)} // לוחצים על "התחברות" כדי לעבור
                >
                    הרשמה
                </div>

                {/* החלק שנע עליהם */}
                <div
                    style={{
                        ...styles.slider,
                        left: !isLogin ? "5px" : "calc(50% - 5px)", // הזזה הפוכה!
                    }}
                ></div>
            </div>

            {isLogin ? <Login /> : <Register />}
        </div>
    );
};

// **עיצוב**
const styles: any = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start", // שים לב שזה משנה את המיקום בגובה
        alignItems: "center", // מרכוז לרוחב
        height: "100vh",
        background: "var(--color-black)",
    },
    switchContainer: {
        display: "flex",
        justifyContent: "center",
        width: "350px",
        background: "var(--color-gray)",
        borderRadius: "25px",
        marginTop: "80px",
        marginBottom: "20px",
        position: "relative",
    },
    switchOption: {
        flex: 1,
        padding: "10px 20px",
        textAlign: "center",
        fontSize: "16px",
        cursor: "pointer",
        position: "relative",
    },
    slider: {
        position: "absolute",
        top: "5px",
        width: "50%",
        height: "calc(100% - 10px)",
        background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
        borderRadius: "25px",
        transition: "left 0.3s ease-in-out",
        zIndex: 0, // כדי שהכפתורים יישבו מעליו
    }
};

export default AuthPage;
