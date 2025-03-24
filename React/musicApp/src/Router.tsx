import { createBrowserRouter } from "react-router"
import Login from "./components/Login";
import Register from "./components/Register";
import AppLayout from "./components/AppLayout";
import Home from "./components/Home";
import PublicSongs from "./components/PublicSongs";
import Playlists from "./components/Playlists";


export const router = createBrowserRouter([
    {
        path: '/', element: <AppLayout />,
        errorElement: <h1>error</h1>,
        children: [
            { path: 'login', element: <Login/> },
            { path: 'register', element: <Register/> },
            { path: 'home', element: <Home/> },
            { path: 'songs', element: <PublicSongs/> },
            { path: 'playlists', element: <Playlists/>},

        ]
    }
])