"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import PlaylistService from "../services/PlaylistService"
import { Users } from "lucide-react"
import "./style/SharePlaylist.css"

interface SharePlaylistProps {
  playlistId: number
  closeShareDialog: () => void
}

const SharePlaylist = ({ playlistId, closeShareDialog }: SharePlaylistProps) => {
  const [userEmail, setUserEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setOpen(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const handleSharePlaylist = async () => {
    // Clear previous errors
    setError(null)

    // Check if email is empty
    if (!userEmail.trim()) {
      setError("Please enter an email address")
      return
    }

    // Validate email format
    if (!isValidEmail(userEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      await PlaylistService.addUserToPlaylist(playlistId, userEmail)
      await PlaylistService.getFullPlaylistById(playlistId)
      handleClose()
    } catch (error) {
      console.error("Error sharing playlist:", error)
      setError("Failed to share playlist. Please check the email and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      closeShareDialog()
    }, 300) // Match transition duration
  }

  // Real-time validation as user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setUserEmail(email)

    // Clear error when user starts typing again
    if (error) {
      setError(null)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className="share-playlist-modal"
      PaperProps={{
        style: {
          backgroundColor: "var(--color-gray, #1e1e1e)",
          borderRadius: "8px",
          maxWidth: "500px",
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
          Share Playlist
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <div className="share-icon-container">
        <div className="share-icon">
          <Users size={40} />
        </div>
      </div>

      <DialogContent className="modal-content">
        <p className="share-message">Enter the email address of the user you want to share this playlist with</p>

        <div className="form-group">
          <input
            type="email"
            value={userEmail}
            onChange={handleEmailChange}
            placeholder="Email address"
            className="custom-input"
            aria-invalid={error ? "true" : "false"}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={handleSharePlaylist}
          disabled={isSubmitting}
          className="share-button"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            color: "var(--color-white)",
            borderRadius: "4px",
            padding: "6px 16px",
            textTransform: "none",
          }}
        >
          {isSubmitting ? "Sharing..." : "Share"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SharePlaylist
