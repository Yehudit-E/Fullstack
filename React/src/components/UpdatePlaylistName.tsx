import { useState } from "react";
import { Edit } from "@mui/icons-material";
import PlaylistService from "../services/PlaylistService";
import { Playlist } from "../models/Playlist";

interface UpdatePlaylistNameProps {
  playlistId: number;
  playlist: Playlist | null;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
  setOwnedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const UpdatePlaylistName = ({
  playlistId,
  playlist,
  setPlaylist,
  setOwnedPlaylists,
}: UpdatePlaylistNameProps) => {
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const openModal = () => {
    setNewPlaylistName(playlist?.name ?? ""); // זה הקטע החדש
    setShowRenameDialog(true);
    setTimeout(() => setIsVisible(true), 10);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => setShowRenameDialog(false), 300);
    document.body.style.overflow = "";
  };

  const handleRenamePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        await PlaylistService.updatePlaylist(playlistId, {
          name: newPlaylistName,
          ownerId: playlist!.ownerId,
        });
        setOwnedPlaylists((prevPlaylists) =>
          prevPlaylists.map((item) =>
            item.id === playlistId ? { ...item, name: newPlaylistName } : item
          )
        );
        setPlaylist((prev) =>
          prev ? { ...prev, name: newPlaylistName } : prev
        );
        closeModal();
      } catch (error) {
        console.error("שגיאה בעדכון הפלייליסט:", error);
        alert("אירעה שגיאה בעדכון השם.");
      }
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "#fff",
          padding: "4px",
        }}
      >
        <Edit />
      </button>

      {showRenameDialog && (
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
            <img
              src="/images/edit-icon.png"
              alt="Playlist"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "24px",
                margin: "0 auto 0",
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
              שינוי שם פלייליסט
            </h2>

            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="שם חדש לפלייליסט..."
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
                onClick={handleRenamePlaylist}
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
                    borderRadius: "32px",
                    padding: "10px 20px",
                    display: "inline-block",
                  }}
                >
                  עדכון
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdatePlaylistName;
