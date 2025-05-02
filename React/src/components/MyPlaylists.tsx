"use client"

import type React from "react"

import { useState, useEffect } from "react"

import { Button, IconButton, Menu, MenuItem } from "@mui/material"
import QueueMusicIcon from "@mui/icons-material/QueueMusic"
import DeleteIcon from "@mui/icons-material/Delete"
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic"
import PeopleIcon from "@mui/icons-material/People"
import type { User } from "../models/User"
import type { Playlist } from "../models/Playlist"
import { AddCircleOutline, MoreHoriz, MusicNote, MusicNoteOutlined, PeopleAltOutlined } from "@mui/icons-material"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import "./style/MyPlaylists.css"
import { Music, Users } from "lucide-react";
import AddPlaylist from "./AddPlaylist"
import { useNavigate } from "react-router"

const MyPlaylist = () => {
    const user: User = useSelector((state: StoreType) => state.user.user)
    const [ownedPlaylists, setOwnedPlaylists] = useState<Playlist[]>([])
    const [sharedPlaylists, setSharedPlaylists] = useState<Playlist[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({})
    const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned")
    const [sortBy, setSortBy] = useState<string>("name")
    const navigate=useNavigate()
    useEffect(() => {
        loadPlaylists()
    }, [user])

    const loadPlaylists = async () => {
        setIsLoading(true)
        try {
            setOwnedPlaylists([...user.ownedPlaylists])
            setSharedPlaylists([...user.sharedPlaylists])
        } catch (error) {
            console.error("Error loading playlists:", error)
        }
        setIsLoading(false)
    }

    const handleCreatePlaylist = () => {
        setEditingPlaylist(null)
        setShowForm(true)
    }

    const handleFormSuccess = () => {
        loadPlaylists()
    }

    const openMenu = (event: React.MouseEvent<HTMLButtonElement>, playlistId: number) => {
        event.stopPropagation()
        setMenuAnchor((prev) => ({ ...prev, [playlistId]: event.currentTarget }))
    }

    const closeMenu = (playlistId: number) => {
        setMenuAnchor((prev) => ({ ...prev, [playlistId]: null }))
    }

    const sortPlaylists = (playlists: Playlist[], sortBy: string) => {
        const sortedPlaylists = [...playlists]
        switch (sortBy) {
            case "date":
                return sortedPlaylists.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            case "name":
            default:
                return sortedPlaylists.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        }
    }

    const filteredPlaylists = sortPlaylists(
        activeTab === "owned" ? ownedPlaylists : sharedPlaylists,
        sortBy
    ).filter((playlist) =>
        playlist.name?.toLowerCase().includes(searchQuery.toLowerCase()) || playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="music-page-container">
            {/* Header Section */}
            <div className="music-page-header">
                <div className="header-text">
                    <h1
                        style={{
                            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                            fontSize: "22px",
                        }}
                        className="header-title"
                    >
                        My Playlists
                    </h1>
                    <p className="header-subtitle">Manage and organize your music collections</p>
                </div>

                <div className="upload-button-container">
                    <AddPlaylist/>
                </div>
            </div>

            {/* Tabs with Icons */}
            <div className="playlist-tabs">
                <button
                    className={`playlist-tab ${activeTab === "owned" ? "active" : ""}`}
                    onClick={() => setActiveTab("owned")}
                >
                    <Music className="tab-icon" />
                    <span>My Playlists</span>
                </button>
                <button
                    className={`playlist-tab ${activeTab === "shared" ? "active" : ""}`}
                    onClick={() => setActiveTab("shared")}
                >
                    <Users className="tab-icon" />
                    <span>Shared With Me</span>
                </button>
            </div>

            {/* Filter Bar - Similar to PublicSongs */}
            <div className="filter-bar">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search playlists..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-select-container">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
                        <option value="date">Newest</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </div>

            {/* Playlists Grid */}
            {isLoading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading playlists...</p>
                </div>
            ) : filteredPlaylists.length === 0 ? (
                <div className="no-songs-container">
                    <div className="no-songs-icon">
                        <MusicNote style={{ fontSize: "4rem", color: "#4a4a4a" }} />
                    </div>

                    {searchQuery ? (
                        <>
                            <h3 className="no-songs-title">No matching playlists</h3>
                            <p className="no-songs-subtitle">Try adjusting the filters or search terms</p>
                        </>
                    ) : (
                        <>
                            <h3 className="no-songs-title">{activeTab === "owned" ? "No playlists yet" : "No shared playlists"}</h3>
                            <p className="no-songs-subtitle">
                                {activeTab === "owned"
                                    ? "Create your first playlist to get started"
                                    : "No one has shared playlists with you yet"}
                            </p>
                            {activeTab === "owned" && (
                                <Button
                                    onClick={handleCreatePlaylist}
                                    className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700"
                                >
                                    Create Playlist
                                </Button>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="songs-grid">
                    {filteredPlaylists.map((playlist) => (
                        <div key={playlist.id} 
                        className="song-card"
                         onClick={() => navigate(`playlist/${playlist.id}`)}
                         >
                            <div className="song-image-container">
                                {/* Placeholder image if playlist doesn't have one */}
                                <img
                                    src={playlist.imageFilePath || ""}
                                    alt={playlist.name || "Playlist"}
                                    className="song-image"
                                />
                                <div className="song-overlay">
                                    <button className="play-button">
                                        <QueueMusicIcon className="play-icon" />
                                    </button>
                                </div>
                                <div className="song-options">
                                    <IconButton className="options-button" onClick={(e) => openMenu(e, playlist.id)}>
                                        <MoreHoriz className="options-icon" />
                                    </IconButton>
                                    <Menu
                                        anchorEl={menuAnchor[playlist.id]}
                                        open={Boolean(menuAnchor[playlist.id])}
                                        onClose={() => closeMenu(playlist.id)}
                                        className="options-menu"
                                    >
                                        {activeTab === "owned" && (
                                            <MenuItem
                                                onClick={() => {
                                                    closeMenu(playlist.id)
                                                    // Handle edit
                                                    setEditingPlaylist(playlist)
                                                    setShowForm(true)
                                                }}
                                            >
                                                <QueueMusicIcon className="menu-icon" />
                                                Edit Playlist
                                            </MenuItem>
                                        )}
                                        <MenuItem
                                            onClick={() => {
                                                closeMenu(playlist.id)
                                                // Handle delete or remove
                                                // This would need actual implementation
                                            }}
                                        >
                                            <DeleteIcon className="menu-icon" />
                                            {activeTab === "owned" ? "Delete Playlist" : "Remove Sharing"}
                                        </MenuItem>
                                    </Menu>
                                </div>
                            </div>
                            <div className="song-info">
                                <h4 className="song-title">{playlist.name}</h4>
                                <p className="song-artist">
                                    {activeTab === "owned"
                                        ? `${playlist.songs?.length || 0} songs`
                                        : `Shared by: ${playlist?.owner?.userName || "User"}`}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create/Edit Playlist Modal */}
            {showForm && (
                <></>
                // <PlaylistForm
                //   onClose={() => setShowForm(false)}
                //   existingPlaylist={editingPlaylist}
                //   onSuccess={handleFormSuccess}
                // />
            )}
        </div>
    )
}

export default MyPlaylist
