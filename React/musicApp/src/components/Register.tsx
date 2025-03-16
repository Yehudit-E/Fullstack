import { FormEvent, useRef } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/userSlice";
import { AddDispatch } from "../store/store";
import { UserRegister } from "../models/UserAuth";
import { useNavigate } from "react-router";

const Register = () => {
    const dispatch = useDispatch<AddDispatch>();
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)

    const  handleSubmit = async (e: FormEvent) =>{
        e.preventDefault()
        const userReg:UserRegister = {
            userName: nameRef.current?.value? nameRef.current?.value: '',
            email: emailRef.current?.value? emailRef.current?.value: '',
            password: passwordRef.current?.value? passwordRef.current?.value: ''
        }
        console.log(userReg);  
              const resultAction = await dispatch(registerUser(userReg));
                 
                 if (registerUser.fulfilled.match(resultAction)) {
                     // navigate to home page or dashboard
                     navigate('/');
                 } else {
                     // handle login failure
                     console.error('Login failed:', resultAction.payload);
                 }
    }

    return (<>
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="name" ref={nameRef}/> <br />
            <input type="text" placeholder="email" ref={emailRef}/> <br />
            <input type="text" placeholder="password" ref={passwordRef}/> <br />
            <button type="submit">SAVE</button>
        </form>
     </>)
}
export default Register
