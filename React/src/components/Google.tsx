import { useDispatch } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { Dispatch } from "../store/store";
import { connectWithGoogle, load } from "../store/userSlice";

const Google = () => {
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [errorOpen, setErrorOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<Dispatch>();
    function getUserIdFromToken(token: string): string | null {
        if (!token) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // מפענחים את החלק השני
            console.log("Decoded payload:", payload);   
            
            return payload.id || null; // מחזירים את ה-id אם קיים
        } catch (e) {
            console.error("Invalid token:", e);
            return null;
        }

    }

    const handleGoogleSignIn = async (token: string) => {
        try {

            const result = await dispatch(connectWithGoogle({ token }));
            if (result.meta.requestStatus === 'fulfilled') {
                setTimeout(() => { navigate('/'); }, 1500);
                const token = localStorage.getItem("authToken");
                if (token) {
                    const id = getUserIdFromToken(token);
                    if (id) {
                        console.log("User ID from token:", id);   
                        await dispatch(load(id));
                    }
                }
            }

            else {
                setErrorMessage('login with google failed');
                setTimeout(() => {
                    setErrorOpen(false);
                }, 3000);
            }
        }
        catch (error) {
            setErrorMessage('Google Sign-In failed. Please try again.');
            setTimeout(() => {
                setErrorOpen(false);
            }, 3000);
        }
    }

    return (<>
        <div style={{ direction: 'ltr' ,margin:'0'}}>
            <GoogleLogin
                locale='en'
                text="signin_with"
                onSuccess={(credentialResponse) => {
                    const token = credentialResponse.credential;
                    if (token) {
                        handleGoogleSignIn(token);
                    } else {
                        //setErrorMessage('Google Sign-In failed. Please try again.');
                    }
                }}
                onError={() => {
                    // setErrorMessage('Google Sign-In failed. Please try again.');
                }}
                useOneTap
                theme="outline"
                size="large"
            />
            <div style={{margin:"6px 6px", display: "flex", alignItems: "center", justifyContent: "center" }}>or</div>
        </div>
        
        {errorOpen && errorMessage && (
            <div className="google-error-message">
                <AlertCircle className="google-error-icon" size={18} />
                {errorMessage}
            </div>
        )}
    </>)
}

export default Google