// // import React, { createContext, useState, useContext, useEffect } from "react";
// // import { Song } from "../models/Song";

// // // יצירת ה-Context
// // interface AudioPlayerContextType {
// //     currentSong: Song | null;
// //     isPlaying: boolean;
// //     playSong: (song: Song) => void;
// //     pauseSong: () => void;
// //     togglePlay: () => void;
// // }

// // const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// // // קומפוננטת Provider לניהול מצב הנגן הגלובלי
// // export const AudioPlayerProvider = ({ children }:{ children:React.ReactNode}) => {
// //     const [currentSong, setCurrentSong] = useState<Song | null>(null);
// //     const [isPlaying, setIsPlaying] = useState<boolean>(false);
// //     const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

// //     useEffect(() => {
// //         if (audio) {
// //             isPlaying ? audio.play() : audio.pause();
// //         }
// //     }, [isPlaying, audio]);

// //     const playSong = (song: Song) => {
// //         if (audio) {
// //             audio.pause(); // להפסיק את השיר הנוכחי אם יש
// //         }
// //         const newAudio = new Audio("/song.mp3");
// //         newAudio.play();
// //         setAudio(newAudio);
// //         setCurrentSong(song);
// //         setIsPlaying(true);
// //     };

// //     const pauseSong = () => {
// //         if (audio) {
// //             audio.pause();
// //         }
// //         setIsPlaying(false);
// //     };

// //     const togglePlay = () => {
// //         if (audio) {
// //             if (isPlaying) {
// //                 audio.pause();
// //             } else {
// //                 audio.play();
// //             }
// //             setIsPlaying(!isPlaying);
// //         }
// //     };

// //     return (
// //         <AudioPlayerContext.Provider value={{ currentSong, isPlaying, playSong, pauseSong, togglePlay }}>
// //             {children}
// //         </AudioPlayerContext.Provider>
// //     );
// // };

// // // Hook נוח לשימוש בקומפוננטות אחרות
// // export const useAudioPlayer = (): AudioPlayerContextType => {
// //     const context = useContext(AudioPlayerContext);
// //     if (!context) {
// //         throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
// //     }
// //     return context;
// // };
// import React, { createContext, useContext, useState, useEffect } from "react";

// interface AudioPlayerContextType {
//   currentSong: string | null;
//   isPlaying: boolean;
//   playSong: (song: string) => void;
//   pauseSong: () => void;
//   stopSong: () => void;
// }

// const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// export const AudioPlayerProvider = ({ children }:{ children:React.ReactNode}) => {
//   const [currentSong, setCurrentSong] = useState<string | null>(
//     () => localStorage.getItem("currentSong") || null
//   );
//   const [isPlaying, setIsPlaying] = useState<boolean>(
//     () => localStorage.getItem("isPlaying") === "true"
//   );

//   useEffect(() => {
//     localStorage.setItem("currentSong", currentSong || "");
//     localStorage.setItem("isPlaying", isPlaying.toString());
//   }, [currentSong, isPlaying]);

//   const playSong = (song: string) => {
//     setCurrentSong(song);
//     setIsPlaying(true);
//   };

//   const pauseSong = () => {
//     setIsPlaying(false);
//   };

//   const stopSong = () => {
//     setCurrentSong(null);
//     setIsPlaying(false);
//   };

//   return (
//     <AudioPlayerContext.Provider value={{ currentSong, isPlaying, playSong, pauseSong, stopSong }}>
//       {children}
//     </AudioPlayerContext.Provider>
//   );
// };

// export const useAudioPlayer = (): AudioPlayerContextType => {
//   const context = useContext(AudioPlayerContext);
//   if (!context) {
//     throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
//   }
//   return context;
// };
// import { createContext, useState, ReactNode } from "react";

// interface AudioPlayerContextProps {
//     currentSong: string | null;
//     currentSongName: string | null;
//     isPlaying: boolean;
//     playSong: (url: string, name: string) => void;
//     togglePlayPause: () => void;
// }

// // יצירת הקונטקסט עם ערכים דיפולטיים
// export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
//     currentSong: null,
//     currentSongName: null,
//     isPlaying: false,
//     playSong: () => {},
//     togglePlayPause: () => {},
// });

// // ספק הקונטקסט (Provider) שינהל את המידע
// export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
//     const [currentSong, setCurrentSong] = useState<string | null>(null);
//     const [currentSongName, setCurrentSongName] = useState<string | null>(null);
//     const [isPlaying, setIsPlaying] = useState<boolean>(false);

//     // פונקציה לניגון שיר חדש
//     const playSong = (url: string, name: string) => {
//         setCurrentSong(url);
//         setCurrentSongName(name);
//         setIsPlaying(true);
//     };

//     // פונקציה להפעלה/עצירה
//     const togglePlayPause = () => {
//         setIsPlaying((prev) => !prev);
//     };

//     return (
//         <AudioPlayerContext.Provider value={{ currentSong, currentSongName, isPlaying, playSong, togglePlayPause }}>
//             {children}
//         </AudioPlayerContext.Provider>
//     );
// };

import { createContext, useState, useEffect, ReactNode } from "react";

interface AudioPlayerContextProps {
    currentSong: string | null;
    currentSongName: string | null;
    isPlaying: boolean;
    playSong: (url: string, name: string) => void;
    togglePlayPause: () => void;
    stopSong: () => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
    currentSong: null,
    currentSongName: null,
    isPlaying: false,
    playSong: () => {},
    togglePlayPause: () => {},
    stopSong: () => {},
    currentTime: 0,
    setCurrentTime: () => {},
});

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<string | null>(localStorage.getItem("currentSong"));
    const [currentSongName, setCurrentSongName] = useState<string | null>(localStorage.getItem("currentSongName"));
    // const [isPlaying, setIsPlaying] = useState<boolean>(localStorage.getItem("isPlaying") === "true");
   const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState<number>(parseFloat(localStorage.getItem("currentTime") || "0"));

    // עדכון הזמן ב-localStorage בצורה רציפה
    useEffect(() => {
        if (currentSong) {
            localStorage.setItem("currentSong", currentSong);
            localStorage.setItem("currentSongName", currentSongName || "");
            localStorage.setItem("isPlaying", isPlaying.toString());
            localStorage.setItem("currentTime", currentTime.toString()); // עדכון הזמן
        }
    }, [currentSong, currentSongName, isPlaying, currentTime]);

  //   useEffect(() => {
  //     let interval: number|null = null;
  
  //     if (isPlaying && currentSong) {
  //         interval = setInterval(() => {
  //             setCurrentTime((prevTime) => prevTime + 1);
  //         }, 1000);
  //     } else {
  //         if (interval)  
  //         clearInterval(interval);
  //     }
  //     if(interval)
  //       return () => clearInterval(interval);
  // }, [isPlaying, currentSong]);

    const playSong = (url: string, name: string) => {
        setIsPlaying(false);
        setCurrentTime(0); // אפס את הזמן בכל פעם ששיר חדש מתחיל
        setTimeout(() => {
            setCurrentSong(url);
            setCurrentSongName(name);
            setIsPlaying(true); // התחלת השיר לאחר חפיפה עם זמן
        }, 100);
    };

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    const stopSong = () => {
        setCurrentSong(null);
        setCurrentSongName(null);
        setIsPlaying(false);
        setCurrentTime(0);
        localStorage.removeItem("currentSong");
        localStorage.removeItem("currentSongName");
        localStorage.removeItem("isPlaying");
        localStorage.removeItem("currentTime");
    };

    return (
        <AudioPlayerContext.Provider
            value={{ currentSong, currentSongName, isPlaying, playSong, togglePlayPause, stopSong, currentTime, setCurrentTime }}
        >
            {children}
        </AudioPlayerContext.Provider>
    );
};
