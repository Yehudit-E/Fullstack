using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class SongService : ISongService
    {
        private readonly IRepositoryManager _iManager;
        private readonly IMapper _mapper;
        public SongService(IRepositoryManager iManager, IMapper mapper)
        {
            _iManager = iManager;
            _mapper = mapper;
        }
        public async Task<IEnumerable<SongDto>> GetAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetAsync();
            IEnumerable<SongDto> songsDtos = _mapper.Map<List<SongDto>>(songs);
            return songsDtos;
        }
        public async Task<IEnumerable<SongDto>> GetPublicAsync()
        {
            IEnumerable<Song> songs = await _iManager._songRepository.GetPublicAsync();
            IEnumerable<SongDto> songsDtos = _mapper.Map<List<SongDto>>(songs);
            return songsDtos;
        }
        public async Task<SongDto>? GetByIdAsync(int id)
        {
            Song song = await _iManager._songRepository.GetByIdAsync(id);
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }

        public async Task<SongDto> AddAsync(SongDto songDto)
        {
            Song song = _mapper.Map<Song>(songDto);
            song = await _iManager._songRepository.AddAsync(song);
            if (song != null)
            {
                await _iManager.SaveAsync();
            }
            songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> UpdateAsync(int id, SongDto songDto)
        {
            Song song = _mapper.Map<Song>(songDto);
            song = await _iManager._songRepository.UpdateAsync(id, song);
            if (song != null)
                await _iManager.SaveAsync();
            songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<SongDto> UpdateLikesAsync(int id)
        {
            Song song = await _iManager._songRepository.UpdateLikesAsync(id);
            if (song != null)
                await _iManager.SaveAsync();
            var songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _iManager._songRepository.DeleteByIdAsync(id);
            if (flag)
                await _iManager.SaveAsync();
            return flag;
        }
        public async Task<bool> IsOwnerOfSong(int songId,int userId)
        {
            Song song = await _iManager._songRepository.GetByIdAsync(songId);
            return await IsOwnerOfPlaylist(song.PlaylistId, userId);
        }
        public async Task<bool> IsOwnerOfPlaylist(int playlistId,int userId)
        {
            var playlist = await _iManager._playlistRepository.GetFullByIdAsync(playlistId);
            if (playlist==null)
                return false;
            if (playlist.OwnerId == userId)
                return true;
            return playlist.SharedUsers.Any(x => x.Id == userId);
        }
        public async Task<SongDto> AddLyricsAsync(int id, string lyrics)
        {
            Song song = await _iManager._songRepository.AddLyricsAsync(id, lyrics);
            if (song != null)
            {
                await _iManager.SaveAsync();
            }
            SongDto songDto = _mapper.Map<SongDto>(song);
            return songDto;
        }
    }
}
