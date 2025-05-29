using music.Core.Entities;

namespace music.API.PostModels
{
    public class SongPostModel
    {
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public string Album { get; set; }
        public int Year { get; set; }
        public string Lyrics { get; set; }
        public string AudioFilePath { get; set; }
        public string ImageFilePath { get; set; }
        public int playlistId { get; set; }

    }
    public class PublicSongPostModel
    {
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public string Album { get; set; }
        public int Year { get; set; }
        public string Lyrics { get; set; }
        public string AudioFilePath { get; set; }
        public string ImageFilePath { get; set; }
    }
}
