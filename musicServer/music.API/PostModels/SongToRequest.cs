using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Entities
{
    public class SongToRequest
    {
        public string AudioFilePath { get; set; }
        public string ImageFilePath { get; set; }
        public string Name { get; set; }
        public string Artist { get; set; }
        public string Genre { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
