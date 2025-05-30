using AutoMapper;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Intefaces.IRepositories;
using music.Core.Intefaces.IServices;
using music.Core.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace music.Service.Services
{
    public class UserService:IUserService
    {
        private readonly IRepositoryManager _repositoryManager;
        private readonly IMapper _mapper;
        public UserService(IRepositoryManager iManager, IMapper mapper)
        {
            _repositoryManager = iManager; 
            _mapper = mapper;
        }
        public async Task<IEnumerable<UserDto>> GetAsync()
        {
            IEnumerable<User> users = await _repositoryManager._userRepository.GetAsync();
            IEnumerable<UserDto> usersDtos = _mapper.Map<List<UserDto>>(users);
            return usersDtos;
        }
        public async Task<IEnumerable<User>> GetFullAsync()
        {
            return await _repositoryManager._userRepository.GetFullAsync();
        }
        public async Task<UserDto>? GetByIdAsync(int id)
        {
            User user = await _repositoryManager._userRepository.GetByIdAsync(id);
            UserDto userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }
        public async Task<User>? GetFullByIdAsync(int id)
        { 
            User user = await _repositoryManager._userRepository.GetFullByIdAsync(id);
            return user;
        }
        public async Task<Result<UserDto>> AddAsync(UserDto userDto)
        {
            if (!IsValidEmail(userDto.Email))
                return Result<UserDto>.BadRequest("Invalid email");
            if (!IsValidPassword(userDto.Password))
                return Result<UserDto>.BadRequest("Invalid password");
            
            var user = _mapper.Map<User>(userDto);
            var users = await _repositoryManager._userRepository.GetAsync();
            if (users.Any(u => u.Email == user.Email))
                return Result<UserDto>.Failure("User already exist");
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            
            var result = await _repositoryManager._userRepository.AddAsync(user);
            if (result == null)
                return Result<UserDto>.Failure("Failed");
            await _repositoryManager.SaveAsync();
            var resultDto = _mapper.Map<UserDto>(result);
            return Result<UserDto>.Success(resultDto);
        }
        public async Task<UserDto> UpdateAsync(int id, UserDto userDto)
        {
            User user = _mapper.Map<User>(userDto);
            user.Password = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
            user = await _repositoryManager._userRepository.UpdateAsync(id, user);
            if (user != null)
                await _repositoryManager.SaveAsync();
            userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            bool flag = await _repositoryManager._userRepository.DeleteByIdAsync(id);
            if (flag)
                await _repositoryManager.SaveAsync();
            return flag;
        }
        
        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return false;
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern, RegexOptions.IgnoreCase);
        }
        private static bool IsValidPassword(string password)
        {
            // בדוק אם הסיסמה לא ריקה ואורכה לפחות 6 תווים
            if (string.IsNullOrWhiteSpace(password) || password.Length < 6)
            {
                return false;
            }
            // בדוק אם הסיסמה מכילה לפחות אות באנגלית
            bool hasLetter = password.Any(char.IsLetter);
            // בדוק אם הסיסמה מכילה לפחות ספרה
            bool hasDigit = password.Any(char.IsDigit);
            return hasLetter && hasDigit;
        }

    }
}
