import { Song } from "./Song";
import { UserDto } from "./User";

export class Playlist {
    constructor(
      public id :number,
    public name :string,
    public description :string,
    public imageFilePath :string,
    public ownerId:number, 
    public owner :UserDto,
    public songs :Song[],
    public sharedUsers:UserDto[],
    public createdAt :Date
    ) { }
}
export class PlaylistPostModel {
    constructor(
    public name :string,
    public description :string,
    public imageFilePath :string,
    public ownerId:number, 
    ) { }
}