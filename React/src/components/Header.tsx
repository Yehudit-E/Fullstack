"use client"

import { useSelector } from "react-redux"
import type { StoreType } from "../store/store"
import { Link, useLocation } from "react-router"
import { useState, useEffect, useRef } from "react"
import { LogIn, Menu, X } from "lucide-react"
import "./style/Header.css"
import UserDetails from "./userDetails"

const Header = () => {
  const authState = useSelector((store: StoreType) => store.user.authState)
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => location.pathname.startsWith(path)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <header
      ref={headerRef}
      className={`app-header ${isScrolled ? "scrolled" : ""} ${mobileMenuOpen ? "menu-open" : ""}`}
    >
      <div className="header-container">
        <div className="header-logo">
          <Link to="/home" className="logo-link">
            <img src="/images/musical-notes.png" alt="Logo" className="logo-image" />
            <span className="logo-text">MusicApp</span>
          </Link>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`header-nav ${mobileMenuOpen ? "open" : ""}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
                {/* <Home size={18} /> */}
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/music" className={`nav-link ${isActive("/music") ? "active" : ""}`}>
                {/* <Music size={18} /> */}
                <span>Music</span>
              </Link>
            </li>
            {authState && (
              <li className="nav-item">
                <Link to="/myplaylists" className={`nav-link ${isActive("/myplaylists") ? "active" : ""}`}>
                  {/* <ListMusic size={18} /> */}
                  <span>My Playlists</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {!authState ? (
            <Link to="/auth" className="auth-button-header">
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          ) : (
            <UserDetails />
          )}
        </div>
      </div>

      {/* Gradient line at bottom */}
      <div className="header-gradient-line"></div>
    </header>
  )
}

export default Header
