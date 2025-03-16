using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.DTOs
{
    public class LoginResponseDto
    {
        public int Id { get; set; }
        public User User { get; set; }
        public string Token {  get; set; }
    }
}
