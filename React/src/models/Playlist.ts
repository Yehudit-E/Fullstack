import { Song } from "./Song"
import { UserDto } from "./User"

export type Playlist ={
    id :number,
    name :string,
    description :string,
    imageFilePath :string,
    ownerId:number, 
    owner :UserDto,
    songs :Song[],
    sharedUsers:UserDto[],
    createdAt :Date
} 
export type PlaylistDto ={
    id :number,
    name :string,
    description :string,
    imageFilePath :string,
    ownerId:number, 
    CreatedAt :Date
} 
export type PlaylistPostModel ={
    name :string,
    ownerId:number, 
    description :string,
    imageFilePath :string,
} 