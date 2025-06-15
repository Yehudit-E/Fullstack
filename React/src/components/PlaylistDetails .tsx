
import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentIndex, updateSongs } from "../store/songSlice"
import type { Dispatch } from "../store/store"
import PlaylistService from "../services/PlaylistService"
import type { Playlist } from "../models/Playlist"
import type { Song } from "../models/Song"
import { IconButton, Menu, MenuItem } from "@mui/material"
import { MoreHoriz } from "@mui/icons-material"
import {
  Play,
  Clock,
  ListMusic,
  User,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import SharePlaylist from "./SharePlaylist"
import EditPlaylist from "./EditPlaylist"
import DeletePlaylist from "./DeletePlaylist"
import AddToPlaylistModel from "./AddToPlaylist"
import "./style/PlaylistDetails.css"
import type { StoreType } from "../store/store"
import { Edit, Trash2, Share2, Upload, Download, Plus, PlayCircle } from "lucide-react"
import EditSong from "./EditSong"
import DeleteSong from "./DeleteSong"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import RemoveSharingInPlaylist from "./RemoveSharingInPlaylist"
import ShareSong from "./ShareSong"

const PlaylistDetails = () => {
  const { id } = useParams<{ id: string }>()
  const decodeId = id ? atob(id) : ""
  const playlistId = Number.parseInt(decodeId || "0")
  const dispatch = useDispatch<Dispatch>()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [songMenuAnchor, setSongMenuAnchor] = useState<{ [key: number]: HTMLElement | null }>({})
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false)
  const [showEditSongDialog, setShowEditSongDialog] = useState(false)
  const [showDeleteSongDialog, setShowDeleteSongDialog] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [showRemoveSharingDialog, setShowRemoveSharingDialog] = useState(false)
  const [showShareSongDialog, setShowShareSongDialog] = useState(false)
  const [showSharedUsers, setShowSharedUsers] = useState(false)
  const currentUser = useSelector((state: StoreType) => state.user.user)
  const navigator = useNavigate()

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        setLoading(true)
        const data = await PlaylistService.getFullPlaylistById(playlistId)
        setPlaylist(data)
      } catch (err) {
        console.error("Error fetching playlist:", err)
        setError("Failed to load playlist details")
      } finally {
        setLoading(false)
      }
    }

    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId])

  const handlePlayAll = () => {
    if (playlist?.songs && playlist.songs.length > 0) {
      dispatch(updateSongs(playlist.songs))
    }
  }

  const handleEditPlaylist = () => {
    setShowEditDialog(true)
  }

  const handleRemoveSharingInPlaylist = () => {
    setShowRemoveSharingDialog(true)
  }

  const handleSharePlaylist = () => {
    setShowShareDialog(true)
  }

  const navigateToSongDetails = (songId: number) => {
    navigator(`/song/${btoa(songId.toString() + "-song")}`)
  }

  const handleDownloadAll = async () => {
    if (!playlist?.songs || playlist.songs.length === 0) return
    console.log("Downloading all songs...")

    const zip = new JSZip()
    const folder = zip.folder(playlist.name || "playlist")
    console.log("Creating zip folder:", folder)
    try {
      for (const song of playlist.songs) {
        const response = await fetch(song.audioFilePath)
        const blob = await response.blob()
        const fileName = `${song.name}.mp3`
        folder?.file(fileName, blob)
      }
      console.log("Adding songs to zip folder:", playlist.songs)

      const zipBlob = await zip.generateAsync({ type: "blob" })
      saveAs(zipBlob, `${playlist.name || "playlist"}.zip`)
    } catch (error) {
      console.error("Error downloading songs:", error)
    }
  }

  const handlePlaySong = (index: number) => {
    console.log(index)
    dispatch(updateSongs(playlist?.songs || []))
    dispatch(setCurrentIndex(index))
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const openSongMenu = (event: React.MouseEvent<HTMLButtonElement>, songId: number) => {
    event.stopPropagation()
    setSongMenuAnchor((prev) => ({ ...prev, [songId]: event.currentTarget }))
  }

  const closeSongMenu = (songId: number) => {
    setSongMenuAnchor((prev) => ({ ...prev, [songId]: null }))
  }

  const handleAddToPlaylist = (song: Song) => {
    setCurrentSong(song)
    setShowAddToPlaylist(true)
  }

  const handleShareSong = (song: Song) => {
    setCurrentSong(song)
    setShowShareSongDialog(true)
  }

  const downloadSong = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) throw new Error("Error downloading file")

      const blob = await response.blob()
      const link = document.createElement("a")

      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  const isCurrentUser = (userId: number) => {
    return currentUser.id === userId
  }

  const toggleSharedUsers = () => {
    setShowSharedUsers(!showSharedUsers)
  }

  if (loading) {
    return (
      <div className="playlist-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading playlist details...</p>
        </div>
      </div>
    )
  }

  if (error || !playlist) {
    return (
      <div className="playlist-details-container">
        <div className="error-state">
          <h2>Playlist Not Found</h2>
          <p>{error || "The requested playlist could not be found."}</p>
          <button onClick={() => window.history.back()} className="back-button">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="playlist-details-container">
      <div className="playlist-details-content">
        {/* Left Side - Image and Playlist Info */}
        <div className="playlist-left-section">
          <div className="playlist-image-container">
            <img
              src={playlist.imageFilePath || "/placeholder.svg?height=300&width=300"}
              alt={playlist.name}
              className="playlist-image"
            />
          </div>

          <button className="play-playlist-button" onClick={handlePlayAll}>
            <PlayCircle size={18} style={{ marginRight: "0.5rem" }} />
            <span>Play All</span>
          </button>

          <div className="playlist-information">
            <h3>Playlist Information</h3>
            <div className="playlist-info-grid">
              <div className="playlist-info-item">
                <span className="playlist-info-label">Songs</span>
                <span className="playlist-info-value">{playlist.songs?.length || 0}</span>
              </div>
              <div className="playlist-info-item">
                <span className="playlist-info-label">Created</span>
                <span className="playlist-info-value">{formatDate(playlist.createdAt)}</span>
              </div>
              <div className="playlist-info-item">
                <span className="playlist-info-label">Owner</span>
                <span className="playlist-info-value">
                  {isCurrentUser(playlist.owner?.id) ? "You" : playlist.owner?.userName || "Unknown"}
                </span>
              </div>
              {playlist.sharedUsers && playlist.sharedUsers.length > 0 && (
                <div className="playlist-info-item">
                  <span className="playlist-info-label">Shared with</span>
                  <div className="shared-users-container">
                    <button className="shared-users-toggle" onClick={toggleSharedUsers}>
                      <span className="playlist-info-value">{playlist.sharedUsers.length} users</span>
                      {showSharedUsers ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    {showSharedUsers && (
                      <div className="shared-users-list">
                        {playlist.sharedUsers.map((user) => (
                          <div key={user.id} className="shared-user-item">
                            <User size={14} />
                            <span>{isCurrentUser(user.id) ? "You" : user.userName || "Unknown User"}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Playlist Title and Songs */}
        <div className="playlist-right-section">
          <div className="playlist-title-section">
            <div className="playlist-details-text">
              <h1 className="playlist-details-title">{playlist.name}</h1>
              {playlist.description && <p className="playlist-details-description">{playlist.description}</p>}
            </div>
            <div className="playlist-details-actions">
              <div>
                <IconButton className="action-icon-button" onClick={handlePlayAll} title="Play All">
                  <PlayCircle size={21} />
                </IconButton>
                {isCurrentUser(playlist.owner?.id) && (
                  <>
                    <IconButton className="action-icon-button" onClick={handleEditPlaylist} title="Edit">
                      <Edit size={21} />
                    </IconButton>
                    <IconButton className="action-icon-button" onClick={handleSharePlaylist} title="Share">
                      <Share2 size={21} />
                    </IconButton>
                  </>
                )}
                <IconButton className="action-icon-button" onClick={() => navigator("upload-song")} title="Upload">
                  <Upload size={21} />
                </IconButton>
                <IconButton className="action-icon-button" onClick={handleDownloadAll} title="Download All">
                  <Download size={21} />
                </IconButton>
                <IconButton
                  className="action-icon-button danger"
                  onClick={() => handleRemoveSharingInPlaylist()}
                  title="Remove Sharing"
                >
                  <Trash2 size={21} />
                </IconButton>
              </div>
            </div>

          </div>

          <div className="songs-section">
            <div className="songs-header">
              <h2>Songs</h2>
            </div>

            <div className="songs-content">
              {playlist.songs && playlist.songs.length > 0 ? (
                <div className="songs-table-container">
                  <table className="songs-table">
                    <thead>
                      <tr>
                        <th className="song-number">#</th>
                        <th className="song-info-header">Title</th>
                        <th className="song-artist">Artist</th>
                        <th className="song-genre">Genre</th>
                        <th className="song-duration">
                          <Clock size={20} />
                        </th>
                        <th className="song-list-actions"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {playlist.songs.map((song, index) => (
                        <tr key={song.id} className="song-row">
                          <td className="song-number">{index + 1}</td>
                          <td className="song-list-info">
                            <div className="song-list-image-container">
                              <img
                                src={song.imageFilePath || "/placeholder.svg?height=40&width=40"}
                                alt={song.name}
                                className="song-image"
                              />
                              <div className="play-overlay" onClick={() => handlePlaySong(index)}>
                                <Play size={14} />
                              </div>
                            </div>
                            <span className="song-2-title">{song.name}</span>
                          </td>
                          <td className="song-artist">{song.artist}</td>
                          <td className="song-genre">{song.genre}</td>
                          <td className="song-duration">{formatDuration(150)}</td>
                          <td className="song-actions">
                            <IconButton className="song-menu-button" onClick={(e) => openSongMenu(e, song.id)}>
                              <MoreHoriz fontSize="small" />
                            </IconButton>
                            <Menu
                              anchorEl={songMenuAnchor[song.id]}
                              open={Boolean(songMenuAnchor[song.id])}
                              onClose={() => closeSongMenu(song.id)}
                              className="options-menu"
                            >
                              <MenuItem className="menu-title" disabled>
                                Song Options
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  navigateToSongDetails(song.id)
                                }}
                              >
                                <ExternalLink size={17} className="menu-icon" />
                                View Details
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  downloadSong(song.audioFilePath, song.name)
                                }}
                              >
                                <Download size={17} className="menu-icon" />
                                Download
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  handleAddToPlaylist(song)
                                }}
                              >
                                <Plus size={17} className="menu-icon" />
                                Add to Another Playlist
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  handleShareSong(song)
                                }}
                              >
                                <Share2 size={17} className="menu-icon" />
                                Share Song
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  setSelectedSong(song)
                                  setShowEditSongDialog(true)
                                }}
                              >
                                <Edit size={17} className="menu-icon" />
                                Edit Song
                              </MenuItem>
                              <MenuItem
                                className="menu-item"
                                onClick={() => {
                                  closeSongMenu(song.id)
                                  setSelectedSong(song)
                                  setShowDeleteSongDialog(true)
                                }}
                              >
                                <Trash2 size={17} className="menu-icon" />
                                Remove from Playlist
                              </MenuItem>
                            </Menu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="songs-placeholder">
                  <ListMusic size={48} className="songs-placeholder-icon" />
                  <p>This playlist doesn't have any songs yet</p>
                  <p className="songs-placeholder-subtitle">Add some songs to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showShareDialog && <SharePlaylist playlistId={playlistId} closeShareDialog={() => setShowShareDialog(false)} />}

      {showEditDialog && (
        <EditPlaylist
          playlist={playlist}
          setPlaylists={() => { }}
          closeEditDialog={() => {
            setShowEditDialog(false)
            PlaylistService.getFullPlaylistById(playlistId).then(setPlaylist)
          }}
        />
      )}

      {showDeleteDialog && (
        <DeletePlaylist
          playlistId={playlistId}
          setPlaylists={() => { }}
          closeOnDeleteDialog={() => {
            setShowDeleteDialog(false)
            navigate("/myplaylists")
          }}
          closeOnCancleDialog={() => {
            setShowDeleteDialog(false)
          }}
        />
      )}

      {showRemoveSharingDialog && (
        <RemoveSharingInPlaylist
          playlistId={playlistId}
          setPlaylists={() => { }}
          closeOnRemoveDialog={() => {
            setShowDeleteDialog(false)
            navigate("/myplaylists")
          }}
          closeOnCancleDialog={() => {
            setShowRemoveSharingDialog(false)
          }}
        />
      )}

      {showAddToPlaylist && currentSong && (
        <AddToPlaylistModel song={currentSong} onClose={() => setShowAddToPlaylist(false)} />
      )}

      {showEditSongDialog && selectedSong && (
        <EditSong
          song={selectedSong}
          playlistId={playlistId}
          setPlaylist={setPlaylist}
          setSong={() => { }}
          closeEditDialog={() => {
            setShowEditSongDialog(false)
            setSelectedSong(null)
            PlaylistService.getFullPlaylistById(playlistId).then(setPlaylist)
          }}
        />
      )}

      {showDeleteSongDialog && selectedSong && (
        <DeleteSong
          song={selectedSong}
          playlistId={playlistId}
          closeDeleteDialog={() => {
            setShowDeleteSongDialog(false)
            setSelectedSong(null)
            PlaylistService.getFullPlaylistById(playlistId).then(setPlaylist)
          }}
        />
      )}

      {showShareSongDialog && currentSong && (
        <ShareSong songId={currentSong.id} closeShareDialog={() => setShowShareSongDialog(false)} />
      )}
    </div>
  )
}

export default PlaylistDetails
