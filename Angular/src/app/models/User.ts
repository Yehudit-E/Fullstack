import { Playlist } from "./Playlist";

export class User {
    constructor(
       public  id: number,
        public userName: string,
        public email: string,
        public password: string,
        public createdAt: string,
        public ownedPlaylists: Playlist[],
        public sharedPlaylists: Playlist[],
        public requests?: Request[]
    ) { }
}
export class UserDto {
    constructor(
        public id: number,
        public userName: string,
        public email: string,
        public password: string,
        public createdAt: string,
    ) { }
}
export class UserPostModel {
    constructor(
        public userName: string,
        public email: string,
        public password: string,
    ) { }
}
export class UserLogin{
    constructor(
        public email: string,
        public password:string,
    )
    {}
}