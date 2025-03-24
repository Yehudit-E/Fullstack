// import { useState, useRef, useEffect } from "react";
// import { IconButton, Slider, Button, Box, Typography } from "@mui/material";
// import { PlayArrow, Pause, ContentCut } from "@mui/icons-material";
// import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

// interface SongTrimmerProps {
//   songUrl: string;
// }

// const ffmpeg = createFFmpeg({ log: true });

// const SongTrimmer = ({ songUrl }: SongTrimmerProps) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [start, setStart] = useState(0);
//   const [end, setEnd] = useState(10);
//   const [loading, setLoading] = useState(false);
//   const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     const loadFFmpeg = async () => {
//       if (!ffmpeg.isLoaded()) {
//         await ffmpeg.load();
//       }
//     };
//     loadFFmpeg();
//   }, []);

//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const setAudioDuration = () => {
//       setDuration(audio.duration);
//       setEnd(audio.duration);
//     };

//     audio.addEventListener("loadedmetadata", setAudioDuration);
//     return () => {
//       audio.removeEventListener("loadedmetadata", setAudioDuration);
//     };
//   }, []);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleTrim = async () => {
//     setLoading(true);
//     if (!ffmpeg.isLoaded()) await ffmpeg.load();

//     ffmpeg.FS("writeFile", "input.mp3", await fetchFile(songUrl));

//     await ffmpeg.run(
//       "-i", "input.mp3",
//       "-ss", `${start}`,
//       "-to", `${end}`,
//       "-c", "copy",
//       "output.mp3"
//     );

//     const data = ffmpeg.FS("readFile", "output.mp3");
//     const trimmedBlob = new Blob([data.buffer], { type: "audio/mp3" });
//     const trimmedUrl = URL.createObjectURL(trimmedBlob);

//     setTrimmedUrl(trimmedUrl);
//     setLoading(false);
//   };

//   return (
//     <Box sx={{ textAlign: "center", maxWidth: 400, margin: "auto" }}>
//       <Typography variant="h6">חיתוך שיר</Typography>
//       <audio ref={audioRef} src={songUrl} controls />

//       <Slider
//         value={[start, end]}
//         onChange={(_, newValue) => {
//           const [newStart, newEnd] = newValue as number[];
//           setStart(newStart);
//           setEnd(newEnd);
//         }}
//         min={0}
//         max={duration}
//         step={0.1}
//         valueLabelDisplay="auto"
//       />

//       <IconButton onClick={togglePlay} color="primary">
//         {isPlaying ? <Pause fontSize="large" /> : <PlayArrow fontSize="large" />}
//       </IconButton>

//       <Button
//         onClick={handleTrim}
//         variant="contained"
//         color="secondary"
//         startIcon={<ContentCut />}
//         disabled={loading}
//       >
//         {loading ? "חותך..." : "חתוך ושמור"}
//       </Button>

//       {trimmedUrl && (
//         <Box mt={2}>
//           <Typography>שיר חתוך:</Typography>
//           <audio src={trimmedUrl} controls />
//           <a href={trimmedUrl} download="trimmed.mp3">
//             <Button variant="outlined">הורד שיר חתוך</Button>
//           </a>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default SongTrimmer;
