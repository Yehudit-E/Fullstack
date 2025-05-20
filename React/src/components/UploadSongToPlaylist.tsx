"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { Buffer } from "buffer"
import * as mm from "music-metadata-browser"
import SongService from "../services/SongService"
import PlaylistService from "../services/PlaylistService"
import type { Playlist } from "../models/Playlist"
import type { SongPostModel } from "../models/Song"
import type { StoreType } from "../store/store"
import { Music, Upload, FileMusic, X, Check, ChevronLeft, AlertCircle } from "lucide-react"
import "./style/UploadMusic.css"

  // Polyfill Buffer for browser
  ; (window as any).Buffer = Buffer

const UploadSongToPlaylist = () => {
  const { playlistId } = useParams<{ playlistId: string }>()
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [metaData, setMetaData] = useState({
    title: "",
    artist: "",
    genre: "",
    album: "",
    year: new Date().getFullYear().toString(),
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [step, setStep] = useState(1)
  const [playlist, setPlaylist] = useState<Playlist | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const userId = useSelector((state: StoreType) => state.user.user).id

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return

      try {
        const data = await PlaylistService.getFullPlaylistById(Number.parseInt(playlistId))
        setPlaylist(data)
      } catch (err) {
        console.error("Error fetching playlist:", err)
        setError("Failed to load playlist details")
      }
    }

    fetchPlaylist()
  }, [playlistId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    if (selectedFile) {
      if (!selectedFile.type.startsWith("audio/")) {
        setError("Please select an audio file (mp3, wav, etc.)")
        return
      }

      setFile(selectedFile)
      extractMetaData(selectedFile)
      setError("")
    }
  }

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      if (!droppedFile.type.startsWith("audio/")) {
        setError("Please select an audio file (mp3, wav, etc.)")
        return
      }

      setFile(droppedFile)
      extractMetaData(droppedFile)
      setError("")
    }
  }

  const extractMetaData = async (file: File) => {
    try {
      const metadata = await mm.parseBlob(file)
      console.log(metadata);

      const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "")
      const artist = metadata.common.artist || metadata.common.albumartist || "Unknown Artist"
      const genre = metadata.common.genre?.[0] || "Unknown Genre"
      const album = metadata.common.album || ""
      const year = metadata.common.year?.toString() || new Date().getFullYear().toString()
      console.log("Extracted Metadata:", { title, artist, genre, album, year });

      setMetaData({ title, artist, genre, album, year })

      return metadata
    } catch (e) {
      console.error("Metadata error:", e)
      // Set filename as title if metadata extraction fails
      setMetaData({
        ...metaData,
        title: file.name.replace(/\.[^/.]+$/, ""),
      })
      return null
    }
  }

  const uploadImage = async (imageData: Buffer, imageName: string, imageFormat: string): Promise<string | null> => {
    try {
      const uploadUrl = await SongService.getUploadUrl(imageName, `image/${imageFormat}`)
      const imageUrl = uploadUrl.split("?")[0] // Remove query parameters from URL

      // Create a Promise that resolves when the XHR completes
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", `image/${imageFormat}`)

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(imageUrl) // Return the image URL
          } else {
            console.error("Error uploading image")
            reject(null)
          }
        }

        xhr.onerror = () => {
          console.error("Error uploading image")
          reject(null)
        }

        xhr.send(imageData)
      })
    } catch (err) {
      console.error("Error uploading image:", err)
      return null
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMetaData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleUploadFile = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    try {
      setLoading(true)
      setProgress(0)
      setError("")

      // Extract metadata including image
      const metadata = await mm.parseBlob(file)

      // Extract and upload image if available
      let imageUrl = null
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const image = metadata.common.picture[0].data
        const imageFormat = metadata.common.picture[0].format || "jpeg"
        const imageName = `${file.name.replace(/\.[^/.]+$/, "")}_cover.${imageFormat.split("/")[1] || "jpg"}`

        imageUrl = await uploadImage(image, imageName, imageFormat)
      }

      // Upload audio file
      const uploadUrl = await SongService.getUploadUrl(file.name, file.type)
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr

      xhr.open("PUT", uploadUrl)
      xhr.setRequestHeader("Content-Type", file.type)

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total)
          setProgress(percentage)
        }
      }

      xhr.onload = async () => {
        if (xhr.status === 200) {
          setStep(2)
        } else {
          setError("Upload failed. Please try again.")
        }
        setLoading(false)
      }

      xhr.onerror = () => {
        if (xhr.statusText !== "abort") {
          setError("Error uploading file. Please try again.")
        }
        setLoading(false)
      }

      xhr.send(file)
    } catch (err) {
      setError("Error preparing upload. Please try again.")
      setLoading(false)
    }
  }

  const handleSubmitSong = async () => {
    if (!file || !playlistId) return

    if (!metaData.title || !metaData.artist) {
      setError("Title and artist are required")
      return
    }

    try {
      setLoading(true)
      setError("")

      // Get the upload URL for the audio file
      const uploadUrl = await SongService.getUploadUrl(file.name, file.type)
      const audioUrl = uploadUrl.split("?")[0]

      // Extract metadata again to get the image
      const metadata = await mm.parseBlob(file)

      // Extract and upload image if available
      let imageUrl = ""
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const image = metadata.common.picture[0].data
        const imageFormat = metadata.common.picture[0].format || "jpeg"
        const imageName = `${file.name.replace(/\.[^/.]+$/, "")}_cover.${imageFormat.split("/")[1] || "jpg"}`

        const uploadedImageUrl = await uploadImage(image, imageName, imageFormat)
        if (uploadedImageUrl) {
          imageUrl = uploadedImageUrl
        }
      }else{
        imageUrl = "https://yehuditmusic.s3.us-east-1.amazonaws.com/default-image.png" // Default cover image URL
      }

      // Create song post model
      const songPostModel: SongPostModel = {
        name: metaData.title,
        artist: metaData.artist,
        genre: metaData.genre,
        year: Number.parseInt(metaData.year),
        album: metaData.album,
        audioFilePath: audioUrl,
        imageFilePath: imageUrl,
        playlistId: Number.parseInt(playlistId),
      }

      // Add song to playlist
      await SongService.addSong(songPostModel)

      setSuccess(true)
      setStep(3)

      // Reset form after success
      setTimeout(() => {
        if (step === 3) {
          navigate(`/playlist/${playlistId}`)
        }
      }, 3000)
    } catch (err) {
      setError("Error adding song to playlist. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const cancelUpload = () => {
    if (xhrRef.current && loading) {
      xhrRef.current.abort()
    }
    setFile(null)
    setProgress(0)
    setLoading(false)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="upload-page-container">
      <div className="upload-card">
        <div className="upload-card-header">
          <h1 className="upload-card-title">
            <span className="gradient-text">Upload to Playlist</span>
          </h1>
          <p className="upload-card-subtitle">
            {playlist ? `Add music to "${playlist.name}" playlist` : "Add music to your playlist"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="upload-steps">
          <div className={`upload-step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select File</div>
          </div>
          <div className="step-connector"></div>
          <div className={`upload-step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Song Details</div>
          </div>
          <div className="step-connector"></div>
          <div className={`upload-step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Confirmation</div>
          </div>
        </div>

        {error && (
          <div className="upload-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="upload-success">
            <Check size={18} />
            <span>Your song has been added to the playlist successfully!</span>
          </div>
        )}

        <div className="upload-content">
          {/* Step 1: File Selection */}
          {step === 1 && (
            <div className="upload-step-content">
              <div className="upload-icon-container">
                <Music size={48} className="upload-icon" />
              </div>

              {!file ? (
                <div
                  className="upload-dropzone"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} className="dropzone-icon" />
                  <p className="dropzone-text">Drag and drop your audio file here</p>
                  <p className="dropzone-subtext">or click to browse</p>
                  <p className="dropzone-formats">Supported formats: MP3, WAV, FLAC, AAC</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </div>
              ) : (
                <div className="selected-file">
                  <div className="file-info">
                    <div className="file-icon">
                      <FileMusic size={24} />
                    </div>
                    <div className="file-details">
                      <p className="file-name">{file.name}</p>
                      <p className="file-size">{formatFileSize(file.size)}</p>
                    </div>
                    <button className="file-remove" onClick={cancelUpload}>
                      <X size={18} />
                    </button>
                  </div>

                  {progress > 0 && (
                    <div className="upload-progress-container">
                      <div className="upload-progress-bar">
                        <div className="upload-progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <p className="upload-progress-text">{progress}% uploaded</p>
                    </div>
                  )}
                </div>
              )}

              <div className="upload-actions">
                <button className="upload-button secondary" onClick={() => navigate(`/myplaylists/playlist/${playlistId}`)}>
                  <ChevronLeft size={16} />
                  <span>Back to Playlist</span>
                </button>
                <button className="upload-button primary" onClick={handleUploadFile} disabled={!file || loading}>
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Song Details */}
          {step === 2 && (
            <div className="upload-step-content">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={metaData.title}
                    onChange={handleInputChange}
                    placeholder="Song title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="artist">Artist *</label>
                  <input
                    type="text"
                    id="artist"
                    name="artist"
                    value={metaData.artist}
                    onChange={handleInputChange}
                    placeholder="Artist name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="album">Album</label>
                  <input
                    type="text"
                    id="album"
                    name="album"
                    value={metaData.album}
                    onChange={handleInputChange}
                    placeholder="Album name (optional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="genre">Genre</label>
                  <select id="genre" name="genre" value={metaData.genre} onChange={handleInputChange}>
                    {!metaData.genre && <option value="">Select genre</option>}
                    {metaData.genre && ![
                      "Pop", "Rock", "Hip Hop", "Electronic", "R&B", "Jazz",
                      "Classical", "Country", "Folk", "Alternative", "Metal",
                      "Blues", "Reggae", "Other"
                    ].includes(metaData.genre) && (
                        <option value={metaData.genre}>{metaData.genre}</option>
                      )}
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                    <option value="Hip Hop">Hip Hop</option>
                    <option value="Electronic">Electronic</option>
                    <option value="R&B">R&B</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Classical">Classical</option>
                    <option value="Country">Country</option>
                    <option value="Folk">Folk</option>
                    <option value="Alternative">Alternative</option>
                    <option value="Metal">Metal</option>
                    <option value="Blues">Blues</option>
                    <option value="Reggae">Reggae</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={metaData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="upload-actions">
                <button className="upload-button secondary" onClick={() => setStep(1)} disabled={loading}>
                  <ChevronLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  className="upload-button primary"
                  onClick={handleSubmitSong}
                  disabled={loading || !metaData.title || !metaData.artist}
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Adding to Playlist...</span>
                    </>
                  ) : (
                    <span>Add to Playlist</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="upload-step-content success-step">
              <div className="success-icon">
                <Check size={48} />
              </div>
              <h2 className="success-title">Song Added Successfully!</h2>
              <p className="success-message">Your song has been added to the playlist and is ready to play.</p>
              <div className="upload-actions">
                <button
                  className="upload-button secondary"
                  onClick={() => {
                    setFile(null)
                    setProgress(0)
                    setMetaData({
                      title: "",
                      artist: "",
                      genre: "",
                      album: "",
                      year: new Date().getFullYear().toString(),
                    })
                    setStep(1)
                  }}
                >
                  <span>Upload Another Song</span>
                </button>

                <button
                  className="upload-button primary"
                  onClick={() => navigate(`/myplaylists/playlist/${playlistId}`)}
                >
                  <span>Go to Playlist</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadSongToPlaylist
