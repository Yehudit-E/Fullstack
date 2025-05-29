import { Song, SongPostModel } from "./Song";
import { User } from "./User";

export class UploadRequest {
    constructor(
        public id: number,
        public userId: number,
        public user:User,
        public songId: number,
        public song:Song,
        public isAnswered: boolean,
        public isApproved: boolean,
        public requestedAt: Date,
    ) { }
}

