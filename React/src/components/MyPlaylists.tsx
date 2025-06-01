
import type React from "react"

import { useState, useEffect } from "react"

import {  IconButton, Menu, MenuItem, Select } from "@mui/material"
import type { UserDto } from "../models/User"
import type { Playlist } from "../models/Playlist"
import { MoreHoriz, MusicNote } from "@mui/icons-material"
import {  useSelector } from "react-redux"
import type {  StoreType } from "../store/store"
import "./style/MyPlaylists.css"
import { Music, Users, Lock, Trash2, ListMusic, Share2 } from "lucide-react"
import AddPlaylist from "./AddPlaylist"
import { useNavigate } from "react-router"
import DeletePlaylist from "./DeletePlaylist"
import EditPlaylist from "./EditPlaylist"
import RemoveSharingInPlaylist from "./RemoveSharingInPlaylist"
import SharePlaylist from "./SharePlaylist"
import playlistServices from "../services/PlaylistService"

const MyPlaylist = () => {
  const user: UserDto = useSelector((state: StoreType) => state.user.user)
  const [ownedPlaylists, setOwnedPlaylists] = useState<Playlist[]>([])
  const [sharedPlaylists, setSharedPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showForm] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({})
  const [activeTab, setActiveTab] = useState<"owned" | "shared">("owned")
  const [sortBy, setSortBy] = useState<string>("date")
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null) // פלייליסט שנבחר למחיקה
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [openRemoveSharingDialog, setOpenRemoveSharingDialog] = useState(false)
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [playlistToEdit, setPlaylistToEdit] = useState<Playlist>({} as Playlist)
  const navigate = useNavigate()
  console.log(user)

  useEffect(() => {
    if (!user.id) return
    loadPlaylists()
  }, [user])
  console.log("myplaylist loaded from server", ownedPlaylists, sharedPlaylists)

  const loadPlaylists = async () => {
    setIsLoading(true)
    try {
      const [owned, shared] = await Promise.all([
        playlistServices.getUserPlaylists(user.id),
        playlistServices.getUserSharedPlaylists(user.id),
      ])
      setOwnedPlaylists(owned)
      setSharedPlaylists(shared)
    } catch (error) {
      console.error("Error loading playlists:", error)
    }
    setIsLoading(false)
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
        return sortedPlaylists.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      case "songs":
        return sortedPlaylists.sort((a, b) => (b.songs?.length || 0) - (a.songs?.length || 0))
      default:
        return sortedPlaylists.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
    }
  }

  const filteredPlaylists = sortPlaylists(activeTab === "owned" ? ownedPlaylists : sharedPlaylists, sortBy).filter(
    (playlist) =>
      playlist.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description?.toLowerCase().includes(searchQuery.toLowerCase()),
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
          <AddPlaylist setPlaylists={setOwnedPlaylists} />
        </div>
      </div>

      {/* Tabs with Icons */}
      <div className="playlist-tabs">
        <button
          style={{ borderRadius: "6px 0 0 6px" }}
          className={`playlist-tab ${activeTab === "owned" ? "active" : ""}`}
          onClick={() => setActiveTab("owned")}
        >
          <Music className="tab-icon" />
          <span>My Playlists</span>
        </button>
        <button
          style={{ borderRadius: "0 6px 6px 0" }}
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
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as string)}
            renderValue={() =>
              `Sort by: ${sortBy === "date"
                ? "Newest"
                : sortBy === "name"
                  ? "Title"
                  : sortBy === "songs"
                    ? "Songs Count"
                    : "Artist"
              }`
            }
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
            <MenuItem value="songs">Songs Count</MenuItem>
          </Select>
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
              {/* {activeTab === "owned" && (
                <Button
                  onClick={handleCreatePlaylist}
                  className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700"
                >
                  Create Playlist
                </Button>
              )} */}
            </>
          )}
        </div>
      ) : (
        <div className="playlists-grid">
          {filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="playlist-card">
              <div className="playlist-content">
                <div className="playlist-image-wrapper">
                  <img
                    src={playlist.imageFilePath || ""}
                    alt={playlist.name || "Playlist"}
                    className="playlist-image"
                  />
                  <div className="playlist-image-overlay">
                    <button className="playlist-view-button" onClick={() => navigate(`playlist/${btoa(playlist.id.toString()+"-playlist")}`)}>
                      <ListMusic className="view-icon" />
                    </button>
                  </div>
                </div>

                <div className="playlist-details">
                  <h4 className="playlist-title">{playlist.name}</h4>
                  <p className="playlist-description">
                    {playlist.description ? playlist.description : "No description"}
                  </p>

                  <div className="playlist-meta">
                    <p className="playlist-songs-count">
                      {activeTab === "owned"
                        ? `${playlist.songs?.length || 0} songs`
                        : `Shared by: ${playlist?.owner?.userName || "User"}`}
                    </p>

                    <div className="playlist-visibility">
                      {playlist.sharedUsers?.length > 0 ? (
                        <div className="visibility-badge public">
                          <Users size={14} />
                          <span>Shared</span>
                        </div>
                      ) : (
                        <div className="visibility-badge private">
                          <Lock size={14} />
                          <span>Personal</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="playlist-actions">
                <IconButton className="playlist-options-button" onClick={(e) => openMenu(e, playlist.id)}>
                  <MoreHoriz className="playlist-options-icon" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchor[playlist.id]}
                  open={Boolean(menuAnchor[playlist.id])}
                  onClose={() => closeMenu(playlist.id)}
                  className="options-menu"
                >
                  <MenuItem className="menu-title" disabled>
                    Options
                  </MenuItem>
                  {activeTab === "owned" && (
                    <MenuItem
                      onClick={() => {
                        closeMenu(playlist.id)
                        setPlaylistToEdit(playlist)
                        setOpenEditDialog(true)
                      }}
                      className="menu-item"
                    >
                      <ListMusic size={17} className="menu-icon" />
                      Edit Playlist
                    </MenuItem>
                  )}
                  {activeTab === "owned" ? (
                    <MenuItem
                      onClick={() => {
                        closeMenu(playlist.id)
                        setSelectedPlaylistId(playlist.id)
                        setOpenDeleteDialog(true)
                      }}
                      className="menu-item"
                    >
                      <Trash2 size={17} className="menu-icon" />
                      Delete Playlist
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        closeMenu(playlist.id)
                        setSelectedPlaylistId(playlist.id)
                        setOpenRemoveSharingDialog(true)
                      }}
                      className="menu-item"
                    >
                      <Trash2 size={17} className="menu-icon" />
                      Remove Sharing
                    </MenuItem>
                  )}
                  {activeTab === "owned" && (
                    <MenuItem
                      onClick={() => {
                        closeMenu(playlist.id)
                        setSelectedPlaylistId(playlist.id)
                        setOpenShareDialog(true)
                      }}
                      className="menu-item"
                    >
                      <Share2 size={17} className="menu-icon" />
                      Share Playlist
                    </MenuItem>
                  )}
                </Menu>
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
      {openDeleteDialog && selectedPlaylistId && (
        <DeletePlaylist
          playlistId={selectedPlaylistId}
          setPlaylists={setOwnedPlaylists}
          closeOnDeleteDialog={() => {
            setSelectedPlaylistId(null)
            setOpenDeleteDialog(false)
          }}
          closeOnCancleDialog={() => {
            setSelectedPlaylistId(null)
            setOpenDeleteDialog(false)
          }}
        />
      )}
      {openRemoveSharingDialog && selectedPlaylistId && (
        <RemoveSharingInPlaylist
          playlistId={selectedPlaylistId}
          setPlaylists={setSharedPlaylists}
          closeOnRemoveDialog={() => {
            setSelectedPlaylistId(null)
            setOpenRemoveSharingDialog(false)
          }}
          closeOnCancleDialog={() => {
            setSelectedPlaylistId(null)
            setOpenRemoveSharingDialog(false)
          }}
        />
      )}
      {openEditDialog && playlistToEdit && (
        <EditPlaylist
          playlist={playlistToEdit}
          setPlaylists={setOwnedPlaylists}
          closeEditDialog={() => {
            setSelectedPlaylistId(null)
            setOpenEditDialog(false)
          }}
        />
      )}
      {openShareDialog && selectedPlaylistId && (
        <SharePlaylist
          playlistId={selectedPlaylistId}
          closeShareDialog={() => {
            setSelectedPlaylistId(null)
            setOpenShareDialog(false)
          }}
        />
      )}
    </div>
  )
}

export default MyPlaylist
