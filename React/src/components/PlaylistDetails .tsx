"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import type { Playlist } from "../models/Playlist"
import type { Song } from "../models/Song"
import { IconButton, Menu, MenuItem } from "@mui/material"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import DownloadIcon from "@mui/icons-material/Download"
import DeleteIcon from "@mui/icons-material/Delete"
import { useDispatch } from "react-redux"
import type { Dispatch } from "../store/store"
import { updateSongs } from "../store/songSlice"
import "./style/PlaylistDetails.css"

const PlaylistDetails = () => {
  const { id } = useParams()
  const playlistId = Number(id)
  const dispatch = useDispatch<Dispatch>()

  const user = useSelector((state: StoreType) => state.user.user)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({})
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  useEffect(() => {
    // Find the playlist in user's owned or shared playlists
    const foundPlaylist = [...user.ownedPlaylists, ...user.sharedPlaylists].find((p) => p.id === playlistId)

    if (foundPlaylist) {
      setPlaylist(foundPlaylist)
    } else {
      setError("Playlist not found")
    }
    setLoading(false)
  }, [playlistId, user])

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, songId: number) => {
    event.stopPropagation()
    setMenuAnchor((prev) => ({ ...prev, [songId]: event.currentTarget }))
  }

  const closeMenu = (songId: number) => {
    setMenuAnchor((prev) => ({ ...prev, [songId]: null }))
  }

  const handlePlaySong = (song: Song) => {
    dispatch(updateSongs([song]))
    setCurrentlyPlaying(song.id)
  }

  const downloadSong = async (event: React.MouseEvent, fileUrl: string, fileName: string) => {
    event.stopPropagation()
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error("שגיאה בהורדת הקובץ")

      const blob = await response.blob()
      const link = document.createElement("a")

      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("שגיאה בהורדה:", error)
    }
  }

  const removeSongFromPlaylist = (event: React.MouseEvent, songId: number) => {
    event.stopPropagation()
    // Implement the logic to remove a song from the playlist
    // This would need to call your API or service
    console.log("Remove song", songId, "from playlist", playlistId)
    closeMenu(songId)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading playlist...</p>
      </div>
    )
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!playlist) {
    return <div className="error-message">Playlist not found</div>
  }

  const isOwner = user.ownedPlaylists.some((p) => p.id === playlist.id)

  return (
    <div className="playlist-details-container">
      {/* Playlist Header */}
      <div className="playlist-header">
        <div className="playlist-image-container">
          <img
            src={playlist.imageFilePath || "/placeholder.svg?height=200&width=200"}
            alt={playlist.name}
            className="playlist-image"
          />
        </div>
        <div className="playlist-info">
          <h1 className="playlist-title">{playlist.name}</h1>
          <p className="playlist-meta">
            {isOwner ? "Your playlist" : `Shared by: ${playlist.owner?.userName || "User"}`} •
            {playlist.songs?.length || 0} songs
          </p>
          <div className="playlist-actions">
            <button
              className="play-all-button"
              onClick={() => {
                if (playlist.songs && playlist.songs.length > 0) {
                  dispatch(updateSongs(playlist.songs))
                  setCurrentlyPlaying(playlist.songs[0].id)
                }
              }}
            >
              Play All
            </button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="songs-list-container">
        <h2 className="songs-list-title">Songs</h2>

        {!playlist.songs || playlist.songs.length === 0 ? (
          <div className="no-songs-message">
            <p>This playlist doesn't have any songs yet.</p>
          </div>
        ) : (
          <div className="songs-list">
            {playlist.songs.map((song, index) => (
              <div key={song.id} className="song-item" onClick={() => handlePlaySong(song)}>
                <div className="song-number">{index + 1}</div>
                <div className="song-image">
                  <img src={song.imageFilePath || "/placeholder.svg"} alt={song.name} />
                  <div className="song-play-overlay">
                    {currentlyPlaying === song.id ? (
                      <PauseIcon className="song-play-icon" />
                    ) : (
                      <PlayArrowIcon className="song-play-icon" />
                    )}
                  </div>
                </div>
                <div className="song-details">
                  <div className="song-name">{song.name}</div>
                  <div className="song-artist">{song.artist}</div>
                </div>
                <div className="song-genre">{song.genre}</div>
                <div className="song-actions">
                  <IconButton className="song-menu-button" onClick={(e) => openMenu(e, song.id)}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor[song.id]}
                    open={Boolean(menuAnchor[song.id])}
                    onClose={() => closeMenu(song.id)}
                    className="song-menu"
                  >
                    <MenuItem
                      onClick={(e) => {
                        closeMenu(song.id)
                        downloadSong(e, song.audioFilePath, song.name)
                      }}
                    >
                      <DownloadIcon className="menu-icon" />
                      Download
                    </MenuItem>
                    {isOwner && (
                      <MenuItem
                        onClick={(e) => {
                          removeSongFromPlaylist(e, song.id)
                        }}
                      >
                        <DeleteIcon className="menu-icon" />
                        Remove from Playlist
                      </MenuItem>
                    )}
                  </Menu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaylistDetails
