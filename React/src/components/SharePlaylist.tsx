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
  const [isVisible, setIsVisible] = useState(false);

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

  const openModal = () => {
    setShowShareDialog(true);
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowShareDialog(false), 300);
    document.body.style.overflow = "";
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
        <Share />
      </IconButton>

      {/* דיאלוג שיתוף */}
      {showShareDialog && (
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
              height: "auto",
              display: "flex",
              flexDirection: "column",
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "transform 0.3s ease",
            }}
          >
            {/* תמונה למעלה */}
            <img
              src="/images/share-icon.png"
              alt="Playlist"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "24px",
                margin: "0 auto 16px",
              }}
            />

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "16px",
              }}
            >
              שתף פלייליסט עם משתמש
            </h2>

            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="אימייל המשתמש"
              style={{
                padding: "10px",
                borderRadius: "32px",
                border: "1px solid var(--color-black)",
                backgroundColor: "var(--color-gray)",
                color: "white",
                fontSize: "16px",
                marginBottom: "16px",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "16px",
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                  padding: "1px",
                  borderRadius: "32px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <span
                  style={{
                    color: "white",
                    backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    padding: "10px 20px",
                    display: "inline-block",
                  }}
                >
                  ביטול
                </span>
              </button>

              <button
                onClick={handleSharePlaylist}
                style={{
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                  padding: "1px",
                  borderRadius: "32px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                <span
                  style={{
                    color: "white",
                    // backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    padding: "10px 20px",
                    display: "inline-block",
                  }}
                >
                  שתף
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SharePlaylist;
