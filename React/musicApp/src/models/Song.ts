import { Playlist } from "./Playlist"

export type Song ={
    id:number,
    name:string,
    artist: string,
    gener?: string,
    create_at:string,
    isPublic: boolean,
    likes:number,
    AudioFilePath:string,
    playlistId:number,
    playlist:Playlist
} 