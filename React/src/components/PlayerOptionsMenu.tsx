import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import SpeedIcon from "@mui/icons-material/Speed";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { resetSong } from "../store/songSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { Song, SongDto } from "../models/Song";

type Props = {
  song: SongDto | Song;
  playbackRate: number;
  onRateChange: (rate: number) => void;
};

const PlayerOptionsMenu = ({ song, playbackRate, onRateChange }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
const dispatch = useDispatch<Dispatch>();
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    dispatch(resetSong())
    sessionStorage.removeItem('songPlayer');

  }

  const handleMenuClose = () => {
    setAnchorEl(null);
    setShowSpeedOptions(false);
  };

  const handleSpeedChange = (speed: number) => {
    onRateChange(speed);
    handleMenuClose();
  };
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("שגיאה בהורדת הקובץ");

      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // משחרר את הזיכרון
    } catch (error) {
      console.error("שגיאה בהורדה:", error);
    }

  };
  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          color: "#f5f5f5",
          p: 1,
          marginLeft: 2,
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "var(--color-gray)",
            borderRadius: "12px",
            color: "var(--color-white)",
            minWidth: "80",
            minHeight: "80px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
            zIndex:99999,
            "& .MuiMenuItem-root": {
              "&:hover": { backgroundColor: "#222" },
            },
          },
        }}
      >
        {!showSpeedOptions ? (
          <>
            <MenuItem
              onClick={() => {
                handleDownload( song.audioFilePath,song.name);
                handleMenuClose();
              }}
            >
              <ListItemIcon sx={{ color: "var(--color-white)" }}>
                <DownloadIcon sx={{fontSize:"16px"}} />
              </ListItemIcon>
              <ListItemText  primary="הורדה" />
            </MenuItem>

            <MenuItem onClick={() => setShowSpeedOptions(true)}>
              <ListItemIcon sx={{ color: "var(--color-white)" }}>
                <SpeedIcon sx={{fontSize:"16px"}} />
              </ListItemIcon>
              <ListItemText primary="מהירות" />
            </MenuItem>

            <Divider sx={{ backgroundColor: "#555" }} />

            <MenuItem
              onClick={() => {
                handleClose();
                handleMenuClose();
              }}
            >
              <ListItemIcon sx={{ color: "var(--color-white)" }}>
                <ExitToAppIcon sx={{fontSize:"16px"}} />
              </ListItemIcon>
              <ListItemText primary="יציאה" />
            </MenuItem>
          </>
        ) : (
          <>
            <Typography
              sx={{
                px: 2,
                py: 1,
                color: "var(--color-white)",
                fontSize: "14px",
                fontWeight: 200,
              }}
            >
              בחר מהירות:
            </Typography>

            {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((val) => (
              <MenuItem
                key={val}
                onClick={() => handleSpeedChange(val)}
                sx={{
                  // backgroundColor: "#333",
                  "&:hover": { backgroundColor: "#222" },
                  position: "relative",
                  paddingRight: "30px",
                  "&:before": {
                    content: '""',
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)", // Center the bar vertically
                    width: val === playbackRate ? "5px" : "0", // Wider bar, only visible for selected speed
                    height: "20px", // Shorter height
                    background: val === playbackRate ? "var(--gradient-end)" : "#888", // Background for selected speed
                    borderRadius: "5px", // Rounded corners for the bar
                    transition: "width 0.3s",
                  },
                }}
              >
                <ListItemText
                 primary={`${val}x`} />
              </MenuItem>
            ))}

            <Divider sx={{ backgroundColor: "#555" }} />

            <MenuItem onClick={() => setShowSpeedOptions(false)}>
              <ListItemIcon sx={{ color: "var(--color-white)" }}>
                <ArrowBackIcon sx={{ fontSize:"16px"}} />
              </ListItemIcon>
              <ListItemText primary="חזרה" />
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default PlayerOptionsMenu;