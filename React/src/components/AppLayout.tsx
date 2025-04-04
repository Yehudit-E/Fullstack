import { Outlet } from "react-router"
import Header from "./Header"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {  load } from "../store/userSlice";
import { Dispatch, StoreType } from "../store/store";
import SongPlayer from "./SongPlayer";
import { loadSong } from "../store/songSlice";
const AppLayout = () => {
    const dispatch = useDispatch<Dispatch>();
    const songPlayer=useSelector((state:StoreType)=>state.songPlayer.song)
    const authState = useSelector((state:StoreType)=>state.user.authState)
    function getUserIdFromToken(token:string): string | null {
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
        console.log(authState);
        
        // if(!authState)
        //   return;
        const fetchData = async () => {
          const token = localStorage.getItem("authToken");
          const song = sessionStorage.getItem("songPlayer");  
          console.log(song);      
          if (token ) {
            const id = getUserIdFromToken(token);
            if (id) {
              await dispatch(load(id));
            }
          }
          if (song) {
            dispatch(loadSong(JSON.parse(song)));
            console.log(JSON.parse(song))
            console.log(songPlayer)
          }
        };  
        fetchData();
      }, [authState]);
      console.log("songId"+songPlayer.id);
      console.log("song"+songPlayer);
      const songId=songPlayer.id;
    return (<>
        <Header /> 
        {songPlayer.id!=0 &&<>
        <div style={{marginBottom:"100px"}}>
            <Outlet />
        </div>
        </>
        }
          {songPlayer.id===0 &&
            <Outlet />
        }

        
        {songId !=0 && 
        <SongPlayer/>}
    </>)
}

export default AppLayout
