import { createBrowserRouter, Navigate } from "react-router"
import {  } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import AuthPage from "./components/AuthPage";
import PlaylistDetails from "./components/PlaylistDetails ";
import MyPlaylists from "./components/MyPlaylists";
import UploadMusic from "./components/UploadMusic";
import UploadSongToPlaylist from "./components/UploadSongToPlaylist";
import About from "./components/About";
import Terms from "./components/Terms";
import Contact from "./components/Contact";
import AcceptShare from "./components/AcceptShare";
import SongDetails from "./components/SongDetails";


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
            path: "music/upload",
            element: <UploadMusic/>,
          },
          {
            path: "myplaylists/playlist/:id/upload-song",
            element: <UploadSongToPlaylist/>,
          },
          {
            path: "/about",
            element: <About/>,
          },
          {
            path: "/terms",
            element: <Terms/>,
          },
          {
            path: "/contact",
            element: <Contact/>,
          },
          { 
            path: "playlist/accept-share", 
            element: <AcceptShare /> 
          },
          {
            path: "song/:id",
            element: <SongDetails/>
          }


        ]
    }
])