using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IRepositories
{
    public interface ISongRepository:IRepository<Song>
    {
        Task<IEnumerable<Song>> GetPublicAsync();
        Task<Song> UpdatePlaysAsync(int id);
        Task<Song> AddLyricsAsync(int id, string lyrics);


    }
}
