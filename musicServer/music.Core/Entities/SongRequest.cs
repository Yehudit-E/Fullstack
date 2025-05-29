using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class SongRequest
    {
        public string SongName { get; set; }
        public string SongArtist { get; set; }
        public string SongGenre { get; set; }
        public string SongAlbum { get; set; }
        public int SongYear { get; set; }
        public string SongAudioFilePath { get; set; }
        public string SongImageFilePath { get; set; }
    }
}
