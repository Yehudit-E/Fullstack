import { Outlet } from "react-router"
import Header from "./Header"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {  load } from "../store/userSlice";
import { Dispatch, StoreType } from "../store/store";
import SongPlayer from "./SongPlayer";
import { loadSongs } from "../store/songSlice";
const AppLayout = () => {
    const dispatch = useDispatch<Dispatch>();
    const songsList=useSelector((state:StoreType)=>state.songPlayer.songs)
    const currentSongIndex=useSelector((state:StoreType)=>state.songPlayer.currentIndex)
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
          const songsList = sessionStorage.getItem('songsList') ? JSON.parse(sessionStorage.getItem('songsList')!) : []; // מערך שירים
          const currentSongIndex = sessionStorage.getItem('currentSongIndex') ? JSON.parse(sessionStorage.getItem('currentSongIndex')!) : 0; // מספר          console.log("---------------------------------------");
          
          console.log(songsList[currentSongIndex]);      
          if (token ) {
            const id = getUserIdFromToken(token);
            if (id) {
              await dispatch(load(id));
            }
          }
          console.log(songsList);
          
          if (songsList.length > 0) {
            console.log(songsList);
            dispatch(loadSongs(songsList));
          }
        };  
        fetchData();
      }, [authState]);
      console.log("songId"+songsList[currentSongIndex].id);
      console.log("song"+songsList[currentSongIndex]);
      const songId=songsList[currentSongIndex].id;
    return (<>
        <Header />
         <Outlet />
        {songsList[0].id!=0 &&
        <div style={{marginBottom:"100px"}}> </div>
        }
        {songId !=0 && 
        <SongPlayer/>}
    </>)
}

export default AppLayout