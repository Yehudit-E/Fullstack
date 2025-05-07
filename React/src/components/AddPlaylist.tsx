"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { User, UserDto } from "../models/User"
import type { Playlist, PlaylistPostModel } from "../models/Playlist"
import PlaylistService from "../services/PlaylistService"
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material"
import { CloudUpload, Close, Add as AddIcon, Lock } from "@mui/icons-material"
import { Users } from "lucide-react"
import "./style/AddPlaylist.css"

interface AddPlaylistProps {
  setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>
}

const AddPlaylist = ({ setPlaylists }: AddPlaylistProps) => {
  // State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [playlistData, setPlaylistData] = useState({
    name: "",
    description: "",
    imageFile: null as File | null,
    imagePreview: null as string | null,
    isPublic: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Redux State
  const user: UserDto = useSelector((state: StoreType) => state.user.user)

  // Effect to handle animation
  useEffect(() => {
    if (isModalOpen) {
      // Small delay to ensure the animation is visible
      const timer = setTimeout(() => {
        setOpen(true)
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isModalOpen])

  // Input Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPlaylistData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target) {
          setPlaylistData((prev) => ({
            ...prev,
            imageFile: file,
            imagePreview: event.target?.result as string,
          }))
        }
      }

      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Form Handlers
  const resetForm = () => {
    setPlaylistData({
      name: "",
      description: "",
      imageFile: null,
      imagePreview: null,
      isPublic: false,
    })
    setError(null)
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      resetForm()
      setIsModalOpen(false)
    }, 300) // Match transition duration
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!playlistData.name.trim()) {
      setError("Playlist name is required")
      setIsSubmitting(false)
      return
    }
    let response: Playlist
    try {
      const newPlaylist: PlaylistPostModel = {
        name: playlistData.name,
        description: playlistData.description,
        ownerId: user.id,
        imageFilePath: "", // Will be updated after image upload
      }

      if (playlistData.imageFile) {
        const uploadUrl = await PlaylistService.getUploadUrl(playlistData.imageFile.name, playlistData.imageFile.type)
        await fetch(uploadUrl, {
          method: "PUT",
          body: playlistData.imageFile,
        })
        const imageUrl = uploadUrl.split("?")[0]

        response = await PlaylistService.createPlaylist({
          ...newPlaylist,
          imageFilePath: imageUrl,
        })
      } else {
        response = await PlaylistService.createPlaylist(newPlaylist)
      }

      // Update playlists in state
      setPlaylists((prev) => [...prev, { ...response }])

      // Close modal
      handleClose()
    } catch (error) {
      console.error("Error creating playlist:", error)
      setError("Failed to create playlist. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render
  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleOpenModal}
        style={{
          background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
          color: "var(--color-white)",
          borderRadius: "3px",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "13px",
          border: "none",
          cursor: "pointer",
          marginTop: "30px",
          width: "auto",
          height: "auto",
          textTransform: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <span style={{ flexGrow: 1, textAlign: "center" }}>Add Playlist</span>
      </Button>

      {isModalOpen && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          className="add-playlist-modal"
          PaperProps={{
            style: {
              backgroundColor: "var(--color-gray, #1e1e1e)",
              borderRadius: "8px",
              maxWidth: "800px",
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
                background:
                  "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                WebkitBackgroundClip: "text",
                color: "transparent",
                fontSize: "22px",
                fontWeight: "700",
              }}
            >
              Create New Playlist
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
                    onClick={triggerFileInput}
                    style={{
                      backgroundImage: playlistData.imagePreview ? `url(${playlistData.imagePreview})` : "none",
                    }}
                  >
                    {!playlistData.imagePreview && (
                      <div className="upload-placeholder">
                        <CloudUpload className="upload-icon" />
                        <span>Upload Cover Image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>

                <div className="form-fields">
                  <div className="form-group">
                    <label
                      htmlFor="name"
                      style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      Playlist Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={playlistData.name}
                      onChange={handleInputChange}
                      placeholder="Enter playlist name"
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
                      htmlFor="description"
                      style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={playlistData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your playlist"
                      className="custom-textarea"
                      rows={5}
                      style={{
                        backgroundColor: "rgba(30, 30, 30, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "0.375rem",
                        color: "var(--color-white)",
                        padding: "0.5rem 1rem",
                        width: "100%",
                        resize: "vertical",
                      }}
                    />
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
                background:
                  "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                color: "var(--color-white)",
                borderRadius: "3px",
                padding: "8px 16px",
                textTransform: "none",
              }}
            >
              {isSubmitting ? "Creating..." : "Create Playlist"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default AddPlaylist
