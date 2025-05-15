"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from "@mui/material"
import { Close, Check } from "@mui/icons-material"
import { Lock, Users } from "lucide-react"
import type { Playlist } from "../models/Playlist"
import type { StoreType } from "../store/store"
import type { Song } from "../models/Song"
import SongService from "../services/SongService"
import "./style/AddToPlaylist.css"
import playlistServices from "../services/PlaylistService"
import type { UserDto } from "../models/User"

interface AddToPlaylistModalProps {
  song: Song
  onClose: () => void
}

const AddToPlaylist = ({ song, onClose }: AddToPlaylistModalProps) => {
  const user: UserDto = useSelector((state: StoreType) => state.user.user)
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null)

  useEffect(() => {
    // Small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setOpen(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!user.id) return
    loadPlaylists()
  }, [user])

  const loadPlaylists = async () => {
    setIsLoading(true)
    try {
      const [owned, shared] = await Promise.all([
        playlistServices.getUserPlaylists(user.id),
        playlistServices.getUserSharedPlaylists(user.id),
      ])

      const owned2: Playlist[] = owned.map((p: Playlist) => ({
        ...p,
        owner: user,
      }))
      setPlaylists([
        ...owned.map((p: Playlist) => ({
          ...p,
          owner: user,
        })),
        ...shared,
      ])
    } catch (error) {
      console.error("Error loading playlists:", error)
    }
    setIsLoading(false)
  }

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExpand = (playlistId: number) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId)
  }

  const handleAddSong = async () => {
    if (!selectedPlaylistId) {
      alert("Please select a playlist first")
      return
    }

    setLoading(true)
    try {
      await SongService.addSong({
        name: song.name,
        imageFilePath: song.imageFilePath,
        artist: song.artist,
        genre: song.genre,
        audioFilePath: song.audioFilePath,
        playlistId: selectedPlaylistId,
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

  const isCurrentUser = (userId: number) => {
    return user.id === userId
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
        <div className="search-container-modal">
          <input
            type="text"
            placeholder="Search playlists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="playlist-search-input"
          />
        </div>

        <div className="playlists-container">
          {isLoading ? (
            <div className="loading-indicator">Loading playlists...</div>
          ) : filteredPlaylists.length === 0 ? (
            <p className="no-playlists-message">No matching playlists found</p>
          ) : (
            filteredPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                className={`playlist-item ${selectedPlaylistId === playlist.id ? "selected" : ""}`}
                onClick={() => setSelectedPlaylistId(playlist.id)}
              >
                <div className="playlist-header">
                  <div className="playlist-info">
                    <div className="playlist-checkbox">
                      {selectedPlaylistId === playlist.id ? (
                        <div className="checkbox-selected">
                          <Check fontSize="small" />
                        </div>
                      ) : (
                        <div className="checkbox-empty" />
                      )}
                    </div>
                    {playlist.sharedUsers.length > 0 ? (
                      <Users size={18} className="playlist-icon public" />
                    ) : (
                      <Lock size={18} className="playlist-icon private" />
                    )}
                    <span className="playlist-name">{playlist.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleExpand(playlist.id)
                      }}
                      className="expand-button"
                    >
                      {expandedPlaylist === playlist.id ? "< Hide" : "> Show details"}
                    </button>
                  </div>
                </div>

                {expandedPlaylist === playlist.id && (
                  <div className="playlist-details">
                    <p className="owner-info">
                      Owner:{isCurrentUser(playlist.owner?.id) ? "You" : "  "+playlist.owner?.userName || "Not available"}
                    </p>
                    <div className="shared-users">
                      <p className="shared-title">Shared with:</p>
                      {playlist.sharedUsers && playlist.sharedUsers.length > 0 ? (
                        <span className="shared-list">
                        {playlist.sharedUsers
                          .map((sharedUser) => isCurrentUser(sharedUser.id) ? "You" : sharedUser.userName)
                          .join(", ")}
                      </span>
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
          onClick={handleAddSong}
          disabled={loading || !selectedPlaylistId}
          className="add-button"
          style={{
            background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
            color: "var(--color-white)",
            borderRadius: "4px",
            padding: "6px 16px",
            textTransform: "none",
            opacity: !selectedPlaylistId ? 0.6 : 1,
          }}
        >
          {loading ? "Adding..." : "Add to Selected Playlist"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddToPlaylist
