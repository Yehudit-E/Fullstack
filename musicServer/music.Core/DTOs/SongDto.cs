using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.DTOs
{
    public class SongDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsPublic { get; set; }
        public int Likes { get; set; }
        public string AudioFilePath { get; set; }
        public string ImageFilePath { get; set; }
        public int playlistId { get; set; }
    }
}
