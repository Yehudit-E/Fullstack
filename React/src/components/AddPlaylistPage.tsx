"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { User } from "../models/User"
import type { PlaylistPostModel } from "../models/Playlist"
import PlaylistService from "../services/PlaylistService"
import { Button, TextField } from "@mui/material"
import { ArrowBack, CloudUpload } from "@mui/icons-material"
import "./style/AddPlaylistPage.css"

const AddPlaylistPage = () => {
    const user: User = useSelector((state: StoreType) => state.user.user)
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [playlistData, setPlaylistData] = useState<{
        name: string
        description: string
        imageFile: File | null
        imagePreview: string | null
    }>({
        name: "",
        description: "",
        imageFile: null,
        imagePreview: null,
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPlaylistData((prev) => ({
            ...prev,
            [name]: value,
        }))
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
            // First create the playlist
            const newPlaylist: PlaylistPostModel = {
                name: playlistData.name,
                description: playlistData.description,
                ownerId: user.id,
                imageFilePath: "", // Will be updated after image upload
            }

            const createdPlaylist = await PlaylistService.createPlaylist(newPlaylist)

            // If there's an image file, upload it
            if (playlistData.imageFile) {
                // This is a placeholder - you'll need to implement the actual image upload
                // to your server and update the playlist with the image path
                const formData = new FormData()
                formData.append("image", playlistData.imageFile)
                formData.append("playlistId", createdPlaylist.id.toString())

                // Example of how you might upload the image
                // await PlaylistService.uploadPlaylistImage(formData)
            }

            // Navigate back to the playlists page
            navigate("/myPlaylists")
        } catch (error) {
            console.error("Error creating playlist:", error)
            setError("Failed to create playlist. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="add-playlist-page">
            <div className="add-playlist-header">
                <Button
                    className="back-button"
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/myPlaylists")}
                    style={{ color: "var(--color-white)" }}
                >
                    Back to Playlists
                </Button>
                <h1 className="add-playlist-title">Create New Playlist</h1>
            </div>

            <form className="add-playlist-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="image-upload-container">
                        <div
                            className="image-preview"
                            onClick={triggerFileInput}
                            style={{
                                backgroundImage: playlistData.imagePreview
                                    ? `url(${playlistData.imagePreview})`
                                    : "none",
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
                            <label htmlFor="name">Playlist Name</label>
                            <input
                                id="name"
                                name="name"
                                value={playlistData.name}
                                onChange={handleInputChange}
                                placeholder="Enter playlist name"
                                className="custom-input"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={playlistData.description}
                                onChange={handleInputChange}
                                placeholder="Describe your playlist"
                                className="custom-textarea"
                                rows={5}
                            />
                        </div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button
                        disabled={isSubmitting}
                        style={{
                            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                            color: "var(--color-white)",
                            borderRadius: "3px",
                            padding: "8px 12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "13px",
                            border: "none",
                            cursor: "pointer",
                            marginRight: "5px",
                        }}
                    >
                        {isSubmitting ? "Creating..." : "Create Playlist"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddPlaylistPage
