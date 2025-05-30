using Microsoft.EntityFrameworkCore;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Data.repositories
{

    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(DataContext dataContex) : base(dataContex)
        { }
        public async Task<IEnumerable<User>> GetFullAsync()
        {
            return await _dataSet.AsSplitQuery().Include(x => x.OwnedPlaylists).Include(x=>x.SharedPlaylists).ToListAsync();
        }
        public async Task<User?> GetFullByIdAsync(int id)
        {
            return await _dataSet.AsSplitQuery().Where(x=>x.Id==id).Include(x => x.OwnedPlaylists).Include(x => x.SharedPlaylists).FirstOrDefaultAsync();
        }
        public User? GetUserWithRoles(string email)
        {
            return  _dataSet.AsSplitQuery().Where(x=>x.Email==email).Include(x=>x.Roles).FirstOrDefault();
        }
        public async Task<User> GetByEmailAsync(string UserEmail)
        {
            return await _dataSet.FirstOrDefaultAsync(x => x.Email == UserEmail);
        }
    }
}
