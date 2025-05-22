import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography
} from "@mui/material";
import axios from "axios";
import { Song } from "../models/Song";
import SongService from "../services/SongService";

const Transcription = ({ song }: { song: Song }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [songLyrics, setSongLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDialogOpen = async () => {
    setOpenDialog(true);
    setLoading(true);
    setError("");
    try {
      if (song.lyrics == "") {
        const response = await axios.post("http://localhost:5000/transcribe", {
          url: song.audioFilePath,
        });
        setSongLyrics(response.data.corrected_lyrics);
        await SongService.addLyrics(song.id, response.data.corrected_lyrics);
      } else {
        setSongLyrics(song.lyrics);
      }
    } catch (err: any) {
      setError("שגיאה בתמלול השיר. נסה שוב מאוחר יותר.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSongLyrics("");
    setError("");
  };

  return (
    <div>
      <Button
        onClick={handleDialogOpen}
        variant="contained"
        color="primary"
        sx={{
          background: "linear-gradient(90deg, #D59039, #F7C26B)",
          "&:hover": { background: "linear-gradient(90deg, #F7C26B, #D59039)" },
          color: "#fff",
        }}
      >
        תמלול
      </Button>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>תמלול</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#fff", whiteSpace: "pre-line" }}>
            {loading
              ? "טוען תמלול..."
              : error
                ? error
                : songLyrics || "אין תמלול זמין"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              background: "linear-gradient(90deg, #D59039, #F7C26B)",
              "&:hover": {
                background: "linear-gradient(90deg, #F7C26B, #D59039)",
              },
              color: "#fff",
            }}
          >
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Transcription;