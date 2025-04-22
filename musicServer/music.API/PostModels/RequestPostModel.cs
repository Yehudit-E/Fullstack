namespace music.API.PostModels
{
    public class RequestPostModel
    {
        public int UserId { get; set; }
        public string SongAudioFilePath { get; set; }
        public string SongName { get; set; }
        public string SongArtist { get; set; }
        public string SongGenre { get; set; }
    }
}
