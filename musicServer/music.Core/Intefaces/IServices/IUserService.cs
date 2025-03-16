using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace music.Core.Intefaces.IServices
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAsync();
        Task<IEnumerable<User>> GetFullAsync();
        Task<UserDto> GetByIdAsync(int id);
        Task<User> GetFullByIdAsync(int id);
        Task<Result<UserDto>> AddAsync(UserDto userDto);
        Task<UserDto> UpdateAsync(int id, UserDto userDto);
        Task<bool> DeleteAsync(int id);
    }
}
