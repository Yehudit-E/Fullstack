import { useDispatch } from "react-redux";
import { AddDispatch } from "../store/store";
import { FormEvent, useRef } from "react";
import { loginUser } from "../store/userSlice";
import { UserLogin } from "../models/UserAuth";
import { useNavigate } from "react-router";

const Login = () => {
    const dispatch = useDispatch<AddDispatch>();
    const navigate = useNavigate();
    
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const userLog: UserLogin = {
            email: emailRef.current?.value ? emailRef.current?.value : '',
            password: passwordRef.current?.value ? passwordRef.current?.value : ''
        };
        console.log(userLog);
        const resultAction = await dispatch(loginUser(userLog));
        
        if (loginUser.fulfilled.match(resultAction)) {
            // navigate to home page or dashboard
            navigate('/');
        } else {
            // handle login failure
            console.error('Login failed:', resultAction.payload);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="email" ref={emailRef} /> <br />
                <input type="password" placeholder="password" ref={passwordRef} /> <br />
                <button type="submit">SAVE</button>
            </form>
        </>
    );
};

export default Login;