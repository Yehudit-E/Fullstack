"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import PlaylistService from "../services/PlaylistService"
import { Music, CheckCircle, XCircle, Loader } from "lucide-react"
import "./style/AcceptShare.css"
import { StoreType } from "../store/store"
import { useSelector } from "react-redux"

const AcceptShare = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "expired">("idle")
  const [playlistName, setPlaylistName] = useState<string>("")
  const [ownerName, setOwnerName] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const navigate = useNavigate()
const authState=useSelector((state:StoreType)=>state.user.authState)
  useEffect(() => {
    // Validate token on component mount
    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setErrorMessage("The link is missing or invalid. Please check that you copied the full link.")
    } else {
      // Optionally fetch playlist details using the token
      const fetchPlaylistInfo = async () => {
        try {
          // This is a placeholder - you would need to implement this endpoint
          // const info = await PlaylistService.getPlaylistInfoFromToken(token)
          // setPlaylistName(info.name)
          // setOwnerName(info.ownerName)

          // For now, we'll use placeholder data
          setPlaylistName("Playlist")
          setOwnerName("User")
        } catch (error) {
          console.error("Error fetching playlist info:", error)
        }
      }

      fetchPlaylistInfo()
    }
  }, [searchParams])

  const handleAccept = async () => {
    const token = searchParams.get("token")
    if (!token) {
      setStatus("error")
      setErrorMessage("The link is missing or invalid. Please check that you copied the full link.")
      return
    }

      // שלב חדש: בדיקת התחברות
  if (authState === false) {
    // שמירת הנתיב המקורי
    sessionStorage.setItem("redirectAfterLogin", `/playlist/accept-share?token=${token}`)
    navigate("/auth") // נניח שזה הנתיב לעמוד ההתחברות
    return
  }
    setStatus("loading")

    try {
      await PlaylistService.acceptPlaylistShare(token)
      setStatus("success")
      setTimeout(() => {
        navigate("/myPlaylists")
      }, 3000)
    } catch (error: any) {
      console.error("Error accepting share:", error)

      // Handle different error types
      if (error.response && error.response.status === 410) {
        setStatus("expired")
        setErrorMessage("The sharing link has expired or has already been used.")
      } else if (error.response && error.response.status === 403) {
        setStatus("error")
        setErrorMessage("You don't have permission to accept this share.")
      } else if (error.response && error.response.status === 404) {
        setStatus("error")
        setErrorMessage("The playlist was not found or has been removed by the creator.")
      } else {
        setStatus("error")
        setErrorMessage("An error occurred while accepting the share. Please try again later.")
      }
    }
  }

  const handleDecline = () => {
    navigate("/")
  }

  return (
    <div className="accept-share-container">
      <div className="accept-share-card">
        <div className="card-header">
          <h2 className="card-title">Playlist Invitation</h2>
        </div>

        {status === "idle" && (
          <div className="card-content">
            <div className="playlist-icon">
              <Music size={23} />
            </div>

            <div className="share-message">
              <h3>You've been invited to join a playlist</h3>
              {playlistName && ownerName && (
                <p className="playlist-info">
                  <strong>{ownerName}</strong> has invited you to join the playlist <strong>"{playlistName}"</strong>
                </p>
              )}
              <p>
                Accepting this invitation will allow you to view the playlist, listen to songs, and add your own songs.
                The playlist will appear in your shared playlists list.
              </p>
            </div>

            <div className="action-buttons">
              <button className="accept-button" onClick={handleAccept}>
                Accept Invitation
              </button>
              <button className="decline-button" onClick={handleDecline}>
                No Thanks
              </button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="card-content loading-state">
            <Loader size={48} className="loading-icon" />
            <p className="loading-text">Verifying invitation...</p>
            <p className="loading-subtext">Please wait while we add the playlist to your account</p>
          </div>
        )}

        {status === "success" && (
          <div className="card-content success-state">
            <CheckCircle size={48} className="success-icon" />
            <h3 className="success-title">Invitation Accepted!</h3>
            <p className="success-message">
              The playlist has been added to your shared playlists. Redirecting to your playlists...
            </p>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="card-content error-state">
            <XCircle size={48} className="error-icon" />
            <h3 className="error-title">An Error Occurred</h3>
            <p className="error-message">{errorMessage}</p>
            <button className="return-button" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        )}

        {status === "expired" && (
          <div className="card-content error-state">
            <XCircle size={48} className="error-icon" />
            <h3 className="error-title">Link Expired</h3>
            <p className="error-message">{errorMessage}</p>
            <p className="error-help">
              If you still want to join the playlist, ask the person who shared it to send you a new link.
            </p>
            <button className="return-button" onClick={() => navigate("/")}>
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AcceptShare
