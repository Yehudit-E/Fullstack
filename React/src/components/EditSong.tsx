
import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from "@mui/material"
import { Close } from "@mui/icons-material"
import { Music } from "lucide-react"
import type { Song, SongPostModel } from "../models/Song"
import SongService from "../services/SongService"
import "./style/AddPlaylist.css" // Reuse the same styles
import { Playlist } from "../models/Playlist"

interface EditSongProps {
  song: Song
  playlistId: number
  setPlaylist: React.Dispatch<React.SetStateAction<Playlist | null>>
  setSong: React.Dispatch<React.SetStateAction<Song | null>>
  closeEditDialog: () => void
}

const EditSong = ({ song, playlistId,setPlaylist,setSong, closeEditDialog }: EditSongProps) => {
  // State
  const [songData, setSongData] = useState({
    name: "",
    artist: "",
    genre: "",
    album: "",
    year: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  // Load song data when component mounts
  useEffect(() => {
    if (song) {
      setSongData({
        name: song.name || "",
        artist: song.artist || "",
        genre: song.genre || "",
        album: song.album || "",
        year: song.year?.toString() || "", // נוודא שזו מחרוזת
      })
    }

    const timer = setTimeout(() => setOpen(true), 50)
    return () => clearTimeout(timer)
  }, [song])
  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSongData((prev) => ({ ...prev, [name]: value }))
  }

  // Form Handlers
  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      closeEditDialog()
    }, 300) // Match transition duration
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!songData.name.trim() || !songData.artist.trim()) {
      setError("Song name and artist are required")
      setIsSubmitting(false)
      return
    }
    const year = songData.year ? Math.min(parseInt(songData.year), new Date().getFullYear()) : new Date().getFullYear();
    try {
      const updatedSong: SongPostModel = {
        name: songData.name,
        artist: songData.artist,
        genre: songData.genre || "Unknown Genre",
        audioFilePath: song.audioFilePath,
        imageFilePath: song.imageFilePath,
        playlistId: playlistId,
        year: year,
        album: songData.album || "Unknown Album",
        lyrics: song.lyrics,
      }

      await SongService.updateSong(song.id, updatedSong)
      // Update the playlist state
      setPlaylist((prev) => {
        if (prev) {
          return {
            ...prev,
            songs: prev.songs.map((s) => (s.id === song.id ? { ...s, ...updatedSong } : s)),
          }
        }
        return prev
      })
      // Update the song state
      setSong((prev) => {
        if (prev && prev.id === song.id) {
          return { ...prev, ...updatedSong }
        }
        return prev
      })

      handleClose()
    } catch (error) {
      console.error("Error updating song:", error)
      setError("Failed to update song. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      className="add-playlist-modal"
      PaperProps={{
        style: {
          backgroundColor: "var(--color-gray, #1e1e1e)",
          borderRadius: "8px",
          maxWidth: "850px",
          width: "90%",
          maxHeight: "90vh",
          minHeight:"500px"
        },
      }}
      TransitionProps={{
        timeout: 300,
      }}
    >
      <DialogTitle className="modal-header">
        <div
          className="modal-title"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: "25px",
            fontWeight: "700",
          }}
        >
          Edit Song
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="modal-content" style={{ padding: "16px 24px !important" }}>
        <form className="add-playlist-form" onSubmit={handleSubmit} style={{ padding: "20px", margin: 0 }}>
          <div className="form-row" style={{ gap: "1.5rem", marginBottom: "1rem" }}>
            <div className="image-upload-container">
              <div
                className="image-preview"
                style={{
                  backgroundImage: song.imageFilePath ? `url(${song.imageFilePath})` : "none",
                  width: "220px",
                  height: "220px",
                }}
              >
                {!song.imageFilePath && (
                  <div className="upload-placeholder">
                    <Music className="upload-icon" size={60} />
                    <span style={{ fontSize: "0.8rem" }}>No Cover Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-fields" style={{ gap: "1rem" }}>
              <div style={{ display: "flex", gap: "1rem" }}>

                <div className="form-group" style={{ flex: 1, gap: "0.3rem" }}>
                  <label htmlFor="name" style={{ color: "var(--color-white)", fontSize: "0.95rem", fontWeight: "500" }}>
                    Song Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={songData.name}
                    onChange={handleInputChange}
                    placeholder="Enter song name"
                    className="custom-input"
                    required
                    style={{
                      backgroundColor: "rgba(30, 30, 30, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.375rem",
                      color: "var(--color-white)",
                      padding: "0.4rem 0.8rem",
                      width: "100%",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div className="form-group" style={{ flex: 1, gap: "0.3rem" }}>
                  <label
                    htmlFor="artist"
                    style={{ color: "var(--color-white)", fontSize: "0.95rem", fontWeight: "500" }}
                  >
                    Artist
                  </label>
                  <input
                    id="artist"
                    name="artist"
                    value={songData.artist}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                    className="custom-input"
                    required
                    style={{
                      backgroundColor: "rgba(30, 30, 30, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.375rem",
                      color: "var(--color-white)",
                      padding: "0.4rem 0.8rem",
                      width: "100%",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div className="form-group" style={{ flex: 1, gap: "0.3rem" }}>
                  <label htmlFor="album" style={{ color: "var(--color-white)", fontSize: "0.95rem", fontWeight: "500" }}>
                    Album
                  </label>
                  <input
                    id="album"
                    name="album"
                    value={songData.album}
                    onChange={handleInputChange}
                    placeholder="Enter album name"
                    className="custom-input"
                    style={{
                      backgroundColor: "rgba(30, 30, 30, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.375rem",
                      color: "var(--color-white)",
                      padding: "0.4rem 0.8rem",
                      width: "100%",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>

                <div className="form-group" style={{ flex: 1, gap: "0.3rem" }}>
                  <label htmlFor="year" style={{ color: "var(--color-white)", fontSize: "0.95rem", fontWeight: "500" }}>
                    Year
                  </label>
                  <input
                    id="year"
                    name="year"
                    type="number"
                    value={songData.year}
                    onChange={handleInputChange}
                    placeholder="Enter year"
                    className="custom-input"
                    min={1800}
                    max={new Date().getFullYear()}
                    style={{
                      backgroundColor: "rgba(30, 30, 30, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.375rem",
                      color: "var(--color-white)",
                      padding: "0.4rem 0.8rem",
                      width: "100%",
                      fontSize: "0.95rem",
                    }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ gap: "0.3rem" }}>
                <label htmlFor="genre" style={{ color: "var(--color-white)", fontSize: "0.95rem", fontWeight: "500" }}>
                  Genre
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={songData.genre}
                  onChange={handleInputChange}
                  className="custom-input"
                  style={{
                    backgroundColor: "rgba(30, 30, 30, 0.5)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "0.375rem",
                    color: "var(--color-white)",
                    padding: "0.4rem 0.8rem",
                    width: "100%",
                    fontSize: "0.95rem",
                  }}
                >
                  {!songData.genre && <option value="">Select genre</option>}
                  {songData.genre &&
                    ![
                      "Pop",
                      "Rock",
                      "Hip Hop",
                      "Electronic",
                      "R&B",
                      "Jazz",
                      "Classical",
                      "Country",
                      "Folk",
                      "Alternative",
                      "Metal",
                      "Blues",
                      "Reggae",
                      "Other",
                    ].includes(songData.genre) && <option value={songData.genre}>{songData.genre}</option>}
                  <option value="Pop">Pop</option>
                  <option value="Rock">Rock</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Electronic">Electronic</option>
                  <option value="R&B">R&B</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Classical">Classical</option>
                  <option value="Country">Country</option>
                  <option value="Folk">Folk</option>
                  <option value="Alternative">Alternative</option>
                  <option value="Metal">Metal</option>
                  <option value="Blues">Blues</option>
                  <option value="Reggae">Reggae</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="create-button"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            color: "var(--color-white)",
            borderRadius: "3px",
            padding: "8px 16px",
            textTransform: "none",
          }}
        >
          {isSubmitting ? "Updating..." : "Update Song"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSong
