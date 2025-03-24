import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Playlist } from "../models/Playlist";
import PlaylistService from "../services/PlaylistService";
import { Delete } from "@mui/icons-material";

interface DeletePlaylistProps {
  playlistId: number;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  playlists: Playlist[];
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const DeletePlaylist = ({ playlistId, setPlaylist, playlists, setPlaylists }: DeletePlaylistProps) => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDeletePlaylist = async () => {
    try {
      await PlaylistService.deletePlaylist(playlistId);
      setPlaylists((prevPlaylists) => prevPlaylists.filter((item) => item.id !== playlistId));
      setTimeout(() => {
        setPlaylist(() => (playlists.length > 1 ? playlists[1] : null));
      }, 0);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Delete sx={{ marginLeft: "14px" }} />}
        onClick={() => setOpenDialog(true)}
        style={{
          color: "#fff",
          textTransform: "none",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "transparent",
          boxShadow: "none",
          outline: "none",
          transition: "none",
          cursor: "default",
        }}
        disableRipple
        disableElevation
        disableFocusRipple
      >
        מחק
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
        PaperProps={{
          style: {
            backgroundColor: "#363636",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      >
        <DialogTitle style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
          אישור מחיקה
        </DialogTitle>
        <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
          <p>האם אתה בטוח שברצונך למחוק את הפלייליסט?</p>
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={handleCancelDelete}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color:"white",
                backgroundColor: "#363636",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                display: "block",
              }}
            >
              ביטול
            </span>
          </Button>
          <Button
            onClick={handleDeletePlaylist}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              marginRight:"20px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color:"white",
                backgroundColor: "#363636",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                display: "block",
              }}
            >
              אישור ומחיקה
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeletePlaylist;
