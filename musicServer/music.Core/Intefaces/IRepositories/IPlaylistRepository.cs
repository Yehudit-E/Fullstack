﻿using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IRepositories
{
    public interface IPlaylistRepository:IRepository<Playlist>
    {
        Task<IEnumerable<Playlist>> GetFullAsync();
        Task<Playlist> GetFullByIdAsync(int id);
        Task<List<Playlist>> GetUserSharedPlaylistsAsync(int userId);
        Task<List<Playlist>> GetUserPlaylistsAsync(int userId);
    }
}
