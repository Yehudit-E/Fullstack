import { Playlist } from "./Playlist"

export type Song = {
    id: number,
    name: string,
    artist: string,
    genre: string,
    year: number,
    album: string,
    create_at: string,
    isPublic: boolean,
    countOfPlays: number,
    lyrics: string,
    audioFilePath: string,
    imageFilePath: string,
    playlistId: number,
    playlist: Playlist
}
export type SongDto = {
    id: number,
    name: string,
    artist: string,
    genre: string,
    year: number,
    album: string,
    create_at: string,
    isPublic: boolean,
    countOfPlays: number,
    lyrics: string,
    audioFilePath: string,
    imageFilePath: string,
    playlistId: number,
}
export type SongPostModel = {
    name: string,
    description?: string,
    artist: string,
    genre: string,
    year: number,
    album: string,
    lyrics: string,
    audioFilePath: string,
    imageFilePath: string,
    playlistId: number,
}
