"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Avatar, Menu, MenuItem } from "@mui/material"
import { LogOut, User } from "lucide-react"
import { logout } from "../store/userSlice"
import { resetSongs } from "../store/songSlice"
import type { Dispatch, StoreType } from "../store/store"
import "./style/UserDetails.css"

const UserDetails = () => {
  const dispatch = useDispatch<Dispatch>()
  const user = useSelector((state: StoreType) => state.user.user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    dispatch(logout())
    handleClose()
    navigate("/home")
    // Clean up song state in redux
    dispatch(resetSongs())
    // Clean up sessionStorage
    sessionStorage.removeItem("songsList")
    sessionStorage.removeItem("currentSongIndex")
  }

  return (
    <>
      <Avatar
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          color: "white",
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
      >
        {user?.userName?.charAt(0) || <User size={20} />}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className="user-menu"
        PaperProps={{
          sx: {
            backgroundColor: "var(--color-gray, #1e1e1e)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            minWidth: "180px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled className="user-name-item">
          {user?.userName || "User"}
        </MenuItem>
        <MenuItem disabled className="user-email-item">
          {user?.email || ""}
        </MenuItem>
        <MenuItem onClick={handleLogout} className="logout-item">
        <LogOut size={12} style={{ marginRight: "8px" }}/> Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserDetails
