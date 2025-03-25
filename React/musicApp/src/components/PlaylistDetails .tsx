import React, { useState, useEffect } from "react";
import PlaylistService from "../services/PlaylistService";
import { Playlist } from "../models/Playlist";
import UploadSongDialog from "./UploadSongDialog";
import SharePlaylist from "./SharePlaylist";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import UpdatePlaylistName from "./UpdatePlaylistName";

interface PlaylistDetailsProps {
  playlistId: number;
  ownedPlaylists: Playlist[];
  setOwnedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const PlaylistDetails = ({ playlistId, ownedPlaylists, setOwnedPlaylists }: PlaylistDetailsProps) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const userId = useSelector((state: StoreType) => state.user.user.id)
  
  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlistData = await PlaylistService.getFullPlaylistById(playlistId);
      console.log(playlistData);
      setPlaylist(playlistData);

    };
    fetchPlaylist();
  }, [playlistId]);

  return (
    <div>
      {playlist ? (
        <>
          {/* מלבן עליון */}
          <div
            className="playlist-header"
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h2
                  style={{
                    background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontSize: "30px",
                    fontWeight: "bold",
                    display: "inline-block",
                    marginRight: "25px",
                  }}
                >
                  {playlist.name}
                </h2>

                {/* כפתור מנהל */}
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: "50px",
                    backgroundColor: "#363636",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "22px",
                  }}
                >
                  {playlist.ownerId === userId ? "אני" : playlist.owner.userName} (מנהל)
                </div>

                {/* רשימת משתמשים משותפים */}
                {playlist.sharedUsers?.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "50px",
                      backgroundColor: "#363636",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {user.id === userId ? "אני" : user.userName}
                  </div>
                ))}

              </div>
              <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: "4px" }}>

              {playlist?.ownerId === userId && <>
              <UpdatePlaylistName playlistId={playlistId} playlist={playlist} setPlaylist={setPlaylist} ownedPlaylists={ownedPlaylists} setOwnedPlaylists={setOwnedPlaylists}  />
              </>}
                <UploadSongDialog playlist={playlist} setPlaylist={setPlaylist} />
                {playlist.ownerId === userId && <>
                  <SharePlaylist playlistId={playlistId} setPlaylist={setPlaylist}></SharePlaylist>
                </>}

              </div>
              </div>

            </div>
          </div>

        </>
      ) : (
        <p>טעינת פלייליסט...</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
