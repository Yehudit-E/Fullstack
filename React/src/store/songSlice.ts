import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Song, SongDto } from '../models/Song';

const emptySong: SongDto = {
    id: 0,
    name: '',
    description: '',
    artist: '',
    genre: '',
    create_at: '',
    isPublic: false,
    likes: 0,
    audioFilePath: '',
    playlistId: 0,
};

const songSlice = createSlice({
  name: 'songPlayer',
  initialState: { song: emptySong ,change: false},
  reducers: {
    loadSong:(state, action: PayloadAction<Song>) =>{
      state.song = action.payload;
    },
    updateSong: (state, action: PayloadAction<Song>) => {
      state.song = action.payload;
      state.change=true;
    },
    deleteSong: (state) => {
      state.song = emptySong;
    },
    resetSong: (state) => {
      state.song = emptySong;
    },
    setChange: (state) => {
      state.change = false;
    },
  },
});

export const { updateSong, deleteSong, resetSong,setChange,loadSong } = songSlice.actions;
export default songSlice;