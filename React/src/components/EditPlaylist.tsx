"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"

import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { User } from "../models/User"
import type { Playlist } from "../models/Playlist"
import PlaylistService from "../services/PlaylistService"
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material"
import { CloudUpload, Close, Lock } from "@mui/icons-material"
import { Users } from "lucide-react"
import "./style/AddPlaylist.css" // Reuse the same styles

interface EditPlaylistProps {
    playlist: Playlist
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>
    closeEditDialog: () => void
}

const EditPlaylist = ({ playlist, setPlaylists, closeEditDialog }: EditPlaylistProps) => {
    // State
    const [playlistData, setPlaylistData] = useState({
        name: "",
        description: "",
        imageFile: null as File | null,
        imagePreview: null as string | null,
        isPublic: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
console.log("edit");

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Redux State
    const user: User = useSelector((state: StoreType) => state.user.user)

    // Load playlist data when component mounts or playlist changes
    useEffect(() => {
        if (playlist) {
            setPlaylistData({
                name: playlist.name || "",
                description: playlist.description || "",
                imageFile: null,
                imagePreview: playlist.imageFilePath || null,
                isPublic: playlist.isPublic || false,
            })
        }
    }, [playlist])

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
        if (playlist) {
            setPlaylistData({
                name: playlist.name || "",
                description: playlist.description || "",
                imageFile: null,
                imagePreview: playlist.imageFilePath || null,
                isPublic: playlist.isPublic || false,
            })
        }
        setError(null)
    }

    const handleClose = () => {
        resetForm()
        closeEditDialog()
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

        try {
            let imageUrl = playlist.imageFilePath

            // If there's a new image file, upload it
            if (playlistData.imageFile) {
                const uploadUrl = await PlaylistService.getUploadUrl(playlistData.imageFile.name, playlistData.imageFile.type)
                await fetch(uploadUrl, {
                    method: "PUT",
                    body: playlistData.imageFile,
                })
                imageUrl = uploadUrl.split("?")[0]
            }

            // Update the playlist
            const updatedPlaylist = await PlaylistService.updatePlaylist(playlist.id, {
                name: playlistData.name,
                ownerId: user.id,
                description: playlistData.description,
                imageFilePath: imageUrl,
            })

            // Update playlists in state
            setPlaylists((prev) => prev.map((p) => (p.id === playlist.id ? { ...p, ...updatedPlaylist } : p)))

            // Close modal
            handleClose()
        } catch (error) {
            console.error("Error updating playlist:", error)
            setError("Failed to update playlist. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Render
    return (
        <Dialog
            open={true}
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
                    Edit Playlist
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
                                <label htmlFor="name" style={{ color: "var(--color-white)", fontSize: "0.875rem", fontWeight: "500" }}>
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
                        background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                        color: "var(--color-white)",
                        borderRadius: "3px",
                        padding: "8px 16px",
                        textTransform: "none",
                    }}
                >
                    {isSubmitting ? "Updating..." : "Update Playlist"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditPlaylist