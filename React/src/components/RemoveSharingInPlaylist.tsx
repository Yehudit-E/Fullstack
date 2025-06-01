
import type React from "react"

import { useState, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Close } from "@mui/icons-material"
import type { Playlist } from "../models/Playlist"
import PlaylistService from "../services/PlaylistService"
import "./style/DeletePlaylist.css"
import { useSelector } from "react-redux"
import { StoreType } from "../store/store"

interface RemoveSharingInPlaylistProps {
  playlistId: number
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>
  closeOnRemoveDialog: () => void
  closeOnCancleDialog: () => void
}

const RemoveSharingInPlaylist = ({ playlistId, setPlaylists,closeOnRemoveDialog, closeOnCancleDialog }: RemoveSharingInPlaylistProps) => {
  const [open, setOpen] = useState(false)
 const user=useSelector((state: StoreType) => state.user.user) 
  useEffect(() => {
    setOpen(true)
  }, [])

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      closeOnCancleDialog()
    }, 300) // Match transition duration
  }

  const handleDeletePlaylist = async () => {
    try {
      await PlaylistService.removeUserFromPlaylist(playlistId, user.id) // Assuming 0 is the ID of the user to be removed
      setPlaylists((prevPlaylists) => prevPlaylists.filter((item) => item.id !== playlistId))
      closeOnRemoveDialog()
    } catch (error) {
      console.error("Error deleting playlist:", error)
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
          Remove Sharing Confirmation
        </div>
        <IconButton onClick={handleClose} className="close-button" style={{ position: "absolute", left: "8px" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <div className="delete-icon-container">
        <img src="/images/delete-icon.png" alt="Delete Playlist" className="delete-icon" />
      </div>

      <DialogContent className="modal-content">
        <p className="delete-message">Are you sure you want to remove your sharing in this playlist?</p>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button onClick={handleDeletePlaylist} className="delete-button">
          <span className="button-inner delete">Confirm and Remuve</span>
        </Button>

      </DialogActions>
    </Dialog>
  )
}

export default RemoveSharingInPlaylist
