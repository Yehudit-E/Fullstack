import { useState, useRef, useEffect } from "react";
import { VolumeUp, VolumeOff, Close } from "@mui/icons-material";
import { Box, CardMedia, IconButton, Slider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router";
import { SkipPreviousRounded, Replay10Rounded, PlayArrowRounded, PauseRounded, Forward30Rounded, SkipNextRounded } from '@mui/icons-material';
import { nextSong, prevSong, resetSongs, setChange, updateSongs } from "../store/songSlice";
import PlayerOptionsMenu from "./PlayerOptionsMenu";


const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const SongPlayer = () => {
    const songsList = useSelector((state: StoreType) => state.songPlayer.songs);
    const currentSongIndex = useSelector((state: StoreType) => state.songPlayer.currentIndex);
    const change = useSelector((state: StoreType) => state.songPlayer.change);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<Dispatch>();
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);

    useEffect(() => {
        if (audioRef.current && change) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            dispatch(setChange())
            setIsPlaying(true);
        }
        sessionStorage.setItem('songsList', JSON.stringify(songsList));
        sessionStorage.setItem('currentSongIndex', JSON.stringify(currentSongIndex));
    }, [change]);

    const togglePlay = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (_: any, newValue: number | number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newValue as number;
            setCurrentTime(newValue as number);
        }
    };

    const handleSongEnd = () => {
        // if (currentSongIndex === songsList.length-1){
        //     dispatch(updateSongs(songsList));
        // }
        // if (audioRef.current) {
        //     audioRef.current.pause();
        //     audioRef.current.currentTime = 0;
        //     setIsPlaying(false);
        //     setCurrentTime(0);
        // }
        if (songsList.length > currentSongIndex && songsList.length !== 1 && currentSongIndex !== songsList.length - 1) {
            console.log(songsList.length);
            dispatch(nextSong());
        }
    };

    const skipTime = (seconds: number) => {
        if (audioRef.current) {
            const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    return (
    <div>
        {songsList[0].id !== 0 && (
            <Box sx={{
                zIndex: 1200, position: "fixed", bottom: 0, width: "100%", height: "140px", background: "linear-gradient(to top, rgba(0,0,0,1) 62%, rgba(0,0,0,0))",
                color: "white",
                direction: "rtl",
            }}>
                <audio ref={audioRef} src={songsList[currentSongIndex].audioFilePath} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onEnded={handleSongEnd} />

                {/* פס התקדמות */}
                <Box sx={{ width: "95%", display: 'flex', flexDirection: 'column', alignItems: 'stretch', mb: -2, margin: '0 auto', marginTop: "30px" }}>
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        sx={{
                            color: 'var( --gradient-end)',
                            height: "1px",
                            width: '100%',  // הגדרת רוחב של 100% כך שיתפשט על כל הרוחב
                            '& .MuiSlider-thumb': {
                                width: 13,
                                height: 13,
                                backgroundColor: 'var( --gradient-end)',
                                '&:hover': {
                                    boxShadow: 'none',
                                    backgroundColor: 'var(--gradient-end)', // מונע שינוי צבע
                                },
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'var( --gradient-end)',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.8)',
                            },
                        }}
                    />
                    {/* השעות מתחת לפס */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                        <Typography sx={{ fontSize: "13px" }}>{formatTime(duration - currentTime)}</Typography>
                        <Typography sx={{ fontSize: "13px" }}>{formatTime(currentTime)}</Typography>
                    </Box>
                </Box>

                {/* נגן */}
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: -10 }}>

                    <Box sx={{ display: "flex", alignItems: "center", marginRight: "30px" }}>
                        <PlayerOptionsMenu
                            song={songsList[currentSongIndex]}
                            playbackRate={playbackRate}
                            onRateChange={(rate) => {
                                setPlaybackRate(rate);
                                if (audioRef.current) {
                                    audioRef.current.playbackRate = rate;
                                }
                            }}
                        />

                        <Slider value={muted ? 0 : volume} min={0} max={1} step={0.01} onChange={(_, newValue) => setVolume(newValue as number)} sx={{
                            color: 'var( --gradient-end)',
                            height: "1px",
                            '& .MuiSlider-thumb': {
                                width: 11,
                                height: 11,
                                backgroundColor: 'var( --gradient-end)',
                                '&:hover': {
                                    boxShadow: 'none',
                                    backgroundColor: 'var(--gradient-end)', // מונע שינוי צבע
                                }
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'var( --gradient-end)',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.8)',
                            },
                            width: 100, mx: 0
                        }} />
                        <IconButton sx={{
                            color: 'rgba(240, 240, 240, 0.8)',
                            padding: '4px',  // מצמצם את גודל הלחיצה
                            '& svg': { fontSize: 20 } // מקטין את האייקון עצמו
                        }} onClick={() => setMuted(!muted)}>{muted ? <VolumeOff /> : <VolumeUp />}</IconButton>
                    </Box>

                    <Box
                        sx={{
                            position: "fixed",
                            left: "40%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 1,
                        }}
                    >
                        {/* כפתור הבא */}
                        <IconButton
                            sx={{
                                color: currentSongIndex === songsList.length - 1
                                    ? 'rgba(240, 240, 240, 0.3)'  // צבע אפור כשלא פעיל
                                    : 'rgba(240, 240, 240, 0.8)'  // צבע רגיל כשהוא פעיל
                            }}
                            onClick={() => { dispatch(nextSong()); }}
                            // disabled={currentSongIndex === songsList.length - 1}
                            style={{ pointerEvents: currentSongIndex === songsList.length - 1 ? 'none' : 'auto' }}  // מוודא שהכפתור יוצג תמיד

                        >
                            <SkipNextRounded sx={{ fontSize: 20 }} />
                        </IconButton>
                        {/* כפתור קדימה 30 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(30)}>
                            <Forward30Rounded sx={{ fontSize: 25 }} />
                        </IconButton>

                        {/* כפתור Play/Pause עם אפקט מעגלי צבעוני */}
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: "50%",
                                background: "linear-gradient( 90deg,var(--gradient-start), var(--gradient-middle), var(--gradient-end))",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
                            }}
                        >
                            <IconButton
                                onClick={togglePlay}
                                sx={{
                                    backgroundColor: "var(--color-gray)",
                                    borderRadius: "50%",
                                    width: 40,
                                    height: 40,
                                    color: "var(--color-white)",
                                    "&:hover": {
                                        backgroundColor: "var(--color-gray)",
                                    },
                                }}
                            >
                                {isPlaying ? <PauseRounded sx={{ fontSize: 28 }} /> : <PlayArrowRounded sx={{ fontSize: 30 }} />}
                            </IconButton>
                        </Box>
                        {/* כפתור חזור 10 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(-10)}>
                            <Replay10Rounded sx={{ fontSize: 25 }} />
                        </IconButton>
                        {/* כפתור קודם */}
                        <IconButton
                            sx={{ color: 'rgba(240, 240, 240, 0.8)' }}
                            onClick={() => { dispatch(prevSong()); }}
                            // disabled={currentSongIndex === 0}
                        >
                            <SkipPreviousRounded sx={{ fontSize: 20 }} />
                        </IconButton>


                    </Box>
                    <Box
                        sx={{
                            marginLeft: "45px",
                            display: "flex",
                            alignItems: "center",
                            padding:0,
                            marginTop: 1,
                            position: "relative",
                            '&::before': songsList[currentSongIndex].isPublic ? {
                                content: '""',
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                right: '-10px',
                                padding:0,
                                bottom: '-10px',
                                borderRadius: 1,
                                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                                transition: 'transform 0.05s, opacity 0.2s',
                                opacity: 0,
                                zIndex: -1,
                            } : {},
                            '&:hover::before': songsList[currentSongIndex].isPublic ? {
                                transform: 'scale(1)',
                                opacity: 1,
                                padding:0,
                            } : {},
                        }}
                        onClick={() => { if (songsList[currentSongIndex].isPublic) navigate('songComments/' + songsList[currentSongIndex].id) }} // כאן תוכל להוסיף ניווט
                    >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            {/* <Typography sx={{ fontSize: 15 }}>{songPlayer.name + " - "}</Typography>
                            <Typography sx={{ fontSize: 15 }}>{songPlayer.artist}</Typography> */}
                            <Typography sx={{ fontSize: 15 }}>{songsList[currentSongIndex].name}</Typography>
                        </Box>
                        <CardMedia
                            component="img"
                            image={songsList[currentSongIndex].imageFilePath}
                            alt={songsList[currentSongIndex].name}
                            sx={{ width: 40, height: 40, borderRadius: 1, mr: 2 }}
                        />

                    </Box>
                </Box>
            </Box>
        )}
        </div>
    );
};

export default SongPlayer; 