import { useState, useRef, useEffect } from "react";
import { VolumeUp, VolumeOff } from "@mui/icons-material";
import { Box, IconButton, Slider, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, StoreType } from "../store/store";
import { useNavigate } from "react-router";
import { SkipPreviousRounded, Replay10Rounded, PlayArrowRounded, PauseRounded, Forward30Rounded, SkipNextRounded } from '@mui/icons-material';
import { setChange } from "../store/songSlice";

const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
};

const SongPlayer = () => {
    const songPlayer = useSelector((state: StoreType) => state.songPlayer.song);
    const change = useSelector((state: StoreType) => state.songPlayer.change);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch<Dispatch>();
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);

    useEffect(() => {
        if (songPlayer.id !== 0 && audioRef.current && change) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            dispatch(setChange())
            setIsPlaying(true);
        }
        sessionStorage.setItem('songPlayer', JSON.stringify(songPlayer));
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
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            setCurrentTime(0);
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
        <>{songPlayer.id !== 0 && (
            <Box sx={{ position: "fixed", bottom: 0, width: "100%", height: "100px", backgroundColor: "#000000", color: "white", direction: "rtl" }}>
                <audio ref={audioRef} src={songPlayer.audioFilePath} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleTimeUpdate} onEnded={handleSongEnd} />

                {/* פס התקדמות */}
                <Box sx={{ width: "95%", display: 'flex', flexDirection: 'column', alignItems: 'stretch', mb: -2, margin: '0 auto' }}>
                    <Slider
                        value={currentTime}
                        max={duration}
                        onChange={handleSeek}
                        sx={{
                            color: 'var( --gradient-start)',
                            height: 2,
                            width: '100%',  // הגדרת רוחב של 100% כך שיתפשט על כל הרוחב
                            '& .MuiSlider-thumb': {
                                width: 20,
                                height: 20,
                                backgroundColor: 'var( --gradient-start)',
                                border: '4px solid rgba(60, 60, 60, 0.8)',
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'var( --gradient-start)',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.88)',
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

                    <Box sx={{ display: "flex", alignItems: "center", marginRight: "40px" }}>
                        <Slider value={muted ? 0 : volume} min={0} max={1} step={0.01} onChange={(_, newValue) => setVolume(newValue as number)} sx={{
                            color: 'var( --gradient-start)',
                            height: 2,
                            '& .MuiSlider-thumb': {
                                width: 16,
                                height: 16,
                                backgroundColor: 'var( --gradient-start)',
                                border: '4px solid rgba(60, 60, 60, 0.8)',
                            },
                            '& .MuiSlider-track': {
                                backgroundColor: 'var( --gradient-start)',
                            },
                            '& .MuiSlider-rail': {
                                backgroundColor: 'rgba(240, 240, 240, 0.89)',
                            },
                            width: 100, mx: 0
                        }} />
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => setMuted(!muted)}>{muted ? <VolumeOff /> : <VolumeUp />}</IconButton>
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
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => { }}>
                            <SkipNextRounded sx={{ fontSize: 25 }} />
                        </IconButton>
                        {/* כפתור קדימה 30 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(30)}>
                            <Forward30Rounded sx={{ fontSize: 30 }} />
                        </IconButton>

                        {/* כפתור Play/Pause עם אפקט מעגלי צבעוני */}
                        <Box
                            sx={{
                                width: 43,
                                height: 43,
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
                                    backgroundColor: "#111",
                                    borderRadius: "50%",
                                    width: 38,
                                    height: 35,
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#111",
                                    },
                                }}
                            >
                                {isPlaying ? <PauseRounded sx={{ fontSize: 30 }} /> : <PlayArrowRounded sx={{ fontSize: 30 }} />}
                            </IconButton>
                        </Box>
                        {/* כפתור חזור 10 שניות */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => skipTime(-10)}>
                            <Replay10Rounded sx={{ fontSize: 30 }} />
                        </IconButton>
                        {/* כפתור קודם */}
                        <IconButton sx={{ color: 'rgba(240, 240, 240, 0.8)' }} onClick={() => { }}>
                            <SkipPreviousRounded sx={{ fontSize: 25 }} />
                        </IconButton>


                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 1,
                            position: "relative",
                            cursor: songPlayer.isPublic ? "pointer" : "default",
                            '&::before': songPlayer.isPublic ? {
                                content: '""',
                                position: 'absolute',
                                top: '-10px',
                                left: '-10px',
                                right: '-10px',
                                bottom: '-10px',
                                borderRadius: 1,
                                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                                transition: 'transform 0.05s, opacity 0.2s',
                                opacity: 0,
                                zIndex: -1,
                            } : {},
                            '&:hover::before': songPlayer.isPublic ? {
                                transform: 'scale(1)',
                                opacity: 1,
                            } : {},
                        }}
                        onClick={() => { if (songPlayer.isPublic) navigate('songComments/' + songPlayer.id) }} // כאן תוכל להוסיף ניווט
                    >
                        <Typography variant="h6">{songPlayer.name}</Typography>

                    </Box>
                </Box>
            </Box>
        )}</>
    );
};

export default SongPlayer;