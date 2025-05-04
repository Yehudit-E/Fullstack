"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from "@mui/material"
import { Close } from "@mui/icons-material"
import { Lock, Users } from "lucide-react"
import type { Playlist } from "../models/Playlist"
import type { StoreType } from "../store/store"
import type { Song } from "../models/Song"
import SongService from "../services/SongService"
import "./style/AddToPlaylist.css"

interface AddToPlaylistModalProps {
  song: Song
  onClose: () => void
}

const AddToPlaylistModal = ({ song, onClose }: AddToPlaylistModalProps) => {
  const user = useSelector((state: StoreType) => state.user.user)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setOpen(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const personal = user.ownedPlaylists
        const shared = user.sharedPlaylists
        setPlaylists([...personal, ...shared])
      } catch (error) {
        console.error("Error fetching playlists:", error)
      }
    }

    if (user) fetchPlaylists()
  }, [user])

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExpand = (playlistId: number) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId)
  }

  const handleAddSong = async (playlistId: number) => {
    setLoading(true)
    try {
      await SongService.addSong({
        name: song.name,
        imageFilePath: song.imageFilePath,
        artist: song.artist,
        genre: song.genre,
        audioFilePath: song.audioFilePath,
        playlistId,
      })
      alert("Song added successfully!")
      handleClose()
    } catch (error) {
      console.error("Error adding song:", error)
      alert("An error occurred while adding the song.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      onClose()
    }, 300) // Match transition duration
  }

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
          Add to Playlist
        </div>
        <IconButton onClick={handleClose} className="close-button">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent className="modal-content">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="playlist-search-input"
          />
        </div>

        <div className="playlists-container">
          {filteredPlaylists.length === 0 ? (
            <p className="no-playlists-message">No matching playlists found</p>
          ) : (
            filteredPlaylists.map((playlist) => (
              <div key={playlist.id} className="playlist-item">
                <div className="playlist-header">
                  <div className="playlist-info">
                    {playlist.isPublic ? (
                      <Users size={18} className="playlist-icon public" />
                    ) : (
                      <Lock size={18} className="playlist-icon private" />
                    )}
                    <span className="playlist-name">{playlist.name}</span>
                    <button onClick={() => handleExpand(playlist.id)} className="expand-button">
                      {expandedPlaylist === playlist.id ? "< Hide" : "> Show details"}
                    </button>
                  </div>
                  <div className="playlist-actions">
                    <Button
                      onClick={() => handleAddSong(playlist.id)}
                      disabled={loading}
                      className="add-button"
                      style={{
                        color: "var(--color-white)",
                        borderRadius: "4px",
                        padding: "6px 16px",
                        textTransform: "none",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                      }}
                    >
                      {loading ? "Adding..." : "Add"}
                    </Button>
                  </div>
                </div>

                {expandedPlaylist === playlist.id && (
                  <div className="playlist-details">
                    <p className="owner-info">Owner: {playlist.owner?.userName || "Not available"}</p>
                    <div className="shared-users">
                      <p className="shared-title">Shared with:</p>
                      {playlist.sharedUsers && playlist.sharedUsers.length > 0 ? (
                        <ul className="shared-list">
                          {playlist.sharedUsers.map((sharedUser) => (
                            <li key={sharedUser.id} className="shared-user">
                              {sharedUser.userName}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-shared">Not shared with anyone</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>

      <DialogActions className="modal-actions">
        <Button
          onClick={handleClose}
          className="cancel-button"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            color: "var(--color-white)",
            borderRadius: "4px",
            padding: "6px 16px",
            textTransform: "none",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddToPlaylistModal
