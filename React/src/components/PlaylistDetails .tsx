import React, { useState, useEffect } from "react";
import PlaylistService from "../services/PlaylistService";
import { Playlist } from "../models/Playlist";
import SharePlaylist from "./SharePlaylist";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import UpdatePlaylistName from "./UpdatePlaylistName";
import { IconButton, Divider, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Song } from "../models/Song";
import { resetSong, updateSong } from "../store/songSlice";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateSong from "./UpdateSong"; // Importing the UpdateSong component
import UploadSongDialog from "./UploadSongDialog";
import DeletePlaylist from "./DeletePlaylist";

interface PlaylistDetailsProps {
  playlistId: number;
  ownedPlaylists: Playlist[];
  setOwnedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const PlaylistDetails = ({ playlistId, ownedPlaylists, setOwnedPlaylists }: PlaylistDetailsProps) => {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [anchorElPlaylist, setAnchorElPlaylist] = useState<null | HTMLElement>(null);
  const [anchorElSong, setAnchorElSong] = useState<{ [key: string]: HTMLElement | null }>({});
  const [editingSong, setEditingSong] = useState<Song | null>(null); // State to handle editing song
  const [openDialog, setOpenDialog] = useState(false); // State to control the delete confirmation dialog
  const [songToDelete, setSongToDelete] = useState<number | null>(null); // State to store the song ID for deletion

  const userId = useSelector((state: StoreType) => state.user.user.id);
  const dispatch = useDispatch<Dispatch>();
  const currentSong  =useSelector((state:StoreType)=>state.songPlayer.song) 
  console.log("currentSong",currentSong);
       
  const handlePlaylistMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElPlaylist(event.currentTarget);
  };

  const handlePlaylistMenuClose = () => {
    setAnchorElPlaylist(null);
  };

  useEffect(() => {
    const fetchPlaylist = async () => {
      const playlistData = await PlaylistService.getFullPlaylistById(playlistId);
      setPlaylist(playlistData);
    };
    fetchPlaylist();
  }, [playlistId]);

  const handlePlaySong = (song: Song) => {
    dispatch(updateSong(song));
  };

  const handleSongMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, songId: number) => {
    setAnchorElSong((prev) => ({ ...prev, [songId]: event.currentTarget }));
  };

  const handleSongMenuClose = (songId: number) => {
    setAnchorElSong((prev) => ({ ...prev, [songId]: null }));
  };

  const downloadSong = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("שגיאה בהורדת הקובץ");

      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // משחרר את הזיכרון
    } catch (error) {
      console.error("שגיאה בהורדה:", error);
    }
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    handleSongMenuClose(song.id); // Close the song menu
  };

  const handleUpdateSong = (updatedSong: Song) => {
    setEditingSong(null);
    setPlaylist((prev) => {
      if (prev) {
        const updatedSongs = prev.songs?.map((song) => (song.id === updatedSong.id ? updatedSong : song));
        return { ...prev, songs: updatedSongs };
      }
      return prev;
    });
    // Here you can perform additional actions after updating the song
  };

  // const handleDeleteSong = async () => {
  //   if (songToDelete === null || !playlist) return;
  //   try {
  //     await PlaylistService.removeSongFromPlaylist(playlist.id, songToDelete);

  //     // עדכון הסטייט של הפלייליסט לאחר מחיקה
  //     setPlaylist((prev) => {
  //       if (!prev) return prev;
  //       return { ...prev, songs: prev.songs?.filter((song) => song.id !== songToDelete) };
  //     });

  //     alert("השיר נמחק בהצלחה!");
  //   } catch (error) {
  //     alert("שגיאה במחיקת השיר.");
  //   }
  //   setOpenDialog(false); // Close the dialog after deletion
  // };
  const handleDeleteSong = async () => {
    
    if (songToDelete === null || !playlist) return;
    try {
      await PlaylistService.removeSongFromPlaylist(playlist.id, songToDelete);
  
      // עדכון הסטייט של הפלייליסט לאחר מחיקה
      setPlaylist((prev) => {
        if (!prev) return prev;
        return { ...prev, songs: prev.songs?.filter((song) => song.id !== songToDelete) };
      });
  
      // // אם השיר שהתנגן נמחק, אז נבצע reset לנגן
      // const currentSong  =useSelector((state:StoreType)=>state.songPlayer.song)      
      if (currentSong?.id === songToDelete) {
        dispatch(resetSong());  
      }
  
      alert("השיר נמחק בהצלחה!");
    } catch (error) {
      alert("שגיאה במחיקת השיר.");
    }
    setOpenDialog(false); // Close the dialog after deletion
  };

  const openDeleteDialog = (songId: number) => {
    setSongToDelete(songId);
    setOpenDialog(true); // Open the dialog
  };

  const handleCancelDelete = () => {
    setOpenDialog(false); // Close the dialog without deleting
  };

  return (
    <div>
      {playlist ? (
        <>
          <div className="playlist-header" style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {playlist.ownerId==userId &&
                <IconButton onClick={handlePlaylistMenuOpen}>
                  <MoreVertIcon sx={{ marginRight: "25px", fontSize: "25px", color: "white" }} />
                </IconButton>
                }
                {playlist.ownerId!=userId &&
                <UploadSongDialog playlist={playlist} setPlaylist={setPlaylist} />
                }
                <h2
                  style={{
                    background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                    // background:"var(--color-gray)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontSize: "30px",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {playlist.name}
                </h2>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: "50px",
                    backgroundColor: "var(--color-gray)",
                    color: "var(--color-white)",
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
                {playlist.sharedUsers?.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "50px",
                      backgroundColor: "var(--color-gray)",
                      color: "var(--color-white)",
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
              {/* <div style={{ display: "flex", marginRight: "15px" }}>
                <DeletePlaylist playlistId={playlistId} setPlaylist={setPlaylist} playlists={ownedPlaylists} setPlaylists={setOwnedPlaylists} />
                {playlist.ownerId === userId && <UpdatePlaylistName playlistId={playlistId} playlist={playlist} setPlaylist={setPlaylist} setOwnedPlaylists={setOwnedPlaylists} />}
                <UploadSongDialog playlist={playlist} setPlaylist={setPlaylist} />
                {playlist.ownerId === userId && <SharePlaylist playlistId={playlistId} setPlaylist={setPlaylist} />}
              </div> */}
            </div>
          </div>

          {/* Menu עבור האפשרויות */}
          <Menu
            anchorEl={anchorElPlaylist}
            open={Boolean(anchorElPlaylist)}
            onClose={handlePlaylistMenuClose}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                backgroundColor: "var(--color-gray)",
              },
            }}
          >
            <div style={{ backgroundColor: "var(--color-gray)", display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
              <MenuItem >
                <UpdatePlaylistName playlistId={playlistId} playlist={playlist} setPlaylist={setPlaylist} setOwnedPlaylists={setOwnedPlaylists} />
              </MenuItem>
              <MenuItem  >
                <DeletePlaylist playlistId={playlistId} setPlaylist={setPlaylist} playlists={ownedPlaylists} setPlaylists={setOwnedPlaylists} />
              </MenuItem>
              <MenuItem >
                <UploadSongDialog playlist={playlist} setPlaylist={setPlaylist} />
              </MenuItem>
              <MenuItem >
                <SharePlaylist playlistId={playlistId} setPlaylist={setPlaylist} />
              </MenuItem>
            </div>
          </Menu>


          {/* רשימת השירים */}
          <div className="songs-container" style={{ flexGrow: 1, marginRight: "85px", marginTop: "20px" }}>
            <div className="songs-grid">
              {playlist.songs?.map((song) => (
                <div key={song.id} className="song-card">
                  <div className="song-image-container">
                    <img src="/images/soundbar.png" alt={song.name} className="song-image" />
                    <div className="play-button-container">
                      <IconButton sx={{ border: "0.8px solid white", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
                        onClick={() => handlePlaySong(song)}
                      >
                        <PlayArrowIcon sx={{ color: "white", fontSize: 30 }} />
                      </IconButton>
                    </div>
                  </div>
                  <Divider sx={{ width: "90%", marginTop: "30px", borderBottomWidth: 0.5, borderColor: "var(--color-white)" }} />
                  <div className="song-info">
                    <span className="song-text">{song.name} </span>
                    <div className="song-icons">
                      <IconButton onClick={(e) => handleSongMenuOpen(e, song.id)}>
                        <MoreVertIcon sx={{ color: "white", fontSize: 20 }} />
                      </IconButton>
                      <Menu
                        anchorEl={anchorElSong[song.id]}
                        open={Boolean(anchorElSong[song.id])}
                        onClose={() => handleSongMenuClose(song.id)}
                        sx={{ "& .MuiPaper-root": { backgroundColor: "var(--color-gray)", color: "white" } }}
                      >
                        <MenuItem onClick={() => {
                          handleSongMenuClose(song.id);
                          downloadSong(song.audioFilePath, song.name);
                        }}>
                          <DownloadIcon sx={{ marginLeft: "7px",fontSize: "16px" }} />הורדה
                        </MenuItem>
                        <MenuItem onClick={() => handleEditSong(song)}>
                          <EditIcon sx={{ marginLeft: "7px" ,fontSize: "16px"}} />עדכן שיר
                        </MenuItem>
                        <MenuItem onClick={() => openDeleteDialog(song.id)}>
                          <DeleteIcon sx={{ marginLeft: "7px" ,fontSize: "16px"}} /> מחק שיר
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dialog לעדכון שיר */}
          {editingSong && (
            <UpdateSong song={editingSong} onUpdate={handleUpdateSong} onClose={() => setEditingSong(null)} />
          )}

          {/* דיאלוג לאישור מחיקת שיר */}
          <Dialog open={openDialog} onClose={handleCancelDelete} PaperProps={{ style: { backgroundColor: "var(--color-gray)", color: "var(--color-white)", borderRadius: "12px", padding: "16px" } }}>
            <DialogTitle style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
              אישור מחיקה
            </DialogTitle>
            <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
              <p>האם אתה בטוח שברצונך למחוק את השיר?</p>
            </DialogContent>
            <DialogActions style={{ justifyContent: "center" }}>
              <Button onClick={handleCancelDelete} style={{ background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))", padding: "1px", borderRadius: "8px" }}>
                <span style={{ color: "white", backgroundColor: "var(--color-gray)", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold", display: "block" }}>
                  ביטול
                </span>
              </Button>
              <Button onClick={handleDeleteSong} style={{ background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))", padding: "1px", marginRight: "20px", borderRadius: "8px" }}>
                <span style={{ color: "white", backgroundColor: "var(--color-gray)", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold", display: "block" }}>
                  אישור ומחיקה
                </span>
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <p>טעינת פלייליסט...</p>
      )}
    </div>
  );
};

export default PlaylistDetails;
