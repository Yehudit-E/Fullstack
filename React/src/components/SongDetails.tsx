"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ArrowLeft, Play, Pause, Download, Plus, Sparkles, Music2, Headphones, PlayCircle } from "lucide-react"
import "./style/SongDetails.css"
import { useParams } from "react-router"
import type { Song } from "../models/Song"
import type { Dispatch, StoreType } from "../store/store"
import SongService from "../services/SongService"
import AddToPlaylist from "./AddToPlaylist"
import axios from "axios"
import { IconButton } from "@mui/material"
import { updateSongs } from "../store/songSlice"

export default function SongDetailsPage() {
    const params = useParams()
    //   const router = useRouter()
    const songId = params.id as string

    const [song, setSong] = useState<Song | null>(null)
    const [lyrics, setLyrics] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showAddToPlaylist, setShowAddToPlaylist] = useState(false)
    const [loadingLyrics, setLoadingLyrics] = useState(false)
    const [fileInfo, setFileInfo] = useState<{ contentType: string; contentLength: number; lastModified: string } | null>(null)
    const authState = useSelector((state: StoreType) => state.user.authState)
  const dispatch = useDispatch<Dispatch>()
    useEffect(() => {
        const fetchSong = async () => {
            let songData;
            try {
                setLoading(true)
                songData = await SongService.getSongById(Number.parseInt(songId))
                setSong(songData)
            } catch (err) {
                setError("Failed to load song details")
                console.error("Error fetching song:", err)
            } finally {
                setLoading(false)
                const fileInfo = await axios.head(songData.audioFilePath);
                const contentType = fileInfo.headers["content-type"];
                const contentLength = fileInfo.headers["content-length"];
                const lastModified = fileInfo.headers["last-modified"];
                setFileInfo({ contentType, contentLength: parseInt(contentLength), lastModified });
            }
        }

        if (songId) {
            fetchSong()
        }
    }, [songId])


    const handleDownload = async (song: Song) => {
        try {
            // setDownloadingSong(song.id)
            const response = await fetch(song.audioFilePath)
            if (!response.ok) throw new Error("Error downloading the file")

            const blob = await response.blob()
            const link = document.createElement("a")

            link.href = URL.createObjectURL(blob)
            link.download = song.name
            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)
        } catch (error) {
            console.error("Download error:", error)
        } finally {
            // setDownloadingSong(null)
        }
    }

    const handleFetchLyrics = async () => {
        if (!song) return

        setLoadingLyrics(true)
        try {
            if (song.lyrics == "") {
                const response = await axios.post("http://localhost:5000/transcribe", {
                    url: song.audioFilePath,
                })
                setLyrics(response.data.corrected_lyrics)
                setLoadingLyrics(false)
                await SongService.addLyrics(song.id, response.data.corrected_lyrics)
                const songData = await SongService.getSongById(Number.parseInt(songId))
                setSong(songData)
            } else {
                setLyrics(song.lyrics)
            }
        } catch (err: any) {
            setError("error generating lyrics. Please try again later.")
            console.error(err)
        } finally {
            setLoadingLyrics(false)
        }
    }

    const formatFileSize = (sizeInBytes: number): string => {
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)
        return sizeInMB
    }

    const formatUploadDate = (dateString: string): string => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }
    const handlePlaySong = (song: Song) => {
        try {
            dispatch(updateSongs([song]))
        } catch (error) {
            console.error("Error playing song:", error)
            setError("Failed to play song. Please try again.")
        }
    }
    if (loading) {
        return (
            <div className="song-details-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading song details...</p>
                </div>
            </div>
        )
    }

    if (error || !song) {
        return (
            <div className="song-details-container">
                <div className="error-state">
                    <h2>Song Not Found</h2>
                    <p>{error || "The requested song could not be found."}</p>
                    <button onClick={() => window.history.back()} className="back-button">
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="song-details-container">
            <div className="song-details-content">
                {/* Left Side - Image and File Info */}
                <div className="song-left-section">
                    <div className="song-image-container">
                        <img
                            src={song.imageFilePath || "/placeholder.svg?height=300&width=300"}
                            alt={song.name}
                            className="song-image"
                        />
                    </div>
                    <button className="play-song-button" onClick={()=>handlePlaySong(song)}>
                        <PlayCircle size={18} style={{ marginRight: "0.5rem" }} />
                        <span>Play</span>
                    </button>
                    <div className="file-information">
                        <h3>File Information</h3>
                        <div className="file-info-grid">
                            <div className="file-info-item">
                                <span className="file-info-label">Type</span>
                                <span className="file-info-value">{fileInfo ? fileInfo.contentType : "Unknown"}</span>
                            </div>
                            <div className="file-info-item">
                                <span className="file-info-label">Uploaded</span>
                                <span className="file-info-value">{formatUploadDate(fileInfo ? fileInfo.lastModified : "")}</span>
                            </div>
                            <div className="file-info-item">
                                <span className="file-info-label">Size</span>
                                <span className="file-info-value">{formatFileSize(fileInfo ? fileInfo.contentLength : 0) + " MB"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls
                    <div className="song-controls">
                        <button onClick={handlePlayPause} className="control-button play-control-button">
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            {isPlaying ? "Pause" : "Play"}
                        </button>

                        <button onClick={handleDownload} className="control-button download-button">
                            <Download size={20} />
                            Download
                        </button>

                        {authState && (
                            <button onClick={() => setShowAddToPlaylist(true)} className="control-button add-button">
                                <Plus size={20} />
                                Add to Playlist
                            </button>
                        )}
                    </div> */}
                </div>

                {/* Right Side - Song Title and Lyrics */}
                <div className="song-right-section">
                    <div className="song-title-section">
                        <h1 className="song-details-title">{song.name}</h1>
                        <p className="song-details-artist">{song.artist}</p>
                        <div className="song-details-actions">
                            <div>
                                <span className="song-details-genre"> <Music2 size={15} /> {song.genre}</span>
                                <span className="song-details-plays"> <Headphones size={15} /> {song.countOfPlays}</span>
                            </div>
                            <div>
                                <IconButton className="action-icon-button" onClick={() => handleDownload(song)} title="Download">
                                    <Download size={20} />
                                </IconButton>
                                <IconButton className="action-icon-button" onClick={() => setShowAddToPlaylist(true)} title="Add to Playlist">
                                    <Plus size={20} />
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div className="lyrics-section">
                        <div className="lyrics-header">
                            <h2>Lyrics</h2>
                            <button onClick={handleFetchLyrics} className="fetch-lyrics-button" disabled={loadingLyrics}>
                                <Sparkles size={18} />
                                {loadingLyrics ? "Generating..." : "Generate Lyrics with AI"}
                            </button>
                        </div>

                        <div className="lyrics-content">
                            {loadingLyrics ? (
                                <div className="lyrics-loading">
                                    <div className="lyrics-loading-spinner"></div>
                                    <div className="loading-spinner"></div>
                                    <p>Generating lyrics...</p>
                                    <p className="lyrics-loading-subtitle">This may take a moment</p>
                                </div>
                            ) : lyrics ? (
                                <pre className="lyrics-text">{lyrics}</pre>
                            ) : (
                                <div className="lyrics-placeholder">
                                    <Sparkles size={48} className="lyrics-placeholder-icon" />
                                    <p>No lyrics available</p>
                                    <p className="lyrics-placeholder-subtitle">Click the button above to generate lyrics using AI</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAddToPlaylist && song && <AddToPlaylist song={song} onClose={() => setShowAddToPlaylist(false)} />}
        </div>
    )
}
