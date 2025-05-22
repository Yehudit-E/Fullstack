"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from "@mui/material"
import { Close, Lyrics } from "@mui/icons-material"
import { Music } from "lucide-react"
import type { Song, SongDto, SongPostModel } from "../models/Song"
import SongService from "../services/SongService"
import "./style/AddPlaylist.css" // Reuse the same styles

interface EditSongProps {
  song: Song
  playlistId: number
  closeEditDialog: () => void
}

const EditSong = ({ song, playlistId, closeEditDialog }: EditSongProps) => {
  // State
  const [songData, setSongData] = useState({
    name: "",
    artist: "",
    genre: "",
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
      })
    }

    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setOpen(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [song])

  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
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

    try {
      const updatedSong: SongPostModel = {
        name: songData.name,
        artist: songData.artist,
        genre: songData.genre,
        audioFilePath: song.audioFilePath,
        imageFilePath: song.imageFilePath,
        playlistId: playlistId,
        year: song.year,
        album: song.album,
        lyrics: song.lyrics
      }

      await SongService.updateSong(song.id, updatedSong)
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
          maxWidth: "600px",
          width: "100%",
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
            fontSize: "22px",
            fontWeight: "700",
          }}
        >
          Edit Song
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="modal-content">
        <form className="add-playlist-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="image-upload-container">
              <div
                className="image-preview"
                style={{
                  backgroundImage: song.imageFilePath ? `url(${song.imageFilePath})` : "none",
                }}
              >
                {!song.imageFilePath && (
                  <div className="upload-placeholder">
                    <Music className="upload-icon" size={48} />
                    <span>No Cover Image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="form-fields">
              <div className="form-group">
                <label htmlFor="name" style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}>
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
                    padding: "0.5rem 1rem",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="artist"
                  style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}
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
                    padding: "0.5rem 1rem",
                    width: "100%",
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="genre" style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}>
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
                    padding: "0.5rem 1rem",
                    width: "100%",
                  }}
                >
                  {!songData.genre && <option value="">Select genre</option>}
                  {songData.genre &&
                    ![
                      "Pop", "Rock", "Hip Hop", "Electronic", "R&B", "Jazz",
                      "Classical", "Country", "Folk", "Alternative", "Metal",
                      "Blues", "Reggae", "Other"
                    ].includes(songData.genre) && (
                      <option value={songData.genre}>{songData.genre}</option>
                    )}

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
