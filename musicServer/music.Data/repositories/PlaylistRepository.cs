using Microsoft.EntityFrameworkCore;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Data.repositories
{
    public class PlaylistRepository:Repository<Playlist>,IPlaylistRepository
    {
        public PlaylistRepository(DataContext dataContex) : base(dataContex)
        {
        }
        public async Task<IEnumerable<Playlist>> GetFullAsync()
        {
            return await _dataSet.Include(x => x.Songs).ToListAsync();
        }
        public async Task<Playlist> GetFullByIdAsync(int id)
        {
            return await _dataSet.Where(x => x.Id == id).Include(x => x.SharedUsers).Include(x=>x.Songs).Include(x=>x.Owner).FirstOrDefaultAsync();
        }
        public async Task<List<Playlist>> GetUserSharedPlaylistsAsync(int userId)
        {
            return await _dataSet.Where(x => x.SharedUsers.Any(x => x.Id == userId)).Include(x => x.Songs).ToListAsync();

        }
        public async Task<List<Playlist>> GetUserPlaylistsAsync(int userId)
        {
            return await _dataSet.Where(x => x.OwnerId == userId).Include(x => x.Songs).ToListAsync();
        }

    }
}
