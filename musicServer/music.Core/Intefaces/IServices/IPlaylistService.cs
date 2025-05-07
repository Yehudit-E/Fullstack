using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IServices
{
    public interface IPlaylistService
    {
        Task<IEnumerable<PlaylistDto>>GetAsync();
        Task<IEnumerable<Playlist>> GetFullAsync();
        Task<PlaylistDto> GetByIdAsync(int id);
        Task<Playlist> GetFullByIdAsync(int id);
        Task<List<Playlist>> GetUserSharedPlaylistsAsync(int userId);
        Task<List<Playlist>> GetUserPlaylistsAsync(int userId);
        Task<PlaylistDto> AddAsync(PlaylistDto playListsongDto);
        Task<PlaylistDto> UpdateAsync(int id, PlaylistDto playListsongDto);
        Task<bool> DeleteAsync(int id);
        Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId);
         Task<bool> RemoveUserFromPlaylistAsync(int playlistId, int songId);
        Task<Playlist> AddUserAsync(Playlist playlist, string userEmail);

    }
}
