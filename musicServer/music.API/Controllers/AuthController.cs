using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using music.API.PostModels;
using music.Core.DTOs;
using music.Core.Entities;
using music.Core.Services;
using music.Core.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace music.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService, IMapper mapper) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly IMapper _mapper = mapper;

        [HttpPost("login")]
        public ActionResult<LoginResponseDto> Login([FromBody] LoginModel model)
        {
            Console.WriteLine(model);
            var result =  _authService.Login(model.Email, model.Password);
            if (!result.IsSuccess)
            {
                return StatusCode(result.StatusCode,result.ErrorMessage);
            }
            return Ok(result.Data); 
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] UserPostModel user)
        {
            Console.WriteLine(user);
            if (user == null)
                return BadRequest("User data is required.");
            var userDto = _mapper.Map<UserDto>(user);
            userDto.CreatedAt = DateTime.Now;
            var result = await _authService.Register(userDto);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return StatusCode(result.StatusCode, result.ErrorMessage);
        }

    }
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
