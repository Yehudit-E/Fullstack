import { createBrowserRouter, Navigate } from "react-router"
import {  } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import Playlists from "./components/Playlists";
import AuthPage from "./components/AuthPage";
import PlaylistDetails from "./components/PlaylistDetails ";


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: 'auth', element: <AuthPage/> },
            { path: '',element:<Navigate to="home" replace /> },
            { path: 'home', element: <Home/> },
            { path: 'music', element: <PublicSongs/> },
            { path: 'playlists',element: <Playlists/>,
            // children:[
            // {
            //     path: "playlists/:id",
            //     element: <PlaylistDetails />, // עובר לקומפוננטה PlaylistDetails
            // }]
        },
        ]
    }
])