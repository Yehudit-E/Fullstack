import { createBrowserRouter, Navigate } from "react-router"
import {  } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import AuthPage from "./components/AuthPage";
import PlaylistDetails from "./components/PlaylistDetails ";
import MyPlaylists from "./components/MyPlaylists";
import AddPlaylistPage from "./components/AddPlaylistPage";


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: 'auth', element: <AuthPage/> },
            { path: '',element:<Navigate to="home" replace /> },
            { path: 'home', element: <Home/> },
            { path: 'music', element: <PublicSongs/> },
            { path: 'myPlaylists',element: <MyPlaylists/>
            // children:[
            // {
            //     path: "playlists/:id",
            //     element: <>fxf</>, 
            // }]
        },
        {
            path: "myPlaylists/playlist/:id",
            element: <PlaylistDetails/>,
          },
          {
            path: "myPlaylists/add",
            element: <AddPlaylistPage />,
          },
        ]
    }
])