import { Playlist } from "./Playlist"

export type Song ={
    id:number,
    name:string,
    description?:string,
    artist: string,
    genre?: string,
    create_at:string,
    isPublic: boolean,
    likes:number,
    audioFilePath:string,
    playlistId:number,
    playlist:Playlist
} 
export type SongDto ={
    id:number,
    name:string,
    description?:string,
    artist: string,
    genre?: string,
    create_at:string,
    isPublic: boolean,
    likes:number,
    audioFilePath:string,
    playlistId:number,
} 
export type SongPostModel ={
    name:string,
    description?:string,
    artist: string,
    genre?: string,
    audioFilePath:string,
    playlistId:number,
} 