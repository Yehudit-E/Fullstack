import { Song } from "./Song"
import { User } from "./User"

export type Playlist ={
    id :number,
    name :string,
    ownerId:number, 
    owner :User,
    songs :Song[],
    sharedUsers:User[],
    createdAt :Date
} 
export type PlaylistDto ={
    id :number,
    name :string,
    ownerId:number, 
    CreatedAt :Date
} 
export type PlaylistPostModel ={
    name :string,
    ownerId:number, 
} 