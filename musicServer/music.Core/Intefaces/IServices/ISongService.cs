using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IServices
{
    public interface ISongService
    {
        Task<IEnumerable<SongDto>> GetAsync();
        Task<IEnumerable<SongDto>> GetPublicAsync();
        Task<SongDto> GetByIdAsync(int id);
        Task<SongDto> AddAsync(SongDto songDto);       
        Task<SongDto> UpdateAsync(int id, SongDto songDto);
        Task<SongDto> UpdatePlaysAsync(int id);
        Task<bool> DeleteAsync(int id);
        Task<bool> IsOwnerOfSong(int songId, int userId);
        Task<bool> IsOwnerOfPlaylist(int playlistId, int userId);
        Task<SongDto> AddLyricsAsync(int id, string lyrics);

    }
}
