import { Playlist } from "./Playlist"
import {Request} from "./Request"
export type User ={
    id:number,
    userName:string,
    email:string,
    password: string,
    create_at:string,
    ownedPlaylists:Playlist[],
    sharedPlaylists:Playlist[],
    requests?:Request[]
} 
export type UserDto ={
    id:number,
    userName:string,
    email:string,
    password: string,
    create_at:string,
} 