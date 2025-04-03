import { Share } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useState } from "react";
import PlaylistService from "../services/PlaylistService";
import { Playlist } from "../models/Playlist";

interface SharePlaylistProps {
  playlistId: number;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
}

const SharePlaylist = ({ playlistId, setPlaylist }: SharePlaylistProps) => {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleSharePlaylist = async () => {
    if (!userEmail.trim()) {
      alert("יש להזין אימייל תקין");
      return;
    }
    try {
      console.log(playlistId, userEmail);
      await PlaylistService.addUserToPlaylist(playlistId, userEmail);
      setShowShareDialog(false);
      setUserEmail("");
      alert("הפלייליסט שותף בהצלחה!");
      await PlaylistService.getFullPlaylistById(playlistId).then((playlist) => {
        setPlaylist(() => playlist);
      });
    } catch (error) {
      console.error("Error sharing playlist:", error);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setShowShareDialog(true)}
        style={{
          color: "#fff",
          borderRadius: "8px",
          backgroundColor: "transparent",
          cursor: "default",
        }}
        disableRipple
      >
        <Share />
      </IconButton>

      {/* דיאלוג שיתוף */}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
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
          שתף פלייליסט עם משתמש
        </DialogTitle>
        <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
          <input
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="אימייל המשתמש"
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
            onClick={() => setShowShareDialog(false)}
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
            onClick={handleSharePlaylist}
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
              שתף
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SharePlaylist;
