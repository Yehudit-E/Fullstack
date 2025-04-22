import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
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
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => {
    setOpenDialog(true);
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setOpenDialog(false), 300);
    document.body.style.overflow = "";
  };

  const handleDeletePlaylist = async () => {
    try {
      await PlaylistService.deletePlaylist(playlistId);
      setPlaylists((prevPlaylists) => prevPlaylists.filter((item) => item.id !== playlistId));
      setTimeout(() => {
        setPlaylist(() => (playlists.length > 1 ? playlists[1] : null));
      }, 0);
      closeModal();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleCancelDelete = () => {
    closeModal();
  };

  return (
    <>
      <IconButton
        onClick={openModal}
        style={{
          color: "#fff",
          borderRadius: "8px",
          backgroundColor: "transparent",
          cursor: "default",
        }}
        disableRipple
      >
        <Delete />
      </IconButton>

      {openDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            direction: "rtl",
            fontSize: "16px",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-gray)",
              color: "var(--color-white)",
              borderRadius: "32px",
              padding: "16px",
              width: "500px",
              height: "250px",
              display: "flex",
              flexDirection: "column",
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* תמונה למעלה */}
            <img
              src="/images/delete-icon.png"
              alt="Delete Playlist"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "24px",
                margin: "0 auto 0",  // צמצום המרחק בין התמונה לכותרת
              }}
            />

            <h2
              style={{
                fontSize: "20px", // הקטנה של הגודל
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "0px", // צמצום המרחק
              }}
            >
              אישור מחיקה
            </h2>

            <DialogContent style={{ fontSize: "17px", textAlign: "center", margin: "0px" }}> {/* צמצום המרווח כאן */}
              <p>האם אתה בטוח שברצונך למחוק את הפלייליסט?</p>
            </DialogContent>

            <DialogActions style={{ justifyContent: "center" }}>
              <Button
                onClick={handleCancelDelete}
                style={{
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                  padding: "1px",
                  borderRadius: "32px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px", // הצרה של הגודל
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    padding: "8px 16px", // הצרה של הפדינג
                    display: "inline-block",
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
                  marginRight: "20px",
                  borderRadius: "32px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px", // הצרה של הגודל
                }}
              >
                <span
                  style={{
                    color: "white",
                    // backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    padding: "8px 16px", // הצרה של הפדינג
                    display: "inline-block",
                  }}
                >
                  אישור ומחיקה
                </span>
              </Button>
            </DialogActions>
          </div>
        </div>
      )}
    </>
  );
};

export default DeletePlaylist;
