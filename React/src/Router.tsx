import { createBrowserRouter } from "react-router"
import {  } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import Playlists from "./components/Playlists";
import AuthPage from "./components/AuthPage";


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: '', element: <Home /> },
            { path: 'auth', element: <AuthPage/> },
            { path: 'home', element: <Home/> },
            { path: 'songs', element: <PublicSongs/> },
            { path: 'playlists', element: <Playlists/>},

        ]
    }
])