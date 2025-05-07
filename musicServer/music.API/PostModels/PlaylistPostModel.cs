using music.Core.Entities;

namespace music.API.PostModels
{
    public class PlaylistPostModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int OwnerId { get; set; }
        public string ImageFilePath { get; set; }

    }
}
