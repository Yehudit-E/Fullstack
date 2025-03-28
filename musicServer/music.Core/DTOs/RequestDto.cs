﻿using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.DTOs
{
    public class RequestDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int SongId { get; set; }
        public bool IsAnswered { get; set; }
        public bool IsApproved { get; set; }
        public DateTime RequestedAt { get; set; }
    }
}
