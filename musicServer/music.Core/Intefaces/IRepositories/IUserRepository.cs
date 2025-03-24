using music.Core.DTOs;
using music.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IRepositories
{
    public interface IUserRepository:IRepository<User>
    {
        Task<IEnumerable<User>> GetFullAsync();
        Task<User>? GetFullByIdAsync(int id);
        User? GetUserWithRoles(string email);
        Task<User> GetByEmailAsync(string UserEmail);
    }
}
