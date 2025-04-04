import { useState, useRef } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress } from "@mui/material";
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [metaData, setMetaData] = useState<{ artist: string, genre: string }>({ artist: "", genre: "" });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadFile = async () => {
    if (!file) {
      alert("בחר קובץ להעלאה");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const uploadUrl = await SongService.getUploadUrl(file.name, file.type);

      const xhr = new XMLHttpRequest();
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
            artist: metaData.artist,  // השתמש במידע שהשלפנו ממטה הדאטה
            genre: metaData.genre,    // השתמש במידע שהשלפנו ממטה הדאטה
            audioFilePath: uploadUrl.split("?")[0],
            playlistId: playlist!.id,
          };

          const song: Song = await SongService.addSong(songPostModel);

          if (playlist) {
            setPlaylist((prevPlaylist: Playlist|null) => ({
              ...prevPlaylist!,
              songs: [...(prevPlaylist?.songs || []), song],
            }));
          }
          alert("השיר הועלה בהצלחה!");
          setShowUploadDialog(false);
        } else {
          alert("אירעה שגיאה בהעלאת הקובץ");
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        alert("אירעה שגיאה בהעלאת הקובץ");
        setLoading(false);
      };

      xhr.send(file);
    } catch (error) {
      alert("אירעה שגיאה בהעלאת הקובץ");
      setLoading(false);
    }
  };

  const handleFileDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      extractMetaData(droppedFile); // שלוף את המידע אחרי גרירת קובץ
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      extractMetaData(selectedFile); // שלוף את המידע אחרי בחירת קובץ
    }
  };

  // פונקציה לשליפת המידע מהמטא-דאטה
  const extractMetaData = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file);
      console.log("metadata:", metadata);
      // נסה לשלוף את המידע משדות שונים
      const artist = metadata.common.artist || metadata.common.albumartist || "אמן לא ידוע"; 
      const genre = metadata.common.genre?.[0] || "ז'אנר לא ידוע";
      
      setMetaData({ artist, genre });
    } catch (error) {
      console.error("שגיאה בהשליפה של המידע מהקובץ", error);
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setShowUploadDialog(true)}
        style={{
          color: "var(--color-white)",
          borderRadius: "8px",
          backgroundColor: "transparent",
          cursor: "default",
        }}
        disableRipple
      >
        <CloudUploadIcon />
      </IconButton>
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        PaperProps={{
          style: {
            backgroundColor: "var(--color-gray)",
            color: "var(--color-white)",
            borderRadius: "12px",
            padding: "16px",
            width: "500px", // הגדלת רוחב הדיאלוג
          },
        }}
      >
        <DialogTitle style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
          העלאת שיר
        </DialogTitle>
        <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
          {/* אזור גרירה עם אייקון */}
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()} // פתיחת בורר קבצים בלחיצה
            style={{
              width: "100%",
              height: "150px",
              border: "2px dashed var(--color-black)",
              borderRadius: "8px",
              backgroundColor: "var(--color-gray)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "10px",
              color: "var(--color-white)",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            <img
              src="/images/upload-icon.png" // כאן צריך לשים את הנתיב של האייקון שלך
              alt="העלאת קובץ"
              style={{ width: "50px", height: "50px", marginBottom: "10px" }}
            />
            {file ? <p>{file.name}</p> : <p>גרור ושחרר כאן קובץ או לחץ לבחירה</p>}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            style={{ display: "none" }} // מוסתר כי הלחיצה על האזור תפתח אותו
          />

          {loading && (
            <>
              <LinearProgress
                variant="determinate"
                value={progress}
                style={{
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "var(--color-gray)",
                  marginTop: "10px",
                }}
                sx={{
                  "& .MuiLinearProgress-bar": {
                    background: `linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))`, // צבעי גרדיאנט
                  },
                }}
              />
              <p style={{ marginTop: "5px", fontSize: "14px", color: "var(--color-white)" }}>
                {progress}% הועלה
              </p>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button
            onClick={() => setShowUploadDialog(false)}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                color: "white",
                backgroundColor: "var(--color-gray)",
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
            onClick={handleUploadFile}
            disabled={!file}
            style={{
              background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
              padding: "1px",
              marginRight: "20px",
              borderRadius: "8px",
              opacity: file ? 1 : 0.5,
            }}
          >
            <span
              style={{
                color: "white",
                backgroundColor: "var(--color-gray)",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                display: "block",
              }}
            >
              העלאה
            </span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadSongDialog;
