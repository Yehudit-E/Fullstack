import { Song } from "./Song"
import { User } from "./User"

export type Request={
    id:number,
    userId:number,
    user:User,
    songId:number,
    song:Song,
    status:string,
    isAmswered:boolean,
    isApproved:boolean,
    reqestedAt:Date
}
export type RequestPostModel={
    userId:number,
    songId:number,
    status:string,
    isAmswered:boolean,
    isApproved:boolean,
    reqestedAt:Date
}