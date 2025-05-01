import { Playlist } from "./Playlist"

export type Song ={
    id:number,
    name:string,
    artist: string,
    genre?: string,
    create_at:string,
    isPublic: boolean,
    likes:number,
    audioFilePath:string,
    imageFilePath:string,
    playlistId:number,
    playlist:Playlist
} 
export type SongDto ={
    id:number,
    name:string,
    artist: string,
    genre?: string,
    create_at:string,
    isPublic: boolean,
    likes:number,
    audioFilePath:string,
    imageFilePath:string,
    playlistId:number,
} 
export type SongPostModel ={
    name:string,
    description?:string,
    artist: string,
    genre?: string,
    audioFilePath:string,
    imageFilePath:string,
    playlistId:number,
} 