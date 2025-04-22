import { useState, useEffect, useRef } from "react";
import { Button, IconButton, LinearProgress } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { Song, SongPostModel } from "../models/Song";
import SongService from "../services/SongService";
import { Playlist } from "../models/Playlist";
import * as mm from "music-metadata-browser";
import { Buffer } from "buffer";

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
window.Buffer = Buffer;

interface UploadSongDialogProps {
  playlist: Playlist | null;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
}

const UploadSongDialog = ({ playlist, setPlaylist }: UploadSongDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metaData, setMetaData] = useState({ artist: "", genre: "" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null); // נוספה שמירת רפרנס ל־xhr

  useEffect(() => {
    if (showUploadDialog) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = '';
    }
  }, [showUploadDialog]);

  const closeModal = () => {
    if (xhrRef.current && loading) {
      xhrRef.current.abort(); // ביטול ההעלאה בפועל
    }
    setIsVisible(false);
    setTimeout(() => {
      setShowUploadDialog(false);
      setFile(null);
      setProgress(0);
      setLoading(false);
    }, 300);
  };

  const handleUploadFile = async () => {
    if (!file) return alert("בחר קובץ להעלאה");
    try {
      setLoading(true);
      setProgress(0);
      const uploadUrl = await SongService.getUploadUrl(file.name, file.type);
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr; // שמירת הרפרנס

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const songPostModel: SongPostModel = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            description: "",
            artist: metaData.artist,
            genre: metaData.genre,
            audioFilePath: uploadUrl.split("?")[0],
            playlistId: playlist!.id,
          };
          const song: Song = await SongService.addSong(songPostModel);
          if (playlist) {
            setPlaylist((prev) => ({
              ...prev!,
              songs: [...(prev?.songs || []), song],
            }));
          }
          alert("השיר הועלה בהצלחה!");
          closeModal();
        } else {
          alert("אירעה שגיאה בהעלאה");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        if (xhr.statusText !== "abort") {
          alert("אירעה שגיאה בהעלאת הקובץ");
        }
        setLoading(false);
      };

      xhr.send(file);
    } catch (err) {
      alert("שגיאה בהעלאת הקובץ");
      setLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      extractMetaData(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      extractMetaData(selectedFile);
    }
  };

  const extractMetaData = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file);
      const artist = metadata.common.artist || metadata.common.albumartist || "אמן לא ידוע";
      const genre = metadata.common.genre?.[0] || "ז'אנר לא ידוע";
      setMetaData({ artist, genre });
    } catch (e) {
      console.error("שגיאה בהפקת מטא-דאטה:", e);
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowUploadDialog(true)} style={{ color: "var(--color-white)" }}>
        <CloudUploadIcon />
      </IconButton>

      {showUploadDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
            direction: "rtl",
            fontSize: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-gray)",
              color: "var(--color-white)",
              borderRadius: "32px",
              padding: "16px",
              width: "500px",
              transform: isVisible ? "translateY(0)" : "translateY(50px)",
              transition: "transform 0.3s ease",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "bold", textAlign: "center" }}>
              העלאת שיר
            </h2>

            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: "100%",
                height: "150px",
                border: "2px dashed var(--color-black)",
                borderRadius: "12px",
                backgroundColor: "var(--color-gray)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "16px",
                color: "var(--color-white)",
                fontSize: "16px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <img src="/images/upload-icon.png" alt="upload" style={{ width: '80px', height: '80px', marginBottom: 10 }} />
              <p>{file ? file.name : "גרור ושחרר כאן קובץ או לחץ לבחירה"}</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {loading && (
              <>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  style={{ height: "8px", borderRadius: "4px", backgroundColor: "var(--color-gray)" }}
                  sx={{
                    "& .MuiLinearProgress-bar": {
                      background: `linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))`,
                    },
                  }}
                />
                <p style={{ marginTop: "8px", fontSize: "14px", textAlign: "center" }}>{progress}% הועלה</p>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
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
                onClick={handleUploadFile}
                disabled={!file}
                style={{
                  background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                  padding: "1px",
                  borderRadius: "32px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: file ? "pointer" : "not-allowed",
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
                  העלאה
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadSongDialog;
