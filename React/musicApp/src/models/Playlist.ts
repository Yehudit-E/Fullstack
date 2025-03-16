import { Song } from "./Song"
import { User } from "./User"

export type Playlist ={
    id :number,
    name :string,
    ownerId:number, 
    owner :User,
    songs :Song[],
    SharedUsers:User[],
    CreatedAt :Date
} 