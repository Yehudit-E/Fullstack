using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.DTOs
{
    public class PlaylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public bool IsPublic { get; set; }
        public string ImageFilePath { get; set; }
        public int OwnerId { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
