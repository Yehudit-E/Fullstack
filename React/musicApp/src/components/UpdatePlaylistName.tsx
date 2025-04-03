import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Edit } from "@mui/icons-material";
import PlaylistService from "../services/PlaylistService";
import { Playlist } from "../models/Playlist";

interface UpdatePlaylistNameProps {
  playlistId: number;
  playlist: Playlist | null;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  setOwnedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const UpdatePlaylistName = ({ playlistId, playlist, setPlaylist, setOwnedPlaylists }: UpdatePlaylistNameProps) => {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const handleRenamePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        await PlaylistService.updatePlaylist(playlistId, { name: newPlaylistName, ownerId: playlist!.ownerId });
        setOwnedPlaylists((prevPlaylists) =>
          prevPlaylists.map((item) =>
            item.id === playlistId ? { ...item, name: newPlaylistName } : item
          )
        );
        setPlaylist((prev) => (prev ? { ...prev, name: newPlaylistName } : prev));
        setShowRenameDialog(false);
      } catch (error) {
        console.error("Error renaming playlist:", error);
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setShowRenameDialog(true)}
        style={{
          color: "#fff",
          borderRadius: "8px",
          backgroundColor: "transparent",
          cursor: "default",
        }}
        disableRipple
      >
        <Edit />
      </IconButton>

      {/* דיאלוג לשינוי שם */}
      <Dialog open={showRenameDialog} onClose={() => setShowRenameDialog(false)} PaperProps={{
        style: {
          backgroundColor: "#363636",
          color: "#fff",
          borderRadius: "12px",
          padding: "16px",
        },
      }}>
        <DialogTitle style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
          שנה שם פלייליסט
        </DialogTitle>
        <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="הכנס שם חדש"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#363636",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: "8px",
              marginBottom: "10px",
              outline: "none",
            }}
          />
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={() => setShowRenameDialog(false)}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color: "white",
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
            onClick={handleRenamePlaylist}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              marginRight: "20px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color: "white",
                backgroundColor: "#363636",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                display: "block",
              }}
            >
              עדכון
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdatePlaylistName;
