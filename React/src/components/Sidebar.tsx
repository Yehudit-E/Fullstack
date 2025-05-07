"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, Link } from "react-router"
import { Home, Music, ListMusic, Menu, ChevronLeft, User, LogIn, LogOut } from "lucide-react"
import type { StoreType } from "../store/store"
import "./style/Sidebar.css"

interface SidebarProps {
  onToggle?: (expanded: boolean) => void
}

const Sidebar = ({ onToggle }: SidebarProps) => {
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const authState = useSelector((store: StoreType) => store.user.authState)
  const user = useSelector((store: StoreType) => store.user.user)
  const location = useLocation()

  // Check if current route is active
  const isActive = (path: string) => location.pathname === path

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setExpanded(false)
        if (onToggle) onToggle(false)
      }
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [onToggle])

  // Toggle sidebar expansion
  const toggleSidebar = () => {
    const newExpandedState = !expanded
    setExpanded(newExpandedState)
    if (onToggle) onToggle(newExpandedState)
  }

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {expanded && isMobile && (
        <div
          className="sidebar-overlay"
          onClick={() => {
            setExpanded(false)
            if (onToggle) onToggle(false)
          }}
        />
      )}

      {/* Main Sidebar */}
      <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          {expanded ? (
            <div className="logo-container">
              <img src="/images/musical-notes.png" alt="Logo" className="logo" />
              <span className="logo-text">Music App</span>
            </div>
          ) : (
            <img src="/images/musical-notes.png" alt="Logo" className="logo-small" />
          )}
          <button className="toggle-button" onClick={toggleSidebar}>
            {expanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <ul className="nav-list">
              <li>
                <Link to="/home" className={`nav-item ${isActive("/home") ? "active" : ""}`}>
                  <Home size={20} className="nav-icon" />
                  {expanded && <span className="nav-text">בית</span>}
                </Link>
              </li>
              <li>
                <Link to="/music" className={`nav-item ${isActive("/music") ? "active" : ""}`}>
                  <Music size={20} className="nav-icon" />
                  {expanded && <span className="nav-text">מוזיקה</span>}
                </Link>
              </li>
              {authState && (
                <li>
                  <Link to="/myplaylists" className={`nav-item ${isActive("/myplaylists") ? "active" : ""}`}>
                    <ListMusic size={20} className="nav-icon" />
                    {expanded && <span className="nav-text">הפלייליסטים שלי</span>}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="sidebar-footer">
          {authState ? (
            <div className="user-section">
              <Link to="/profile" className="user-profile">
                <div className="avatar">
                  {user ? (
                    <img src={user.userName|| "/placeholder.svg"} alt="Profile" className="avatar-img" />
                  ) : (
                    <User size={expanded ? 24 : 20} className="avatar-icon" />
                  )}
                </div>
                {expanded && (
                  <div className="user-info">
                    <span className="username">{user?.userName || "User"}</span>
                    <span className="user-email">{user?.email || ""}</span>
                  </div>
                )}
              </Link>
              {expanded && (
                <Link to="/logout" className="logout-button">
                  <LogOut size={18} />
                  <span>התנתק</span>
                </Link>
              )}
            </div>
          ) : (
            <Link to="/auth" className="login-button">
              <LogIn size={20} className="nav-icon" />
              {expanded && <span>התחברות</span>}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export default Sidebar
