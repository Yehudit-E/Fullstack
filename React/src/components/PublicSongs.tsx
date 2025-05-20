"use client"

import type React from "react"

import { useEffect, useState } from "react"
import SongService from "../services/SongService"
import type { Song } from "../models/Song"
import { useSelector } from "react-redux"
import type { Dispatch, StoreType } from "../store/store"
import { useDispatch } from "react-redux"
import { updateSongs } from "../store/songSlice"
import AddToPlaylistModel from "./AddToPlaylist"
import PlayArrowIcon from "@mui/icons-material/PlayArrow"
import PauseIcon from "@mui/icons-material/Pause"
import MusicNoteIcon from "@mui/icons-material/MusicNote"
import { MenuItem, IconButton, Menu, Select } from "@mui/material"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import { Download, ListMusic, Plus } from "lucide-react"
import { Add as AddIcon } from "@mui/icons-material";

import "./style/PublicSongs.css"
import "./style/MenuStyles.css" // Import the shared menu styles
import { useNavigate } from "react-router"

const PublicSongs = () => {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("date")
  const [genre, setGenre] = useState<string>("all")
  const [search, setSearch] = useState<string>("")
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({})
  const [currentSong, setCurrentSong] = useState<Song>({} as Song)
  const [showPlaylistList, setShowPlaylistList] = useState<boolean>(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)
  const dispatch = useDispatch<Dispatch>()
  const [downloadingSong, setDownloadingSong] = useState<number | null>(null)
  const navigator = useNavigate()
  const authState: boolean = useSelector((store: StoreType) => store.user.authState)

  useEffect(() => {
    SongService.getPublicSongs()
      .then((data) => {
        setSongs(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching public songs:", err)
        setError("Failed to load songs.")
        setLoading(false)
      })
  }, [])

  const sortSongs = (songs: Song[], sortBy: string) => {
    const sortedSongs = [...songs]
    switch (sortBy) {
      case "date":
        return sortedSongs.sort((a, b) => new Date(b.year).getTime() - new Date(a.year).getTime())
      case "artist":
        return sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist))
      case "name":
      default:
        return sortedSongs.sort((a, b) => a.name.localeCompare(b.name))
    }
  }

  const getGenres = () => {
    const genres = new Set(songs.map((song) => song.genre))
    return ["all", ...genres]
  }

  const filteredSongs = sortSongs(songs, sortBy)
    .filter((song) => genre === "all" || song.genre === genre)
    .filter(
      (song) =>
        song.name.toLowerCase().includes(search.toLowerCase()) ||
        song.artist.toLowerCase().includes(search.toLowerCase()),
    )
  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, songId: number) => {
    event.stopPropagation()
    setMenuAnchor((prev) => ({ ...prev, [songId]: event.currentTarget }))
  }

  const closeMenu = (songId: number) => {
    setMenuAnchor((prev) => ({ ...prev, [songId]: null }))
  }

  // const downloadSong = async (event: React.MouseEvent, fileUrl: string, fileName: string, songId: number) => {
  //   event.stopPropagation()
  //   try {
  //     setDownloadingSong(songId)
  //     const response = await fetch(fileUrl)
  //     if (!response.ok) throw new Error("שגיאה בהורדת הקובץ")

  //     const blob = await response.blob()
  //     const link = document.createElement("a")

  //     link.href = URL.createObjectURL(blob)
  //     link.download = fileName
  //     document.body.appendChild(link)
  //     link.click()

  //     document.body.removeChild(link)
  //     URL.revokeObjectURL(link.href)
  //   } catch (error) {
  //     console.error("שגיאה בהורדה:", error)
  //   } finally {
  //     setDownloadingSong(null)
  //   }
  // }
  const handleDownload = async (song: Song) => {
    try {
      setDownloadingSong(song.id)
      const response = await fetch(song.audioFilePath);
      if (!response.ok) throw new Error("Error downloading the file");

      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = song.name;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloadingSong(null)
    }
  };

  const handlePlaySong = (song: Song) => {
    try {
      dispatch(updateSongs([song]))
      setCurrentlyPlaying(currentlyPlaying === song.id ? null : song.id)
    } catch (error) {
      console.error("Error playing song:", error)
      setError("Failed to play song. Please try again.")
    }
  }

  const handleAddToPlaylist = (event: React.MouseEvent, song: Song) => {
    event.stopPropagation()
    setCurrentSong(song)
    setShowPlaylistList(true)
  }

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
            Discover Music
          </h1>
          <p className="header-subtitle">Explore the latest music shared by our community</p>
        </div>

        {authState && (
          <div className="upload-button-container">
            <button
              onClick={() => { navigator("upload") }}
              style={{
                background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                color: "var(--color-white)",
                borderRadius: "3px", // פינות מעוגלות
                padding: "4px 8px", // ריווח פנימי
                display: "flex", // מאפשר למרכז את התוכן
                alignItems: "center", // מרכז אנכית
                justifyContent: "center", // מרכז אופקית
                fontSize: "13px", // גודל הטקסט (אפשר לשנות אם צריך)
                border: "none", // לבטל את הגבול אם יש
                cursor: "pointer" // להפוך את הכפתור ללחיץ
              }}
            >
              <AddIcon /> Upload Music
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-select-container">
          <Select
            value={genre}
            onChange={(e) => setGenre(e.target.value as string)}
            renderValue={() => `Genre: ${genre === "all" ? "All Genres" : genre}`}
            sx={{
              backgroundColor: "rgba(30, 30, 30, 0.5)",
              color: "var(--color-white)",
              width: "100%",
              height: "35px",
              borderRadius: "0.375rem",
              "& .MuiSvgIcon-root": {
                color: "var(--color-white)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: "1px",
              },
              "&:focus-visible": {
                outline: "none",
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "white",
                color: "var(--color-black)", // אפשר לשנות את הצבע לפי הצורך
              },
            }}
          >
            {getGenres().map((g) => (
              <MenuItem key={g} value={g}>
                {g === "all" ? "All Genres" : g}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className="filter-select-container">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as string)}
            renderValue={() => `Sort by: ${sortBy === "date" ? "Newest" : sortBy === "name" ? "Title" : "Artist"}`}
            sx={{
              backgroundColor: "rgba(30, 30, 30, 0.5)",
              color: "var(--color-white)",
              width: "100%",
              height: "35px",
              borderRadius: "0.375rem",
              "& .MuiSvgIcon-root": {
                color: "var(--color-white)",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.1)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
                borderWidth: "1px",
              },
              "&:focus-visible": {
                outline: "none",
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "white",
                color: "var(--color-black)", // אפשר לשנות את הצבע לפי הצורך
              },
            }}
          >
            <MenuItem value="date">Newest</MenuItem>
            <MenuItem value="name">Title</MenuItem>
            <MenuItem value="artist">Artist</MenuItem>
          </Select>
        </div>

      </div>

      {/* Songs Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">טוען שירים...</p>
        </div>
      ) :error?(
        <div className="error-message">{error}</div>
      ):(
        <div>
        {filteredSongs.length === 0 ? (
          <div className="no-songs-container">
            <MusicNoteIcon className="no-songs-icon" />
            <h3 className="no-songs-title">No songs found</h3>
            <p className="no-songs-subtitle">Try adjusting the filters or search terms</p>
          </div>
        ) : (
          <div className="songs-grid">
            {filteredSongs.map((song: Song) => (
              <div key={song.id} className="song-card">
                <div className="song-image-container">
                  <img src={song.imageFilePath || "/placeholder.svg"} alt={song.name} className="song-image" />
                  <div className="song-overlay">
                    <button
                      className={`play-button ${currentlyPlaying === song.id ? "playing" : ""}`}
                      onClick={() => handlePlaySong(song)}
                    >
                      {currentlyPlaying === song.id ? (
                        <PauseIcon className="play-icon" />
                      ) : (
                        <PlayArrowIcon className="play-icon" />
                      )}
                    </button>
                  </div>
                  <div className="song-options">
                    <IconButton className="options-button" onClick={(e) => openMenu(e, song.id)}>
                      <MoreHorizIcon className="options-icon" />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor[song.id]}
                      open={Boolean(menuAnchor[song.id])}
                      onClose={() => closeMenu(song.id)}
                      className="options-menu"
                    >
                      <MenuItem className="menu-title" disabled>
                        Options
                      </MenuItem>
                      <MenuItem
                        className="menu-item"
                        onClick={() => {
                          closeMenu(song.id)
                          // downloadSong(e, song.audioFilePath, song.name, song.id)
                          handleDownload(song)
                        }}
                      >
                        <Download size={17} className="menu-icon" />
                        Download
                      </MenuItem>
                      {authState && (
                        <MenuItem
                          className="menu-item"
                          onClick={(e) => {
                            closeMenu(song.id)
                            handleAddToPlaylist(e, song)
                          }}
                        >
                          <ListMusic size={17} className="menu-icon" />
                          Add to Playlist
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="song-info">
                  <h4 className="song-title">{song.name}</h4>
                  <p className="song-artist">{song.artist}</p>

                  <div className="song-actions">
                    <button
                      className="action-button"
                      onClick={() => handleDownload(song)}
                      disabled={downloadingSong === song.id}
                    >
                      {downloadingSong === song.id ? (
                        <div className="loading-spinner-small"></div>
                      ) : (
                        <>
                          <Download size={11.5} className="action-icon" />
                          <span style={{ fontSize: "0.62rem" }}>Download</span>
                        </>
                      )}
                    </button>

                    {authState && (
                      <button className="action-button" onClick={(e) => handleAddToPlaylist(e, song)}>
                        <Plus size={11.5} className="action-icon" />
                        <span style={{ fontSize: "0.62rem", marginRight: "0.5rem" }}>Add to playlist</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      )}
      {showPlaylistList && <AddToPlaylistModel song={currentSong} onClose={() => setShowPlaylistList(false)} />}
    </div>
  )
}

export default PublicSongs
