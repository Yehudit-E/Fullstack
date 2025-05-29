using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Services;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using Microsoft.Extensions.Configuration;
using music.Core.Intefaces.IRepositories;
using AutoMapper;
using System.Text.RegularExpressions;
using music.Core.Shared;
using music.Service.Services;
using music.Core.Intefaces.IServices;

namespace music.Service
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration ;
        private readonly IRepositoryManager _repositoryManager ;
        private readonly IMapper _mapper ;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService ;
        public AuthService(IConfiguration configuration, IRepositoryManager repositoryManager, IMapper mapper,IUserService userService, IEmailService emailService)
        {
            _configuration = configuration;
            _repositoryManager = repositoryManager;
            _mapper = mapper;
            _userService = userService;
            _emailService = emailService;
        }
        public string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())

            };
            // Add roles as claims
            foreach (var role in user.Roles.Select(r => r.Name))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            } 
            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public bool  ValidateUser(string email, string password, out string[] roles, out User user)
        {
            roles = null;
            user = _repositoryManager._userRepository.GetUserWithRoles(email);
            if (user != null && BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                roles = user.Roles.Select(r => r.Name).ToArray();
                return true;
            }
            return false;
        }

        public Result<LoginResponseDto?> Login(string email, string password)
        {
            if (ValidateUser(email, password, out var roles, out var user))
            {
                var token = GenerateJwtToken(user);
                var response = new LoginResponseDto
                {
                    User = user,
                    Token = token
                };
                return Result<LoginResponseDto?>.Success(response);
            }
            return Result<LoginResponseDto?>.NotFound();
        }

        //public async Task<Result<UserDto>> Register(UserDto userDto)
        //{
        //    return await _userService.AddAsync(userDto);
        //}
        public async Task<Result<LoginResponseDto?>> Register(UserDto userDto)
        {
            var result = await _userService.AddAsync(userDto);
            if (result == null)
                return null;
            var user = _mapper.Map<User>(result.Data);

            if (result.IsSuccess)
            {
                var token = GenerateJwtToken(user);
                var response = new LoginResponseDto
                {
                    User = user,
                    Token = token
                };
                EmailRequest emailRequest = new EmailRequest()
                {
                    To = user.Email,
                    Subject = "Welcome To MusiX!",
                    Body = ""
                };
                _emailService.SendEmailAsync(emailRequest);
                return Result<LoginResponseDto>.Success(response);
            }

            return Result<LoginResponseDto>.NotFound("User registration failed.");
        }

        public async Task<User> GetOrCreateUserAsync(string email, string name)
        {
            var user = await _repositoryManager._userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                user = new User
                {
                    UserName= name,
                    Email = email,
                    Password=""
                };
                await _repositoryManager._userRepository.AddAsync(user);
                await _repositoryManager.SaveAsync();
            }
            return user;
        }
    }
}
