import { Song } from "./Song"
import { User } from "./User"

export type Request={
  userId: number,
  songName: string,
  songArtist: string,
  songGenre: string,
  songYear: number,
  songAlbum: string,
  songAudioFilePath: string,
  songImageFilePath: string
}