import { createBrowserRouter } from "react-router"
import {  } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import Playlists from "./components/Playlists";
import Register from "./components/Register";
import Login from "./components/Login";


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: '', element: <Home /> },
            { path: 'login', element: <Login/> },
            { path: 'register', element: <Register/> },
            { path: 'home', element: <Home/> },
            { path: 'songs', element: <PublicSongs/> },
            { path: 'playlists', element: <Playlists/>},

        ]
    }
])