import { Outlet } from "react-router"
import Header from "./Header"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load } from "../store/userSlice";
import { Dispatch, StoreType } from "../store/store";
import SongPlayer from "./SongPlayer";
import { loadSongs } from "../store/songSlice";
import Footer from "./Footer";
const AppLayout = () => {
  const dispatch = useDispatch<Dispatch>();
  const songsList = useSelector((state: StoreType) => state.songPlayer.songs)
  const currentSongIndex = useSelector((state: StoreType) => state.songPlayer.currentIndex)
  const authState = useSelector((state: StoreType) => state.user.authState)

  function getUserIdFromToken(token: string): string | null {
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
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      const songsList = sessionStorage.getItem('songsList') ? JSON.parse(sessionStorage.getItem('songsList')!) : []; // מערך שירים
      const currentSongIndex = sessionStorage.getItem('currentSongIndex') ? JSON.parse(sessionStorage.getItem('currentSongIndex')!) : 0; // מספר          console.log("---------------------------------------");

      console.log(songsList[currentSongIndex]);
      if (token) {
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
  const songId = songsList[currentSongIndex].id;
  const hasSongPlayer = songsList[0].id !== 0;

  return (
    <div className={`app-layout ${hasSongPlayer ? 'song-player-active' : ''}`}>
      <Header />
      <div style={{ marginTop: "60px" }}> </div>
      <main className="app-main" style={{ minHeight:"85vh"}}>
        <Outlet />
      </main>
      {!hasSongPlayer && (
        <>
          <Footer />

        </>
      )}
      {hasSongPlayer && (
        <>
          <div style={{ marginBottom: "100px" }}> </div>
          {songId !== 0 && <SongPlayer />}
        </>
      )}
    </div>
  )
}

export default AppLayout



// "use client"

// import { Outlet } from "react-router"
// import { useDispatch, useSelector } from "react-redux"
// import { useEffect, useState } from "react"
// import { load } from "../store/userSlice"
// import type { Dispatch, StoreType } from "../store/store"
// import SongPlayer from "./SongPlayer"
// import { loadSongs } from "../store/songSlice"
// import Sidebar from "./Sidebar"
// import "./style/AppLayout.css"

// const AppLayout = () => {
//   const dispatch = useDispatch<Dispatch>()
//   const songsList = useSelector((state: StoreType) => state.songPlayer.songs)
//   const currentSongIndex = useSelector((state: StoreType) => state.songPlayer.currentIndex)
//   const authState = useSelector((state: StoreType) => state.user.authState)
//   const [sidebarExpanded, setSidebarExpanded] = useState(false)

//   function getUserIdFromToken(token: string): string | null {
//     if (!token) {
//       return null
//     }
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]))
//       return payload.id || null
//     } catch (e) {
//       console.error("Invalid token:", e)
//       return null
//     }
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("authToken")
//       const songsList = sessionStorage.getItem("songsList") ? JSON.parse(sessionStorage.getItem("songsList")!) : []
//       const currentSongIndex = sessionStorage.getItem("currentSongIndex")
//         ? JSON.parse(sessionStorage.getItem("currentSongIndex")!)
//         : 0

//       if (token) {
//         const id = getUserIdFromToken(token)
//         if (id) {
//           await dispatch(load(id))
//         }
//       }

//       if (songsList.length > 0) {
//         dispatch(loadSongs(songsList))
//       }
//     }

//     fetchData()
//   }, [authState, dispatch])

//   const songId = songsList[currentSongIndex]?.id || 0

//   const handleSidebarToggle = (expanded: boolean) => {
//     setSidebarExpanded(expanded)
//   }

//   return (
//     <div className="app-container">
//       <Sidebar onToggle={handleSidebarToggle} />

//       <main className={`main-content ${sidebarExpanded ? "sidebar-expanded" : "sidebar-collapsed"}`}>
//         <Outlet />

//         {songsList[0]?.id !== 0 && <div style={{ marginBottom: "100px" }}></div>}

//         {songId !== 0 && <SongPlayer />}
//       </main>
//     </div>
//   )
// }

// export default AppLayout