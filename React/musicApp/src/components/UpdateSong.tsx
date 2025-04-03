import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Song, SongDto } from "../models/Song";
import SongService from "../services/SongService";

interface UpdateSongProps {
  song: SongDto;
  onUpdate: (updatedSong: Song) => void;
  onClose: () => void;
}

const UpdateSong: React.FC<UpdateSongProps> = ({ song, onUpdate, onClose }) => {
  const [formData, setFormData] = useState<SongDto>(song);
  const [errors, setErrors] = useState<{ name: string }>({ name: "" });
  
  useEffect(() => {
    setFormData(song);
  }, [song]);

  const handleChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: formData.name.trim() ? "" : "שם השיר לא יכול להיות ריק",
    };
    setErrors(newErrors);
    if (!newErrors.name) {
      try {
        const songToUpdate: SongDto = { ...formData, isPublic: false };
        const updatedSong:Song = await SongService.updateSong(song.id, songToUpdate);
        if (updatedSong) {
          alert("השיר עודכן בהצלחה");
          onUpdate(updatedSong);
          onClose();
        } else {
          alert("שגיאה בעדכון השיר");
        }
      } catch (error) {
        console.error(error);
        alert("שגיאה בעדכון השיר");
      }
    }
  };

  return (
    <Dialog open={true} onClose={onClose} PaperProps={{
      style: { backgroundColor: "#363636", color: "#fff", borderRadius: "12px", padding: "16px" },
    }}>
      <DialogTitle style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
        עדכון שיר
      </DialogTitle>
      <DialogContent>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
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
        {errors.name && <div style={{ color: "red", fontSize: "14px" }}>{errors.name}</div>}
        <input
          type="text"
          value={formData.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="תיאור"
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
          type="text"
          value={formData.artist}
          onChange={(e) => handleChange("artist", e.target.value)}
          placeholder="שם האמן"
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
          type="text"
          value={formData.genre || ""}
          onChange={(e) => handleChange("genre", e.target.value)}
          placeholder="ז'אנר"
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
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <button
          onClick={onClose}
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
        </button>
        <button
          onClick={handleSubmit}
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
        </button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateSong;
