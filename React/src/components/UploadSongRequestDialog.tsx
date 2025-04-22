import { useState, useEffect, useRef } from "react";
import { IconButton, LinearProgress } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import * as mm from "music-metadata-browser";
import { Buffer } from "buffer";
import SongService from "../services/SongService";
import api from "../interceptor/api";
import { useSelector } from "react-redux";
import { RequestPostModel } from "../models/Request";

(window as any).Buffer = Buffer;

const UploadSongRequestDialog = () => {
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metaData, setMetaData] = useState({ artist: "", genre: "" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const userId = useSelector((state: any) => state.user.user).id; // Assuming you have a userId in your Redux store
  useEffect(() => {
    if (showDialog) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = '';
    }
  }, [showDialog]);

  const closeModal = () => {
    if (xhrRef.current && loading) {
      xhrRef.current.abort();
    }
    setIsVisible(false);
    setTimeout(() => {
      setShowDialog(false);
      setFile(null);
      setProgress(0);
      setLoading(false);
    }, 300);
  };

  const handleUploadFile = async () => {
    if (!file) return alert("בחר קובץ");

    try {
      setLoading(true);
      setProgress(0);

      const uploadUrl = await SongService.getUploadUrl(file.name, file.type);
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

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
          const requestPostModel: RequestPostModel = {
            userId: userId,
            songName: file.name.replace(/\.[^/.]+$/, ""),
            songArtist: metaData.artist,
            songGenre: metaData.genre,
            songAudioFilePath: uploadUrl.split("?")[0],

          };
          await api.post("/Request", requestPostModel);
          alert("הבקשה נשלחה למנהל!");
          closeModal();
        } else {
          alert("שגיאה בהעלאה");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        if (xhr.statusText !== "abort") {
          alert("שגיאה בהעלאת הקובץ");
        }
        setLoading(false);
      };

      xhr.send(file);
    } catch (err) {
      alert("שגיאה בהעלאה");
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
      console.error("שגיאת מטא-דאטה:", e);
    }
  };

  return (
    <>
      <IconButton onClick={() => setShowDialog(true)} style={{ color: "var(--color-white)" }}>
        <AddIcon />
      </IconButton>

      {showDialog && (
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
            <h2 style={{ textAlign: "center" }}>בקשה להוספת שיר למאגר</h2>
<div style={{ textAlign: "center",marginBottom:"16px" }}>העלה שיר לבדיקה במערכת. <br />לאחר השליחה, השיר יעבור תהליך בדיקה ואישור, ותוכל לקבל עדכון על התוצאה. אם יאושר, השיר יתפרסם במאגר הציבורי. <br />תודה על שיתוף הפעולה!</div>
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
                cursor: "pointer",
              }}
            >
              <img src="/images/upload-icon.png" alt="upload" style={{ width: '80px', height: '80px', marginBottom: 10 }} />
              <p>{file ? file.name : "גרור קובץ או לחץ לבחירה"}</p>
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
                <p style={{ marginTop: "8px", textAlign: "center" }}>{progress}% הועלה</p>
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
                    backgroundColor: "var(--color-gray)",
                    borderRadius: "32px",
                    padding: "10px 20px",
                    display: "inline-block",
                  }}
                >
                  שלח בקשה
                </span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadSongRequestDialog;
