import { useEffect, useState } from "react";
import SongService from "../services/SongService";
import { Song } from "../models/Song";
import "./style/PublicSongs.css";
import { MenuItem, IconButton, Menu, Divider } from "@mui/material";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import DownloadIcon from "@mui/icons-material/Download";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useDispatch } from "react-redux";
import { updateSong } from "../store/songSlice";
import AddToPlaylistModel from "./AddToPlaylistModel";
import RequestUploadDialog from "./UploadSongRequestDialog";
import UploadSongRequestDialog from "./UploadSongRequestDialog";

const PublicSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [genre, setGenre] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [menuAnchor, setMenuAnchor] = useState<{ [key: string]: HTMLElement | null }>({});
  const [currentSong, setCurrentSong] = useState<Song>({} as Song);
  const [showPlaylistList, setShowPlaylistList] = useState<boolean>(false);
  const dispatch = useDispatch<Dispatch>();

  const authState: boolean = useSelector((store: StoreType) => store.user.authState);
  console.log(authState);

  useEffect(() => {
    SongService.getPublicSongs()
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching public songs:", err);
        setError("Failed to load songs.");
        setLoading(false);
      });
  }, []);

  const sortSongs = (songs: Song[], sortBy: string) => {
    const sortedSongs = [...songs];
    switch (sortBy) {
      case "date":
        return sortedSongs.sort((a, b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime());
      case "artist":
        return sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
      case "name":
      default:
        return sortedSongs.sort((a, b) => a.name.localeCompare(b.name));
    }
  };

  const getGenres = () => {
    const genres = new Set(songs.map(song => song.genre));
    return ["all", ...genres];
  };

  const filteredSongs = sortSongs(songs, sortBy)
    .filter(song => genre === "all" || song.genre === genre)
    .filter(song => song.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>, songId: number) => {
    setMenuAnchor((prev) => ({ ...prev, [songId]: event.currentTarget }));
  };

  const closeMenu = (songId: number) => {
    setMenuAnchor((prev) => ({ ...prev, [songId]: null }));
  };


  const downloadSong = async (fileUrl: string, fileName: string) => {
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
  const handlePlaySong = (song: Song) => {
    dispatch(updateSong(song));
  };


  return (
    <div style={{ marginTop: "45px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
      {/* תיבת הסינון והמיון */}
      <div className="filters-container"
  style={{
    marginRight: "12px",
    marginLeft: "1px",
    marginTop: "30px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "151px",
    height: "100%",
    alignItems: "flex-start",
    position: "sticky",
    top: "169px", // כאן את יכולה לשחק עם המרווח מלמעלה
    zIndex: 1, // חשוב לוודא שהמרכיבים האלו לא יהיו מתחת לתוכן אחר
  }}
>
  {authState && <UploadSongRequestDialog />}
  {/* תיבת חיפוש */}
  <div style={{
    cursor: "pointer",
    padding: "0.5px",
    color: "var(--color-white)",
    borderRadius: "32px",
    width: "100%",
    height: "25px",
    marginBottom: "5px",
    background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
    position: "relative",
  }}>
    <div style={{
      backgroundColor: "var(--color-gray)",
      borderRadius: "32px",
      width: "100%",
      height: "25px",
      display: "flex",
      alignItems: "center",
    }}>
      <input
        type="text"
        placeholder="חפש שיר..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
          color: "var(--color-white)",
          outline: "none",
          fontSize: "14px",
          marginRight: "6px",
        }}
      />
    </div>
  </div>
  {/* תיבת מיון */}
  {[
    {
      label: "מיין לפי",
      value: sortBy,
      setValue: setSortBy,
      options: [{ label: "שם", value: "name" }, { label: "תאריך", value: "date" }, { label: "אמן", value: "artist" }],
    },
    {
      label: "ז'אנר",
      value: genre,
      setValue: setGenre,
      options: getGenres().map(g => ({ label: g === "all" ? "הכל" : g, value: g })),
    },
  ].map(({ label, value, setValue, options }, index) => (
    <div key={index} style={{
      cursor: "pointer",
      padding: "0.5px",
      color: "var(--color-white)",
      borderRadius: "32px",
      width: "100%",
      height: "25px",
      background: "linear-gradient(90deg, var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
      position: "relative",
      marginBottom: "5px"
    }}>
      <button
        style={{
          backgroundColor: "var(--color-gray)",
          borderRadius: "32px",
          width: "100%",
          height: "25px",
          color: "white",
          border: "none",
          appearance: "none",
          outline: "none",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          overflow: "hidden"
        }}
      >
        <span style={{ marginRight: "6px" }}>{label}:</span>
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            backgroundColor: "var(--color-gray)",
            borderRadius: "32px",
            width: "auto",
            maxWidth: "100%",
            marginRight: "6px",
            height: "25px",
            color: "#707070",
            border: "none",
            appearance: "none",
            outline: "none",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          {options.map(({ label, value }) => (
            <option
              key={value}
              value={value}
              style={{
                backgroundColor: "var(--color-gray)",
                color: "var(--color-white)",
                padding: "5px",
              }}
            >
              {label}
            </option>
          ))}
        </select>
      </button>
    </div>
  ))}
</div>

      {/* רשימת השירים */}
      <div className="songs-container" style={{ flexGrow: 1, marginRight: "37px" }}>
        <div className="songs-grid">
          {filteredSongs.map((song: Song) => (
            <div key={song.id} className="song-card">
              <div className="song-image-container">
                <img src="/images/soundbar.png" alt={song.name} className="song-image" />
                <div className="play-button-container">
                  <IconButton sx={{
                    border: "0.8px solid white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                    onClick={() => handlePlaySong(song)}
                  >
                    <PlayArrowIcon sx={{ color: "white", fontSize: 30 }} />
                  </IconButton>
                </div>
              </div>
              <Divider sx={{ width: "90%", marginTop: "30px", borderBottomWidth: 0.5, borderColor: "var(--color-white)" }} />
              <div className="song-info">
                <span className="song-text">{song.name} </span>
                <div className="song-icons">
                  <IconButton onClick={(e) => openMenu(e, song.id)} >
                    <MoreVertIcon sx={{ color: "white", fontSize: 20 }} />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor[song.id]}
                    open={Boolean(menuAnchor[song.id])}
                    onClose={() => closeMenu(song.id)}
                    sx={{
                      "& .MuiPaper-root": { backgroundColor: "var(--color-gray)", color: "white" },
                      "& .MuiMenuItem-root": { "&:hover": { backgroundColor: "#222" }, },
                    }}
                  >
                    <MenuItem onClick={() => {
                      closeMenu(song.id);
                      downloadSong(song.audioFilePath, song.name);
                    }}>
                      <DownloadIcon sx={{ marginLeft: "7px", fontSize: "16px" }} />הורדה
                    </MenuItem>
                    {authState &&
                      <MenuItem onClick={() => { closeMenu(song.id); setCurrentSong(song); setShowPlaylistList(true); }}>
                        <QueueMusicIcon sx={{ marginLeft: "7px", fontSize: "16px" }} />הוספה לפלייליסט
                      </MenuItem>}
                  </Menu>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>

      {showPlaylistList && (
        <AddToPlaylistModel
          song={currentSong}
          onClose={() => setShowPlaylistList(false)}
        />
      )}
    </div>
  );
};

export default PublicSongs;