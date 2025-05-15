"use client"

import { useState, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Song } from "../models/Song"
import PlaylistService from "../services/PlaylistService"
import "./style/DeletePlaylist.css" // Reuse the same styles

interface DeleteSongProps {
  song: Song
  playlistId: number
  closeDeleteDialog: () => void
}

const DeleteSong = ({ song, playlistId, closeDeleteDialog }: DeleteSongProps) => {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setOpen(true)
  }, [])

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      closeDeleteDialog()
    }, 300) // Match transition duration
  }

  const handleDeleteSong = async () => {
    try {
      setIsDeleting(true)
      setError(null)
      await PlaylistService.removeSongFromPlaylist(playlistId, song.id)
      handleClose()
    } catch (error) {
      console.error("Error removing song from playlist:", error)
      setError("Failed to remove song. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="delete-playlist-modal"
      PaperProps={{
        style: {
          backgroundColor: "var(--color-gray, #1e1e1e)",
          borderRadius: "8px",
          maxWidth: "500px",
          width: "100%",
        },
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
            width: "100%",
          }}
        >
          Remove Song
        </div>
        <IconButton onClick={handleClose} className="close-button" style={{ position: "absolute", right: "8px" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <div className="delete-icon-container">
        <img src="/images/delete-icon.png" alt="Delete Song" className="delete-icon" />
      </div>

      <DialogContent className="modal-content">
        <p className="delete-message">
          Are you sure you want to remove "{song.name}" by {song.artist} from this playlist?
        </p>
        {error && <div className="error-message">{error}</div>}
      </DialogContent>

      <DialogActions className="modal-actions">

        <Button
          onClick={handleDeleteSong}
          className="delete-button"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            color: "var(--color-white)",
            borderRadius: "3px",
            padding: "8px 16px",
            textTransform: "none",
          }}
          disabled={isDeleting}
        >
          {isDeleting ? "Removing..." : "Remove Song"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteSong
