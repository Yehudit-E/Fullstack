
import type React from "react"

import { useState, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import SongService from "../services/SongService"
import { Users } from "lucide-react"
import "./style/SharePlaylist.css"

interface ShareSongProps {
  songId: number
  closeShareDialog: () => void
}

const ShareSong = ({ songId, closeShareDialog }: ShareSongProps) => {
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

  const handleShareSong = async () => {
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
      console.log(songId,userEmail);   
      await SongService.shareSongByEmail(songId, userEmail)
      handleClose()
    } catch (error) {
      console.error("Error sharing song:", error)
      setError("Failed to share song. Please check the email and try again.")
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
          maxWidth: "750px",
          width: "100%",
          minHeight:"450px"
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
          Share Song
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <div className="share-icon-container">
        <div className="share-icon">
          <Users size={60} />
        </div>
      </div>

      <DialogContent className="modal-content">
        <p className="share-message">Enter the email address of the person you want to share this song with. The recipient will receive the link in their inbox.</p>

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
          onClick={handleShareSong}
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

export default ShareSong
