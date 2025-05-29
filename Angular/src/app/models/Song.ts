import { Playlist } from "./Playlist";

export class Song {
    constructor(
        public   id: number,
    public name: string,
    public artist: string,
    public genre: string,
    public year: number,
    public album: string,
    public create_at: string,
    public isPublic: boolean,
    public countOfPlays: number,
    public lyrics: string,
    public audioFilePath: string,
    public imageFilePath: string,
    public playlistId: number,
    public playlist: Playlist
    ) { }
}

export class PublicSongPostModel {
    constructor(
    public name: string,
    public artist: string,
    public genre: string,
    public year: number,
    public album: string,
    public lyrics: string,
    public audioFilePath: string,
    public imageFilePath: string,
    ) { }
}
export class SongPostModel {
    constructor(
    public name: string,
    public artist: string,
    public genre: string,
    public year: number,
    public album: string,
    public lyrics: string,
    public audioFilePath: string,
    public imageFilePath: string,
    public playlistId: number
    ) { }
}