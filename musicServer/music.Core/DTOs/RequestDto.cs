using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.DTOs
{
    public class RequestDto
    {
        public int UserId { get; set; }
        public SongRequest Song { get; set; }


    }
}
