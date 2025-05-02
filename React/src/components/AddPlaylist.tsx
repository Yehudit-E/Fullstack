"use client"

import type React from "react"

import { Add as AddIcon } from "@mui/icons-material"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import type { Playlist } from "../models/Playlist"



const AddPlaylist = () => {
  const navigate = useNavigate()

  const handleAddPlaylist = () => {
    navigate("/myPlaylists/add")
  }

  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={handleAddPlaylist}
      style={{
        background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
        color: "var(--color-white)",
        borderRadius: "3px",
        padding: "4px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        border: "none",
        cursor: "pointer",
        marginTop: "30px",
        width: "auto",
        height: "auto",
        textTransform: "none",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>Add Playlist</span>
    </Button>
  )
}

export default AddPlaylist
