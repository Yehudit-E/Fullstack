import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongDto } from '../models/Song';

const emptySong: SongDto = {
  id: 0,
  name: '',
  artist: '',
  genre: '',
  year: 0,
  album: '',
  create_at: '',
  isPublic: false,
  likes: 0,
  audioFilePath: '',
  imageFilePath: '',
  playlistId: 0,
  lyrics: '',
};

// Slice Redux עבור נגן שירים
const songSlice = createSlice({
  name: 'songPlayer',
  initialState: { 
    songs: [emptySong], // מערך של שירים
    currentIndex: 0,    // אינדקס השיר הנוכחי
    change: false       // מצב של שינוי
  },
  reducers: {
    // טוען מערך שירים ומגדיר את האינדקס הנוכחי
    loadSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      state.currentIndex = 0; // התחלה של השיר הראשון במערך
    },

    // עדכון שיר נוכחי
    updateSongs: (state, action: PayloadAction<SongDto[]>) => {
      const newSongs = action.payload;
      // עדכון השיר הנוכחי במערך
      state.songs = newSongs;
      state.currentIndex=0;
      state.change = true;
    },

    // אתחול של המערך חזרה למצב ההתחלתי
    resetSongs: (state) => {
      state.songs = [emptySong];
      state.currentIndex = 0;
    },

    // עדכון מצב השינוי
    setChange: (state) => {
      state.change = false;
    },

    // שינוי אינדקס השיר הנוכחי
    setCurrentIndex: (state, action: PayloadAction<number>) => {
      const newIndex = action.payload;
      // אם האינדקס בתוך גבולות המערך, עדכן אותו
      if (newIndex >= 0 && newIndex < state.songs.length) {
        state.currentIndex = newIndex;
      }
    },

    // מעבר לשיר הבא במערך
    nextSong: (state) => {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex < state.songs.length) {
        state.currentIndex = nextIndex;
      }
      state.change = true;
    },

    // מעבר לשיר הקודם במערך
    prevSong: (state) => {
      const prevIndex = state.currentIndex - 1;
      if (prevIndex >= 0) {
        state.currentIndex = prevIndex;
      }
      state.change = true;
    }
  },
});

// פעולות ה-Redux
export const { 
  loadSongs, 
  updateSongs, 
  resetSongs, 
  setChange, 
  setCurrentIndex, 
  nextSong, 
  prevSong 
} = songSlice.actions;

export default songSlice;
