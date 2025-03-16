import { Playlist } from "./Playlist"

export type User ={
    id:number,
    userName?:string,
    email:string,
    password: string,
    create_at:string,
    ownedPlaylists?:Playlist[],
    sharedPlaylists?:Playlist[],
    requests?:Request[]
} 