import { Song } from "./Song"
import { User } from "./User"

export type Request={
    id:number,
    userId:number,
    user:User,
    songAudioFilePath :string,
    songName:string,
    songArtist:string,
    songGenre:string,
    status:string,
    isAmswered:boolean,
    isApproved:boolean,
    reqestedAt:Date
}
export type RequestPostModel={
    userId:number,
    songAudioFilePath :string,
    songName:string,
    songArtist:string,
    songGenre:string,
}