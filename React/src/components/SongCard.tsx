// // PublicSongCard.tsx
// import React, { useState } from "react";
// import { MenuItem, IconButton, Menu, Divider } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import QueueMusicIcon from '@mui/icons-material/QueueMusic';
// import DownloadIcon from "@mui/icons-material/Download";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import { Song } from "../models/Song";
// import { useDispatch } from "react-redux";
// import { updateSongs } from "../store/songSlice";

// interface PublicSongCardProps {
//   song: Song;
//   onDownload: (fileUrl: string, fileName: string) => void;
//   onAddToPlaylist: (song: Song) => void;
// }

// const SongCard: React.FC<PublicSongCardProps> = ({ song, onDownload, onAddToPlaylist }) => {
//   const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
//   const dispatch = useDispatch();

//   const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setMenuAnchor(event.currentTarget);
//   };

//   const closeMenu = () => {
//     setMenuAnchor(null);
//   };

//   const handlePlaySong = () => {
//     dispatch(updateSongs([song]));
//   };

//   return (
//     <div className="song-card">
//       <div className="song-image-container">
//         <img src="/images/soundbar.png" alt={song.name} className="song-image" />
//         <div className="play-button-container">
//           <IconButton
//             sx={{
//               border: "0.8px solid white",
//               borderRadius: "50%",
//               width: 40,
//               height: 40,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center"
//             }}
//             onClick={handlePlaySong}
//           >
//             <PlayArrowIcon sx={{ color: "white", fontSize: 30 }} />
//           </IconButton>
//         </div>
//       </div>
//       <Divider sx={{ width: "90%", marginTop: "30px", borderBottomWidth: 0.5, borderColor: "var(--color-white)" }} />
//       <div className="song-info">
//         <span className="song-text">{song.name}</span>
//         <div className="song-icons">
//           <IconButton onClick={openMenu}>
//             <MoreVertIcon sx={{ color: "white", fontSize: 20 }} />
//           </IconButton>
//           <Menu
//             anchorEl={menuAnchor}
//             open={Boolean(menuAnchor)}
//             onClose={closeMenu}
//             sx={{
//               "& .MuiPaper-root": { backgroundColor: "var(--color-gray)", color: "white" },
//               "& .MuiMenuItem-root": { "&:hover": { backgroundColor: "#222" }, },
//             }}
//           >
//             <MenuItem onClick={() => { closeMenu(); onDownload(song.audioFilePath, song.name); }}>
//               <DownloadIcon sx={{ marginLeft: "7px", fontSize: "16px" }} />הורדה
//             </MenuItem>
//             <MenuItem onClick={() => { closeMenu(); onAddToPlaylist(song); }}>
//               <QueueMusicIcon sx={{ marginLeft: "7px", fontSize: "16px" }} />הוספה לפלייליסט
//             </MenuItem>
//           </Menu>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SongCard;
