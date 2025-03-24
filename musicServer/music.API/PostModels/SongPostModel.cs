using music.Core.Entities;

namespace music.API.PostModels
{
    public class SongPostModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public string AudioFilePath { get; set; }
        //public string ImageFilePath { get; set; }
        public int playlistId { get; set; }

    }
}
