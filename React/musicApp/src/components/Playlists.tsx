import React, { useState, useEffect } from "react";
import {  useSelector } from "react-redux";
import {  StoreType } from "../store/store";
import { User } from "../models/User";
import PlaylistService from "../services/PlaylistService";
import {  ExpandMore, ExpandLess } from "@mui/icons-material"; // אייקונים דקים ויפים של חץ
import PlaylistDetails from "./PlaylistDetails ";
import { Playlist } from "../models/Playlist";
import AddPlaylist from "./AddPlaylist";

const Playlists: React.FC = () => {
  const user: User = useSelector((state: StoreType) => state.user.user);
  const [openOwned, setOpenOwned] = useState(false);
  const [openShared, setOpenShared] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedPlaylists, setOwnedPlaylists] = useState<Playlist[]>([]);
  const [sharedPlaylists, setSharedPlaylists] = useState<any[]>([]);
  const authState: boolean = useSelector((store: StoreType) => store.user.authState);
  console.log(authState);

  useEffect(() => {

    const fetchPlaylists = async () => {
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const owned = await PlaylistService.getUserPlaylists(user.id);
        const shared = await PlaylistService.getUserSharedPlaylists(user.id);
        setOwnedPlaylists(owned);
        setSharedPlaylists(shared);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      } finally {
        setLoading(false);
      }
    };
    // while(!authState);
    fetchPlaylists();
  }, [user.id]);

  const handlePlaylistClick = (playlistId: number) => {
    setSelectedPlaylistId(playlistId);
  };

  

  if (loading) {
    return <div style={{ color: "white" }}>Loading playlists...</div>;
  }

  return (
    <div style={{ display: "flex", color: "white" }}>
      {/* צד ימין - פלייליסטים שלי ופלייליסטים ששותפו */}
      <div style={{ width: "30%", padding: "20px" }}>
        <AddPlaylist playlists={ownedPlaylists} setPlaylists={setOwnedPlaylists}></AddPlaylist>
        {/* רשימות השמעה שלי */}
        <div style={{ marginBottom: "20px" }}>
          <h3
            onClick={() => setOpenOwned(!openOwned)}
            style={{
              cursor: "pointer",
              padding: "0.5px",
              color: "var(--color-white)",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--color-gray)",
                borderRadius: "8px",
                width: "100%",
                padding:"2px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>רשימות השמעה שלי</span>
              {openOwned ? <ExpandLess style={{ fontSize: "20px", color: "var(--color-white)" }} /> : <ExpandMore style={{ fontSize: "20px", color: "var(--color-white)" }} />}
            </div>
          </h3>
          {openOwned && (
            <div>
              {ownedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id)}
                  style={{
                    backgroundColor: "var(--color-gray)",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                    cursor: "pointer",
                    color: "var(--color-white)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {playlist.name}
                </div>
              ))}
            </div>
          )}
          
        </div>

        {/* רשימות ששותפו איתי */}
        <div>
          <h3
            onClick={() => setOpenShared(!openShared)}
            style={{
              cursor: "pointer",
              padding: "0.5px",
              color: "var(--color-white)",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "var(--color-gray)",
                borderRadius: "8px",
                width: "100%",
                padding:"2px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
            <span>רשימות ששותפו איתי</span>
            {openShared ? <ExpandLess style={{ fontSize: "20px", color: "var(--color-white)" }} /> : <ExpandMore style={{ fontSize: "20px", color: "var(--color-white)" }} />}
            </div>
         </h3>
          {openShared && (
            <div>
              {sharedPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist.id)}
                  style={{
                    backgroundColor: "var(--color-gray)",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    padding: "10px",
                    cursor: "pointer",
                    color: "var(--color-white)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  {playlist.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* צד שמאל - פרטי הפלייליסט */}
      <div style={{ width: "75%", padding: "20px" }}>
        {selectedPlaylistId ? (
          <PlaylistDetails
            playlistId={selectedPlaylistId}
            ownedPlaylists={ownedPlaylists}
            setOwnedPlaylists={setOwnedPlaylists}
          />
        ) : (
          <p>בחר פלייליסט כדי לראות את השירים</p>
        )}
      </div>
    </div>
  );
};

export default Playlists;
