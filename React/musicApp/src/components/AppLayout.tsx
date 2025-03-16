import { Outlet } from "react-router"
import Header from "./Header"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {  load } from "../store/userSlice";
import { AddDispatch } from "../store/store";
const AppLayout = () => {
    const dispatch = useDispatch<AddDispatch>();
    function getUserIdFromToken(): string | null {
        const token = localStorage.getItem("authToken");
        if (!token) {
            return null;
        }
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // מפענחים את החלק השני
            
            return payload.id || null; // מחזירים את ה-id אם קיים
        } catch (e) {
            console.error("Invalid token:", e);
            return null;
        }
    }
    useEffect(() => {
        const id=getUserIdFromToken();
        if(id)
            dispatch(load(id));
    
    }, []);
    return (<>
        <Header />
        <Outlet />
    </>)
}

export default AppLayout