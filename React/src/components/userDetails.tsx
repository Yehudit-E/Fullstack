"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router"
import { Avatar, Menu, MenuItem, IconButton, TextField } from "@mui/material"
import { LogOut, Edit2, Check, X } from "lucide-react"
import { logout, updateUser } from "../store/userSlice"
import { resetSongs } from "../store/songSlice"
import type { Dispatch, StoreType } from "../store/store"
import "./style/UserDetails.css"
import { UserDto } from "../models/User"
import UserService from "../services/UserService"

const UserDetails = () => {
  const dispatch = useDispatch<Dispatch>()
  const user = useSelector((state: StoreType) => state.user.user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [newUserName, setNewUserName] = useState(user?.userName || "")
  const [editError, setEditError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Update local state when user changes in Redux
  useEffect(() => {
    setNewUserName(user?.userName || "")
  }, [user?.userName])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditingName])

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setIsEditingName(false)
    setNewUserName(user?.userName || "")
    setEditError("")
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditingName(true)
  }

  const handleSaveUsername = async () => {
    // Validate username
    if (!newUserName.trim()) {
      setEditError("Username cannot be empty")
      return
    }

    if (newUserName.trim().length < 3) {
      setEditError("Username must be at least 3 characters")
      return
    }
    const userWithNewName: UserDto = {
      id: user.id,
      userName: newUserName.trim(),
      email: user.email,
      password: user.password,
      create_at: user.create_at,
    }
    try {
      await UserService.updateUser(user.id, userWithNewName);
      await dispatch(updateUser(userWithNewName))
      setIsEditingName(false)
      setEditError("")
    }
    catch (error) {
      // console.error("Failed to update username:", error)
      setEditError("Failed to update username")
    }

  }

  const handleCancelEdit = () => {
    setIsEditingName(false)
    setNewUserName(user?.userName || "")
    setEditError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveUsername()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  return (
    <>
      <Avatar
        onClick={handleClick}
        sx={{
          width: 32,
          height: 32,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          // bgcolor: "rgba(205, 101, 198)",
          color: "white",
          cursor: "pointer",
          "&:hover": { opacity: 0.8 },
        }}
      >
        {/* {user?.userName?.charAt(0) || <User size={20} />} */}
        <img
          style={{
            width: 37,
            height: 32,
          }}
          src="/images/profile.png">
        </img>
      </Avatar>
      {/* <img
        style={{
          width: 40,
          height: 40,
        }}
        onClick={handleClick}
        src="/images/profile.png">
      </img> */}

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
            minWidth: "220px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div className="user-name-item">
          {isEditingName ? (
            <div className="username-edit-container">
              <TextField
                inputRef={inputRef}
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="standard"
                className="username-edit-input"
                error={!!editError}
                helperText={editError}
                InputProps={{
                  disableUnderline: false,
                  className: "username-input-field",
                }}

                autoComplete="off"
              />
              <div className="username-edit-actions">
                <IconButton size="small" onClick={handleSaveUsername} className="edit-action-button save-name-button">
                  <Check size={16} />
                </IconButton>
                <IconButton size="small" onClick={handleCancelEdit} className="edit-action-button cancel-edit-button">
                  <X size={16} />
                </IconButton>
              </div>
            </div>
          ) : (
            <div className="username-display">
              <span>{user?.userName || "User"}</span>
              <IconButton size="small" onClick={handleEditClick} className="edit-username-button">
                <Edit2 size={14} />
              </IconButton>
            </div>
          )}
        </div>
        <MenuItem disabled className="user-email-item">
          {user?.email || ""}
        </MenuItem>
        <MenuItem onClick={handleLogout} className="logout-item">
          <LogOut size={16} style={{ marginRight: "8px" }} /> Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserDetails
