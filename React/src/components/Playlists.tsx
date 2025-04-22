import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { User } from "../models/User";
import PlaylistService from "../services/PlaylistService";
import { ExpandMore, ExpandLess, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Playlist } from "../models/Playlist";
import AddPlaylist from "./AddPlaylist";
import PlaylistDetails from "./PlaylistDetails ";

const Playlists: React.FC = () => {
  const user: User = useSelector((state: StoreType) => state.user.user);
  const authState: boolean = useSelector((store: StoreType) => store.user.authState);

  const [openOwned, setOpenOwned] = useState(false);
  const [openShared, setOpenShared] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedPlaylists, setOwnedPlaylists] = useState<Playlist[]>([]);
  const [sharedPlaylists, setSharedPlaylists] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      {/* Sidebar */}
      <div
        style={{
          width: sidebarOpen ? "30%" : "40px",
          transition: "width 0.3s",
          overflow: "hidden",
          padding: sidebarOpen ? "20px" : "0",
          position: "relative",
        }}
      >
        {/* Toggle button - ממוקם שונה לפי מצב הפתיחה */}
        {sidebarOpen ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <AddPlaylist playlists={ownedPlaylists} setPlaylists={setOwnedPlaylists} />
            <div
              onClick={() => setSidebarOpen(false)}
              style={{
                top: 10,
                borderRadius: "50%",
                // width: "30px",
                // height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                // marginRight: "10px",
              }}
            >
            <ChevronRight style={{ color: "white" }} />
            </div>
          </div>
        ) : (
          <div
            onClick={() => setSidebarOpen(true)}
            style={{
              top:10,
              position: "absolute",
              // right: "-15px",
              borderRadius: "50%",
              // width: "30px",
              // height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            <ChevronLeft style={{ color: "white" }} />
          </div>
        )}

        {/* התוכן של הסיידבר */}
        {sidebarOpen && (
          <>
            {/* Owned playlists */}
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <h4
                onClick={() => setOpenOwned(!openOwned)}
                style={{
                  cursor: "pointer",
                  padding: "0.5px",
                  color: "var(--color-white)",
                  borderRadius: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    width: "100%",
                    padding: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "15px" }}>פלייליסטים שלי</span>
                  {openOwned ? (
                    <ExpandLess style={{ fontSize: "20px", color: "var(--color-white)", marginLeft: "15px" }} />
                  ) : (
                    <ExpandMore style={{ fontSize: "20px", color: "var(--color-white)", marginLeft: "15px" }} />
                  )}
                </div>
              </h4>
              {openOwned && (
                <div>
                  {ownedPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist.id)}
                      style={{
                        backgroundColor: "var(--color-gray)",
                        marginBottom: "10px",
                        borderRadius: "32px",
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

            {/* Shared playlists */}
            <div>
              <h4
                onClick={() => setOpenShared(!openShared)}
                style={{
                  cursor: "pointer",
                  padding: "0.5px",
                  color: "var(--color-white)",
                  borderRadius: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                }}
              >
                <div
                  style={{
                    backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    width: "100%",
                    padding: "2px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ marginRight: "15px" }}>פלייליסטים ששותפו איתי</span>
                  {openShared ? (
                    <ExpandLess style={{ fontSize: "20px", color: "var(--color-white)", marginLeft: "15px" }} />
                  ) : (
                    <ExpandMore style={{ fontSize: "20px", color: "var(--color-white)", marginLeft: "15px" }} />
                  )}
                </div>
              </h4>
              {openShared && (
                <div>
                  {sharedPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      onClick={() => handlePlaylistClick(playlist.id)}
                      style={{
                        backgroundColor: "var(--color-gray)",
                        marginBottom: "10px",
                        borderRadius: "32px",
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
          </>
        )}
      </div>

      {/* Playlist details */}
      <div style={{ width: "70%", padding: "20px" }}>
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
