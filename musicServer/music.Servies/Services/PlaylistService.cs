using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class PlaylistService : IPlaylistService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        public PlaylistService(IRepositoryManager iManager, IMapper mapper)
        {
            _iManager = iManager;
            _mapper = mapper;
        }
        public async Task<IEnumerable<PlaylistDto>> GetAsync()
        {
            IEnumerable<Playlist> playlists = await _iManager._playlistRepository.GetAsync();
            IEnumerable<PlaylistDto> playlistDto = _mapper.Map<List<PlaylistDto>>(playlists);
            return playlistDto;
        }
        public async Task<IEnumerable<Playlist>> GetFullAsync()
        {
            return await _iManager._playlistRepository.GetFullAsync();
        }
        public async Task<PlaylistDto>? GetByIdAsync(int id)
        {
            Playlist playlist = await _iManager._playlistRepository.GetByIdAsync(id);
            PlaylistDto playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<Playlist?> GetFullByIdAsync(int id)
        {
            Playlist playlist = await _iManager._playlistRepository.GetFullByIdAsync(id);
            return playlist;
        }
        public async Task<List<Playlist>> GetUserSharedPlaylistsAsync(int userId)
        {
            List<Playlist> playlists = await _iManager._playlistRepository.GetUserSharedPlaylistsAsync(userId);
            return playlists;
        }
        public async Task<List<Playlist>> GetUserPlaylistsAsync(int userId)
        {
            List<Playlist> playlists = await _iManager._playlistRepository.GetUserPlaylistsAsync(userId);
            return playlists;
        }
        public async Task<PlaylistDto> AddAsync(PlaylistDto playlistDto)
        {
            Playlist playlist = _mapper.Map<Playlist>(playlistDto);
            playlist = await _iManager._playlistRepository.AddAsync(playlist);
            if (playlist != null)
                await _iManager.SaveAsync();
            playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<PlaylistDto> UpdateAsync(int id, PlaylistDto playlistDto)
        {
            Playlist playlist = _mapper.Map<Playlist>(playlistDto);
            playlist = await _iManager._playlistRepository.UpdateAsync(id, playlist);
            if (playlist != null)
                await _iManager.SaveAsync();
            playlistDto = _mapper.Map<PlaylistDto>(playlist);
            return playlistDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager._playlistRepository.DeleteByIdAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        public async Task<bool> RemoveSongFromPlaylistAsync(int playlistId, int songId)
        {
            Playlist playlist = await _iManager._playlistRepository.GetFullByIdAsync(playlistId);
            if (playlist == null)
                return false;
            Song song = playlist.Songs.FirstOrDefault(x => x.Id == songId);
            if (song == null)
                return false;
            playlist.Songs.Remove(song);
            if (!song.IsPublic)
            {
                await _iManager._songRepository.DeleteByIdAsync(songId);
            }
            await _iManager.SaveAsync();
            return true;
        }
        public  async Task<Playlist> AddUserAsync(Playlist playlist, string userEmail)
        {
            var u =await  _iManager._userRepository.GetByEmailAsync(userEmail);
            var userId = u.Id;
            if (playlist.SharedUsers.Any(x => x.Id == userId))
                return null;
            var user = await _iManager._userRepository.GetByIdAsync(userId);
            playlist.SharedUsers.Add(user);
            await _iManager.SaveAsync();
            return playlist;
        }
    }
}
