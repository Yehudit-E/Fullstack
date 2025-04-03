import { useState } from "react";
import SongService from "../services/SongService";
import { Song, SongPostModel } from "../models/Song";
import { Playlist } from "../models/Playlist";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";

interface UploadSongDialogProps {
  playlist: Playlist | null;
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>;
}

const UploadSongDialog = ({ playlist, setPlaylist }: UploadSongDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadFile = async () => {
    if (!file) {
      alert("בחר קובץ להעלאה");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);
      
      const uploadUrl = await SongService.getUploadUrl(fileName, file.type);
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (response.ok) {
        const songPostModel: SongPostModel = {
          name: fileName,
          description: "", // ניתן להוסיף בעתיד
          artist: "", // ניתן להוסיף בעתיד
          genre: "", // ניתן להוסיף בעתיד
          audioFilePath: uploadUrl.split("?")[0],
          playlistId: playlist!.id,
        };

        const song: Song = await SongService.addSong(songPostModel);
        
        if (playlist) {
          setPlaylist((prevPlaylist) => ({
            ...prevPlaylist!,
            songs: [...(prevPlaylist?.songs || []), song],
          }));
        }
        alert("השיר הועלה בהצלחה!");
        setShowUploadDialog(false);
      } else {
        alert("אירעה שגיאה בהעלאת הקובץ");
      }
    } catch (error) {
      alert("אירעה שגיאה בהעלאת הקובץ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

<IconButton
  onClick={() => setShowUploadDialog(true)}
  style={{
    color: "#fff",
    borderRadius: "8px",
    backgroundColor: "transparent",
    cursor: "default",
  }}
  disableRipple
>
<CloudUploadIcon/>
</IconButton>
      <Dialog
        open={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
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
          העלאת שיר
        </DialogTitle>
        <DialogContent style={{ fontSize: "16px", textAlign: "center" }}>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="שם השיר"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: "8px",
              marginBottom: "10px",
              outline: "none",
            }}
          />
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#333",
              color: "#fff",
              border: "1px solid #555",
              borderRadius: "8px",
              outline: "none",
            }}
          />

          {loading && (
            <>
              <LinearProgress
                variant="determinate"
                value={progress}
                style={{ height: "8px", borderRadius: "4px", backgroundColor: "#333", marginTop: "10px" }}
              />
              <p style={{ marginTop: "5px", fontSize: "14px", color: "#FFA726" }}>{progress}%</p>
            </>
          )}
        </DialogContent>
        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={() => setShowUploadDialog(false)} style={{ background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))", padding: "1px", borderRadius: "8px" }}>
            <span style={{ color: "white", backgroundColor: "#363636", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold", display: "block" }}>ביטול</span>
          </Button>
          <Button onClick={handleUploadFile} style={{ background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))", padding: "1px", marginRight: "20px", borderRadius: "8px" }}>
            <span style={{ color: "white", backgroundColor: "#363636", borderRadius: "8px", padding: "8px 16px", fontWeight: "bold", display: "block" }}>העלאה</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadSongDialog;
