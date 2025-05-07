using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class Playlist
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int OwnerId { get; set; }
        public User Owner { get; set; }
        public string ImageFilePath { get; set; }
        public List<Song> Songs { get; set; }
        public List<User> SharedUsers { get; set; }
        public DateTime CreatedAt { get; set; }

        public Playlist()
        {
            Songs = new List<Song>();
            SharedUsers = new List<User>();
            CreatedAt= DateTime.Now;
            
        }

    }
}
