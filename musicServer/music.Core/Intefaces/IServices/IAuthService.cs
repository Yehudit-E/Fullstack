using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Shared;

namespace music.Core.Services
{
    public interface IAuthService
    {
        string GenerateJwtToken(User user);
        bool ValidateUser(string usernameOrEmail, string password, out string[] roles, out User user);
        Result<LoginResponseDto?> Login(string email, string password);
        //Task<Result<UserDto>> Register(UserDto userDto);
        Task<Result<LoginResponseDto?>> Register(UserDto userDto);
        Task<User> GetOrCreateUserAsync(string email, string name);

    }
}
