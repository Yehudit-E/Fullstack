using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public List<Playlist> OwnedPlaylists {  get; set; }
        public List<Playlist> SharedPlaylists {  get; set; }
        public List<Request> Requests {  get; set; }
        public DateTime CreatedAt { get; set; }
        public List<Role> Roles { get; set; }

        public User()
        {
            CreatedAt = DateTime.Now;
            OwnedPlaylists = new List<Playlist>();
            SharedPlaylists = new List<Playlist>();
            Requests= new List<Request>();
            Roles= new List<Role>();
        }
    }
}
