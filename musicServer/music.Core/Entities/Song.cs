﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class Song
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Album { get; set; }
        public int Year { get; set; }
        public string Genre { get; set; }
        public string Lyrics { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsPublic { get; set; }
        public int  CountOfPlays { get; set; }
        public string AudioFilePath { get; set; }
        public string ImageFilePath { get; set; }
        public int PlaylistId { get; set; }
        public Playlist playlist { get; set; }

        public Song()
        {
            CreatedAt = DateTime.Now;
            CountOfPlays = 0;
        }
    }
}
