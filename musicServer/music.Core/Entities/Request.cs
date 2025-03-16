using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class Request
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int SongId { get; set; }
        public Song Song { get; set; }
        public bool IsAnswered { get; set; }
        public bool IsApproved { get; set; }
        public DateTime RequestedAt { get; set; }

        public Request()
        {
            IsAnswered=false;
            IsApproved = false;
            RequestedAt = DateTime.Now;
        }
    }
}
