import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SpeedIcon from "@mui/icons-material/Speed";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { resetSongs } from "../store/songSlice";
import { useDispatch } from "react-redux";
import { Dispatch } from "../store/store";
import { Song, SongDto } from "../models/Song";
import { ArrowLeft, Download } from "lucide-react";

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
    dispatch(resetSongs());
    sessionStorage.removeItem("songsList");
    sessionStorage.removeItem("currentSongIndex");
  };

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
      if (!response.ok) throw new Error("Error downloading the file");

      const blob = await response.blob();
      const link = document.createElement("a");

      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
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
        className="options-menu"
        PaperProps={{
          sx: {
            backgroundColor: "var(--color-gray)",
            borderRadius: "12px",
            color: "var(--color-white)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
            zIndex: 99999,
            "& .MuiMenuItem-root": {
              "&:hover": { backgroundColor: "#222" },
            },
          },
        }}
      >
        {!showSpeedOptions
  ? [
      <MenuItem key="title" className="menu-title" disabled>
        Options
      </MenuItem>,
      <MenuItem
        key="download"
        className="menu-item"
        onClick={() => {
          handleDownload((song as Song).audioFilePath, (song as Song).name);
          handleMenuClose();
        }}
      >
        <Download size={17} className="menu-icon" />
        Download
      </MenuItem>,
      <MenuItem
        key="speed"
        className="menu-item"
        onClick={() => setShowSpeedOptions(true)}
      >
        <SpeedIcon fontSize="small" className="menu-icon" />
        Speed
      </MenuItem>,
      <MenuItem
        key="close"
        className="menu-item"
        onClick={() => {
          handleClose();
          handleMenuClose();
        }}
      >
        <ExitToAppIcon fontSize="small" className="menu-icon" />
        Close player
      </MenuItem>,
    ]
  : [
      <MenuItem key="speed-title" className="menu-title" disabled>
        Select speed
      </MenuItem>,
      ...[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((val) => (
        <MenuItem
          key={val}
          className="menu-item"
          onClick={() => handleSpeedChange(val)}
          sx={{
            position: "relative",
            paddingRight: "30px",
            "&:before": {
              content: '""',
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              width: val === playbackRate ? "5px" : "0",
              height: "20px",
              background: val === playbackRate ? "var(--gradient-end)" : "#888",
              borderRadius: "5px",
              transition: "width 0.3s",
            },
          }}
        >
          {val}x
        </MenuItem>
      )),
      <MenuItem
        key="back"
        className="menu-item"
        onClick={() => setShowSpeedOptions(false)}
      >
        <ArrowLeft size={17} className="menu-icon" />
        Back
      </MenuItem>,
    ]}


      </Menu>
    </>
  );
};

export default PlayerOptionsMenu;
