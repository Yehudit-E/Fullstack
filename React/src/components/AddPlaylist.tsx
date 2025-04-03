import { AddCircleOutline } from "@mui/icons-material";
import { Button, Popover, TextField } from "@mui/material";
import { useState } from "react";
import { Playlist, PlaylistPostModel } from "../models/Playlist";
import PlaylistService from "../services/PlaylistService";
import { useSelector } from "react-redux";
import { StoreType } from "../store/store";
import { User } from "../models/User";

interface AddPlaylistProps {
    playlists: Playlist[];
    setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const AddPlaylist = ({ playlists, setPlaylists }: AddPlaylistProps) => {
    const user: User = useSelector((state: StoreType) => state.user.user);
    const [showInput, setShowInput] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleCreatePlaylist = async () => {
        if (newPlaylistName.trim()) {
            try {
                const newPlaylist: PlaylistPostModel = { name: newPlaylistName, ownerId: user.id };
                const createdPlaylist = await PlaylistService.createPlaylist(newPlaylist);
                setPlaylists([...playlists, createdPlaylist]);
                setNewPlaylistName("");
                setShowInput(false);
            } catch (error) {
                console.error("Error creating playlist:", error);
            }
        }
    };
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    return (
        <>
            <Button
                variant="outlined"
                color="secondary"
                startIcon={<AddCircleOutline />}
                onClick={handleClick}
                style={{
                    marginTop: "30px",
                    height: "26px",
                    width: "180px",
                    textTransform: "none",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px",
                    border: "1px solid #333",
                    color: "#000000",
                    background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#444")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
                <span style={{ flexGrow: 1, textAlign: "center" }}>צור פלייליסט חדש</span>
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                style={{ zIndex: 1000 }}
            >
                <div
                    style={{
                        backgroundColor: "#363636",
                        padding: "15px",
                        // borderRadius: "8px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                        color: "white",
                        // minWidth: "200px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="שם הפלייליסט"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px",
                            marginBottom: "10px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#000000",
                            color: "white",
                            display: "block",
                            boxSizing: "border-box",
                        }}
                    />
                    <button
                        onClick={handleCreatePlaylist}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#000000",
                            color: "white",
                            cursor: "pointer",
                            display: "block",
                            boxSizing: "border-box",
                        }}
                    >
                        צור
                    </button>
                </div>
            </Popover>
        </>
    );
};

export default AddPlaylist;
